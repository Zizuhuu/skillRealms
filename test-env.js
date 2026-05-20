// Simple test to verify environment variables are loaded
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firstEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

// Check for API keys
const OPENAI_KEY = firstEnv('OPENAI_API_KEY', 'OPENAI_KEY', 'VITE_OPENAI_KEY');
const GROQ_KEY = firstEnv('GROQ_API_KEY', 'VITE_GROQ_API_KEY');
const SILICON_FLOW_KEY = firstEnv('SILICON_FLOW_API_KEY', 'SILICONFLOW_API_KEY', 'VITE_SILICON_FLOW_API_KEY');
const SKILLCLOUD_KEY = firstEnv('SKILLCLOUD_API_KEY', 'SKILLCLOUD_APIKEY', 'SKILLCLOUD_KEY', 'VITE_SKILLCLOUD_API_KEY');

console.log('=== API Key Configuration Check ===\n');

if (OPENAI_KEY) {
  console.log('OpenAI: Configured');
} else {
  console.log('OpenAI: Not found');
}

if (GROQ_KEY) {
  console.log('Groq: Configured');
} else {
  console.log('Groq: Not found');
}

if (SILICON_FLOW_KEY) {
  console.log('SiliconFlow: Configured');
} else {
  console.log('SiliconFlow: Not found');
}

if (SKILLCLOUD_KEY) {
  console.log('SkillCloud: Configured');
} else {
  console.log('SkillCloud: Not found');
}

const hasAnyKey = Boolean(OPENAI_KEY || GROQ_KEY || SILICON_FLOW_KEY || SKILLCLOUD_KEY);
console.log(`\nStatus: ${hasAnyKey ? 'API keys configured' : 'No API keys found'}`);

if (!hasAnyKey) {
  console.log('\nTo fix this, add one of these to your .env file:');
  console.log('GROQ_API_KEY=your_groq_key_here');
  console.log('SILICON_FLOW_API_KEY=your_siliconflow_key_here');
  console.log('OPENAI_API_KEY=your_openai_key_here');
}
