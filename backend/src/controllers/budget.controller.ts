import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getFilteredBudgetTransactions } from '../services/budgetLogic';

const prisma = new PrismaClient();

// --- CREATE BUDGET TRANSACTION ---
export const createBudgetTransaction = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;

    const {
      transactionType,
      category,
      amount,
      currency,
      fxRate,
      platform,
      accountHolder,
      notes,
      fromAccount,
      toAccount,
      date
    } = req.body;

    if (!userId || !transactionType || !amount || !currency || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await prisma.budgetTransaction.create({
      data: {
        userId,
        transactionType,
        category,
        amount,
        currency,
        fxRate,
        platform,
        accountHolder,
        notes,
        fromAccount,
        toAccount,
        date: new Date(date),
      }
    });

    return res.status(201).json(transaction);
  } catch (error: any) {
    console.error('❌ Error creating budget transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// --- GET BUDGET TRANSACTIONS BY USER ---
export const getBudgetTransactionsByUser = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(400).json({ error: 'Missing authenticated user ID' });
    }

    const transactions = await prisma.budgetTransaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return res.status(200).json(transactions);
  } catch (error: any) {
    console.error('❌ Error fetching budget transactions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFilteredBudget = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ error: 'Missing authenticated user ID' });

    const {
      startDate,
      endDate,
      transactionType,
      category,
      account,
      platform
    } = req.query;

    const filtered = await getFilteredBudgetTransactions({
      userId,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      transactionType: transactionType as string,
      category: category as string,
      account: account as string,
      platform: platform as string,
    });

    return res.status(200).json(filtered);
  } catch (error) {
    console.error('❌ Error filtering budget transactions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

