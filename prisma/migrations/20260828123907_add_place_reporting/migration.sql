-- AlterEnum
ALTER TYPE "ReportTargetType" ADD VALUE 'PLACE';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reportedPlaceId" TEXT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedPlaceId_fkey" FOREIGN KEY ("reportedPlaceId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
