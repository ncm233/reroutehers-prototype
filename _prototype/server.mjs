import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DIR = path.join(__dirname, 'site');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
  const target = safePath === '/' || safePath === ''
    ? path.join(SITE_DIR, 'index.html')
    : path.join(SITE_DIR, safePath);

  // never serve outside site/
  if (!target.startsWith(SITE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(target, (err, data) => {
    if (err) {
      // single-page app: unknown paths fall back to index.html
      fs.readFile(path.join(SITE_DIR, 'index.html'), (fallbackErr, indexData) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(indexData);
      });
      return;
    }
    const ext = path.extname(target);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`ReRouteHer prototype server listening on port ${PORT}`);
});
