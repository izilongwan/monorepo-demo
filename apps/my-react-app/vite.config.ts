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
  build: {
    outDir: 'dist',
    entry: './src/main.tsx',
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        globals: {
          // 如果有外部依赖，在这里添加全局变量名称
        },
      },
    },
  },
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
