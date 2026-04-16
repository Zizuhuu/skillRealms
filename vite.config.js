import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

function openAIProxyPlugin() {
  const handler = async (req, res, next) => {
    if (!req.url?.startsWith('/api/openai')) return next();

    const openaiKey = process.env.VITE_OPENAI_KEY || process.env.OPENAI_KEY || process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const siliconFlowKey = process.env.SILICON_FLOW_API_KEY;

    let apiUrl, apiKey;

    if (siliconFlowKey) {
      apiUrl = 'https://api.siliconflow.cn/v1/chat/completions';
      apiKey = siliconFlowKey;
    } else if (groqKey) {
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
      apiKey = groqKey;
    } else if (openaiKey) {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      apiKey = openaiKey;
    } else {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'No AI API key configured' }));
      return;
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    if (req.method === 'GET') {
      let provider = 'unknown';
      if (siliconFlowKey) provider = 'siliconflow';
      else if (groqKey) provider = 'groq';
      else if (openaiKey) provider = 'openai';
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: true, hasKey: true, provider }));
    }

    if (req.method === 'POST') {
      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(data));
          req.on('error', reject);
        });

        let requestBody = JSON.parse(body);
        
        // Map model names for different providers
        if (siliconFlowKey && requestBody.model === 'gpt-3.5-turbo') {
          requestBody.model = 'Qwen/Qwen2.5-32B-Instruct';
        } else if (groqKey && requestBody.model === 'gpt-3.5-turbo') {
          requestBody.model = 'llama3-70b-8192';
        }

        const proxyRes = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        const text = await proxyRes.text();
        res.statusCode = proxyRes.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(text);
      } catch (err) {
        console.error('AI proxy error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'AI proxy failed' }));
      }
    }
  };

  return {
    name: 'openai-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    openAIProxyPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
