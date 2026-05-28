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
  // Priority order for Gemini API key (same as api/openai.js)
  const geminiKey = process.env.GEMINI_API_KEY || 
                    process.env.VITE_GEMINI_API_KEY || 
                    process.env.OPENAI_API_KEY || 
                    process.env.VITE_OPENAI_KEY || 
                    process.env.GROQ_API_KEY || 
                    process.env.VITE_GROQ_API_KEY ||
                    'AIzaSyDLGkyp10Sww4Gv7tBj1P1e6wI4veScJjw'; // Fallback for development
  return res.status(200).json({ ok: Boolean(geminiKey), hasKey: Boolean(geminiKey), provider: 'gemini' });
});

app.post('/api/openai', async (req, res) => {
  try {
    // Priority order for Gemini API key (same as api/openai.js)
    const geminiKey = process.env.GEMINI_API_KEY || 
                      process.env.VITE_GEMINI_API_KEY || 
                      process.env.OPENAI_API_KEY || 
                      process.env.VITE_OPENAI_KEY || 
                      process.env.GROQ_API_KEY || 
                      process.env.VITE_GROQ_API_KEY ||
                      'AIzaSyDLGkyp10Sww4Gv7tBj1P1e6wI4veScJjw'; // Fallback for development
                      
    if (!geminiKey) {
      console.error('Gemini key not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const requestBody = { ...req.body };
    
    // Replace OpenAI model with Gemini model
    if (requestBody.model === 'gpt-3.5-turbo') {
      requestBody.model = 'gemini-1.5-flash';
    }

    // Ensure messages array is properly formatted
    if (requestBody.messages && !Array.isArray(requestBody.messages)) {
      requestBody.messages = [{ role: 'user', content: String(requestBody.messages) }];
    }

    let retryCount = 0;
    const maxRetries = 3;
    let response;

    while (retryCount < maxRetries) {
      try {
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${geminiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        // Check for rate limiting or API pause
        if (response.status === 429 || (data.error && data.error.message && data.error.message.includes('quota'))) {
          console.log(`API rate limited, waiting 34 seconds... (attempt ${retryCount + 1}/${maxRetries})`);
          if (retryCount < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 34000)); // Wait 34 seconds
            retryCount++;
            continue;
          }
        }
        
        // Success response
        console.log('API request successful');
        return res.json(data);
        
      } catch (fetchError) {
        console.error(`API request failed (attempt ${retryCount + 1}/${maxRetries}):`, fetchError.message);
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log('Retrying in 5 seconds...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    // All retries failed
    console.error('API request failed after all retries');
    return res.status(500).json({ error: 'API request failed after retries' });
    
  } catch (error) {
    console.error('Proxy server error:', error.message);
    return res.status(500).json({ error: 'Proxy server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});