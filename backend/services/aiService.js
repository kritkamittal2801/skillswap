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

export const expandSkills = async (
  skills
) => {

  const prompt = `
A user can teach:

${skills.join(", ")}

Generate related learning and teaching tags.

Return ONLY a JSON array.

Example:
["React","JavaScript","Frontend Development"]
`;

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
  const cleaned =
    response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  return JSON.parse(cleaned);
};