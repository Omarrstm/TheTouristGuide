"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function upsertGuideProfile(input: {
  bio: string;
  languages: string;
  city: string;
  countryId: string;
  isPublic: boolean;
}) {
  const { userId } = await verifySession();

  const city = input.city.trim();
  const bio = input.bio.trim();
  const languages = input.languages
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  if (city.length < 2) throw new Error("Enter the city you guide in.");
  if (!input.countryId) throw new Error("Pick a country.");

  const country = await prisma.country.findUnique({ where: { id: input.countryId } });
  if (!country) throw new Error("Pick a valid country.");

  await prisma.guideProfile.upsert({
    where: { userId },
    update: { bio: bio || null, languages, city, countryId: country.id, isPublic: input.isPublic },
    create: {
      userId,
      bio: bio || null,
      languages,
      city,
      countryId: country.id,
      isPublic: input.isPublic,
    },
  });

  revalidatePath("/guides");
  revalidatePath(`/guides/${userId}`);
  revalidatePath(`/countries/${country.slug}`);
}
