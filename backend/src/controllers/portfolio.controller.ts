import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- CREATE TRANSACTION ---
export const createTransaction = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;
    const {
      holdingId,
      action,
      symbol,
      cryptoName,
      quantity,
      pricePerUnit,
      fiatFee,
      cryptoFee,
      currency,
      fxRate,
      platform,
      assetClass,
      sector,
      country,
      strategy,
      accountHolder,
      totalCost,
      costBasisMethod,
      notes,
      date
    } = req.body;

    if (!userId || !action || !symbol || !currency || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await prisma.portfolioTransaction.create({
      data: {
        userId,
        holdingId,
        action,
        symbol,
        cryptoName,
        quantity,
        pricePerUnit,
        fiatFee,
        cryptoFee,
        currency,
        fxRate,
        platform,
        assetClass,
        sector,
        country,
        strategy,
        accountHolder,
        totalCost,
        costBasisMethod,
        notes,
        date: new Date(date),
      }
    });

    return res.status(201).json(transaction);
  } catch (error: any) {
    console.error('❌ Error creating transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// --- GET TRANSACTIONS BY AUTHENTICATED USER ---
export const getTransactionsByUserId = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(400).json({ error: 'Missing authenticated user ID' });
    }

    const transactions = await prisma.portfolioTransaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return res.status(200).json(transactions);
  } catch (error: any) {
    console.error('❌ Error fetching transactions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// --- CREATE HOLDING ---
export const createHolding = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;
    const {
      symbol,
      cryptoName,
      investmentType,
      quantity,
      averageCost,
      currentPrice,
      broker,
      brokerAccountId,
      region,
      industry,
      assetClass,
      strategy,
      notes,
      splitAdjustments,
      isActive
    } = req.body;

    if (!userId || !symbol || !investmentType || quantity == null || averageCost == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const holding = await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol,
        cryptoName,
        investmentType,
        quantity,
        averageCost,
        currentPrice,
        broker,
        brokerAccountId,
        region,
        industry,
        assetClass,
        strategy,
        notes,
        splitAdjustments,
        isActive,
      }
    });

    return res.status(201).json(holding);
  } catch (error: any) {
    console.error('❌ Error creating holding:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
