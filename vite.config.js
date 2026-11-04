import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        app: resolve(import.meta.dirname, 'app.html'),
        showcase: resolve(import.meta.dirname, 'legacy/showcase.html'),
        presentation: resolve(import.meta.dirname, 'legacy/presentation.html'),
      },
    },
  },
});
