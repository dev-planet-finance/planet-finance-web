import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- CREATE DEBT TRANSACTION ---
export const createDebtTransaction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { debtId, amount, interest, principal, notes, date } = req.body;

    if (!debtId || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await prisma.debtTransaction.create({
      data: {
        debtId,
        amount,
        interest,
        principal,
        notes,
        date: new Date(date),
      },
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error('❌ Error creating debt transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// --- GET DEBT TRANSACTIONS FOR A DEBT ---
export const getDebtTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { debtId } = req.params;

    if (!debtId) {
      return res.status(400).json({ error: 'Missing debt ID' });
    }

    const transactions = await prisma.debtTransaction.findMany({
      where: { debtId },
      orderBy: { date: 'asc' },
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('❌ Error fetching debt transactions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
