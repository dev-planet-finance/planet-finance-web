-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('Stock', 'ETF', 'Crypto', 'Option', 'Forex');

-- CreateEnum
CREATE TYPE "TransactionAction" AS ENUM ('Buy', 'Sell', 'DRIP', 'CashDividend', 'CashDeposit', 'CashWithdrawal', 'CashInterest', 'CryptoInterest', 'TransferSend', 'TransferReceive', 'Fee', 'FreeAsset', 'Split');

-- CreateEnum
CREATE TYPE "CostBasisMethod" AS ENUM ('FIFO', 'LIFO', 'AVG');

-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "cryptoName" TEXT,
    "investmentType" "InvestmentType" NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "averageCost" DECIMAL(65,30) NOT NULL,
    "currentPrice" DECIMAL(65,30),
    "totalDividends" DECIMAL(65,30),
    "dividendReinvestEnabled" BOOLEAN NOT NULL DEFAULT false,
    "splitAdjustments" JSONB,
    "broker" TEXT,
    "brokerAccountId" TEXT,
    "region" TEXT,
    "industry" TEXT,
    "assetClass" TEXT,
    "strategy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "holdingId" TEXT,
    "action" "TransactionAction" NOT NULL,
    "symbol" TEXT NOT NULL,
    "cryptoName" TEXT,
    "quantity" DECIMAL(65,30),
    "pricePerUnit" DECIMAL(65,30),
    "fiatFee" DECIMAL(65,30),
    "cryptoFee" DECIMAL(65,30),
    "currency" TEXT NOT NULL,
    "fxRate" DECIMAL(65,30),
    "platform" TEXT,
    "assetClass" TEXT,
    "sector" TEXT,
    "country" TEXT,
    "strategy" TEXT,
    "accountHolder" TEXT,
    "totalCost" DECIMAL(65,30),
    "costBasisMethod" "CostBasisMethod",
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioTransaction" ADD CONSTRAINT "PortfolioTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioTransaction" ADD CONSTRAINT "PortfolioTransaction_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "PortfolioHolding"("id") ON DELETE SET NULL ON UPDATE CASCADE;
