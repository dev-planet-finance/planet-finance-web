'use client';

import { useEffect, useState } from 'react';
import { fetchWithToken } from '@/lib/fetchWithToken';

type SelectedAsset = {
  name?: string;
  symbol?: string;
  type: string;
  source: string;
};

export default function AddPortfolioPage() {
  const [asset, setAsset] = useState<SelectedAsset | null>(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('selectedAsset');
    if (stored) {
      try {
        setAsset(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse selectedAsset from localStorage');
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!asset || !quantity || !price) {
      setStatus('❌ Please fill all fields');
      return;
    }

    try {
      const res = await fetchWithToken('http://localhost:4000/api/portfolio/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: asset.symbol,
          investmentType: asset.type,
          action: 'Buy',
          quantity: parseFloat(quantity),
          pricePerUnit: parseFloat(price),
          date: new Date().toISOString(), // ✅ Add this line
          currency: 'USD', // ✅ Temporarily hardcoded until currency logic added
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit transaction');
      }

      setStatus('✅ Transaction saved!');
      setQuantity('');
      setPrice('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error saving transaction');
    }
  };

  if (!asset) return <div>⚠️ No asset selected.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>➕ Add Asset to Portfolio</h1>

      <p>
        <strong>Asset:</strong> {asset.name || 'Unnamed'} ({asset.symbol}) – {asset.type}
      </p>

      <div style={{ marginTop: '1.5rem' }}>
        <label>
          Quantity:
          <input
            type="number"
            placeholder="e.g. 1.5"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.3rem', width: '100px' }}
          />
        </label>
        <br />
        <label style={{ marginTop: '1rem', display: 'block' }}>
          Purchase Price:
          <input
            type="number"
            placeholder="e.g. 102.50"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.3rem', width: '100px' }}
          />
        </label>
        <br />
        <button
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>

        {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
      </div>
    </div>
  );
}
