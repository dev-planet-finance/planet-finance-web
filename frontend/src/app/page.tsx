'use client';

import { useEffect, useState } from 'react';
import { loginUser, registerUser } from '@/lib/api';

export default function Home() {
  const [pingMessage, setPingMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Check for stored token on page load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);

    const fetchPing = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/ping');
        const data = await res.json();
        setPingMessage(data.message);
      } catch {
        setPingMessage('❌ Server not reachable');
      }
    };
    fetchPing();
  }, []);

  const handleAuth = async () => {
    try {
      const result = isRegistering
        ? await registerUser(email, password)
        : await loginUser(email, password);

      const token = result.token;
      setToken(token);
      localStorage.setItem('token', token);
      alert(`${isRegistering ? 'Registered' : 'Login'} success! Token stored.`);
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Planet Finance Web App</h1>
      <p>Server says: <strong>{pingMessage}</strong></p>

      {token ? (
        <div>
          <p>🔓 You are logged in!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ display: 'block', marginBottom: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ display: 'block', marginBottom: '1rem' }}
          />
          <button onClick={handleAuth}>
            {isRegistering ? 'Register' : 'Login'}
          </button>
          <p style={{ marginTop: '1rem' }}>
            <button onClick={() => setIsRegistering(!isRegistering)}>
              Switch to {isRegistering ? 'Login' : 'Register'}
            </button>
          </p>
        </>
      )}
    </main>
  );
}

