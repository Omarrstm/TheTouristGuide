"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";

export async function createItinerary(input: { name: string }) {
  const { userId } = await verifySession();
  const name = input.name.trim();
  if (name.length < 2) throw new Error("Enter a trip name.");

  const itinerary = await prisma.itinerary.create({ data: { name, userId } });

  revalidatePath("/trips");

  return { id: itinerary.id };
}

export async function renameItinerary(input: { itineraryId: string; name: string }) {
  const { userId } = await verifySession();

  const existing = await prisma.itinerary.findFirst({
    where: { id: input.itineraryId, userId },
  });
  if (!existing) throw new Error("Trip not found.");

  const name = input.name.trim();
  if (name.length < 2) throw new Error("Enter a trip name.");

  await prisma.itinerary.update({ where: { id: input.itineraryId }, data: { name } });

  revalidatePath("/trips");
  revalidatePath(`/trips/${input.itineraryId}`);
}

export async function deleteItinerary(itineraryId: string) {
  const { userId } = await verifySession();

  const existing = await prisma.itinerary.findFirst({ where: { id: itineraryId, userId } });
  if (!existing) throw new Error("Trip not found.");

  await prisma.itinerary.delete({ where: { id: itineraryId } });

  revalidatePath("/trips");
}

export async function setTripSharing(input: { itineraryId: string; isShared: boolean }) {
  const { userId } = await verifySession();

  const existing = await prisma.itinerary.findFirst({
    where: { id: input.itineraryId, userId },
  });
  if (!existing) throw new Error("Trip not found.");

  await prisma.itinerary.update({
    where: { id: input.itineraryId },
    data: { isShared: input.isShared },
  });

  revalidatePath(`/trips/${input.itineraryId}`);
}

export async function regenerateShareLink(itineraryId: string): Promise<{ shareToken: string }> {
  const { userId } = await verifySession();

  const existing = await prisma.itinerary.findFirst({
    where: { id: itineraryId, userId },
  });
  if (!existing) throw new Error("Trip not found.");

  const shareToken = randomBytes(16).toString("hex");
  await prisma.itinerary.update({ where: { id: itineraryId }, data: { shareToken } });

  revalidatePath(`/trips/${itineraryId}`);
  return { shareToken };
}

export async function addPlaceToItinerary(input: { itineraryId: string; placeId: string }) {
  const { userId } = await verifySession();

  const itinerary = await prisma.itinerary.findFirst({
    where: { id: input.itineraryId, userId },
    select: { id: true },
  });
  if (!itinerary) throw new Error("Trip not found.");

  await prisma.itineraryPlace.upsert({
    where: {
      itineraryId_placeId: { itineraryId: input.itineraryId, placeId: input.placeId },
    },
    create: { itineraryId: input.itineraryId, placeId: input.placeId },
    update: {},
  });

  revalidatePath("/trips");
  revalidatePath(`/trips/${input.itineraryId}`);
}

export async function removePlaceFromItinerary(input: { itineraryId: string; placeId: string }) {
  const { userId } = await verifySession();

  const itinerary = await prisma.itinerary.findFirst({
    where: { id: input.itineraryId, userId },
    select: { id: true },
  });
  if (!itinerary) throw new Error("Trip not found.");

  await prisma.itineraryPlace.deleteMany({
    where: { itineraryId: input.itineraryId, placeId: input.placeId },
  });

  revalidatePath("/trips");
  revalidatePath(`/trips/${input.itineraryId}`);
}
