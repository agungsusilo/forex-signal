// api/ai.js — Unified AI proxy supporting multiple providers
// Provider is selected by passing { provider, model, prompt } in the request body

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { provider = 'anthropic', model, prompt, max_tokens = 4096 } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    let text = '';

    // ── ANTHROPIC ────────────────────────────────────────────────────────────
    if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in Vercel env vars' });
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: model || 'claude-haiku-4-5', max_tokens, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await r.json();
      if (data.error) return res.status(r.status).json({ error: data.error.message || JSON.stringify(data.error) });
      text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    }

    // ── GOOGLE GEMINI ────────────────────────────────────────────────────────
    else if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set in Vercel env vars' });
      const mdl = model || 'gemini-2.0-flash';
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${mdl}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: max_tokens, temperature: 0.7 }
          })
        }
      );
      const data = await r.json();
      if (data.error) return res.status(r.status).json({ error: data.error.message || JSON.stringify(data.error) });
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // ── GROQ ─────────────────────────────────────────────────────────────────
    else if (provider === 'groq') {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not set in Vercel env vars' });
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: model || 'llama-3.3-70b-versatile',
          max_tokens,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await r.json();
      if (data.error) return res.status(r.status).json({ error: data.error.message || JSON.stringify(data.error) });
      text = data.choices?.[0]?.message?.content || '';
    }

    // ── OPENROUTER ───────────────────────────────────────────────────────────
    else if (provider === 'openrouter') {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY not set in Vercel env vars' });
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://aurum-signal.vercel.app',
          'X-Title': 'AURUM Signal'
        },
        body: JSON.stringify({
          model: model || 'mistralai/mistral-7b-instruct:free',
          max_tokens,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await r.json();
      if (data.error) return res.status(r.status).json({ error: data.error.message || JSON.stringify(data.error) });
      text = data.choices?.[0]?.message?.content || '';
    }

    else {
      return res.status(400).json({ error: `Unknown provider: ${provider}` });
    }

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
