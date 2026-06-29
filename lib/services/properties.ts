import type { Prisma, PropertyType } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  PAGE_SIZE,
  type PropertyFilter,
} from "@/lib/validators/property";

/** Build a Prisma `where` clause from a validated filter. */
function buildWhere(f: PropertyFilter): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};

  if (f.type) where.type = f.type;
  if (f.city) where.city = { equals: f.city, mode: "insensitive" };
  if (f.minBedrooms) where.bedrooms = { gte: f.minBedrooms };

  if (f.minPrice || f.maxPrice) {
    where.price = {
      ...(f.minPrice ? { gte: f.minPrice } : {}),
      ...(f.maxPrice ? { lte: f.maxPrice } : {}),
    };
  }

  if (f.amenities?.length) where.amenities = { hasEvery: f.amenities };

  if (f.q) {
    where.OR = [
      { title: { contains: f.q, mode: "insensitive" } },
      { locality: { contains: f.q, mode: "insensitive" } },
      { city: { contains: f.q, mode: "insensitive" } },
      { description: { contains: f.q, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(
  sort: PropertyFilter["sort"]
): Prisma.PropertyOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function listProperties(filter: PropertyFilter) {
  const where = buildWhere(filter);
  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: buildOrderBy(filter.sort),
      skip: (filter.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items,
    total,
    page: filter.page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getPropertyBySlug(slug: string) {
  const property = await prisma.property.findUnique({
    where: { slug },
    include: { panoramas: { orderBy: { order: "asc" } } },
  });
  if (property) {
    // fire-and-forget view increment; never block render on it
    prisma.property
      .update({ where: { id: property.id }, data: { views: { increment: 1 } } })
      .catch(() => {});
  }
  return property;
}

export async function getFeaturedProperties(take = 3) {
  return prisma.property.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

/** Distinct cities + amenities for building filter facets. */
export async function getFilterFacets() {
  const properties = await prisma.property.findMany({
    select: { city: true, amenities: true },
  });
  const cities = [...new Set(properties.map((p) => p.city))].sort();
  const amenities = [
    ...new Set(properties.flatMap((p) => p.amenities)),
  ].sort();
  return { cities, amenities };
}

/** Structured similarity for "similar homes" (DESIGN.md §8.3 candidate set). */
export async function getSimilarProperties(
  property: { id: string; type: PropertyType; city: string; price: number },
  take = 3
) {
  return prisma.property.findMany({
    where: {
      id: { not: property.id },
      OR: [
        { type: property.type },
        { city: property.city },
        {
          price: {
            gte: Math.round(property.price * 0.75),
            lte: Math.round(property.price * 1.25),
          },
        },
      ],
    },
    take,
    orderBy: { views: "desc" },
  });
}
