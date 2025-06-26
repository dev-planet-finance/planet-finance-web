'use client';

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import app from '@/lib/firebase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const auth = getAuth(app);

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setResponse(`✅ Registered: ${userCredential.user.email}`);
    } catch (error) {
      setResponse(`❌ Register failed: ${(error as any).message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setResponse(`✅ Logged in: ${userCredential.user.email}`);
    } catch (error) {
      setResponse(`❌ Login failed: ${(error as any).message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setResponse('👋 Logged out');
    } catch (error) {
      setResponse(`❌ Logout failed: ${(error as any).message}`);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Planet Finance Web App</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
        />

        <button onClick={handleRegister} style={{ marginRight: 10 }}>Register</button>
        <button onClick={handleLogin} style={{ marginRight: 10 }}>Login</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p>{response}</p>
    </main>
  );
}
