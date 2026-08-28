import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const STATEMENTS = [
  `ALTER TYPE "NotificationType" ADD VALUE 'NEW_GUIDE_RATING'`,
  `CREATE TABLE "GuideRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "raterId" TEXT NOT NULL,
    "guideUserId" TEXT NOT NULL,

    CONSTRAINT "GuideRating_pkey" PRIMARY KEY ("id")
)`,
  `CREATE UNIQUE INDEX "GuideRating_guideUserId_raterId_key" ON "GuideRating"("guideUserId", "raterId")`,
  `ALTER TABLE "GuideRating" ADD CONSTRAINT "GuideRating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  `ALTER TABLE "GuideRating" ADD CONSTRAINT "GuideRating_guideUserId_fkey" FOREIGN KEY ("guideUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
];

export async function POST(request: Request) {
  const secret = process.env.MIGRATION_SECRET;
  if (!secret || request.headers.get("x-migration-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ran: string[] = [];
  for (const statement of STATEMENTS) {
    await prisma.$executeRawUnsafe(statement);
    ran.push(statement.split("\n")[0].slice(0, 60));
  }

  return NextResponse.json({ ran });
}
