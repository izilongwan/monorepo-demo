import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    // autoImport({
    //   imports: [
    //     'react',
    //     'react/router',
    //   ],
    //   dts: true,
    //   resolvers: [AntdResolver()],
    // }),
    // componentAutoImport({ resolvers: [AntdResolver()] })
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    https: {
      key: readFileSync('./certs/key.pem'),
      cert: readFileSync('./certs/cert.pem'),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:9000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
