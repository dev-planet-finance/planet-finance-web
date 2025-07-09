// File: backend/src/utils/normalizeAssetType.ts

export function normalizeAssetType(raw: string): string {
  const type = raw?.toLowerCase();

  if (!type) return 'Other';

  if (type.includes('crypto') || type.includes('coin') || type.includes('token')) return 'Crypto';
  if (type.includes('etf')) return 'ETF';
  if (type.includes('stock') || type.includes('equity') || type === 'common stock') return 'Stock';
  if (type.includes('currency') || type.includes('forex') || type === 'fx') return 'Currency';
  if (type.includes('fund')) return 'Fund';
  if (type.includes('bond')) return 'Bond';
  if (type.includes('future')) return 'Derivative';
  if (type.includes('index')) return 'Index';

  return 'Other';
}