import axios from 'axios';
import dotenv from 'dotenv';
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

  return results
    .filter((s: any) => s.code && s.name)
    .map((s: any) => ({
      name: s.name || 'Unnamed Asset',
      symbol: s.code || '',
      type: s.Type || 'Stock',
      source: 'EODHD',
    }));
}
