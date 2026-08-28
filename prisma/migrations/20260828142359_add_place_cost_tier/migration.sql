-- CreateEnum
CREATE TYPE "CostTier" AS ENUM ('BUDGET', 'MODERATE', 'EXPENSIVE');

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "costTier" "CostTier";
