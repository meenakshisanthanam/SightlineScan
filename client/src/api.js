const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function scanUrl(url) {
  const res = await fetch(`${API_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "That didn't go through. Try again in a moment.");
  }
  return data;
}
