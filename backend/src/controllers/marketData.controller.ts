import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Common crypto ticker -> CoinGecko ID
const cryptoMap: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  BNB: 'binancecoin',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  AVAX: 'avalanche-2',
};

export const getLiveAssetPrice = async (req: Request, res: Response): Promise<void> => {
  const { symbol } = req.params;

  if (!symbol) {
    res.status(400).json({ error: 'Missing symbol' });
    return;
  }

  try {
    const upperSymbol = symbol.toUpperCase();

    // --- CRYPTO ROUTE ---
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

    // --- STOCK/ETF ROUTE (EODHD) ---
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

// Map user-friendly tickers to EODHD format
function mapToEodFormat(ticker: string): string {
  if (ticker.startsWith('ASX:')) return ticker.split(':')[1] + '.AU';
  if (ticker.startsWith('TSX:')) return ticker.split(':')[1] + '.TO';
  if (ticker.startsWith('LSE:')) return ticker.split(':')[1] + '.L';
  if (ticker.startsWith('NYSE:')) return ticker.split(':')[1] + '.US';
  if (ticker.startsWith('NASDAQ:')) return ticker.split(':')[1] + '.US';
  if (ticker.startsWith('HKEX:')) return ticker.split(':')[1] + '.HK';
  if (ticker.startsWith('TSE:')) return ticker.split(':')[1] + '.T';
  if (ticker.startsWith('BSE:')) return ticker.split(':')[1] + '.BO';
  if (ticker.startsWith('NSE:')) return ticker.split(':')[1] + '.NS';
  if (ticker.startsWith('SSE:')) return ticker.split(':')[1] + '.SS';
  if (ticker.startsWith('SZSE:')) return ticker.split(':')[1] + '.SZ';
  return ticker; // for symbols like AAPL
}
