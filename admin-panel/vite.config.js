// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Terminal from 'vite-plugin-terminal';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      Terminal({
        console: 'terminal',
        output: ['terminal', 'console']
      })
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    define: {
      'process.env': env
    },

    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
      allowedHosts: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, '/api')
        }
      }
    },

    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      cssCodeSplit: true,
      minify: 'esbuild',

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'react-vendor';
              if (id.includes('axios')) return 'axios';
              if (id.includes('socket.io')) return 'socket';
              return 'vendor';
            }
          }
        }
      }
    },

    preview: {
      port: 3002,
      host: '0.0.0.0',
      strictPort: true
    }
  };
});
