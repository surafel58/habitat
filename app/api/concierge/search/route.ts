import { NextResponse } from "next/server";
import { z } from "zod";
import { extractFilters } from "@/lib/ai/search";
import { getFilterFacets } from "@/lib/services/properties";

const bodySchema = z.object({ query: z.string().trim().min(1).max(200) });

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const { cities, amenities } = await getFilterFacets();
  const filters = await extractFilters(parsed.data.query, cities, amenities);
  return NextResponse.json({ filters });
}
