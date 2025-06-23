'use client';

import { useEffect, useState } from 'react';
import { pingServer, login } from '@/lib/api';

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginResponse, setLoginResponse] = useState('');

  useEffect(() => {
    pingServer().then(setMessage);
  }, []);

  const handleLogin = async () => {
    const res = await login(email, password);
    setLoginResponse(res.message || 'No response');
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Planet Finance Web App</h1>
      <p>Server says: {message}</p>

      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '0.5rem' }}
      />
      <button onClick={handleLogin}>Login</button>

      {loginResponse && <p style={{ marginTop: '1rem' }}>Response: {loginResponse}</p>}
    </main>
  );
}

