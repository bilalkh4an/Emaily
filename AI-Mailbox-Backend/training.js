import { Ollama } from "ollama"; // Import the Ollama class
import { EmailMemory } from "./models/EmailMemory.js";
import "dotenv/config";

// Initialize the client with your Proxmox Container IP from .env
const ollama = new Ollama({ host: process.env.OLLAMA_HOST });

/**
 * STEP 1: Voice DNA Extraction
 * Analyzes the 10 static emails to create a permanent style guide.
 */
async function extractVoiceDNA(emails) {
  try {
    console.log(`Starting analysis with ${process.env.VOICE_MODEL}...`);

    const prompt = `Analyze these emails and extract a JSON Voice DNA. 
    Focus on vocabulary, sentence structure, and tone:
    ${emails.join("\n---\n")}`;

    const response = await ollama.generate({
      model: process.env.VOICE_MODEL, // Now uses 'llama4:scout' from .env
      prompt: prompt,
      format: "json",
      options: {
        num_ctx: 32768, // Scout supports 10M, but 32k is plenty for 10 emails
        num_thread: 32, // Fully utilizes your 32-core VPS
      },
    });

    const dna = JSON.parse(response.response);
    console.log("Voice DNA successfully extracted.");
    return dna;
  } catch (error) {
    console.error("Error in Voice DNA extraction:", error);
    throw error;
  }
}


async function saveFetchEmail(
  userId,
  folder,
  account,
  sender,
  to,
  subject,
  time,
  unread,
  avatar,
  messages,
  threadId,
  role
) {
  try {
    if (!threadId) {
      console.error("Skipping save: No threadId provided");
      return;
    }
    // 2. Sort messages descending by date (latest first)
    const sortedMessages = messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const result = await EmailMemory.findOneAndUpdate(
      { userId: userId, threadId: threadId },
      { 
        $set: { 
          folder,
          account,
          sender,
          subject,
          time,
          unread,
          avatar,
          messages: sortedMessages, // Use the sorted array here
          role: "user"
        } 
      },
      { 
        upsert: true, 
        new: true, 
        setDefaultsOnInsert: true 
      }
    );

    console.log(`💾 Sync Successful: Thread ${threadId} saved with ${sortedMessages.length} messages in order.`);
  } catch (error) {
    console.error("❌ MongoDB Update Error:", error);
  }
}

export { extractVoiceDNA, saveFetchEmail };
