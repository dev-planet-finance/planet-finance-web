/*
  Warnings:

  - You are about to drop the column `averageCost` on the `PortfolioHolding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PortfolioHolding" DROP COLUMN "averageCost",
ADD COLUMN     "averagePrice" DECIMAL(65,30);
