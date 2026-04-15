import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.options('/api/openai', (req, res) => {
  res.sendStatus(204);
});

app.get('/api/openai', (req, res) => {
  const openAiKey = process.env.OPENAI_KEY || process.env.VITE_OPENAI_KEY;
  return res.status(200).json({ ok: Boolean(openAiKey), hasKey: Boolean(openAiKey) });
});

app.post('/api/openai', async (req, res) => {
  try {
    const openAiKey = process.env.OPENAI_KEY || process.env.VITE_OPENAI_KEY;
    if (!openAiKey) {
      return res.status(500).json({ error: 'OpenAI key not configured on proxy server' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});