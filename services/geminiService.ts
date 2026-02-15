import { GoogleGenAI } from "@google/genai";
import { Session } from '../types';

export const generatePDSummary = async (
  sessions: Session[],
  userName: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Returning fallback summary.");
    return `## Professional Development Itinerary\n\n**Attendee:** ${userName}\n\n` +
      sessions.map(s => `### ${s.title}\n* **Presenter:** ${s.presenter}\n* **Room:** ${s.room}\n`).join('\n');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const sessionList = sessions.map(
    (s) => `- ${s.title} (Presenter: ${s.presenter}, Room: ${s.room}): ${s.description}`
  ).join('\n');

  const prompt = `
    You are an enthusiastic professional development coordinator for Barrington District 220.
    
    A staff member named "${userName}" has signed up for the following sessions today:
    ${sessionList}

    Please generate a personalized "PD Focus Guide" for them.
    It should be formatted in Markdown.
    
    Structure:
    1.  **Friendly Greeting**: Acknowledge their commitment to professional growth.
    2.  **Itinerary at a Glance**: A clean list of their sessions with Room Numbers.
    3.  **Key Takeaway Questions**: For each session chosen, provide 1 thoughtful question they should ask themselves or the presenter to get the most out of it.
    4.  **Closing**: A motivational sign-off.

    Keep the tone professional yet inspiring.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `## Professional Development Itinerary\n\n**Attendee:** ${userName}\n\n` +
      sessions.map(s => `### ${s.title}\n* **Presenter:** ${s.presenter}\n* **Room:** ${s.room}\n`).join('\n');
  }
};
