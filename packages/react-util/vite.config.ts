import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'index',
			formats: ['es', 'cjs', 'umd'],
			name: 'ReactUtil',
			fileName: (format) => `react-util.${format}.js`
		},
		outDir: 'dist',
		rollupOptions: {
			external: ['react', 'react-dom'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM'
				}
			}
		}
	}
});
