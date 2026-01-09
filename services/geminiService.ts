
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getManhuaRecommendation = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `وەک شارەزایەکی مانهوا (Manhua)، بەکارهێنەرێک داوای پێشنیار دەکات دەربارەی: "${topic}". 
      تکایە ٣ مانهوای گونجاو پێشنیار بکە بە زمانی کوردی. 
      بۆ هەر دانەیەک تەنها ناوەکەی و وەسفێکی زۆر کورتی (١ دێڕ) بنووسە.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ببورە، ناتوانم لە ئێستادا پێشنیار بکەم. تکایە دواتر هەوڵ بدەرەوە.";
  }
};
