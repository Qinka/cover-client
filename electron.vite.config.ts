import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { resolve } from 'path';
import { cpSync, existsSync, mkdirSync } from 'fs';

// Plugin: copy WASM files from public/wasm to Vite output directory before build
function copyWasmPlugin() {
  return {
    name: 'copy-wasm',
    async closeBundle() {
      const src = resolve(__dirname, 'public/wasm');
      const dest = resolve(__dirname, 'dist-renderer/wasm');
      if (existsSync(src)) {
        if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
        cpSync(src, dest, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist-electron/main',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts'),
        },
        external: ['electron'],
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist-electron/preload',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/index.ts'),
        },
      },
    },
  },
  renderer: {
    root: '.',
    plugins: [react(), wasm(), topLevelAwait(), copyWasmPlugin()],
    base: './',
    build: {
      outDir: 'dist-renderer',
      copyPublicDir: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
        external: [/^\/wasm\/cover_wasm\.js$/],
      },
    },
    optimizeDeps: {
      exclude: ['cover-wasm'],
    },
  },
});
