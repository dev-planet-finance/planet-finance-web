/*
  Warnings:

  - Added the required column `type` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DebtType" AS ENUM ('Mortgage', 'StudentLoan', 'CreditCard', 'PersonalLoan', 'CarLoan', 'Other');

-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "type" "DebtType" NOT NULL;
