// Zero-dependency sandbox server. Serves the web app and a tiny API.
// State is the append-only command log in data/log.jsonl, replayed on start.
//
// SANDBOX ONLY: there is no sign-in. The "viewer" is chosen in the page so one
// person can play borrower, lender and operator. Do not put real member data
// or real money anywhere near this.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Platform } from './core/platform.js';
import { seedCommands } from './core/seed.js';
import { buildView } from './core/views.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
const logFile = path.join(dataDir, 'log.jsonl');
fs.mkdirSync(dataDir, { recursive: true });

function fresh() {
  const p = new Platform();
  for (const c of seedCommands()) p.dispatch(c);
  fs.writeFileSync(logFile, p.log.map((e) => JSON.stringify(e)).join('\n') + '\n');
  return p;
}
let platform = fs.existsSync(logFile)
  ? Platform.replay(fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)))
  : fresh();

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try {
    if (url.pathname === '/api/view') {
      return send(res, 200, JSON.stringify(buildView(platform, url.searchParams.get('as') || 'M1')));
    }
    if (url.pathname === '/api/dispatch' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) { body += chunk; if (body.length > 1e5) throw new Error('Too large'); }
      const { cmd, as } = JSON.parse(body);
      let error = null;
      const before = platform.log.length;
      if (cmd.type === 'resetSandbox') platform = fresh();
      else {
        try { platform.dispatch(cmd); } catch (e) { error = { message: e.message, rule: e.rule?.id || null }; }
        const added = platform.log.slice(before);
        if (added.length) fs.appendFileSync(logFile, added.map((e) => JSON.stringify(e)).join('\n') + '\n');
      }
      return send(res, 200, JSON.stringify({ error, view: buildView(platform, platform.members[as] ? as : 'M1') }));
    }
    // static files: / -> web/index.html, /src/core/* for the browser modules
    const rel = url.pathname === '/' ? 'web/index.html' : url.pathname.replace(/^\//, '');
    const file = path.resolve(root, rel);
    const allowed = [path.join(root, 'web') + path.sep, path.join(root, 'src', 'core') + path.sep];
    if (!allowed.some((a) => file.startsWith(a)) || !fs.existsSync(file)) return send(res, 404, 'Not found', 'text/plain');
    send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] || 'application/octet-stream');
  } catch (e) {
    send(res, 500, JSON.stringify({ error: { message: e.message } }));
  }
}).listen(process.env.PORT || 4173, () => console.log(`Qard sandbox on http://localhost:${process.env.PORT || 4173}`));
