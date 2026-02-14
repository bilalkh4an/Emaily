import { Ollama } from 'ollama';


// Initialize with your Proxmox Container IP
const ollama = new Ollama({ host: 'http://185.119.109.61:11434' });

/**
 * DRAFT GENERATOR
 */
async function generateAIPrompt(userId, voiceDNA, newEmail, formattedHistory, onToken) {
  console.log('AI stream started');
  
  // 1. Construct the System Instructions
  const systemInstructions = `
    You are a professional AI email assistant.
    Your personality is defined by this VOICE DNA:
    - TONE: ${voiceDNA.tone.join(", ")}
    - VOCABULARY: ${voiceDNA.vocabulary.join(", ")}
    - STRUCTURE: ${voiceDNA.sentence_structure}
    - STYLE: ${voiceDNA.communication_style.join(", ")}

    ADHERENCE RULES:
    1. Use the provided VOCABULARY naturally.
    2. Maintain the specified SENTENCE STRUCTURE strictly.
    3. Output ONLY the email body. No conversational filler like "Sure, here is your email."
  `;

   let finalResponse = '';

  // 2. Construct the User Prompt with the Current Thread
  const userPrompt = `
    [CONVERSATION HISTORY]
    ${formattedHistory}

    [NEW MESSAGE TO CONVEY]
    "${newEmail}"

    [TASK]
    Write an email to convay my message.

   

    [GUIDELINES]
    1. UNDERSTAND PURPOSE: Analyze the conversation history to determine the reason and intent of this reply.
    2. TARGET AUDIENCE: Ensure the tone and content are appropriate for the specific recipient in the history.
    3. VOICE DNA: Strictly apply the provided Style Guide (Tone, Vocabulary, Structure).
    4. CONTINUITY: Stay 100% consistent with facts mentioned in previous emails.
    5. BREVITY: Be concise and professional; avoid corporate fluff.
    6. FINAL OUTPUT: Provide ONLY the email body text.
    7. SIGNATURE: Start with an appropriate greeting based on the recipient's name in the history, and end with a professional sign-off.
  `;
console.log(userPrompt);
console.log(systemInstructions);
  // 3. GENERATE FINAL DRAFT
  const stream = await ollama.generate({
    model: 'llama4:17b-scout-16e-instruct-q4_K_M',
    system: systemInstructions,
    prompt: userPrompt,
    stream: true,
    options: {
    temperature: 0.4, // Keep it professional and focused
    num_predict: 500,  // Prevents the AI from writing an endlessly long email
  }
  });

  for await (const chunk of stream) {
    if (chunk.response) {
      finalResponse += chunk.response;

      // LIVE STREAM OUTPUT
      if (onToken) {
        onToken(chunk.response);
      }
    }

    if (chunk.done) {
      console.log('AI stream finished');
    }
  }

  return finalResponse;
}

export { generateAIPrompt };
