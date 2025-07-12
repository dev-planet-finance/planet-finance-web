import { PrismaClient, InvestmentType} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

/**
 * Handles a 'Buy' transaction:
 * - Updates or creates a holding
 * - Recalculates average cost basis
 */
export async function handleBuyTransaction({
  userId,
  symbol,
  investmentType,
  quantity,
  pricePerUnit,
  fiatFee,
  platform,
  currency,
  fxRate,
}: {
  userId: string;
  symbol: string;
  investmentType?: InvestmentType;
  quantity: number;
  pricePerUnit: number;
  fiatFee?: number;
  platform?: string;
  currency: string;
  fxRate?: number;
}) {
  const qty = new Decimal(quantity);
  const price = new Decimal(pricePerUnit);
  const fee = fiatFee ? new Decimal(fiatFee) : new Decimal(0);

  const cost = qty.mul(price).add(fee);


  const existing = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol },
  });

  if (existing) {
    const newQty = existing.quantity.add(qty);
    const newTotalCost = existing.quantity.mul(existing.averagePrice ?? 0).add(cost);
    const newAvgPrice = newTotalCost.div(newQty);

    await prisma.portfolioHolding.update({
      where: { id: existing.id },
      data: {
        quantity: newQty,
        averagePrice: newAvgPrice,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol,
        investmentType: investmentType || InvestmentType.Stock,
        quantity: qty,
        averagePrice: price,
        platform,
        notes: '',
      },
    });
  }

  await prisma.portfolioTransaction.create({
    data: {
      userId,
      action: 'Buy',
      symbol,
      quantity: qty,
      pricePerUnit: price,
      fiatFee: fee,
      currency,
      fxRate: fxRate ? new Decimal(fxRate) : null,
      platform,
      date: new Date(),
    },
  });
}

/**
 * Handles a 'Sell' transaction:
 * - Decreases quantity
 * - Keeps average cost unchanged (AVG method)
 * - Removes holding if quantity becomes zero
 */
export async function handleSellTransaction({
  userId,
  symbol,
  quantity,
  pricePerUnit,
  fiatFee,
  currency,
  platform,
  fxRate,
}: {
  userId: string;
  symbol: string;
  quantity: Decimal;
  pricePerUnit: Decimal;
  fiatFee?: Decimal;
  currency: string;
  platform?: string;
  fxRate?: Decimal;
}) {
  const existing = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol, platform },
  });

  if (!existing || existing.quantity.lt(quantity)) {
    throw new Error('Not enough quantity to sell');
  }

  const newQty = existing.quantity.sub(quantity);
  const proceeds = quantity.mul(pricePerUnit).sub(fiatFee || 0);

  // Update or delete the holding
  if (newQty.equals(0)) {
    await prisma.portfolioHolding.delete({ where: { id: existing.id } });
  } else {
    await prisma.portfolioHolding.update({
      where: { id: existing.id },
      data: { quantity: newQty, updatedAt: new Date() },
    });
  }

  // Add proceeds to cash (e.g. USD)
  const cashSymbol = currency.toUpperCase(); // e.g. USD, AUD
  const cashHolding = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol: cashSymbol, investmentType: 'Cash', platform },
  });

  if (cashHolding) {
    await prisma.portfolioHolding.update({
      where: { id: cashHolding.id },
      data: {
        quantity: cashHolding.quantity.add(proceeds),
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol: cashSymbol,
        investmentType: InvestmentType.Cash,
        quantity: proceeds,
        averagePrice: undefined, // ⛔ no avg price for cash
        platform,
        notes: '',
      },
    });
  }

  // Log the transaction
  await prisma.portfolioTransaction.create({
    data: {
      userId,
      action: 'Sell',
      symbol,
      quantity,
      pricePerUnit,
      fiatFee,
      currency,
      fxRate: fxRate || null,
      platform,
      date: new Date(),
    },
  });

  console.log(`✅ Sold ${quantity} of ${symbol} @ $${pricePerUnit} → proceeds $${proceeds} → +${currency} cash`);
}

import { getLivePricesForHoldings } from '../services/priceFetcher';

