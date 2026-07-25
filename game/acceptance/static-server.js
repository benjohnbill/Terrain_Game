/**
 * A minimal static server over `game/`, used by the browser acceptance lanes.
 *
 * It exists so a browser can load **the emitted artifact** — the same
 * `game/dist/` graph Node imports — rather than a per-host re-transpile
 * (gate 05 D6). Node's own `http` module covers it; no dependency is added.
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME_ROOT = fileURLToPath(new URL('..', import.meta.url));

const CONTENT_TYPES = {
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

/**
 * Starts the server on an ephemeral port.
 * @returns {Promise<{ origin: string, close: () => Promise<void> }>}
 */
export async function startStaticServer() {
  const server = createServer((req, res) => {
    // Strip the query, then normalize and confine to GAME_ROOT — a served
    // directory should never be escapable by `../`, whatever the caller sends.
    const requested = decodeURIComponent((req.url ?? '/').split('?')[0]);
    const resolved = normalize(join(GAME_ROOT, requested));
    if (!resolved.startsWith(GAME_ROOT.endsWith(sep) ? GAME_ROOT : GAME_ROOT + sep)) {
      res.writeHead(403).end('forbidden');
      return;
    }

    readFile(resolved)
      .then((body) => {
        res.writeHead(200, {
          'content-type': CONTENT_TYPES[extname(resolved)] ?? 'application/octet-stream',
          'cache-control': 'no-store',
        });
        res.end(body);
      })
      .catch(() => {
        res.writeHead(404).end('not found');
      });
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());

  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
