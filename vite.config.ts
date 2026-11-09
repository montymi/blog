/// <reference types="vitest" />
import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import vercel from 'vite-plugin-vercel';

import { MOVED } from './src/moved';
import devApiPlugin from './vite-dev-api-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    root: path.resolve(__dirname, './src'),
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          markdown: ['react-markdown', 'rehype-raw'],
        },
      },
    },
  },
  vercel: {
    redirects: Object.entries(MOVED).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    })),
    // Every page is the one app: a reload of /writing/talking-docs serves index.html, not a 404.
    rewrites: [{ source: '/((?!api/).*)', destination: '/index.html' }],
  },
  plugins: [react(), vercel(), devApiPlugin()],
});
