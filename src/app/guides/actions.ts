"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { notifyUser } from "@/lib/notifications";

export async function rateGuide(input: { guideUserId: string; rating: number; comment?: string | null }) {
  const { userId } = await verifySession();

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("Pick a rating from 1 to 5.");
  }
  if (input.guideUserId === userId) throw new Error("You can't rate yourself.");

  const guide = await prisma.guideProfile.findUnique({ where: { userId: input.guideUserId } });
  if (!guide) throw new Error("Guide not found.");

  const existing = await prisma.guideRating.findUnique({
    where: { guideUserId_raterId: { guideUserId: input.guideUserId, raterId: userId } },
  });
  if (existing) throw new Error("You've already rated this guide.");

  await prisma.guideRating.create({
    data: {
      guideUserId: input.guideUserId,
      raterId: userId,
      rating: input.rating,
      comment: input.comment?.trim() || null,
    },
  });

  await notifyUser({
    userId: input.guideUserId,
    type: "NEW_GUIDE_RATING",
    title: "You received a new rating",
    href: `/guides/${input.guideUserId}`,
  });

  revalidatePath(`/guides/${input.guideUserId}`);
}

export async function updateGuideRating(input: { ratingId: string; rating: number; comment?: string | null }) {
  const { userId } = await verifySession();

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("Pick a rating from 1 to 5.");
  }

  const rating = await prisma.guideRating.findFirst({
    where: { id: input.ratingId, raterId: userId },
  });
  if (!rating) throw new Error("Rating not found.");

  await prisma.guideRating.update({
    where: { id: input.ratingId },
    data: { rating: input.rating, comment: input.comment?.trim() || null },
  });

  revalidatePath(`/guides/${rating.guideUserId}`);
}

export async function deleteGuideRating(ratingId: string) {
  const { userId } = await verifySession();

  const rating = await prisma.guideRating.findFirst({
    where: { id: ratingId, raterId: userId },
  });
  if (!rating) throw new Error("Rating not found.");

  await prisma.guideRating.delete({ where: { id: ratingId } });

  revalidatePath(`/guides/${rating.guideUserId}`);
}
