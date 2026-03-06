import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

function openAIProxyPlugin() {
  const handler = async (req, res, next) => {
    if (!req.url?.startsWith('/api/openai')) return next();

    const openaiKey = process.env.VITE_OPENAI_KEY;
    if (!openaiKey) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'OpenAI key missing. Set VITE_OPENAI_KEY in .env.' }));
      return;
    }

    try {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });

      const proxyRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body
      });

      const text = await proxyRes.text();
      res.statusCode = proxyRes.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(text);
    } catch (err) {
      console.error('OpenAI proxy error:', err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'OpenAI proxy failed' }));
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
