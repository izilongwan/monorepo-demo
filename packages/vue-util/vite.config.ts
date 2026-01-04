import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'index',
			formats: ['es', 'cjs', 'umd'],
			name: 'VueUtilLib',
			fileName: (format) => `vue-util.${format}.js`
		},
		outDir: 'dist',
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
});
