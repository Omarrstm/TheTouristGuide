import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OWNER_EMAIL, PLACES } from "../../../../../prisma/placesData";

export async function POST(request: Request) {
  const secret = process.env.SEED_SECRET;
  if (!secret || request.headers.get("x-seed-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owner = await prisma.user.findUnique({ where: { email: OWNER_EMAIL } });
  if (!owner) {
    return NextResponse.json(
      { error: `Owner account ${OWNER_EMAIL} not found in this database.` },
      { status: 400 }
    );
  }

  let created = 0;
  let skipped = 0;
  let photosBackfilled = 0;
  const warnings: string[] = [];

  for (const p of PLACES) {
    const country = await prisma.country.findUnique({ where: { name: p.country } });
    if (!country) {
      warnings.push(`Skipping "${p.name}" -- country "${p.country}" not found.`);
      continue;
    }

    const existing = await prisma.place.findFirst({
      where: { name: p.name, countryId: country.id },
      include: { _count: { select: { photos: true } } },
    });

    if (existing) {
      if (existing._count.photos === 0) {
        await prisma.placePhoto.create({
          data: { url: p.photoUrl, placeId: existing.id, uploadedByUserId: owner.id },
        });
        photosBackfilled++;
      } else {
        skipped++;
      }
      continue;
    }

    await prisma.place.create({
      data: {
        name: p.name,
        city: p.city,
        description: p.description,
        isHiddenGem: false,
        countryId: country.id,
        createdByUserId: owner.id,
        latitude: p.latitude,
        longitude: p.longitude,
        photos: {
          create: [{ url: p.photoUrl, uploadedByUserId: owner.id }],
        },
      },
    });
    created++;
  }

  return NextResponse.json({ created, skipped, photosBackfilled, warnings });
}
