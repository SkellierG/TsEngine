import { defineConfig } from 'vite';
import fs from 'vite-plugin-fs';

export default defineConfig({
  assetsInclude: "**/*.html",
  build: {
    ssr: false,
  },
  server: {
    port: 3000,
  },
  plugins: [
    fs()
  ],
});

//plugins: [staticPlugin()]