# Environment Variable Verification

## Your .env file should look like this:

```env
# Choose ONE of these API keys (Groq recommended - free)

# Option 1: Groq (Free & Fast)
GROQ_API_KEY=gsk_your_actual_groq_key_here

# Option 2: SiliconFlow (Free tier)
# SILICON_FLOW_API_KEY=your_actual_siliconflow_key_here

# Option 3: OpenAI (Paid)
# OPENAI_API_KEY=sk-your-actual-openai-key-here

# Option 4: SkillCloud (if you have access)
# SKILLCLOUD_API_KEY=your_actual_skillcloud_key_here
```

## Common Issues:

### 1. **Missing .env file**
- Make sure the file is named exactly `.env` (not `.env.txt` or `env`)
- Should be in the root directory: `/Users/ziyadhussein/Intersession 2 & 3/skillRealms/.env`

### 2. **Incorrect format**
- No quotes around the key: `GROQ_API_KEY=gsk_abc123` (not `GROQ_API_KEY="gsk_abc123"`)
- No spaces around `=`: `GROQ_API_KEY=gsk_abc123` (not `GROQ_API_KEY = gsk_abc123`)
- One key per line

### 3. **Invalid key**
- Make sure the key is complete and not truncated
- Check for extra characters or spaces
- Verify the key format matches the provider

### 4. **Server not restarted**
- After adding/changing API keys, you MUST restart the development server
- The environment variables are only loaded at startup

## Quick Test:

1. Check your `.env` file has the correct format
2. Make sure there's no `.env.example` or `.env.sample` - it should be exactly `.env`
3. Restart your development server
4. Try loading a lesson - if you see "AI lesson unavailable" with setup instructions, the keys aren't being loaded

## If still getting 403 error:

The error suggests the API keys aren't being loaded properly. Check:
- File name is exactly `.env`
- File is in the correct directory
- No syntax errors in the file
- Development server was restarted after adding keys
