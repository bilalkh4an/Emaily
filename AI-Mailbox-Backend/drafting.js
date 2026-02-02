import { Ollama } from 'ollama';
import { collection } from './db.js';

// Initialize with your Proxmox Container IP
const ollama = new Ollama({ host: 'http://185.119.109.61:11434' });

/**
 * DRAFT GENERATOR
 */
async function generateAIPrompt(userId, voiceDNA, newEmail, formattedHistory, semanticContext) {
  
  // 1. Construct the System Instructions
  const systemInstructions = `
    You are a professional AI email assistant.

    VOICE DNA (Your Style Guide):
    ${JSON.stringify(voiceDNA)}

    HISTORICAL CONTEXT (Relevant past info from other threads):
    ${semanticContext || "No past related context found."}
  `;

  // 2. Construct the User Prompt with the Current Thread
  const userPrompt = `
    CURRENT CONVERSATION LOG:
    ${formattedHistory}

    CLIENT'S NEW MESSAGE:
    "${newEmail}"

    TASK:
    Write a reply to the client's latest message.

    Guidelines:
    1. Reason: Explain why this email is being created.
    2. Intent: Clearly define who this email is addressed to and the purpose.
    3. Tone: Use the provided Voice DNA to match the user's style and tone.
    4. Stay strictly consistent with the conversation history above.
    5. Be concise, professional, and structured.
  `;

  // 3. GENERATE FINAL DRAFT
  const response = await ollama.generate({
    model: 'llama4:17b-scout-16e-instruct-q4_K_M',
    system: systemInstructions,
    prompt: userPrompt
  });

  return response.response;
}

export { generateAIPrompt };
