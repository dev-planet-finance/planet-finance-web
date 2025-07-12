import axios from 'axios';
import dotenv from 'dotenv';
import { normalizeAssetType } from '../utils/normalizeAssetType';
dotenv.config();

/** ------------------------------------------
 * ✅ Reusable crypto symbol → CoinGecko ID map
 * (Used in price fetching logic)
 --------------------------------------------- */
export const cryptoMap: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  BNB: 'binancecoin',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  AVAX: 'avalanche-2',
};

/** ------------------------------------------
 * ✅ Format symbols for EODHD (e.g. ASX:IVV → IVV.AU)
 --------------------------------------------- */
export function mapToEodFormat(ticker: string): string {
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
  return ticker;
}

/** ------------------------------------------
 * 🔍 Search Crypto Assets (CoinGecko)
 --------------------------------------------- */
export async function searchCryptoAssets(query: string) {
  const resp = await axios.get('https://api.coingecko.com/api/v3/coins/list');
  const cryptos = resp.data;

  return cryptos
    .filter((c: any) =>
      c.id.includes(query) || c.symbol.includes(query) || c.name.toLowerCase().includes(query)
    )
    .slice(0, 10)
    .map((c: any) => ({
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      type: 'Crypto',
      source: 'CoinGecko',
      coingeckoId: c.id, // ✅ Include ID
    }));
}

/** ------------------------------------------
 * 🔍 Search Stock/ETF/Currency Assets (EODHD)
 --------------------------------------------- */

export async function searchStockAssets(query: string) {
  const url = `https://eodhistoricaldata.com/api/search/${query}`;

  const resp = await axios.get(url, {
    params: {
      api_token: process.env.EODHD_API_KEY,
      limit: 10,
      fmt: 'json',
    },
  });

  const results = resp.data;

  console.log('🔍 EODHD raw results:', results); // ✅ verify it's being hit

  const mapped = results
    .filter((s: any) => s.Code && s.Name)
    .map((s: any) => {
      const normalizedType = normalizeAssetType(s.Type || '');

      return {
        name: s.Name || 'Unnamed Asset',
        symbol: s.Code || '',
        type: normalizedType,
        source: 'EODHD',
      };
    });

  console.log('🧠 Mapped stock results:', mapped); // ✅ new debug line
  return mapped;
}

import { PortfolioHolding } from '@prisma/client';

export async function getLivePricesForHoldings(
  holdings: PortfolioHolding[]
): Promise<Record<string, number>> {
  const symbols = holdings.map(h => h.symbol.toUpperCase());
  const priceMap: Record<string, number> = {};

  await Promise.allSettled(
    symbols.map(async (symbol) => {
      try {
        if (cryptoMap[symbol]) {
          const coingeckoId = cryptoMap[symbol];
          const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
              ids: coingeckoId,
              vs_currencies: 'usd',
            },
          });
          const price = response.data[coingeckoId]?.usd;
          if (price) priceMap[symbol] = price;
        } else {
          const formattedSymbol = mapToEodFormat(symbol);
          const response = await axios.get(`https://eodhd.com/api/real-time/${formattedSymbol}`, {
            params: {
              api_token: process.env.EODHD_API_KEY,
              fmt: 'json',
            },
          });

          const price = parseFloat(response.data?.close || response.data?.c);
          if (!isNaN(price)) priceMap[symbol] = price;
        }
      } catch (err: any) {
        console.warn(`⚠️ Failed to fetch price for ${symbol}:`, err.message);
      }
    })
  );

  return priceMap;
}

