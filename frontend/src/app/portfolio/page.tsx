'use client';

import { useEffect, useState } from 'react';

type Holding = {
  id: string;
  symbol: string;
  quantity: number;
  investmentType: string;
};

type EnrichedHolding = Holding & {
  price: number;
  marketValue: number;
};

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<EnrichedHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = 'UhXXrtNZalRXbKETL6CijtRi7EC3'; // ✅ Your current Firebase UID
  const token =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3NzQ4NTAwMmYwNWJlMDI2N2VmNDU5ZjViNTEzNTMzYjVjNThjMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcGxhbmV0LWZpbmFuY2UtZGV2IiwiYXVkIjoicGxhbmV0LWZpbmFuY2UtZGV2IiwiYXV0aF90aW1lIjoxNzUxNDYwMTMxLCJ1c2VyX2lkIjoiVWhYWHJ0TlphbFJYYktFVEw2Q2lqdFJpN0VDMyIsInN1YiI6IlVoWFhydE5aYWxSWGJLRVRMNkNpanRSaTdFQzMiLCJpYXQiOjE3NTE0NjAxMzEsImV4cCI6MTc1MTQ2MzczMSwiZW1haWwiOiJkZW1vMTRAdXNlci5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiZGVtbzE0QHVzZXIuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.PAXPfvZ8TY82LodsVjfPVnkke7TBtoRf6UfRXzqLvyAHX1W9shTW3LAIIuF-lbK7clnyxi9J0Qycut_HET4Umw-5cEJFqNJSsg2oxdsT6adeHG3Vg9_os6_mGYXM7n66pCe2aJeBhPCO0aZws4_nXPMIjkdP9IMQ-MIOxzURJeKnBbFmajaxw5Tmr81Ju5XyJiXZjmiQk93mYNC8MN67d83oPRKTXG2ykdzxopWfHZkGg3TYZ7A8dEHeR9zl8Z2KydjIlwASFYBXK4XwsZATzo54Sugq6OyqHDe-TjvjRDfLBnMMo1SGo0aSfp6ja0CqCco5sUUcIYAJgMHHvfR0Hg'; // ✅ Your full Firebase token here (truncated for display)

  useEffect(() => {
    const fetchHoldingsWithPrices = async () => {
      try {
        const holdingsRes = await fetch(
          `http://localhost:4000/api/portfolio/transactions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const holdingsData: Holding[] = await holdingsRes.json();

        const enriched = await Promise.all(
          holdingsData.map(async (holding) => {
            const priceRes = await fetch(
              `http://localhost:4000/api/portfolio/price/${holding.symbol}`
            );
            const priceData = await priceRes.json();
            const price = priceData.price || 0;
            const marketValue = price * holding.quantity;

            return {
              ...holding,
              price,
              marketValue,
            };
          })
        );

        setHoldings(enriched);
        setLoading(false);
      } catch (err) {
        console.error('Error loading portfolio:', err);
        setError('Failed to load portfolio');
        setLoading(false);
      }
    };

    fetchHoldingsWithPrices();
  }, []);

  const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);

  if (loading) return <div>Loading portfolio...</div>;
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
            <th align="right">Price</th>
            <th align="right">Market Value</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{h.symbol}</td>
              <td>
                <span
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: h.investmentType === 'Crypto' ? '#ffe58f' : '#d6f5d6',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {h.investmentType}
                </span>
              </td>
              <td align="right">{Number(h.quantity).toFixed(4)}</td>
              <td align="right">${h.price.toFixed(2)}</td>
              <td align="right">${h.marketValue.toFixed(2)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', borderTop: '2px solid #000' }}>
            <td colSpan={4} align="right">
              Total Market Value:
            </td>
            <td align="right">${totalValue.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
