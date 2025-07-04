const API_BASE_URL = 'http://localhost:4000/api';

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return await response.json();
}

export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return await response.json();
}

export async function pingServer(): Promise<string> {
  const response = await fetch('http://localhost:4000/api/ping');
  const data = await response.json();
  return data.message;
}

export async function fetchBulkPrices(token: string): Promise<Record<string, number>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/prices`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch prices: ${res.status}`);
  }

  return res.json();
}
