import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import {
  cryptoMap,
  mapToEodFormat,
  searchCryptoAssets,
  searchStockAssets
} from '../services/priceFetcher';

// --- GET LIVE PRICE ---
export const getLiveAssetPrice = async (req: Request, res: Response): Promise<void> => {
  const { symbol } = req.params;

  if (!symbol) {
    res.status(400).json({ error: 'Missing symbol' });
    return;
  }

  try {
    const upperSymbol = symbol.toUpperCase();

    // Crypto route
    if (cryptoMap[upperSymbol]) {
      const coingeckoId = cryptoMap[upperSymbol];
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: coingeckoId,
          vs_currencies: 'usd',
        },
      });

      const price = response.data[coingeckoId]?.usd;

      if (!price) {
        res.status(404).json({ error: 'Crypto price not found' });
        return;
      }

      res.status(200).json({ symbol: upperSymbol, price });
      return;
    }

    // Stock/ETF route
    const eodSymbol = mapToEodFormat(upperSymbol);
    const eodResponse = await axios.get(`https://eodhd.com/api/real-time/${eodSymbol}`, {
      params: {
        api_token: process.env.EODHD_API_KEY,
        fmt: 'json',
      },
    });

    const price = eodResponse.data.close;
    if (!price) {
      res.status(404).json({ error: `Price not found for ${symbol}` });
      return;
    }

    res.status(200).json({ symbol: upperSymbol, price });
  } catch (error) {
    console.error('❌ Error fetching price:', error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};

// --- SEARCH ASSETS ---
export const searchAssets = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q?.toString().toLowerCase();

  if (!query || query.length < 1) {
    res.status(400).json({ error: 'Missing or invalid search query' });
    return;
  }

  try {
    const [cryptos, stocks] = await Promise.all([
      searchCryptoAssets(query),
      searchStockAssets(query),
    ]);

    const results = [...cryptos, ...stocks];
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error during asset search:', error);
    res.status(500).json({ error: 'Failed to search assets' });
  }
};
