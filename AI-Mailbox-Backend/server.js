import express from "express";
import { setupDatabase } from "./db.js";
import { VoiceDNA } from "./models/VoiceDNA.js"; // Import the new model
import { EmailMemory } from "./models/EmailMemory.js";
import { EmailAccount } from "./models/EmailAccount.js";
import { generateAIPrompt } from "./drafting.js";
import {
  fetchEmails,
  fetchSentEmails,
  sentEmail,
  EmailAccounts,
} from "./Controller/emailService.js"; // path to function file

import cors from "cors";
// 1. THIS MUST BE THE FIRST LINE
import "dotenv/config";
import { Ollama } from "ollama"; // 1. Import the Class

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
const ollama = new Ollama({ host: "http://185.119.109.61:11434" });

app.get("/api/emailaccounts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const emails = await EmailAccounts(userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/emails/fetch/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const emails = await fetchEmails(userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/emails/conversation/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const emails = await fetchSentEmails(userId);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/sentemail", async (req, res) => {
  const { to, subject, body, userId, inReplyToId } = req.body;

  try {
    const result = await sentEmail(to, subject, body, userId, inReplyToId);
    res.json(result);
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/setup-voice", async (req, res) => {
  try {
    const { userId, initialEmails } = req.body;

    if (!initialEmails || initialEmails.length < 5) {
      return res.status(400).json({
        error: "Please provide at least 5 emails for accurate analysis.",
      });
    }

    console.log(`🧬 Analyzing voice for user: ${userId}...`);

    // 1. AI Analysis Logic
    const analysisResponse = await ollama.generate({
      model: "llama4:17b-scout-16e-instruct-q4_K_M",
      system: `You are a linguistic expert. Analyze the provided emails and extract the writer's "Voice DNA".
               Return ONLY a raw JSON object with these keys: 
               vocabulary (list of technical or frequent words), 
               sentence_structure (description of length/complexity), 
               tone (list of adjectives like professional, urgent), 
               communication_style (e.g., collaborative, authoritative).
               Do not include any conversational text, only the JSON.`,
      prompt: `Analyze these emails: ${JSON.stringify(initialEmails)}`,
      format: "json", // Forces the model to output valid JSON
    });

    const analyzedDNA = JSON.parse(analysisResponse.response);

    // 2. Save to DB using the Model
    const savedRecord = await VoiceDNA.findOneAndUpdate(
      { userId },
      { voiceDNA: analyzedDNA },
      { upsert: true, new: true },
    );

    console.log(`✅ Voice DNA saved for ${userId}`);
    res.json({ success: true, voiceDNA: savedRecord.voiceDNA });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze voice DNA." });
  }
});

// ENDPOINT 2: Draft a Reply
app.post("/api/draft", async (req, res) => {
  try {
    const { userId, threadId, prompt, sessionHistory = [] } = req.body;

    // 1. Set SSE Headers immediately
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    //res.setHeader('Connection', 'keep-alive');

    if (req.httpVersion === "1.1") {
      res.setHeader("Connection", "keep-alive");
    }
    console.log(userId);

    // ... (Keep your Voice DNA, Thread History, and Semantic Context logic exactly as is) ...
    const userRecord = await VoiceDNA.findOne({ userId });
    const defaultDNA = {
      tone: ["professional", "appreciative", "direct"],
      vocabulary: [
        "collaboration",
        "milestones",
        "transparency",
        "action items",
        "efficiency",
        "documentation",
      ],
      sentence_structure:
        "concise, with an average length of 15-20 words per sentence",
      communication_style: ["instructive", "collaborative", "objective"],
    };

    const activeDNA = userRecord ? userRecord.voiceDNA : defaultDNA;
    const threadHistory = await EmailMemory.find({ userId, threadId })
      .sort({ createdAt: 1 })
      .limit(10);
    // const formattedHistory = threadHistory.map(msg => `${msg.role === 'user' ? 'Client' : 'Me'}: ${msg.content}`).join('\n');

    // 2. Fetch Thread History from DB (Previous emails)
    const dbHistory = await EmailMemory.findOne({ userId, threadId })
      .sort({ createdAt: 1 })
      .limit(5);

    // 3. Combine DB History + Current Session Instructions
    const formattedHistory = [
      // --- Part A: Emails from Database ---
      // We use ?. and || [] to ensure it doesn't crash if no history exists
      ...(dbHistory?.messages || []).map((msg) => {
        // In your schema, 'Sent' folder means it's from you
        const senderLabel = msg.folder === "Sent" ? "Me" : "Client";
        return `${senderLabel}: ${msg.body}`;
      }),

      // --- Part B: Instructions from Current Chat Session ---
      ...(sessionHistory || []).map((msg) => {
        const roleLabel = msg.role === "user" ? "User Instruction" : "AI Draft";
        return `${roleLabel}: ${msg.content}`;
      }),
    ].join("\n");

    // 2. Call generateAIPrompt
    // Note: We use res.write to push tokens to the frontend in real-time
    await generateAIPrompt(
      userId,
      activeDNA,
      prompt,
      formattedHistory,
      (token) => {
        res.write(token); // Send token directly to stream
      },
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

app.post("/api/settings/add-imap", async (req, res) => {
  try {
    const { userId, email, imapHost, imapPort, security, password } = req.body;

    // 1. Basic Validation
    if (!email || !password || !imapHost) {
      return res.status(400).json({ error: "Missing required IMAP fields." });
    }

    // 2. Save or Update the account settings
    const account = await EmailAccount.findOneAndUpdate(
      { email }, // Find by email
      { userId, email, imapHost, imapPort, security, password }, // Update these fields
      { upsert: true, new: true }, // Create if doesn't exist
    );

    console.log(`📧 IMAP Account linked: ${email} for user ${userId}`);
    res.json({
      success: true,
      message: "Email account linked successfully!",
      account,
    });
  } catch (error) {
    console.error("IMAP Save Error:", error);
    res.status(500).json({ error: "Failed to link email account." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await setupDatabase(); // Ensures MongoDB Vector Index is ready at startup
  console.log(`Email AI Lab running on http://localhost:${PORT}`);
});
