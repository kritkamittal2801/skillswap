import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
 const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const extractTopics = async (
  text,
  retries = 2
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

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const cleaned = response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.log("Topic extraction parse error:", cleaned);
        return [];
      }
    } catch (apiError) {
      const isOverloaded =
        apiError?.status === 503 ||
        apiError?.message?.toLowerCase().includes("overloaded");

      console.log(
        `Gemini extractTopics attempt ${attempt + 1} failed:`,
        apiError.message
      );

      if (isOverloaded && attempt < retries) {
        await sleep(1000 * (attempt + 1)); // 1s, then 2s
        continue;
      }

      
      return [];
    }
  }

  return [];
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