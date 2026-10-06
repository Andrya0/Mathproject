import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'src');
let html = readFileSync(join(source, 'index.html'), 'utf8');
const css = readFileSync(join(source, 'style.css'), 'utf8').trimEnd();
const js = readFileSync(join(source, 'app.js'), 'utf8').trimEnd();
const svg = readFileSync(join(source, 'favicon.svg'), 'utf8').trim();

function replaceOnce(before, after) {
  if (!html.includes(before)) throw new Error(`Missing build marker: ${before}`);
  html = html.replace(before, after);
}

replaceOnce('<link rel="icon" type="image/svg+xml" href="./favicon.svg" />',
  `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(svg)}" />`);
replaceOnce('<link rel="stylesheet" href="./style.css" />', `<style>\n${css}\n  </style>`);
replaceOnce('<script src="./app.js"></script>', `<script>\n${js}\n  </script>`);

writeFileSync(join(root, 'index.html'), html, 'utf8');
console.log('Built index.html');
