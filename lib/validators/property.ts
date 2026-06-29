import { z } from "zod";

/** Canonical property-type / status values (mirror the Prisma enums). */
export const PROPERTY_TYPES = ["APARTMENT", "VILLA", "PLOT", "COMMERCIAL"] as const;
export const LISTING_STATUSES = ["FOR_SALE", "FOR_RENT", "SOLD"] as const;

export const SORT_OPTIONS = ["recent", "price-asc", "price-desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/**
 * Filter schema for the catalog. Used by both the URL-param parser and the
 * Gemini natural-language search (DESIGN.md §8.1) so AI output is validated
 * the exact same way as user input.
 */
export const propertyFilterSchema = z.object({
  q: z.string().trim().max(120).optional(),
  type: z.enum(PROPERTY_TYPES).optional(),
  city: z.string().trim().max(80).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  minBedrooms: z.coerce.number().int().min(0).max(20).optional(),
  amenities: z.array(z.string().trim()).optional(),
  sort: z.enum(SORT_OPTIONS).default("recent"),
  page: z.coerce.number().int().min(1).default(1),
});

export type PropertyFilter = z.infer<typeof propertyFilterSchema>;

/**
 * Parse loosely-typed URL search params (string | string[] | undefined) into a
 * validated filter. Invalid values are dropped rather than throwing, so a
 * malformed query never 500s the catalog.
 */
export function parsePropertyFilter(
  params: Record<string, string | string[] | undefined>
): PropertyFilter {
  const amenities =
    typeof params.amenities === "string"
      ? params.amenities.split(",").map((a) => a.trim()).filter(Boolean)
      : Array.isArray(params.amenities)
        ? params.amenities
        : undefined;

  const result = propertyFilterSchema.safeParse({ ...params, amenities });
  return result.success ? result.data : propertyFilterSchema.parse({});
}

export const PAGE_SIZE = 9;
