import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The ArcGIS Maps SDK alone is over 1 MB. Its chunk size is expected, so the default 500 kB warning is raised.
    chunkSizeWarningLimit: 1500,
  },
  server: {
    // The API runs on http://localhost:5080 and has no CORS setup, so the dev server proxies /api to it.
    proxy: { '/api': 'http://localhost:5080' },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
