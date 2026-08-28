import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const secret = process.env.MIGRATION_SECRET;
  if (!secret || request.headers.get("x-migration-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await prisma.$executeRawUnsafe(
    `UPDATE "User" SET "isAdmin" = true WHERE email = 'omarrestom11@gmail.com'`
  );

  return NextResponse.json({ updated: count });
}
