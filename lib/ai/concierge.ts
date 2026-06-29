import { getGemini, GEMINI_MODEL } from "./gemini";
import { calculateEmi } from "@/lib/finance";
import { formatINR } from "@/lib/format";

export interface ConciergeProperty {
  title: string;
  type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  city: string;
  locality: string;
  amenities: string[];
  description: string;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/**
 * Grounded property concierge (DESIGN.md §8.2). EMI is computed deterministically
 * server-side (§8.5) — the model only narrates it, never does binding maths.
 */
export async function askConcierge(
  property: ConciergeProperty,
  question: string
): Promise<string> {
  // EMI on a typical 80% loan @ 9% p.a. over 20 years.
  const principal = Math.round(property.price * 0.8);
  const emi = calculateEmi({ principal, annualRatePct: 9, years: 20 });

  const ai = getGemini();
  if (!ai) {
    return `${property.title} is a ${property.bedrooms} BHK ${property.type.toLowerCase()} in ${property.locality}, ${property.city}, priced at ${formatINR(
      property.price
    )}. On an 80% loan at 9% over 20 years the EMI is about ${inr(
      emi.monthly
    )}/month. (The AI concierge is offline right now.)`;
  }

  const systemInstruction = `You are Habitat's warm, concise property concierge. Answer in 2–4 sentences using ONLY the facts below plus general real-estate guidance. Never invent specific numbers (exact distances, other listings' prices). If asked about EMI/mortgage/affordability, use the precomputed figure.

PROPERTY
- ${property.title} — ${property.type}, ${property.bedrooms} bed / ${property.bathrooms} bath, ${property.areaSqft} sq ft
- Location: ${property.locality}, ${property.city}
- Price: ${formatINR(property.price)} (${inr(property.price)})
- Amenities: ${property.amenities.join(", ") || "—"}
- About: ${property.description}

PRECOMPUTED EMI (80% loan = ${inr(principal)}, 9% p.a., 20 yrs): ${inr(
    emi.monthly
  )}/month; total interest ${inr(emi.totalInterest)}.`;

  try {
    const res = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: question,
      config: { systemInstruction, temperature: 0.4, maxOutputTokens: 500 },
    });
    return res.text?.trim() || "Sorry, I couldn't answer that just now.";
  } catch {
    return `On an 80% loan at 9% over 20 years, the EMI for ${property.title} is about ${inr(
      emi.monthly
    )}/month. (The concierge had trouble reaching the AI service — please try again.)`;
  }
}
