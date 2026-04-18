// api/providers.js — Returns which AI providers are configured server-side
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  return res.status(200).json({
    anthropic:   !!process.env.ANTHROPIC_API_KEY,
    gemini:      !!process.env.GEMINI_API_KEY,
    groq:        !!process.env.GROQ_API_KEY,
    openrouter:  !!process.env.OPENROUTER_API_KEY,
    twelvedata:  !!process.env.TD_API_KEY,
  });
}
