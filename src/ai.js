// src/ai.js
import { GoogleGenAI } from "@google/genai";

// Create AI client
const ai = new GoogleGenAI({});

// Export a function that the app can call
export async function getNegotiationReply(history) {
  const model = "gemini-2.5-flash";

  // Convert chat history into Gemini format
  const contents = history.map((msg) => ({
    role: msg.role, // "user" or "model"
    parts: [{ text: msg.text }],
  }));

  // Add system-style instruction at the start
  contents.unshift({
    role: "user",
    parts: [
      {
        text: `
You are an AI negotiation trainer.

Your job:
1. Roleplay as the negotiation partner.
2. After replying, give coaching feedback:
   - What the user did well
   - What they should improve
   - One actionable tip

Keep replies realistic, concise, and helpful.
        `,
      },
    ],
  });

  // Generate response
  const response = await ai.models.generateContent({
    model,
    contents,
  });

  return response.text;
}
