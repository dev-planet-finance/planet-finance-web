import { Request, Response } from 'express';
import { Express } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { cryptoMap, mapToEodFormat } from '../services/priceFetcher';
import {
  handleBuyTransaction,
  handleSellTransaction,
  handleDripTransaction,
  handleCashDividendTransaction,
  handleCashFeeTransaction,
  handleCashInterestTransaction,
  handleCashDepositTransaction,
  handleCashWithdrawalTransaction,
  getHoldingsWithSummary,
  handleTransferOutTransaction,
  handleTransferInTransaction
} from '../services/portfolioLogic';
import { parse } from 'csv-parse/sync';

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
      date,
    } = req.body;

    if (!userId || !action || !symbol) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (action === 'Buy') {
      await handleBuyTransaction({
        userId,
        symbol,
        investmentType,
        quantity,
        pricePerUnit,
        fiatFee,
        platform,
        currency,
        fxRate,
      });
    }

    if (action === 'Sell') {
      await handleSellTransaction({
        userId,
        symbol,
        quantity,
        pricePerUnit,
        fiatFee,
        platform,
        currency,
        fxRate,
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
        amount: totalCost,
        currency,
        platform,
        fxRate,
      });
    }

    if (action === 'CashFee') {
      await handleCashFeeTransaction({
        userId,
        amount: totalCost,
        currency,
        platform,
        fxRate,
      });
    }

    if (action === 'CashInterest') {
      await handleCashInterestTransaction({
        userId,
        amount: totalCost,
        currency,
        platform,
        fxRate,
      });
    }

    if (action === 'CashDeposit') {
      if (!totalCost || totalCost <= 0) {
        return res.status(400).json({ error: 'Missing or invalid deposit amount' });
      }

      await handleCashDepositTransaction({
        userId,
        amount: totalCost,
        currency,
        platform,
        fxRate,
      });
    }

    if (action === 'CashWithdrawal') {
      if (!totalCost || totalCost <= 0) {
        return res.status(400).json({ error: 'Missing or invalid withdrawal amount' });
      }

      await handleCashWithdrawalTransaction({
        userId,
        amount: totalCost,
        currency,
        platform,
        fxRate,
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

    console.log(`🔍 Looking for holding with userId=${userId}, symbol=${symbol}, platform=${platform}`);


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

const safeDate = typeof date === 'string' && !isNaN(Date.parse(date)) ? new Date(date) : new Date();

    // Store the raw transaction record
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
        currency: currency ?? '',
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
        date: date && !isNaN(new Date(date).getTime()) ? new Date(date) : new Date(),
      },
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
      averagePrice,
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

    if (!userId || !symbol || !investmentType || quantity == null || averagePrice == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const holding = await prisma.portfolioHolding.create({
      data: {
        userId,
        symbol,
        cryptoName,
        investmentType,
        quantity,
        averagePrice,
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

// --- UPLOAD TRANSACTIONS VIA CSV ---
export const uploadTransactionsCSV = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
): Promise<void> => {

  try {
    const userId = req.user?.uid;
    const fileBuffer = req.file?.buffer;

    if (!userId || !fileBuffer) {
      res.status(400).json({ error: 'Missing file or user' });
      return;
    }

    const fileContent = fileBuffer.toString('utf-8').replace(/^\uFEFF/, '').replace(/["]+/g, ''); // Remove BOM and stray quotes

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
      trim: true,
      relax_column_count: true,
    });

    const created = [];

    for (const row of records) {
      const {
        action,
        symbol,
        quantity,
        pricePerUnit,
        currency,
        platform,
        date
      } = row;

      if (!action || !symbol || !quantity || !pricePerUnit || !currency || !date) {
        console.warn('⚠️ Skipping row with missing fields:', row);
        continue;
      }

      const tx = await prisma.portfolioTransaction.create({
        data: {
          userId,
          action,
          symbol,
          quantity: parseFloat(quantity),
          pricePerUnit: parseFloat(pricePerUnit),
          currency,
          platform,
          date: new Date(date),
        },
      });

      created.push(tx);
    }

    res.status(201).json({ message: `${created.length} transactions uploaded`, transactions: created });
  } catch (error) {
    console.error('❌ Error uploading CSV:', error);
    res.status(500).json({ error: 'Failed to upload CSV' });
  }
};


// --- TEMP DEBUG: LIST USER HOLDINGS ---
export const listUserHoldings = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ error: 'Missing user ID' });
    

    const holdings = await prisma.portfolioHolding.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json(holdings);
  } catch (err) {
    console.error('Error listing holdings:', err);
    res.status(500).json({ error: 'Could not fetch holdings' });
  }
};
