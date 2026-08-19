import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],

  // Relative asset paths: this app is served from a kiosk device and must
  // also work if opened directly or hosted from a subpath.
  base: './',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Workspace packages resolve to their TS source directly — Vite
      // transpiles them on the fly, so no separate build step is needed
      // during development.
      '@red-giant/game-engine': path.resolve(__dirname, '../../packages/game-engine/src'),
      '@red-giant/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },

  server: {
    host: true,
    port: 5173,
  },

   preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    allowedHosts: ['game4-0-3.onrender.com']
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
