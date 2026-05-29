/**
 * P1d (optionnel) — Pré-rendu minimal « coquilles HTML » pour SPA Vite.
 * Après `vite build`, copie index.html sous chaque route statique détectée
 * dans src/App.tsx (+ routes optionnelles STATIC_PRERENDER_ROUTES).
 *
 * Usage : `pnpm run build:spa-shells`
 * Variable d'environnement : STATIC_PRERENDER_ROUTES="/legal,/privacy"
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const indexPath = join(dist, 'index.html');
const appPath = join(root, 'src', 'App.tsx');

if (!existsSync(indexPath)) {
  console.error('[P1d] dist/index.html introuvable — exécutez vite build avant ce script.');
  process.exit(1);
}

const html = readFileSync(indexPath, 'utf8');
const routes = new Set(['/']);

function collectFromAppSource(src) {
  const re = /path=\{?['"]([^'"]+)['"]\}?/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const p = m[1];
    if (!p || p.includes('*') || p.includes(':')) continue;
    if (!p.startsWith('/')) continue;
    routes.add(p);
  }
}

if (existsSync(appPath)) {
  try {
    collectFromAppSource(readFileSync(appPath, 'utf8'));
  } catch (e) {
    console.warn('[P1d] lecture App.tsx:', e?.message || e);
  }
}

for (const raw of (process.env.STATIC_PRERENDER_ROUTES || '').split(',')) {
  const t = raw.trim();
  if (!t) continue;
  routes.add(t.startsWith('/') ? t : `/${t}`);
}

let written = 0;
for (const route of routes) {
  if (route === '/') continue;
  const rel = route.replace(/^\//, '');
  const target = join(dist, rel, 'index.html');
  if (existsSync(target)) continue;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html, 'utf8');
  written += 1;
  console.log('[P1d] +', target);
}

console.log(`[P1d] OK — routes=${routes.size} nouvellesCoquilles=${written}`);
