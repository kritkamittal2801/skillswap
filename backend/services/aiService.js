import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
 const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const extractTopics = async (
  text
) => {
  const prompt = `
Extract learning topics from this request.

Return ONLY a comma separated list.

Request:
${text}
`;

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

const result = response.text;

const topics = result
  .split(",")
  .map((topic) => topic.trim());

return topics;
};