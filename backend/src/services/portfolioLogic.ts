import { PrismaClient, InvestmentType} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

/**
 * Handles a 'Buy' transaction:
 * - Updates or creates a holding
 * - Recalculates average cost basis
 */
export async function handleBuyTransaction(transaction: {
  userId: string;
  symbol: string;
  quantity: number;
  pricePerUnit: number;
  fiatFee?: number;
  platform?: string;
}) {
  const {
    userId,
    symbol,
    quantity,
    pricePerUnit,
    fiatFee = 0,
    platform,
  } = transaction;

  const existingHolding = await prisma.portfolioHolding.findFirst({
    where: {
      userId,
      symbol,
      platform,
    },
  });

  const totalCost = new Decimal(quantity).times(pricePerUnit).plus(fiatFee);

  if (!existingHolding) {
    return await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol,
        investmentType: InvestmentType.Stock,
        quantity: new Decimal(quantity),
        averageCost: new Decimal(pricePerUnit),
        platform,
      },
    });
  } else {
    const existingTotalCost = new Decimal(existingHolding.quantity).times(existingHolding.averageCost);
    const newTotalQuantity = new Decimal(existingHolding.quantity).plus(quantity);
    const newAverageCost = existingTotalCost.plus(totalCost).dividedBy(newTotalQuantity);

    return await prisma.portfolioHolding.update({
      where: { id: existingHolding.id },
      data: {
        quantity: newTotalQuantity,
        averageCost: newAverageCost,
      },
    });
  }
}

/**
 * Handles a 'Sell' transaction:
 * - Decreases quantity
 * - Keeps average cost unchanged (AVG method)
 * - Removes holding if quantity becomes zero
 */
export async function handleSellTransaction(transaction: {
  userId: string;
  symbol: string;
  quantity: number;
  platform?: string;
}) {
  const { userId, symbol, quantity, platform } = transaction;

  const existingHolding = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol, platform },
  });

  if (!existingHolding) {
    throw new Error('Holding not found for Sell transaction.');
  }

  const currentQty = new Decimal(existingHolding.quantity);
  const sellQty = new Decimal(quantity);

  if (sellQty.gt(currentQty)) {
    throw new Error('Sell quantity exceeds current holding quantity.');
  }

  const newQty = currentQty.minus(sellQty);

  if (newQty.equals(0)) {
    // If all sold, delete holding
    await prisma.portfolioHolding.delete({
      where: { id: existingHolding.id },
    });
  } else {
    // Otherwise, update holding quantity
    await prisma.portfolioHolding.update({
      where: { id: existingHolding.id },
      data: {
        quantity: newQty,
        // averageCost remains the same in AVG method
      },
    });
  }
}

export async function getHoldingsWithSummary(userId: string) {
  const holdings = await prisma.portfolioHolding.findMany({
    where: { userId },
  });

  // TEMP: Use fake current prices (real API comes later)
  const fakePrices: Record<string, number> = {
    AAPL: 180,
    TSLA: 250,
    BTC: 65000,
    ETH: 3500,
  };

  return holdings.map(h => {
    const currentPrice = fakePrices[h.symbol] ?? 0;
    const marketValue = new Decimal(h.quantity).times(currentPrice);
    const costBasis = new Decimal(h.quantity).times(h.averageCost);
    const gain = marketValue.minus(costBasis);
    const gainPercent = costBasis.equals(0) ? null : gain.dividedBy(costBasis).times(100);

    return {
      symbol: h.symbol,
      quantity: h.quantity,
      averageCost: h.averageCost,
      currentPrice,
      marketValue: marketValue.toFixed(2),
      gain: gain.toFixed(2),
      gainPercent: gainPercent?.toFixed(2) ?? null,
      assetClass: h.assetClass,
      platform: h.platform,
      strategy: h.strategy,
      region: h.region,
    };
  });
}

/**
 * Handles a 'DRIP' transaction:
 * - Acts like a 'Buy' but from dividends
 * - Recalculates average cost
 */
export async function handleDripTransaction(transaction: {
  userId: string;
  symbol: string;
  quantity: number;
  pricePerUnit: number;
  platform?: string;
}) {

  console.log('🟡 Running DRIP logic:', transaction); // <== Add this


  const {
    userId,
    symbol,
    quantity,
    pricePerUnit,
    platform,
  } = transaction;

  const existingHolding = await prisma.portfolioHolding.findFirst({
    where: {
      userId,
      symbol,
      platform,
    },
  });

  const dripCost = new Decimal(quantity).times(pricePerUnit);

  if (!existingHolding) {
    // If no holding exists, create one
    return await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol,
        investmentType: 'Stock', // TEMP — enum required
        quantity: new Decimal(quantity),
        averageCost: new Decimal(pricePerUnit),
        platform,
      },
    });
  } else {
    const existingTotalCost = new Decimal(existingHolding.quantity).times(existingHolding.averageCost);
    const newTotalQuantity = new Decimal(existingHolding.quantity).plus(quantity);
    const newAverageCost = existingTotalCost.plus(dripCost).dividedBy(newTotalQuantity);

    return await prisma.portfolioHolding.update({
      where: { id: existingHolding.id },
      data: {
        quantity: newTotalQuantity,
        averageCost: newAverageCost,
      },
    });
  }
}

