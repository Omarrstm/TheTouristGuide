import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const STATEMENTS = [
  `CREATE TYPE "ReportTargetType" AS ENUM ('REVIEW', 'USER')`,
  `CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RESOLVED', 'DISMISSED')`,
  `ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suspendedAt" TIMESTAMP(3)`,
  `CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporterId" TEXT NOT NULL,
    "reviewId" TEXT,
    "reportedUserId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
)`,
  `ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  `ALTER TABLE "Report" ADD CONSTRAINT "Report_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  `ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  `UPDATE "User" SET "isAdmin" = true WHERE email = 'lljoddehll@gmail.com'`,
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
