import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const STATEMENTS = [
  `ALTER TYPE "ReportTargetType" ADD VALUE 'PLACE'`,
  `ALTER TABLE "Report" ADD COLUMN     "reportedPlaceId" TEXT`,
  `ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedPlaceId_fkey" FOREIGN KEY ("reportedPlaceId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
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
