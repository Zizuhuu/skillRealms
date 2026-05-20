// Debug script to identify the source of the parse error
console.log('Starting debug...');

// Test 1: Check if dotenv can load
try {
  import('dotenv').then(dotenv => {
    console.log('Testing dotenv...');
    const result = dotenv.config();
    console.log('Dotenv result:', result);
  }).catch(err => {
    console.error('Dotenv import error:', err);
  });
} catch (err) {
  console.error('Dotenv test error:', err);
}

// Test 2: Check environment variables directly
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);

// Test 3: Try a simple JSON parse
try {
  JSON.parse('{"test": "value"}');
  console.log('JSON parsing works');
} catch (err) {
  console.error('JSON parse error:', err);
}

console.log('Debug complete');
