export default async function handler(req, res) {
  // Simple test endpoint to ensure API routing works
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'API test endpoint working',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  }

  return res.status(200).json({ message: 'Test endpoint' });
}