/**
 * Handles a 'CashDividend' transaction:
 * - Does not update holding
 * - Only stores transaction for income tracking
 */
export async function handleCashDividendTransaction(transaction: {
  userId: string;
  symbol: string;
  amount: number;
  platform?: string;
}) {
  const { userId, symbol, amount, platform } = transaction;

  if (!amount || amount <= 0) {
    throw new Error('Invalid dividend amount.');
  }

  // Log only – doesn't update holdings
  console.log(`💸 Cash dividend received for ${symbol}: $${amount} on platform ${platform}`);
}

/**
 * Handles a 'CashFee' transaction:
 * - For now, just validates and logs the transaction
 * - In future: will deduct from cash balance in linked account
 */
export async function handleCashFeeTransaction(transaction: {
  userId: string;
  totalCost: number;
  currency: string;
  date: Date;
}) {
  const { userId, totalCost, currency, date } = transaction;

  if (!totalCost || totalCost <= 0) {
    throw new Error('Invalid CashFee amount.');
  }

  // Placeholder for future cash account logic
  console.log(`💸 CashFee recorded for user ${userId}: -${totalCost} ${currency} on ${date.toISOString()}`);
}

export async function handleCashDepositTransaction(transaction: {
  userId: string;
  amount: number;
  platform?: string;
}) {
  const { userId, amount, platform } = transaction;

  if (!amount || amount <= 0) {
    throw new Error('Invalid deposit amount.');
  }

  const existingHolding = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol: 'CASH', platform },
  });

  if (!existingHolding) {
    return await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol: 'CASH',
        investmentType: InvestmentType.Cash,
        quantity: new Decimal(amount),
        averageCost: new Decimal(1),
        platform,
      },
    });
  } else {
    const updatedQuantity = new Decimal(existingHolding.quantity).plus(amount);

    return await prisma.portfolioHolding.update({
      where: { id: existingHolding.id },
      data: {
        quantity: updatedQuantity,
      },
    });
  }
}

/**
 * Handles a 'CashWithdrawal' transaction:
 * - Decreases the user's CASH holding
 */
export async function handleCashWithdrawalTransaction(transaction: {
  userId: string;
  amount: number;
  platform?: string;
}) {
  const { userId, amount, platform } = transaction;

  if (!amount || amount <= 0) {
    throw new Error('Invalid withdrawal amount.');
  }

  const existingHolding = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol: 'CASH', platform },
  });

  if (!existingHolding) {
    throw new Error('No CASH holding found for this user/platform.');
  }

  const currentBalance = new Decimal(existingHolding.quantity);
  const newBalance = currentBalance.minus(amount);

  if (newBalance.lt(0)) {
    throw new Error('Withdrawal exceeds available cash balance.');
  }

  await prisma.portfolioHolding.update({
    where: { id: existingHolding.id },
    data: {
      quantity: newBalance,
    },
  });

  console.log(`💸 CashWithdrawal: -${amount} by ${userId} on ${platform}`);
}

/**
 * Handles a 'TransferOut' transaction:
 * - Subtracts quantity from the holding
 * - No gain/loss is realized
 */
export async function handleTransferOutTransaction(transaction: {
  userId: string;
  symbol: string;
  quantity: number;
  platform?: string;
}) {
  const { userId, symbol, quantity, platform } = transaction;

  const holding = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol, platform },
  });

  if (!holding) {
    throw new Error('Holding not found for TransferOut');
  }

  const currentQty = new Decimal(holding.quantity);
  const transferQty = new Decimal(quantity);

  if (transferQty.gt(currentQty)) {
    throw new Error('Transfer quantity exceeds current holding quantity');
  }

  const newQty = currentQty.minus(transferQty);

  if (newQty.equals(0)) {
    await prisma.portfolioHolding.delete({ where: { id: holding.id } });
  } else {
    await prisma.portfolioHolding.update({
      where: { id: holding.id },
      data: { quantity: newQty },
    });
  }

  console.log(`📤 Transferred OUT ${quantity} of ${symbol} from ${platform}`);
}


/**
 * Handles a 'TransferIn' transaction:
 * - Adds quantity with a given price (like DRIP)
 * - Recalculates average cost
 */
export async function handleTransferInTransaction(transaction: {
  userId: string;
  symbol: string;
  quantity: number;
  pricePerUnit: number;
  platform?: string;
}) {
  const { userId, symbol, quantity, pricePerUnit, platform } = transaction;

  const existingHolding = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol, platform },
  });

  const incomingCost = new Decimal(quantity).times(pricePerUnit);

  if (!existingHolding) {
    return await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol,
        investmentType: 'Stock', // TEMP default
        quantity: new Decimal(quantity),
        averageCost: new Decimal(pricePerUnit),
        platform,
      },
    });
  } else {
    const existingCost = new Decimal(existingHolding.quantity).times(existingHolding.averageCost);
    const totalQty = new Decimal(existingHolding.quantity).plus(quantity);
    const newAvg = existingCost.plus(incomingCost).dividedBy(totalQty);

    return await prisma.portfolioHolding.update({
      where: { id: existingHolding.id },
      data: {
        quantity: totalQty,
        averageCost: newAvg,
      },
    });
  }

  console.log(`📥 Transferred IN ${quantity} of ${symbol} to ${platform} at $${pricePerUnit}`);
}