import { GoogleGenAI, Type } from "@google/genai";
import { LicenseConfig, LegalConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions for different personas
const LEGAL_SYSTEM_INSTRUCTION = `You are an expert digital product attorney. 
Your goal is to draft robust, clear, and legally sound documents for digital product creators. 
Ensure you handle placeholders like [Date] or [Company Address] clearly.`;

const LICENSE_SYSTEM_INSTRUCTION = `You are a cryptographically inspired generator. 
Generate unique, hard-to-guess license keys based on the requested format. 
Output ONLY the keys, one per line. Do not add introductory text.`;

export const generateLegalDocument = async (config: LegalConfig): Promise<string> => {
  const prompt = `
    Draft a ${config.documentType.toUpperCase()} for a ${config.productType} created by "${config.entityName}".
    Jurisdiction: ${config.jurisdiction}.
    Tone/Strictness: ${config.strictness}.
    
    Ensure the document covers standard protections for digital goods (no refunds on downloaded files, IP rights, etc.).
    Format the output in clean Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: LEGAL_SYSTEM_INSTRUCTION,
        temperature: 0.3, // Lower temperature for more consistent/formal legal text
      }
    });
    return response.text || "Failed to generate document.";
  } catch (error) {
    console.error("Legal Gen Error:", error);
    return "An error occurred while generating the legal document. Please check your API key.";
  }
};

export const generateLicenseKeys = async (config: LicenseConfig): Promise<string[]> => {
  let formatInstruction = "";
  switch (config.format) {
    case 'uuid': formatInstruction = "Standard UUID v4 format"; break;
    case 'alphanumeric': formatInstruction = "Groups of 4 alphanumeric characters separated by dashes (e.g., A1B2-C3D4-E5F6-G7H8)"; break;
    case 'phonetic': formatInstruction = "Phonetic words separated by dashes (e.g., ALPHA-BRAVO-CHARLIE)"; break;
    case 'custom': formatInstruction = "A complex mix of special chars, numbers, and letters."; break;
  }

  const prompt = `Generate ${config.count} unique license keys for the product "${config.productName}".
  Format Style: ${formatInstruction}.
  Complexity Level: ${config.complexity}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: LICENSE_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keys: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    return parsed.keys || [];
  } catch (error) {
    console.error("License Gen Error:", error);
    return ["Error generating keys"];
  }
};

export const streamAdvisorChat = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash', 
      history: history,
      config: {
        systemInstruction: "You are 'ProtectorAI', a digital rights and copyright advisor. You help creators understand how to protect their work. You are helpful, concise, and professional. Disclaimer: You are an AI, not a lawyer.",
      }
    });

    return await chat.sendMessageStream({ message: newMessage });
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};
