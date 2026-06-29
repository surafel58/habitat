import { Type } from "@google/genai";
import { getGemini, GEMINI_MODEL } from "./gemini";
import { PROPERTY_TYPES } from "@/lib/validators/property";

export type ExtractedFilters = {
  q?: string;
  type?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  amenities?: string[];
};

/**
 * Natural-language → structured filters via Gemini JSON mode (DESIGN.md §8.1).
 * The model only ever returns a structured object we re-validate; it never
 * touches the database. Falls back to keyword search if AI is unavailable.
 */
export async function extractFilters(
  query: string,
  cities: string[],
  amenityVocab: string[] = []
): Promise<ExtractedFilters> {
  const ai = getGemini();
  if (!ai) return { q: query };

  // Canonical-casing map so "pool" matches the DB's "Pool".
  const amenityByLower = new Map(amenityVocab.map((a) => [a.toLowerCase(), a]));

  try {
    const res = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: query,
      config: {
        temperature: 0,
        systemInstruction: `You extract real-estate search filters from a user query.
Known cities: ${cities.join(", ")}.
Valid amenities (use these EXACT strings, matching case): ${amenityVocab.join(", ")}.
Prices are Indian Rupees: 1 crore = 10000000, 1 lakh = 100000 — always output whole rupees.
"3 BHK" means minBedrooms 3. Only include fields the user clearly specified; omit the rest.
Put any free-text keywords that aren't a structured field into "q".`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            q: { type: Type.STRING },
            type: { type: Type.STRING, enum: [...PROPERTY_TYPES] },
            city: { type: Type.STRING },
            minPrice: { type: Type.INTEGER },
            maxPrice: { type: Type.INTEGER },
            minBedrooms: { type: Type.INTEGER },
            amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    const raw = JSON.parse(res.text ?? "{}") as Record<string, unknown>;
    const out: ExtractedFilters = {};
    if (typeof raw.q === "string" && raw.q.trim()) out.q = raw.q.trim();
    if (typeof raw.type === "string" && PROPERTY_TYPES.includes(raw.type as never))
      out.type = raw.type;
    if (typeof raw.city === "string" && raw.city.trim()) out.city = raw.city.trim();
    if (typeof raw.minPrice === "number") out.minPrice = Math.round(raw.minPrice);
    if (typeof raw.maxPrice === "number") out.maxPrice = Math.round(raw.maxPrice);
    if (typeof raw.minBedrooms === "number") out.minBedrooms = Math.round(raw.minBedrooms);
    if (Array.isArray(raw.amenities)) {
      const normalized = raw.amenities
        .filter((a): a is string => typeof a === "string")
        .map((a) => amenityByLower.get(a.toLowerCase()) ?? (amenityVocab.length ? null : a))
        .filter((a): a is string => Boolean(a));
      if (normalized.length) out.amenities = [...new Set(normalized)];
    }
    return out;
  } catch {
    return { q: query };
  }
}
