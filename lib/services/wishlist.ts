import { prisma } from "@/lib/db";

/** Set of property IDs the user has saved (for marking cards). */
export async function getWishlistIds(userId: string): Promise<Set<string>> {
  const rows = await prisma.wishlist.findMany({
    where: { userId },
    select: { propertyId: true },
  });
  return new Set(rows.map((r) => r.propertyId));
}

export async function getSavedProperties(userId: string) {
  const rows = await prisma.wishlist.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => r.property);
}
