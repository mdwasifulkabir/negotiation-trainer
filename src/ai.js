import { GoogleGenAI } from "@google/genai";

// create AI client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_API_KEY,
});

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

//Generate session title
export async function generateSessionTitle(firstMessage) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      Generate a short 3-5 word title for this negotiation scenario.
      Do not include quotation marks.
      Be concise.

      Message:
      ${firstMessage}
          `,
  });

  return response.text.trim();
}

//Generate scenario using first message
export async function generateScenario(subject) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      You are a negotiation roleplay generator.

      The user provides a subject for negotiation.

      Generate:
      1. A realistic negotiation scenario
      2. Background context about the user
      3. Any relevant details to make the negotiation realistic

      Do not negotiate yet.
      Only set up the scenario.

      Subject:
      ${subject}
    `,
  });

  return response.text.trim();
}
export async function generateFeedback(conversation) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    You are an expert negotiation coach.

    Analyze the following negotiation conversation and provide feedback for the user's texts.

    Provide:

    # Negotiation Review

    ## Overall Summary
    ...

    ## Strengths
    - ...

    ## Weaknesses
    - ...

    ## Improvements
    - ...

    ## Skill Ratings (0-10)
    - Confidence: X/10
    - Anchoring: X/10
    - Persuasion: X/10
    - Emotional Intelligence: X/10
    - Preparation: X/10

    Keep the formatting in your response. Provide your response as clean markdown.
    
    Give the review based on the user's replies. The opponent is an AI roleplaying the conversation. Do not sugarcoat the review, feel free to give
    a low score if the user put on a poor performance.

    Conversation:
    ${conversation} `,
  });

  return response.text.trim();
}
