// Copies ONLY the public web assets into www/ (never functions/, .dev.vars, .wrangler, docs).
// Requires BACKEND_URL (e.g. https://your-project.pages.dev) — the existing deployed backend.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'www');
const backend = (process.env.BACKEND_URL || '').replace(/\/+$/, '');
if (!/^https:\/\/[^/]+/.test(backend)) { console.error('Set BACKEND_URL to your deployed https backend origin.'); process.exit(1); }
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'manifest.json', 'service-worker.js']) fs.copyFileSync(path.join(root, f), path.join(out, f));
fs.cpSync(path.join(root, 'icons'), path.join(out, 'icons'), { recursive: true });
fs.writeFileSync(path.join(out, 'android-config.js'), `window.MW_API_BASE = ${JSON.stringify(backend)};\n`);
console.log('www ready, backend =', backend);
