import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { askConcierge } from "@/lib/ai/concierge";

const bodySchema = z.object({
  propertyId: z.string().min(1),
  question: z.string().trim().min(1).max(500),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const p = await prisma.property.findUnique({
    where: { id: parsed.data.propertyId },
  });
  if (!p) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  const answer = await askConcierge(
    {
      title: p.title,
      type: p.type,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      areaSqft: p.areaSqft,
      city: p.city,
      locality: p.locality,
      amenities: p.amenities,
      description: p.description,
    },
    parsed.data.question
  );

  return NextResponse.json({ answer });
}