export async function getHoldingsWithSummary(userId: string) {
  const holdings = await prisma.portfolioHolding.findMany({
    where: { userId },
  });

  if (holdings.length === 0) return [];

  const priceMap = await getLivePricesForHoldings(holdings);

  return holdings.map(h => {
    const latestPrice = priceMap[h.symbol] ?? 0;
    const marketValue = new Decimal(h.quantity).times(latestPrice);
    const costBasis = new Decimal(h.quantity).times(h.averagePrice ?? 0);
    const gain = marketValue.minus(costBasis);
    const gainPercent = costBasis.equals(0) ? null : gain.dividedBy(costBasis).times(100);

    return {
      symbol: h.symbol,
      investmentType: h.investmentType,
      quantity: h.quantity.toNumber(),
      averagePrice: h.averagePrice?.toNumber() ?? null,
      currentPrice: latestPrice,
      marketValue: marketValue.toFixed(2),
      gain: gain.toFixed(2),
      gainPercent: gainPercent?.toFixed(2) ?? null,
      platform: h.platform,
      strategy: h.strategy,
      region: h.region,
      assetClass: h.assetClass,
      updatedAt: h.updatedAt,
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
        averagePrice: new Decimal(pricePerUnit),
        platform,
      },
    });
  } else {
    const existingTotalCost = new Decimal(existingHolding.quantity).times(existingHolding.averagePrice ?? 0);
    const newTotalQuantity = new Decimal(existingHolding.quantity).plus(quantity);
    const newAverageCost = existingTotalCost.plus(dripCost).dividedBy(newTotalQuantity);

    return await prisma.portfolioHolding.update({
      where: { id: existingHolding.id },
      data: {
        quantity: newTotalQuantity,
        averagePrice: newAverageCost,
      },
    });
  }
}

/**
 * Handles a 'CashDividend' transaction:
 * - Does not update holding
 * - Only stores transaction for income tracking
 */
export async function handleCashDividendTransaction({
  userId,
  symbol,
  amount,
  currency,
  platform,
  fxRate,
}: {
  userId: string;
  symbol: string; // asset symbol that generated dividend
  amount: Decimal;
  currency: string;
  platform?: string;
  fxRate?: Decimal;
}) {
  const cashSymbol = currency.toUpperCase();

  const existing = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol: cashSymbol, investmentType: 'Cash', platform },
  });

  if (existing) {
    await prisma.portfolioHolding.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity.add(amount),
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol: cashSymbol,
        investmentType: InvestmentType.Cash,
        quantity: amount,
        averagePrice: undefined,
        platform,
      },
    });
  }

  await prisma.portfolioTransaction.create({
    data: {
      userId,
      action: 'CashDividend',
      symbol,
      quantity: amount,
      pricePerUnit: new Decimal(1),
      currency: cashSymbol,
      fxRate: fxRate || null,
      platform,
      date: new Date(),
    },
  });
}

/**
 * Handles a 'CashFee' transaction:
 * - For now, just validates and logs the transaction
 * - In future: will deduct from cash balance in linked account
 */
export async function handleCashFeeTransaction({
  userId,
  amount,
  currency,
  platform,
  fxRate,
}: {
  userId: string;
  amount: Decimal;
  currency: string;
  platform?: string;
  fxRate?: Decimal;
}) {
  const cashSymbol = currency.toUpperCase();

  const existing = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol: cashSymbol, investmentType: 'Cash', platform },
  });

  if (!existing || existing.quantity.lt(amount)) {
    throw new Error('Insufficient cash for fee deduction.');
  }

  await prisma.portfolioHolding.update({
    where: { id: existing.id },
    data: {
      quantity: existing.quantity.sub(amount),
      updatedAt: new Date(),
    },
  });

  await prisma.portfolioTransaction.create({
    data: {
      userId,
      action: 'CashFee',
      symbol: cashSymbol,
      quantity: amount,
      pricePerUnit: new Decimal(1),
      currency: cashSymbol,
      fxRate: fxRate || null,
      platform,
      date: new Date(),
    },
  });
}

