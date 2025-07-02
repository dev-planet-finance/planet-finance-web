import { Request, Response } from 'express';
import { PrismaClient, DebtType, CompoundingFrequency } from '@prisma/client';

const prisma = new PrismaClient();

// --- CREATE DEBT ENTRY ---
export const createDebt = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const {
      name,
      debtType,
      originalAmount,
      startDate,
      interestRate,
      compounding,
      termMonths,
      notes,
    } = req.body;
    console.log('📦 Incoming request body:', req.body);

    if (!userId || !name || !debtType || !originalAmount || !startDate || !interestRate || !termMonths) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newDebt = await prisma.debt.create({
      data: {
        userId,
        name,
        type: debtType as DebtType,
        originalAmount,
        startDate: new Date(startDate),
        interestRate,
        compounding: compounding as CompoundingFrequency,
        termMonths,
        notes,
      },
    });

    res.status(201).json(newDebt);
  } catch (error) {
    console.error('❌ Error creating debt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// --- GET DEBTS BY USER ---
export const getDebtsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      res.status(400).json({ error: 'Missing authenticated user ID' });
      return;
    }

    const debts = await prisma.debt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(debts);
  } catch (error) {
    console.error('❌ Error fetching debts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
