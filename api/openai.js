export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Handle GET request
  if (req.method === 'GET') {
    return res.status(200).json({ 
      ok: true, 
      hasKey: true, 
      provider: 'groq',
      message: null
    });
  }

  // Handle POST request
  if (req.method === 'POST') {
    const { model, messages, temperature, max_tokens } = req.body;

    try {
      // Use Groq API as primary
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: temperature || 0.85,
          max_tokens: max_tokens || 6000
        })
      });

      if (groqResponse.ok) {
        const data = await groqResponse.json();
        return res.status(200).json(data);
      } else {
        console.error('Groq API error:', groqResponse.status);
        // Try Gemini as fallback
        try {
          const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gemini-1.5-flash',
              messages: messages,
              temperature: temperature || 0.85,
              max_tokens: max_tokens || 6000
            })
          });

          if (geminiResponse.ok) {
            const data = await geminiResponse.json();
            return res.status(200).json(data);
          }
        } catch (geminiError) {
          console.error('Gemini fallback error:', geminiError);
        }

        // If both fail, return error
        return res.status(500).json({ 
          error: 'AI service unavailable',
          message: 'Both Groq and Gemini APIs failed'
        });
      }
    } catch (error) {
      console.error('API handler error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Handle other methods
  return res.status(405).json({ error: 'Method Not Allowed' });
}