export async function handleCashInterestTransaction({
  userId,
  amount,
  currency,
  platform,
  fxRate,
}: {
  userId: string;
  amount: Decimal;
  currency: string;
  platform?: string;
  fxRate?: Decimal;
}) {
  const cashSymbol = currency.toUpperCase();

  const existing = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol: cashSymbol, investmentType: 'Cash', platform },
  });

  if (existing) {
    await prisma.portfolioHolding.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity.add(amount),
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol: cashSymbol,
        investmentType: InvestmentType.Cash,
        quantity: amount,
        averagePrice: undefined,
        platform,
      },
    });
  }

  await prisma.portfolioTransaction.create({
    data: {
      userId,
      action: 'CashInterest',
      symbol: cashSymbol,
      quantity: amount,
      pricePerUnit: new Decimal(1),
      currency: cashSymbol,
      fxRate: fxRate || null,
      platform,
      date: new Date(),
    },
  });
}


export async function handleCashDepositTransaction({
  userId,
  amount,
  currency,
  platform,
  fxRate,
}: {
  userId: string;
  amount: Decimal;
  currency: string;
  platform?: string;
  fxRate?: Decimal;
}) {
  const symbol = currency.toUpperCase();

  const existing = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol, investmentType: 'Cash', platform },
  });

  if (existing) {
    await prisma.portfolioHolding.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity.add(amount),
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol,
        investmentType: InvestmentType.Cash,
        quantity: amount,
        averagePrice: undefined,
        platform,
        notes: '',
      },
    });
  }

  await prisma.portfolioTransaction.create({
    data: {
      userId,
      action: 'CashDeposit',
      symbol,
      quantity: amount,
      pricePerUnit: new Decimal(1),
      currency: symbol,
      fxRate: fxRate || null,
      platform,
      date: new Date(),
    },
  });
}


/**
 * Handles a 'CashWithdrawal' transaction:
 * - Decreases the user's CASH holding
 */
export async function handleCashWithdrawalTransaction({
  userId,
  amount,
  currency,
  platform,
  fxRate,
}: {
  userId: string;
  amount: Decimal;
  currency: string;
  platform?: string;
  fxRate?: Decimal;
}) {
  const symbol = currency.toUpperCase();

  const existing = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol, investmentType: 'Cash', platform },
  });

  if (!existing || existing.quantity.lt(amount)) {
    throw new Error('Not enough cash to withdraw');
  }

  await prisma.portfolioHolding.update({
    where: { id: existing.id },
    data: {
      quantity: existing.quantity.sub(amount),
      updatedAt: new Date(),
    },
  });

  await prisma.portfolioTransaction.create({
    data: {
      userId,
      action: 'CashWithdrawal',
      symbol,
      quantity: amount,
      pricePerUnit: new Decimal(1),
      currency: symbol,
      fxRate: fxRate || null,
      platform,
      date: new Date(),
    },
  });
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

  // 🔍 New log to debug matching issue
  console.log('🟡 TransferOut Debug');
  console.log('User:', userId);
  console.log('Symbol:', symbol);
  console.log('Platform:', platform);

  const holding = await prisma.portfolioHolding.findFirst({
    where: { userId, symbol, platform },
  });

  if (!holding) {
    console.log('❌ No holding found. Trying fallback query without platform...');
    const fallback = await prisma.portfolioHolding.findMany({
      where: { userId, symbol },
    });
    console.log('🔍 Fallback results:', fallback);

    throw new Error('Holding not found for TransferOut');
  }}



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
        averagePrice: new Decimal(pricePerUnit),
        platform,
      },
    });
  } else {
    const existingCost = new Decimal(existingHolding.quantity).times(existingHolding.averagePrice ?? 0);
    const totalQty = new Decimal(existingHolding.quantity).plus(quantity);
    const newAvg = existingCost.plus(incomingCost).dividedBy(totalQty);

    return await prisma.portfolioHolding.update({
      where: { id: existingHolding.id },
      data: {
        quantity: totalQty,
        averagePrice: newAvg,
      },
    });
  }

  console.log(`📥 Transferred IN ${quantity} of ${symbol} to ${platform} at $${pricePerUnit}`);
}