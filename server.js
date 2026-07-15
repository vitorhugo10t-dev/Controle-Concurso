import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createServer } from 'node:http';

const port = Number(process.env.PORT || 3000);
const root = process.cwd();
const routeAliases = new Set(['/', '/dashboard/financas']);
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = routeAliases.has(url.pathname) ? '/index.html' : url.pathname;
  const filePath = normalize(join(root, pathname));

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Arquivo não encontrado.');
    return;
  }

  response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`Dashboard financeiro disponível em http://localhost:${port}/dashboard/financas`);
});
