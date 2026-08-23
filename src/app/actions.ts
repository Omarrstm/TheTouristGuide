"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteSession } from "@/lib/session";
import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { uploadPhoto, uploadPhotos } from "@/lib/blob";

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function createPlace(input: {
  name: string;
  countryId: string;
  city: string;
  description: string;
  isHiddenGem: boolean;
  photos: File[];
  location?: {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    googlePlaceId: string;
  } | null;
}) {
  const { userId } = await verifySession();
  const name = input.name.trim();
  const city = input.city.trim();
  const description = input.description.trim();

  if (name.length < 2) throw new Error("Enter a place name.");
  if (city.length < 2) throw new Error("Enter a city.");
  if (description.length < 10) throw new Error("Description must be at least 10 characters.");
  if (!input.countryId) throw new Error("Pick a country.");

  const country = await prisma.country.findUnique({ where: { id: input.countryId } });
  if (!country) throw new Error("Pick a valid country.");

  const photoUrls = await uploadPhotos(input.photos.slice(0, 5), "places");

  const place = await prisma.place.create({
    data: {
      name,
      city,
      description,
      isHiddenGem: input.isHiddenGem,
      countryId: country.id,
      createdByUserId: userId,
      latitude: input.location?.latitude ?? null,
      longitude: input.location?.longitude ?? null,
      formattedAddress: input.location?.formattedAddress ?? null,
      googlePlaceId: input.location?.googlePlaceId ?? null,
      photos: { create: photoUrls.map((url) => ({ url, uploadedByUserId: userId })) },
    },
  });

  revalidatePath("/");
  revalidatePath(`/countries/${country.slug}`);

  return { id: place.id };
}

export async function updatePlace(input: {
  placeId: string;
  name: string;
  countryId: string;
  city: string;
  description: string;
  isHiddenGem: boolean;
  photos: File[];
  location?: {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    googlePlaceId: string;
  } | null;
}) {
  const { userId } = await verifySession();

  const existing = await prisma.place.findUnique({
    where: { id: input.placeId },
    include: { country: true },
  });
  if (!existing) throw new Error("Place not found.");
  if (existing.createdByUserId !== userId) {
    throw new Error("You can only edit places you created.");
  }

  const name = input.name.trim();
  const city = input.city.trim();
  const description = input.description.trim();

  if (name.length < 2) throw new Error("Enter a place name.");
  if (city.length < 2) throw new Error("Enter a city.");
  if (description.length < 10) throw new Error("Description must be at least 10 characters.");
  if (!input.countryId) throw new Error("Pick a country.");

  const country = await prisma.country.findUnique({ where: { id: input.countryId } });
  if (!country) throw new Error("Pick a valid country.");

  const photoUrls = await uploadPhotos(input.photos.slice(0, 5), "places");

  await prisma.place.update({
    where: { id: input.placeId },
    data: {
      name,
      city,
      description,
      isHiddenGem: input.isHiddenGem,
      countryId: country.id,
      latitude: input.location?.latitude ?? null,
      longitude: input.location?.longitude ?? null,
      formattedAddress: input.location?.formattedAddress ?? null,
      googlePlaceId: input.location?.googlePlaceId ?? null,
      photos: photoUrls.length
        ? { create: photoUrls.map((url) => ({ url, uploadedByUserId: userId })) }
        : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath(`/places/${input.placeId}`);
  revalidatePath(`/countries/${existing.country.slug}`);
  if (country.slug !== existing.country.slug) revalidatePath(`/countries/${country.slug}`);

  return { id: input.placeId };
}

export async function deletePlace(placeId: string) {
  const { userId } = await verifySession();

  const place = await prisma.place.findUnique({
    where: { id: placeId },
    include: { country: true },
  });
  if (!place) throw new Error("Place not found.");
  if (place.createdByUserId !== userId) {
    throw new Error("You can only delete places you created.");
  }

  await prisma.place.delete({ where: { id: placeId } });

  revalidatePath("/");
  revalidatePath(`/countries/${place.country.slug}`);

  return { countrySlug: place.country.slug };
}

export async function createReview(input: {
  placeId: string;
  rating: number;
  comment?: string | null;
  photo?: File | null;
}) {
  const { userId } = await verifySession();

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("Pick a rating from 1 to 5.");
  }

  const place = await prisma.place.findUnique({ where: { id: input.placeId } });
  if (!place) throw new Error("Place not found.");

  const existing = await prisma.review.findUnique({
    where: { placeId_userId: { placeId: input.placeId, userId } },
  });
  if (existing) throw new Error("You've already reviewed this place.");

  const photoUrl = input.photo ? await uploadPhoto(input.photo, "reviews") : null;

  await prisma.review.create({
    data: {
      placeId: input.placeId,
      userId,
      rating: input.rating,
      comment: input.comment?.trim() || null,
      photoUrl,
    },
  });

  revalidatePath(`/places/${input.placeId}`);
}

export async function updateReview(input: {
  reviewId: string;
  rating: number;
  comment?: string | null;
}) {
  const { userId } = await verifySession();

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("Pick a rating from 1 to 5.");
  }

  const review = await prisma.review.findFirst({ where: { id: input.reviewId, userId } });
  if (!review) throw new Error("Review not found.");

  await prisma.review.update({
    where: { id: input.reviewId },
    data: { rating: input.rating, comment: input.comment?.trim() || null },
  });

  revalidatePath(`/places/${review.placeId}`);
}

export async function deleteReview(reviewId: string) {
  const { userId } = await verifySession();

  const review = await prisma.review.findFirst({ where: { id: reviewId, userId } });
  if (!review) throw new Error("Review not found.");

  await prisma.review.delete({ where: { id: reviewId } });

  revalidatePath(`/places/${review.placeId}`);
}
