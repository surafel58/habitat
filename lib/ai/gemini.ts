import { GoogleGenAI } from "@google/genai";

let cached: GoogleGenAI | null | undefined;

/**
 * Server-side Gemini client (DESIGN.md §8.4 — the key never reaches the client).
 * Returns null when no key is configured so callers can fall back gracefully.
 */
export function getGemini(): GoogleGenAI | null {
  if (cached !== undefined) return cached;
  const apiKey = process.env.GEMINI_API_KEY;
  cached = apiKey && apiKey !== "replace-me" ? new GoogleGenAI({ apiKey }) : null;
  return cached;
}

export const GEMINI_MODEL = "gemini-2.5-flash";
