'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      localStorage.setItem('firebaseToken', token); // ✅ store token for reuse
      localStorage.setItem('firebaseEmail', userCredential.user.email || '');

      setStatus('✅ Login successful!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('❌ Login error:', err.message);
        setStatus('❌ Login failed: ' + err.message);
      } else {
        console.error('❌ Login error:', err);
        setStatus('❌ Login failed.');
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🔐 Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', margin: '1rem 0', padding: '0.5rem', width: '300px' }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />

      <button
        onClick={handleLogin}
        style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.5rem 1rem' }}
      >
        Login
      </button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}
