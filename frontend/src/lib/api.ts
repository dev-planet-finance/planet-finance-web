export async function pingServer(): Promise<string> {
  const response = await fetch('http://localhost:4000/api/ping');
  const data = await response.json();
  return data.message;
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch('http://localhost:4000/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    return { message: 'Something went wrong' };
  }
}
