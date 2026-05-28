# skillRealms

## Recent Updates
- Fixed API key configuration for production
- Updated Vercel deployment settings

skillRealms is a React + Vite app for GED-focused lessons and games.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## AI proxy environment variables

The app routes AI lesson generation through `/api/openai` and supports multiple providers.

Configure one of these keys (aliases accepted):

- `SKILLCLOUD_API_KEY` (also supports `SKILLCLOUD_APIKEY` / `SKILLCLOUD_KEY`; optional `SKILLCLOUD_API_URL`, defaults to `https://api.skillcloud.ai/v1/chat/completions`)
- `SILICON_FLOW_API_KEY` (also supports `SILICONFLOW_API_KEY`)
- `GROQ_API_KEY`
- `OPENAI_API_KEY` (also supports `OPENAI_KEY` / `VITE_OPENAI_KEY`)

Provider selection order is:

1. SkillCloud
2. SiliconFlow
3. Groq
4. OpenAI

You can test key detection locally:

```bash
curl http://localhost:5000/api/openai
```
