"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type ToggleResult = { saved: boolean } | { error: "unauthenticated" };

export async function toggleWishlist(propertyId: string): Promise<ToggleResult> {
  const session = await auth();
  if (!session?.user) return { error: "unauthenticated" };

  const userId = session.user.id;
  const existing = await prisma.wishlist.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    revalidatePath("/dashboard");
    return { saved: false };
  }

  await prisma.wishlist.create({ data: { userId, propertyId } });
  revalidatePath("/dashboard");
  return { saved: true };
}
