export async function pingServer(): Promise<string> {
  const response = await fetch('http://localhost:4000/api/ping');
  const data = await response.json();
  return data.message;
}

