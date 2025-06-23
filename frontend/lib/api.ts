export async function pingServer(): Promise<string> {
  try {
    const res = await fetch('http://localhost:4000/api/ping');
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error('Error pinging server:', error);
    return 'error';
  }
}

