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
Extract only the most relevant learning topics.

Rules:
- Return ONLY a valid JSON array.
- No markdown.
- No explanations.
- Maximum 5 topics.
- Each topic must be a string.

Example:

Input:
"I need help with React Hooks"

Output:
["React","Hooks","React Hooks","Frontend Development","Web Development","Frontend"]

Text:
${text}
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

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.log(
      "Topic extraction parse error:",
      cleaned
    );

    return [];
  }
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