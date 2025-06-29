/*
  Warnings:

  - You are about to drop the column `broker` on the `PortfolioHolding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PortfolioHolding" DROP COLUMN "broker",
ADD COLUMN     "platform" TEXT;
