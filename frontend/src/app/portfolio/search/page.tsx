'use client';

import { useState } from 'react';

type AssetResult = {
  name?: string;
  symbol?: string;
  type: string;
  source: string;
  price?: number;
};

export default function AssetSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AssetResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchAssets = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/market/search?q=${query}`);
      const data = await response.json();
      console.log('🚀 Received search results:', data);
      setResults(data);
    } catch (err) {
      console.error('❌ Failed to fetch assets:', err);
      setError('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        🔍 Asset Search
      </h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for BTC, AAPL, IVV..."
          style={{
            padding: '0.5rem',
            width: '300px',
            marginRight: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={searchAssets}
          style={{
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th align="left">Name</th>
              <th align="left">Symbol</th>
              <th align="left">Type</th>
              <th align="left">Price</th>
              <th align="left">Source</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td>{r.name || 'Unnamed Asset'}</td>
                <td>{r.symbol || '—'}</td>
                <td>{r.type || '—'}</td>
                <td>{r.price ? `$${r.price.toFixed(2)}` : '—'}</td>
                <td>{r.source}</td>
                <td>
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        'selectedAsset',
                        JSON.stringify({
                          name: r.name,
                          symbol: r.symbol,
                          type: r.type,
                          source: r.source,
                        })
                      );
                      window.location.href = '/portfolio/add';
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    ➕ Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
