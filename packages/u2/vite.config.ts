import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index',
      formats: ['es', 'cjs', 'umd'],
      name: 'U2Lib',
      fileName: (format) => `u2.${ format }.js`,
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
