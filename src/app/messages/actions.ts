"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { notifyUser } from "@/lib/notifications";

async function requireParticipant(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation || (conversation.travelerId !== userId && conversation.guideId !== userId)) {
    throw new Error("Conversation not found.");
  }
  return conversation;
}

export async function startConversation(input: { guideUserId: string; body: string }) {
  const trimmed = input.body.trim();
  if (!trimmed) throw new Error("Message can't be empty.");
  if (trimmed.length > 2000) throw new Error("Message is too long.");

  const { userId } = await verifySession();
  if (input.guideUserId === userId) throw new Error("You can't message yourself.");

  const guideProfile = await prisma.guideProfile.findUnique({
    where: { userId: input.guideUserId },
  });
  if (!guideProfile) throw new Error("This guide isn't available.");

  const conversation = await prisma.conversation.upsert({
    where: { travelerId_guideId: { travelerId: userId, guideId: input.guideUserId } },
    update: {},
    create: { travelerId: userId, guideId: input.guideUserId },
  });

  await prisma.message.create({
    data: { conversationId: conversation.id, senderId: userId, body: trimmed },
  });

  await notifyUser({
    userId: input.guideUserId,
    type: "NEW_MESSAGE",
    title: "New message",
    body: trimmed.slice(0, 140),
    href: `/messages/${conversation.id}`,
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversation.id}`);

  return { conversationId: conversation.id };
}

export async function sendMessage(conversationId: string, body: string) {
  const trimmed = body.trim();
  if (!trimmed) throw new Error("Message can't be empty.");
  if (trimmed.length > 2000) throw new Error("Message is too long.");

  const { userId } = await verifySession();
  const conversation = await requireParticipant(conversationId, userId);

  await prisma.message.create({
    data: { conversationId, senderId: userId, body: trimmed },
  });

  const recipientId =
    conversation.travelerId === userId ? conversation.guideId : conversation.travelerId;
  await notifyUser({
    userId: recipientId,
    type: "NEW_MESSAGE",
    title: "New message",
    body: trimmed.slice(0, 140),
    href: `/messages/${conversationId}`,
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
}

export async function markThreadRead(conversationId: string) {
  const { userId } = await verifySession();
  await requireParticipant(conversationId, userId);

  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });
}
