import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify:        true,
    cssMinify:     true,
    rollupOptions: {
      output: {
        manualChunks: {
          framer:   ['framer-motion'],
          gauge:    ['react-gauge-chart'],
          tailwind: ['@material-tailwind/react'],
        },
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
});
