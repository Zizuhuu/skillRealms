import dotenv from 'dotenv';
dotenv.config();

console.log('Environment variables loaded:');
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);          
console.log('Firebase keys exist:', !!process.env.VITE_FIREBASE_API_KEY);

// Test the firstEnv function
const firstEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const groqKey = firstEnv('GROQ_API_KEY', 'VITE_GROQ_API_KEY');
console.log('Groq key found:', !!groqKey);
