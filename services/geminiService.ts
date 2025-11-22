import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const summarizeNote = async (noteContent: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following markdown note into a concise 3-sentence summary:\n\n${noteContent}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating summary.";
  }
};

export const suggestHabitSteps = async (goal: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I want to establish the following habit/goal: "${goal}". detailed but concise list of 3 small, actionable daily steps I can take to achieve this. Format as a markdown list.`,
    });
    return response.text || "Could not generate suggestions.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating suggestions.";
  }
};