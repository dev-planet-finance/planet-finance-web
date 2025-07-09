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
      searchCryptoAssets(query), // ✅ now includes `coingeckoId`
      searchStockAssets(query),
    ]);

    const combined = [...cryptos, ...stocks];

    // 🧠 Fetch live price for each asset
    const enriched = await Promise.all(
      combined.map(async (asset) => {
        try {
          let price = null;

          if (asset.source === 'CoinGecko' && asset.coingeckoId) {
            const resp = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
              params: {
                ids: asset.coingeckoId,
                vs_currencies: 'usd',
              },
            });
            price = resp.data[asset.coingeckoId]?.usd || null;
          }

          if (asset.source === 'EODHD') {
            const mappedSymbol = mapToEodFormat(asset.symbol || '');
            const resp = await axios.get(`https://eodhd.com/api/real-time/${mappedSymbol}`, {
              params: {
                api_token: process.env.EODHD_API_KEY,
                fmt: 'json',
              },
            });
            price = parseFloat(resp.data?.close || resp.data?.c);
            if (isNaN(price)) price = null;
          }

          return {
            ...asset,
            price,
          };
        } catch {
          return { ...asset, price: null };
        }
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    console.error('❌ Error during asset search:', error);
    res.status(500).json({ error: 'Failed to search assets' });
  }
};