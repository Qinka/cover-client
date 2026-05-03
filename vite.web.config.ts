import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { resolve, dirname } from 'path';
import { existsSync, mkdirSync, cpSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Plugin: copy WASM files from public/wasm to Vite's public dir (served at /wasm/)
function copyWasmPlugin() {
  return {
    name: 'copy-wasm',
    async closeBundle() {
      const src = resolve(__dirname, 'public/wasm');
      const dest = resolve(__dirname, 'dist-web/wasm');
      if (existsSync(src)) {
        if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
        cpSync(src, dest, { recursive: true });
      }
    },
  };
}

// Plugin: serve index.web.html at / when running in dev mode
function serveWebIndexPlugin() {
  return {
    name: 'serve-web-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        // Skip WASM files - let Vite handle them normally
        if (req.url?.startsWith('/wasm/')) {
          return next();
        }
        if (req.url === '/' || req.url === '') {
          req.url = '/index.web.html';
        }
        next();
      });
    },
  };
}

// Web-only vite config: no electron deps, WASM handled natively
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait(), copyWasmPlugin(), serveWebIndexPlugin()],
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist-web',
    copyPublicDir: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.web.html'),
      },
    },
  },
});
