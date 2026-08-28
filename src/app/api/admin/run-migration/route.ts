import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const STATEMENTS = [
  `ALTER TABLE "Itinerary" ADD COLUMN "isShared" BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE "Itinerary" ADD COLUMN "shareToken" TEXT`,
  `UPDATE "Itinerary" SET "shareToken" = md5(random()::text || id) WHERE "shareToken" IS NULL`,
  `ALTER TABLE "Itinerary" ALTER COLUMN "shareToken" SET NOT NULL`,
  `CREATE UNIQUE INDEX "Itinerary_shareToken_key" ON "Itinerary"("shareToken")`,
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
