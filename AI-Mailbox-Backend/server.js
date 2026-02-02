import express from 'express';
import { setupDatabase } from './db.js';
import { extractVoiceDNA, saveSentEmail } from './training.js';
import { VoiceDNA } from './models/VoiceDNA.js'; // Import the new model
import { EmailMemory } from './models/EmailMemory.js';
import { generateAIPrompt } from './drafting.js';
// 1. THIS MUST BE THE FIRST LINE
import 'dotenv/config'; 
import { Ollama } from 'ollama'; // 1. Import the Class


const app = express();
app.use(express.json()); // Allows the API to read JSON from your React app


// ENDPOINT 1: Initial Setup (The 10 Emails)
// Use this once to "train" the system on a user's voice
const ollama = new Ollama({ host: 'http://185.119.109.61:11434' });

app.post('/api/setup-voice', async (req, res) => {
  try {
    const { userId, initialEmails } = req.body;

    if (!initialEmails || initialEmails.length < 5) {
      return res.status(400).json({ error: "Please provide at least 5 emails for accurate analysis." });
    }

    console.log(`🧬 Analyzing voice for user: ${userId}...`);

    // 1. AI Analysis Logic
    const analysisResponse = await ollama.generate({
      model: 'llama4:17b-scout-16e-instruct-q4_K_M',
      system: `You are a linguistic expert. Analyze the provided emails and extract the writer's "Voice DNA".
               Return ONLY a raw JSON object with these keys: 
               vocabulary (list of technical or frequent words), 
               sentence_structure (description of length/complexity), 
               tone (list of adjectives like professional, urgent), 
               communication_style (e.g., collaborative, authoritative).
               Do not include any conversational text, only the JSON.`,
      prompt: `Analyze these emails: ${JSON.stringify(initialEmails)}`,
      format: 'json' // Forces the model to output valid JSON
    });

    const analyzedDNA = JSON.parse(analysisResponse.response);

    // 2. Save to DB using the Model
    const savedRecord = await VoiceDNA.findOneAndUpdate(
      { userId },
      { voiceDNA: analyzedDNA },
      { upsert: true, new: true }
    );

    console.log(`✅ Voice DNA saved for ${userId}`);
    res.json({ success: true, voiceDNA: savedRecord.voiceDNA });

  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze voice DNA." });
  }
});



// ENDPOINT 2: Draft a Reply
// React calls this when a new email arrives


app.post('/api/draft', async (req, res) => {
  try {
    const { userId, threadId, prompt } = req.body;

    // 1. Fetch Voice DNA
    const defaultDNA = {
      tone: ["professional", "direct"],
      communication_style: ["concise"]
    };
    const userRecord = await VoiceDNA.findOne({ userId });
    const activeDNA = userRecord ? userRecord.voiceDNA : defaultDNA;

    // 2. Fetch Thread History (Current Conversation Context)
    // We get the last 10 messages to keep the thread context fresh
    const threadHistory = await EmailMemory.find({ userId, threadId })
      .sort({ createdAt: 1 }) // Chronological order
      .limit(10);
      

    const formattedHistory = threadHistory.map(msg => 
      `${msg.role === 'user' ? 'Client' : 'Me'}: ${msg.content}`
    ).join('\n');

    // 3. Optional: Vector Search (Semantic Context)
    // Find similar past threads from other conversations
    let semanticContext = "";
    try {
      const queryEmbeddingResponse = await ollama.embeddings({
        model: 'mxbai-embed-large',
        prompt: prompt
      });

      const similarThreads = await EmailMemory.aggregate([
        {
          "$vectorSearch": {
            "index": "vector_index", 
            "path": "embedding",
            "queryVector": queryEmbeddingResponse.embedding,
            "numCandidates": 5,
            "limit": 2
          }
        },
        { "$match": { "userId": userId, "threadId": { "$ne": threadId } } } // Don't match current thread
      ]);

      semanticContext = similarThreads.map(t => 
        `Past Context: Client asked: ${t.content}`
      ).join('\n');
    } catch (vErr) {
      console.log("Vector Search skipped or failed:", vErr.message);
    }

    // 4. Combine Context for AI
    console.log(`🧬 Using ${userRecord ? 'Custom' : 'Default'} DNA and Thread Context for ${userId}`);

    const draft = await generateAIPrompt(
      userId, 
      activeDNA, 
      prompt, 
      formattedHistory, // Current thread context
      semanticContext   // Related past context
    );

    res.json({ 
      success: true, 
      draft, 
      History:formattedHistory,
      Sementic: semanticContext,      
      historyCount: threadHistory.length 
    });
    
  } catch (error) {
    console.error("Drafting Error:", error);
    res.status(500).json({ error: error.message });
  }
});
// ENDPOINT 3: Feedback Loop
// React calls this when the user clicks "Send"
app.post('/api/confirm-send', async (req, res) => {
  try {
    const { userId, threadId, incoming, finalReply } = req.body;

    if (!threadId) {
      return res.status(400).json({ error: "threadId is required to save memory." });
    }

    // Pass everything to the helper function
    await saveSentEmail(userId, threadId, incoming, finalReply);
    
    res.json({ status: "Memory Updated", threadId });
  } catch (error) {
    console.error("Save Memory Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await setupDatabase(); // Ensures MongoDB Vector Index is ready at startup
  console.log(`Email AI Lab running on http://localhost:${PORT}`);
});