const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Add security and CORS headers
app.use((req, res, next) => {
  // Allow camera access
  res.setHeader('Permissions-Policy', 'camera=(self)');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Cache control for assets - DISABLED FOR DEBUGGING
  if (req.url.match(/\.(jpg|jpeg|png|gif|fset|fset3|iset|glb|gltf)$/)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.fset') || filepath.endsWith('.fset3') || filepath.endsWith('.iset')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    }
  }
}));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});