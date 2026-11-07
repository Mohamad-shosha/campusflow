import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        app: resolve(import.meta.dirname, 'app.html'),
        showcase: resolve(import.meta.dirname, 'showcase.html'),
        presentation: resolve(import.meta.dirname, 'presentation.html'),
      },
    },
  },
});
