/// <reference types="vitest" />
import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import vercel from 'vite-plugin-vercel';

import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    root: path.resolve(__dirname, './src'),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'vercel-vendor': ['@vercel/analytics/react', '@vercel/speed-insights'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Adjust if necessary
  },
  plugins: [
    react(),
    vercel(),
    VitePWA({
      manifest,
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      // switch to "true" to enable sw on development
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
      },
    }),
  ],
});
