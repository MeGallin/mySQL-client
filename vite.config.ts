import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('origin', 'http://localhost:5173');
            proxyReq.setHeader('x-requested-with', 'XMLHttpRequest');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const sc = proxyRes.headers['set-cookie'];
            if (sc) {
              proxyRes.headers['set-cookie'] = sc.map((cookie) =>
                cookie
                  .replace(/SameSite=\w+/, 'SameSite=lax')
                  .replace(/Secure;?\s*/, '')
                  .replace(/Domain=\w+/, 'Domain=localhost'),
              );
            }
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
});
