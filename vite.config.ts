import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  envPrefix: 'VITE_',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        proxyTimeout: 10000,
        ws: false,
        rewrite: (path) => path, // Don't rewrite the path
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('❌ Vite Proxy Error:', err.message);
            console.error('💡 Solution: Make sure backend server is running on port 3001');
            console.error('💡 Try running: npm run dev:full');
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`🔄 Proxying: ${req.method} ${req.url} → http://localhost:3001`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(`✅ Backend Response: ${proxyRes.statusCode} for ${req.url}`);
          });
        },
      }
    }
  }
});
