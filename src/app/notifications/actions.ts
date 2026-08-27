"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function markNotificationRead(id: string) {
  const { userId } = await verifySession();
  await prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  });
}

export async function markAllNotificationsRead() {
  const { userId } = await verifySession();
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
