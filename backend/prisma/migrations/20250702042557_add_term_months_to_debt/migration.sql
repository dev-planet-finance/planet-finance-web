/*
  Warnings:

  - Added the required column `termMonths` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "termMonths" INTEGER NOT NULL;
