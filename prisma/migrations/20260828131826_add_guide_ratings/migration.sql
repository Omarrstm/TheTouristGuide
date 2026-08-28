-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'NEW_GUIDE_RATING';

-- CreateTable
CREATE TABLE "GuideRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "raterId" TEXT NOT NULL,
    "guideUserId" TEXT NOT NULL,

    CONSTRAINT "GuideRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuideRating_guideUserId_raterId_key" ON "GuideRating"("guideUserId", "raterId");

-- AddForeignKey
ALTER TABLE "GuideRating" ADD CONSTRAINT "GuideRating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideRating" ADD CONSTRAINT "GuideRating_guideUserId_fkey" FOREIGN KEY ("guideUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
