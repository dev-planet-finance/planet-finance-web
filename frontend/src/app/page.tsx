'use client';

import { useEffect, useState } from 'react';
import { pingServer } from '@/lib/api';

export default function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    pingServer().then((msg) => setMessage(msg));
  }, []);

  return (
    <main>
      <h1>Planet Finance Web App</h1>
      <p>Server says: {message}</p>
    </main>
  );
}

