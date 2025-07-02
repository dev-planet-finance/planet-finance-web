import { PrismaClient, BudgetTransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export async function getFilteredBudgetTransactions({
  userId,
  startDate,
  endDate,
  transactionType,
  category,
  account,
  platform,
}: {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  transactionType?: string;
  category?: string;
  account?: string;
  platform?: string;
}) {
  return await prisma.budgetTransaction.findMany({
    where: {
      userId,
      ...(transactionType && {
          transactionType: transactionType as BudgetTransactionType}),
      ...(category && { category }),
      ...(account && { account }),
      ...(platform && { platform }),
      ...(startDate && endDate && {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }),
    },
    orderBy: {
      date: 'desc',
    },
  });
}
