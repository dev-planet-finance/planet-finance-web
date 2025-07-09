// File: frontend/src/lib/fetchWithToken.ts

export async function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('firebaseToken');

  if (!token) {
    throw new Error('No Firebase token found in localStorage');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
