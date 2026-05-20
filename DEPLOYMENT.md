# Production Deployment Guide

## Environment Variables Required

Add these to your deployment platform (Vercel, Netlify, etc.):

### Firebase Configuration
```
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=skillway-1125b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skillway-1125b
VITE_FIREBASE_STORAGE_BUCKET=skillway-1125b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=242283113269
VITE_FIREBASE_APP_ID=1:242283113269:web:73fead12546faa887dba7c
```

### AI API Configuration (Choose ONE)
```
GROQ_API_KEY=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
```

## Deployment Steps

### 1. Prepare for Deployment
```bash
# Build the application
npm run build
```

### 2. Deploy to Platform

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 3. Set Environment Variables
Go to your deployment platform's dashboard and add the environment variables listed above.

## Important Notes

- **NEVER commit API keys to Git**
- **Always use environment variables in production**
- **The .env file should be in .gitignore**
- **Test locally first** with `npm run build && npm run preview`

## Troubleshooting

If the deployed site shows "AI lesson unavailable":
1. Check environment variables are set correctly
2. Verify API keys are valid
3. Check deployment logs for errors
