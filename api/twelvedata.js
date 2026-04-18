// api/twelvedata.js — Vercel Serverless Function
// Proxies requests to Twelve Data API using server-side env var

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const tdKey = process.env.TD_API_KEY;
  if (!tdKey) {
    return res.status(500).json({ error: 'TD_API_KEY not configured in Vercel environment variables' });
  }

  // Extract the endpoint from query param, e.g. ?_endpoint=quote
  const { _endpoint, ...rest } = req.query;
  if (!_endpoint) {
    return res.status(400).json({ error: 'Missing _endpoint query param' });
  }

  try {
    const params = new URLSearchParams({ ...rest, apikey: tdKey });
    const url = `https://api.twelvedata.com/${_endpoint}?${params}`;

    const response = await fetch(url);
    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
