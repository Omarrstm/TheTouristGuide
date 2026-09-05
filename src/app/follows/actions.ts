"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function toggleFollow(userId: string): Promise<{ following: boolean }> {
  const { userId: followerId } = await verifySession();
  if (userId === followerId) throw new Error("You can't follow yourself.");

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: userId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    revalidatePath(`/guides/${userId}`);
    revalidatePath("/following");
    return { following: false };
  }

  await prisma.follow.create({ data: { followerId, followingId: userId } });
  revalidatePath(`/guides/${userId}`);
  revalidatePath("/following");
  return { following: true };
}
