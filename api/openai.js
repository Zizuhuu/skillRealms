export default async function handler(req, res) {
  const OPENAI_KEY = process.env.VITE_OPENAI_KEY || process.env.OPENAI_KEY;

  if (req.method === 'GET') {
    return res.status(200).json({ ok: Boolean(OPENAI_KEY), hasKey: Boolean(OPENAI_KEY) });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!OPENAI_KEY) {
    return res.status(500).json({ error: 'OpenAI key not configured on server' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('OpenAI proxy error:', error);
    return res.status(500).json({ error: 'OpenAI proxy failed' });
  }
}
