
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API with correct parameter name and exclusive use of process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getManhuaRecommendation = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بەکارهێنەر دەیەوێت مانھوایەک بخوێنێتەوە دەربارەی: ${topic}. تکایە ٣ پێشنیار بدە بە کوردی بە کورت و کورتی.`,
    });
    // Correctly access text property from GenerateContentResponse
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ببورە، ناتوانم لە ئێستادا پێشنیار بکەم.";
  }
};
