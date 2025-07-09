import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { cryptoMap, mapToEodFormat } from '../services/priceFetcher';
import {
  handleBuyTransaction,
  handleSellTransaction,
  handleDripTransaction,
  handleCashDividendTransaction,
  handleCashFeeTransaction,
  handleCashDepositTransaction,
  handleCashWithdrawalTransaction,
  getHoldingsWithSummary,
  handleTransferOutTransaction,
  handleTransferInTransaction
} from '../services/portfolioLogic';

const prisma = new PrismaClient();

// --- CREATE TRANSACTION ---
export const createTransaction = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;
    const {
      holdingId,
      action,
      symbol,
      investmentType,
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

    if (!userId || !action || !symbol || quantity === undefined || pricePerUnit === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle Buy transaction logic (update or create holding)
    if (action === 'Buy') {
  await handleBuyTransaction({
    userId,
    symbol,
    investmentType,
    quantity,
    pricePerUnit,
    fiatFee,
    platform,
  });
}

    if (action === 'Sell') {
  await handleSellTransaction({
    userId,
    symbol,
    quantity,
    platform,
  });
}

    if (action === 'DRIP') {
  await handleDripTransaction({
    userId,
    symbol,
    quantity,
    pricePerUnit,
    platform,
  });
}

    if (action === 'CashDividend') {
  await handleCashDividendTransaction({
    userId,
    symbol,
    amount: totalCost, // using totalCost as input field for dividend amount
    platform,
  });
}

    if (action === 'CashFee') {
  await handleCashFeeTransaction({
    userId,
    totalCost,
    currency,
    date: new Date(date),
  });
}

    if (action === 'CashDeposit') {
      if (!totalCost || totalCost <= 0) {
        return res.status(400).json({ error: 'Missing or invalid deposit amount' });
  }

  await handleCashDepositTransaction({
    userId,
    amount: totalCost,
    platform,
  });
}

    if (action === 'CashWithdrawal') {
      if (!totalCost || totalCost <= 0) {
        return res.status(400).json({ error: 'Missing or invalid withdrawal amount' });
  }

  await handleCashWithdrawalTransaction({
    userId,
    amount: totalCost,
    platform,
  });
}

    if (action === 'TransferOut') {
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Missing or invalid TransferOut quantity' });
  }

  await handleTransferOutTransaction({
    userId,
    symbol,
    quantity,
    platform,
  });
}

    if (action === 'TransferIn') {
      if (!quantity || !pricePerUnit) {
        return res.status(400).json({ error: 'Missing quantity or pricePerUnit for TransferIn' });
  }

  await handleTransferInTransaction({
    userId,
    symbol,
    quantity,
    pricePerUnit,
    platform,
  });
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
      platform,
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
        platform,
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

export const getPortfolioSummary = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(400).json({ error: 'Missing authenticated user ID' });
    }

    const summary = await getHoldingsWithSummary(userId);
    return res.status(200).json(summary);
  } catch (error: any) {
    console.error('❌ Error fetching portfolio summary:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// --- GET BULK PRICES FOR USER HOLDINGS ---
export const getBulkPricesForUser = async (req: Request, res: Response): Promise<Response | void> => {
  const userId = req.user?.uid;

  if (!userId) {
    return res.status(400).json({ error: 'Missing authenticated user ID' });
  }

  try {
    const holdings = await prisma.portfolioHolding.findMany({
      where: { userId },
      select: { symbol: true },
    });

    const symbols = holdings.map((h) => h.symbol.toUpperCase());
    const priceResults: Record<string, number> = {};

    await Promise.allSettled(
      symbols.map(async (symbol) => {
        try {
          if (cryptoMap[symbol]) {
            // ✅ Crypto price from CoinGecko
            const coingeckoId = cryptoMap[symbol];
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
              params: {
                ids: coingeckoId,
                vs_currencies: 'usd',
              },
            });

            const price = response.data[coingeckoId]?.usd;
            if (price) priceResults[symbol] = price;
          } else {
            // ✅ Stock/ETF/Forex price from EODHD
            const formattedSymbol = mapToEodFormat(symbol); // ✅ Use reusable logic
            const response = await axios.get(`https://eodhd.com/api/real-time/${formattedSymbol}`, {
              params: {
                api_token: process.env.EODHD_API_KEY,
                fmt: 'json',
              },
            });

            const price = parseFloat(response.data?.close || response.data?.c);
            if (!isNaN(price)) priceResults[symbol] = price;
          }
        } catch (err: any) {
          console.warn(`⚠️ Failed to fetch ${symbol}:`, err.message);
        }
      })
    );

    return res.status(200).json(priceResults);
  } catch (error) {
    console.error('❌ Error fetching bulk prices:', error);
    return res.status(500).json({ error: 'Failed to fetch bulk prices' });
  }
};