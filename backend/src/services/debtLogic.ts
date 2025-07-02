// backend/src/services/debtLogic.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Retrieves all debts with their transactions and variable rates.
 * This is used for summaries and future calculations.
 */
export async function getDebtsWithSummary(userId: string) {
  const debts = await prisma.debt.findMany({
    where: { userId },
    include: {
      transactions: true,
      variableRates: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // 🔧 Future: process these debts for frontend summaries
  return debts;
}

/**
 * ⏳ Placeholder for amortization logic
 * Will return an amortization schedule array based on inputs
 */
export function calculateAmortizationSchedule() {
  // ⏳ Future: implement logic to compute amortization table
}
