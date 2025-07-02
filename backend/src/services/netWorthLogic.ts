import { PrismaClient, InvestmentType } from '@prisma/client';

const prisma = new PrismaClient();

export async function calculateNetWorth(userId: string, date: Date): Promise<number> {
  // Get total portfolio value (non-cash assets)
  const portfolio = await prisma.portfolioHolding.findMany({
    where: {
      userId,
      isActive: true,
      investmentType: {
        not: InvestmentType.Cash,
      },
    },
    select: {
      quantity: true,
      currentPrice: true,
    },
  });

  const portfolioValue = portfolio.reduce((sum, asset) => {
    const price = parseFloat(asset.currentPrice?.toString() || '0');
    const qty = parseFloat(asset.quantity.toString());
    return sum + price * qty;
  }, 0);

  // Get total cash balance
  const cashHoldings = await prisma.portfolioHolding.findMany({
    where: {
      userId,
      isActive: true,
      investmentType: InvestmentType.Cash,
    },
    select: {
      quantity: true,
    },
  });

  const cashValue = cashHoldings.reduce((sum, c) => sum + parseFloat(c.quantity.toString()), 0);

  // Get total outstanding debt
  const debts = await prisma.debt.findMany({
    where: { userId },
    include: {
      transactions: true,
    },
  });

  const totalDebt = debts.reduce((sum, debt) => {
    const principalPaid = debt.transactions.reduce((acc, t) => acc + parseFloat(t.principal?.toString() || '0'), 0);
    const remaining = parseFloat(debt.originalAmount.toString()) - principalPaid;
    return sum + Math.max(remaining, 0);
  }, 0);

  // Net Worth = Portfolio + Cash - Debt
  return Number((portfolioValue + cashValue - totalDebt).toFixed(2));
}
