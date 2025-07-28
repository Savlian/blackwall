const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const DIST_DIR = path.join(__dirname, 'dist');

console.log('Starting server...');
console.log('Dist directory:', DIST_DIR);
console.log('Files in dist:', fs.readdirSync(DIST_DIR));

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Serve index.html for all routes (SPA routing)
  const filePath = req.url === '/' ? 
    path.join(DIST_DIR, 'index.html') : 
    path.join(DIST_DIR, req.url);
  
  console.log('Looking for file:', filePath);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('File not found, serving index.html');
      // File doesn't exist, serve index.html for SPA routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          console.error('Error loading index.html:', err);
          res.writeHead(500);
          res.end('Error loading index.html');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
      return;
    }
    
    // File exists, serve it
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.wasm': 'application/wasm'
    }[ext] || 'application/octet-stream';
    
    console.log('Serving file:', filePath, 'as', contentType);
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error loading file:', err);
        res.writeHead(500);
        res.end('Error loading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/`);
  console.log('🎨 Purple theme should be visible!');
});