import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

const firstEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

function openAIProxyPlugin() {
  const handler = async (req, res, next) => {
    if (!req.url?.startsWith('/api/openai')) return next();

    const openaiKey = firstEnv('OPENAI_API_KEY', 'OPENAI_KEY', 'VITE_OPENAI_KEY');
    const groqKey = firstEnv('GROQ_API_KEY', 'VITE_GROQ_API_KEY');
    const siliconFlowKey = firstEnv('SILICON_FLOW_API_KEY', 'SILICONFLOW_API_KEY', 'VITE_SILICON_FLOW_API_KEY');
    const skillCloudKey = firstEnv('SKILLCLOUD_API_KEY', 'SKILLCLOUD_APIKEY', 'SKILLCLOUD_KEY', 'VITE_SKILLCLOUD_API_KEY');
    const skillCloudUrl = firstEnv('SKILLCLOUD_API_URL', 'VITE_SKILLCLOUD_API_URL') || 'https://api.skillcloud.ai/v1/chat/completions';

    let apiUrl, apiKey;

    // Use our API endpoint instead of external APIs
    apiUrl = '/api/openai';
    apiKey = 'proxy';

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    if (req.method === 'GET') {
      const provider = skillCloudKey
        ? 'skillcloud'
        : groqKey
          ? 'groq'
          : siliconFlowKey
            ? 'siliconflow'
            : openaiKey
              ? 'openai'
              : 'none';
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: provider !== 'none', hasKey: provider !== 'none', provider }));
    }

    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }

    // Forward POST requests to our API endpoint
    try {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });

      const parsedBody = body ? JSON.parse(body) : {};
      let requestBody = typeof parsedBody === 'object' && parsedBody ? parsedBody : {};

      // Map model names for different providers
      if (skillCloudKey && requestBody.model === 'gpt-3.5-turbo') {
        requestBody.model = 'gpt-4o-mini';
      } else if (siliconFlowKey && requestBody.model === 'gpt-3.5-turbo') {
        requestBody.model = 'deepseek-ai/DeepSeek-V3';
      } else if (groqKey && requestBody.model === 'gpt-3.5-turbo') {
        requestBody.model = 'llama3-70b-8192';
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
    port: 3001,
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
