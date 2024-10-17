import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: './node_modules/.vite',
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
