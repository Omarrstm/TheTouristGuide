-- AlterTable
ALTER TABLE "GuideProfile" ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[];
