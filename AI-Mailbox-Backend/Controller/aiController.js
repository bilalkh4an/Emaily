import { VoiceTraining, generateAIPrompt } from "../Services/aiService.js";
import { VoiceDNA } from "../models/VoiceDNA.js";
import { EmailMemory } from "../models/EmailMemory.js";

export const setupVoice = async (req, res) => {
  try {
    const userId = req.user.id; // comes from protect middleware
    const { account, initialEmails } = req.body;
    if (!initialEmails || initialEmails.length < 5) {
      return res.status(400).json({
        error: "Please provide at least 5 emails for accurate analysis.",
      });
    }
    const analyzedDNA = await VoiceTraining(initialEmails);

    const savedRecord = await VoiceDNA.findOneAndUpdate(
      { userId, account },
      { $set: { userId, account, voiceDNA: analyzedDNA } },
      { upsert: true, new: true, runValidators: true },
    );

    console.log(`✅ Voice DNA saved for ${userId}`);
    res.json({ success: true, voiceDNA: savedRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateDraft = async (req, res) => {
  try {
    const userId = req.user.id; // comes from protect middleware
    const { account, threadId, prompt, sessionHistory = [] } = req.body;
    console.log("Account = "+account);

    // 1. Set SSE Headers immediately
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");

    //res.setHeader('Connection', 'keep-alive');
    if (req.httpVersion === "1.1") {
      res.setHeader("Connection", "keep-alive");
    }

    // ... (Keep your Voice DNA, Thread History, and Semantic Context logic exactly as is) ...

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

    const userRecord = await VoiceDNA.findOne({ userId, account });
    const activeDNA = userRecord ? userRecord.voiceDNA : defaultDNA;

    // 2. Fetch Thread History from DB (Previous emails)
    const dbHistory = await EmailMemory.findOne({ userId, threadId });

    // 3. Combine DB History + Current Session Instructions
    const formattedHistory = [
      // --- Part A: Emails from Database ---
      ...(dbHistory?.messages || []).map((msg) => {
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

    res.end();
  } catch (error) {
    console.error("Drafting Error:", error);
    // If headers haven't been sent, we can send a 500. Otherwise, we just end.
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.end();
    }
  }
};
