import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'index',
			formats: ['es', 'cjs', 'umd'],
			name: 'U1Lib',
			fileName: (format) => `u1.${format}.js`
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
