
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, CareerRecommendation, ChatMessage, SkillSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are Pathweaver AI, an elite career strategist for Indian students and professionals.
Your goal is to provide personalized, context-aware career guidance.
MANDATORY RULES:
1. All salary ranges MUST be in Indian Rupees (INR) using the ₹ symbol.
2. Provide a 'minSalary' as a number (e.g., 800000) for internal sorting.
3. Provide a 'location' representing the primary hub for this role in India (e.g., "Bengaluru", "Mumbai", "Hyderabad", "Remote").
4. The entire analysis and all text fields MUST be in the user's requested language.
5. Suggest 3 distinct but highly relevant career paths.
6. Provide realistic, actionable roadmaps based on the current Indian job market.`;

export async function getCareerRecommendations(profile: StudentProfile): Promise<CareerRecommendation[]> {
  const prompt = `Analyze this profile and respond in ${profile.language}:
    Name: ${profile.name}
    Education: ${profile.educationLevel}
    Major: ${profile.major}
    Interests: ${profile.interests.join(', ')}
    Skills: ${profile.skills.join(', ')}
    Goals: ${profile.goals}
    
    Ensure all JSON values are translated to ${profile.language}. 
    Provide salaries in INR with ₹ symbol.
    Include 'minSalary' (number) and 'location' (string).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            alignmentScore: { type: Type.NUMBER },
            salaryRange: { type: Type.STRING },
            minSalary: { type: Type.NUMBER },
            location: { type: Type.STRING },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketOutlook: { type: Type.STRING }
          },
          required: ["title", "description", "alignmentScore", "salaryRange", "minSalary", "location", "requiredSkills", "roadmap", "marketOutlook"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function getSkillSuggestions(profile: StudentProfile): Promise<SkillSuggestion[]> {
  const prompt = `Suggest 6 high-value skills for ${profile.name} to learn, given their major in ${profile.major} and interests in ${profile.interests.join(', ')}.
  Provide the response in ${profile.language}. 
  Identify skills that are currently trending in the Indian job market 2024-2025.
  Include specific types of learning resources (e.g., 'YouTube', 'Coursera', 'Documentation').`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a skill acquisition expert. Provide practical and trending skill advice for the Indian context.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            importance: { type: Type.STRING },
            learningResources: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  title: { type: Type.STRING }, 
                  type: { type: Type.STRING, description: "One of: video, course, article" } 
                } 
              } 
            },
            difficulty: { type: Type.STRING, description: "One of: Beginner, Intermediate, Advanced" },
            trendingStatus: { type: Type.BOOLEAN }
          },
          required: ["name", "description", "importance", "learningResources", "difficulty", "trendingStatus"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function chatWithAI(history: ChatMessage[], message: string, language: string) {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Pathweaver Assistant. Answer career-related questions in ${language}. Be concise and encouraging.`,
    },
    history: history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }))
  });

  const result = await chat.sendMessage({ message });
  return result.text;
}

export async function searchMarketTrends(query: string, language: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze current market trends for: ${query}. Write the response in ${language}. Use Google Search to find recent data. Focus on the Indian market perspective.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      title: chunk.web?.title || 'External Source',
      uri: chunk.web?.uri || ''
    })) || [];

  return {
    text: response.text,
    sources
  };
}
