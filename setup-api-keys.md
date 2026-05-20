# API Key Setup Guide

## Quick Setup (Recommended)

### Option 1: Groq (Free & Fast)
1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Add to your `.env` file:
   ```
   GROQ_API_KEY=your_groq_key_here
   ```

### Option 2: SiliconFlow (Free Tier)
1. Go to [https://siliconflow.cn](https://siliconflow.cn)
2. Sign up for free account
3. Get API key from dashboard
4. Add to your `.env` file:
   ```
   SILICON_FLOW_API_KEY=your_siliconflow_key_here
   ```

### Option 3: OpenAI (Paid)
1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Create account and add payment method
3. Generate API key
4. Add to your `.env` file:
   ```
   OPENAI_API_KEY=your_openai_key_here
   ```

## Environment Variables

Add any of the following to your `.env` file (only one needed):

```env
# Groq (Recommended - Free)
GROQ_API_KEY=gsk_your_key_here

# SiliconFlow (Alternative - Free tier)
SILICON_FLOW_API_KEY=your_key_here

# OpenAI (Paid)
OPENAI_API_KEY=sk-your-key-here

# SkillCloud (If you have access)
SKILLCLOUD_API_KEY=your_key_here
```

## Testing Your Setup

1. Restart your development server
2. The app will automatically detect available API keys
3. If no keys are configured, the app will use built-in lesson content

## Troubleshooting

- **403 Error**: Means no API keys are configured
- **Invalid Key**: Check that the key is copied correctly without extra spaces
- **Rate Limit**: Free tiers have usage limits, upgrade if needed

## Pro Activation Code

Use code: `unlockproforfeatures`

This unlocks:
- Unlimited practice drills
- 30 questions per subject (vs 5 for free)
- In-depth explanations
- Permanent web access after GED completion
