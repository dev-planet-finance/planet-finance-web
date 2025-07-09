'use client';

import { useEffect, useState } from 'react';
import { fetchWithToken } from '@/lib/fetchWithToken';

type HoldingSummary = {
  symbol: string;
  investmentType?: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: string;
  gain: string;
  gainPercent: string;
  assetClass?: string;
  platform?: string;
  strategy?: string;
  region?: string;
};

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<HoldingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetchWithToken('http://localhost:4000/api/portfolio/summary');

        if (!res.ok) {
          throw new Error('Failed to fetch summary');
        }

        const data: HoldingSummary[] = await res.json();
        setHoldings(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading portfolio summary:', err);
        setError('Failed to load portfolio summary');
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const totalValue = holdings.reduce((sum, h) => sum + parseFloat(h.marketValue), 0);

  if (loading) return <div>Loading portfolio summary...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>💼 Portfolio Overview</h1>

      <button
        style={{
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
        onClick={() => alert('🚧 Add Transaction modal coming soon!')}
      >
        ➕ Add Transaction
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th align="left">Symbol</th>
            <th align="left">Type</th>
            <th align="right">Quantity</th>
            <th align="right">Avg Cost</th>
            <th align="right">Price</th>
            <th align="right">Market Value</th>
            <th align="right">Gain</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.symbol} style={{ borderBottom: '1px solid #eee' }}>
              <td>{h.symbol}</td>
              <td>
                <span
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: h.investmentType === 'Crypto' ? '#ffe58f' : '#d6f5d6',
                    color: '#000', // ✅ Fix for visibility
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {h.investmentType || 'Unknown'}
                </span>
              </td>
              <td align="right">{Number(h.quantity).toFixed(4)}</td>
              <td align="right">${Number(h.averageCost).toFixed(2)}</td>
              <td align="right">${Number(h.currentPrice).toFixed(2)}</td>
              <td align="right">${h.marketValue}</td>
              <td align="right" style={{ color: parseFloat(h.gain) >= 0 ? 'limegreen' : 'red' }}>
                ${h.gain} ({h.gainPercent}%)
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', borderTop: '2px solid #000' }}>
            <td colSpan={5} align="right">
              Total Market Value:
            </td>
            <td align="right">${totalValue.toFixed(2)}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
