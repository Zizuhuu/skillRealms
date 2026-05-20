// Minimal test to isolate the parse error
import dotenv from 'dotenv';

console.log('Testing dotenv loading...');

try {
  const result = dotenv.config();
  console.log('Dotenv config result:', result);
  console.log('Environment loaded successfully');
  
  // Test specific keys
  console.log('GROQ_API_KEY:', !!process.env.GROQ_API_KEY ? 'Found' : 'Not found');
  console.log('FIREBASE_PROJECT_ID:', !!process.env.VITE_FIREBASE_PROJECT_ID ? 'Found' : 'Not found');
} catch (error) {
  console.error('Error loading .env:', error.message);
  console.error('Full error:', error);
}
