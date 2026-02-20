
import { GoogleGenAI, Type } from "@google/genai";
import { Skill, Gig, MatchingResult } from "./types";

export const getSkillMatches = async (userSkills: Skill[], gigs: Gig[]): Promise<MatchingResult[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Match these user skills with these gigs. User Skills: ${userSkills.map(s => s.title).join(", ")}. Gigs: ${JSON.stringify(gigs)}. Return a JSON array of objects with gigId, relevanceReason, and matchScore (0-100).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            gigId: { type: Type.STRING },
            relevanceReason: { type: Type.STRING },
            matchScore: { type: Type.NUMBER }
          },
          required: ["gigId", "relevanceReason", "matchScore"]
        }
      }
    }
  });

  try {
    const response = await model;
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini matching failed", error);
    return [];
  }
};
