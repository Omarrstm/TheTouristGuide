"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function reportReview(input: { reviewId: string; reason: string }) {
  const { userId } = await verifySession();
  const reason = input.reason.trim();
  if (reason.length < 3) throw new Error("Tell us a bit more about why you're reporting this.");

  await prisma.report.create({
    data: {
      targetType: "REVIEW",
      reviewId: input.reviewId,
      reason,
      reporterId: userId,
    },
  });
}

export async function reportPlace(input: { placeId: string; reason: string }) {
  const { userId } = await verifySession();
  const reason = input.reason.trim();
  if (reason.length < 3) throw new Error("Tell us a bit more about why you're reporting this.");

  await prisma.report.create({
    data: {
      targetType: "PLACE",
      reportedPlaceId: input.placeId,
      reason,
      reporterId: userId,
    },
  });
}

export async function reportUser(input: { userId: string; reason: string }) {
  const { userId } = await verifySession();
  if (input.userId === userId) throw new Error("You can't report yourself.");

  const reason = input.reason.trim();
  if (reason.length < 3) throw new Error("Tell us a bit more about why you're reporting this.");

  await prisma.report.create({
    data: {
      targetType: "USER",
      reportedUserId: input.userId,
      reason,
      reporterId: userId,
    },
  });
}
