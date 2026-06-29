"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { inquirySchema, type InquiryInput } from "@/lib/validators/inquiry";

export type InquiryResult = { ok: true } | { error: string };

export async function createInquiry(input: InquiryInput): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const session = await auth();
  const { propertyId, name, email, phone, message, visitDate } = parsed.data;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true },
  });
  if (!property) return { error: "That property no longer exists." };

  await prisma.inquiry.create({
    data: {
      propertyId,
      name,
      email,
      phone: phone || null,
      message,
      visitDate: visitDate ? new Date(visitDate) : null,
      status: visitDate ? "SCHEDULED" : "NEW",
      userId: session?.user?.id ?? null,
    },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
