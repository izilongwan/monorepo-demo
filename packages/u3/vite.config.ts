import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index',
      formats: ['es', 'cjs', 'umd'],
      name: 'U3Lib',
      fileName: (format) => `u3.${ format }.js`,
    },
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        globals: {
        },
      },
    },
  },
});
