import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'index',
			formats: ['es', 'cjs', 'umd'],
			name: 'UtilLib',
			fileName: (format) => `util.${format}.js`
		},
		outDir: 'dist',
		rollupOptions: {
			external: [],
			output: {
				globals: {
					'@monorepo-demo/u2': 'U2Lib'
				}
			}
		}
	}
});
