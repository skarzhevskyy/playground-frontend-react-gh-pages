import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.GITHUB_PAGES ? '/playground-frontend-react-gh-pages/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist'
  }
});
