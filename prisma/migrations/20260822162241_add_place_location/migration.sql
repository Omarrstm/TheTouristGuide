-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "formattedAddress" TEXT,
ADD COLUMN     "googlePlaceId" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
