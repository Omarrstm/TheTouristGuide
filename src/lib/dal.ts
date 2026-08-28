import "server-only";
import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSessionCookie } from "@/lib/session";

const userSelect = {
  id: true,
  email: true,
  name: true,
  homeCountry: true,
  isAdmin: true,
} as const;

export const verifySession = cache(async () => {
  const payload = await getSessionCookie();
  if (!payload?.sessionId) redirect("/login");

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId as string },
  });

  if (!session || session.expiresAt < new Date()) redirect("/login");

  return { userId: session.userId };
});

export const getUser = cache(async () => {
  const { userId } = await verifySession();
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: userSelect,
  });
});

export const getOptionalUser = cache(async () => {
  const payload = await getSessionCookie();
  if (!payload?.sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId as string },
  });
  if (!session || session.expiresAt < new Date()) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: userSelect,
  });
});

export const getAdmin = cache(async () => {
  const user = await getUser();
  if (!user.isAdmin) notFound();
  return user;
});
