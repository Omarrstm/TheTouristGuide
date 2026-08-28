"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function toggleFavorite(placeId: string): Promise<{ favorited: boolean }> {
  const { userId } = await verifySession();

  const existing = await prisma.favorite.findUnique({
    where: { userId_placeId: { userId, placeId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath(`/places/${placeId}`);
    revalidatePath("/favorites");
    return { favorited: false };
  }

  await prisma.favorite.create({ data: { userId, placeId } });
  revalidatePath(`/places/${placeId}`);
  revalidatePath("/favorites");
  return { favorited: true };
}
