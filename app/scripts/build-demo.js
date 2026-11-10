// Bundles the web app and the engine into one self-contained HTML file
// (dist/qard-sandbox.html) that runs entirely in the browser.
// Needs esbuild once:  npm install --no-save esbuild
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = await build({ entryPoints: [path.join(root, 'web/main-local.js')], bundle: true, format: 'iife', minify: false, write: false, target: 'es2020' });
const css = fs.readFileSync(path.join(root, 'web/styles.css'), 'utf8');
const html = `<title>Qard Sandbox</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
${css}
</style>
<div id="app"></div>
<script>
${out.outputFiles[0].text.replace(/<\/script/g, '<\\/script')}
</script>
`;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/qard-sandbox.html'), html);
console.log(`dist/qard-sandbox.html  ${(html.length / 1024).toFixed(0)} KB`);
