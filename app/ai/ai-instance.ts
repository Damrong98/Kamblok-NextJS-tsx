// src/ai/ai-instance.ts
import { GoogleGenAI } from '@google/genai';

export const genAI = new GoogleGenAI(process.env.GOOGLE_GENAI_API_KEY || "");
