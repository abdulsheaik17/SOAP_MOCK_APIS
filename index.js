import express from 'express';
import basicAuthHandler from './api/basic_auth.js';
import noAuthHandler from './api/no_auth.js';
import xApiKeyHandler from './api/x_api_key.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse raw body for SOAP requests
app.use(express.raw({ type: 'text/xml', limit: '10mb' }));
app.use(express.raw({ type: 'application/xml', limit: '10mb' }));

// SOAP API Endpoints
app.post('/api/basic-auth', basicAuthHandler);
app.post('/api/no-auth', noAuthHandler);
app.post('/api/x-api-key', xApiKeyHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SOAP Mock Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SOAP Mock Server is running',
    endpoints: {
      health: '/health',
      noAuth: 'POST /api/no-auth',
      basicAuth: 'POST /api/basic-auth',
      xApiKey: 'POST /api/x-api-key'
    }
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist'
  });
});

// Export for Vercel serverless function
// Vercel will use this as the handler
export default app;

// Start server locally (only if not in Vercel environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SOAP Mock Server running on http://localhost:${PORT}`);
    console.log('\nAvailable SOAP Endpoints:');
    console.log(`  POST http://localhost:${PORT}/api/no-auth (No Authentication)`);
    console.log(`  POST http://localhost:${PORT}/api/basic-auth (Basic Auth: abc:1234)`);
    console.log(`  POST http://localhost:${PORT}/api/x-api-key (X-API-Key: 1234)`);
  });
}
