import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  const OPENAI_KEY = process.env.VITE_OPENAI_KEY || process.env.OPENAI_KEY || process.env.OPENAI_API_KEY;
  const GROQ_KEY = process.env.GROQ_API_KEY;
  const SILICON_FLOW_KEY = process.env.SILICON_FLOW_API_KEY;

  // Basic CORS support for cross-origin dev setups
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      ok: Boolean(OPENAI_KEY || GROQ_KEY || SILICON_FLOW_KEY), 
      hasKey: Boolean(OPENAI_KEY || GROQ_KEY || SILICON_FLOW_KEY), 
      provider: SILICON_FLOW_KEY ? 'siliconflow' : GROQ_KEY ? 'groq' : 'openai'
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let apiUrl, apiKey, requestBody;

  if (SILICON_FLOW_KEY) {
    apiUrl = 'https://api.siliconflow.cn/v1/chat/completions';
    apiKey = SILICON_FLOW_KEY;
    requestBody = { ...req.body };
  } else if (GROQ_KEY) {
    apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    apiKey = GROQ_KEY;
    requestBody = { ...req.body };
    // Replace OpenAI model with Groq model
    if (requestBody.model === 'gpt-3.5-turbo') {
      requestBody.model = 'llama3-70b-8192';
    }
  } else if (OPENAI_KEY) {
    apiUrl = 'https://api.openai.com/v1/chat/completions';
    apiKey = OPENAI_KEY;
    requestBody = req.body;
  } else {
    return res.status(500).json({ error: 'No AI API key configured' });
  }

  try {
    let requestBody = req.body;
    
    // Map model names for different providers
    if (SILICON_FLOW_KEY && requestBody.model === 'gpt-3.5-turbo') {
      requestBody.model = 'Qwen/Qwen2.5-32B-Instruct';
    } else if (GROQ_KEY && requestBody.model === 'gpt-3.5-turbo') {
      requestBody.model = 'llama3-70b-8192';
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('AI proxy error:', error);
    return res.status(500).json({ error: 'AI proxy failed' });
  }
}
