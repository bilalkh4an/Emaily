import express from 'express';
import { setupDatabase } from './db.js';
import { extractVoiceDNA, saveSentEmail } from './training.js';
import { VoiceDNA } from './models/VoiceDNA.js'; // Import the new model
import { EmailMemory } from './models/EmailMemory.js';
import { generateAIPrompt } from './drafting.js';
import cors from 'cors';
// 1. THIS MUST BE THE FIRST LINE
import 'dotenv/config'; 
import { Ollama } from 'ollama'; // 1. Import the Class


const app = express();
app.use(express.json()); // Allows the API to read JSON from your React app

app.use(cors());

// Allow only your frontend domain
// app.use(cors({
//   origin: 'http://https://emaily.uk/', // or '*' to allow all
//   methods: ['GET','POST','PUT','DELETE'],
//   credentials: true // if you need cookies/auth
// }));


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
    const { userId, threadId, prompt, sessionHistory = [] } = req.body;    

    // 1. Set SSE Headers immediately
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    //res.setHeader('Connection', 'keep-alive');

     if (req.httpVersion === '1.1') {
      res.setHeader('Connection', 'keep-alive');
     }

    // ... (Keep your Voice DNA, Thread History, and Semantic Context logic exactly as is) ...
    const userRecord = await VoiceDNA.findOne({ userId });
    const activeDNA = userRecord ? userRecord.voiceDNA : { tone: ["professional"], communication_style: ["concise"] };
    const threadHistory = await EmailMemory.find({ userId, threadId }).sort({ createdAt: 1 }).limit(10);
    // const formattedHistory = threadHistory.map(msg => `${msg.role === 'user' ? 'Client' : 'Me'}: ${msg.content}`).join('\n');

    // 2. Fetch Thread History from DB (Previous emails)
    const dbHistory = await EmailMemory.find({ userId, threadId }).sort({ createdAt: 1 }).limit(5);

    // 3. Combine DB History + Current Session Instructions
    const formattedHistory = [
       ...dbHistory.map(msg => `${msg.role === 'user' ? 'Client' : 'Me'}: ${msg.content}`),
       ...sessionHistory.map(msg => `${msg.role === 'user' ? 'User Instruction' : 'AI Draft'}: ${msg.content}`)
    ].join('\n');
    
    // 2. Call generateAIPrompt
    // Note: We use res.write to push tokens to the frontend in real-time
    await generateAIPrompt(
      userId, 
      activeDNA, 
      prompt, 
      formattedHistory,  
      (token) => {
        res.write(token); // Send token directly to stream
      }
    );

    res.end(); // Close the connection when AI is finished
    
  } catch (error) {
    console.error("Drafting Error:", error);
    // If headers haven't been sent, we can send a 500. Otherwise, we just end.
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.end();
    }
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