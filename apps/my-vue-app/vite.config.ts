import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		entry: './src/main.ts',
		outDir: 'dist',
		rollupOptions: {
			// 确保外部化处理那些你不想打包进库的依赖
			external: [],
			output: {
				globals: {
					// 如果有外部依赖，在这里添加全局变量名称
				}
			}
		}
	},
	resolve: {
		alias: {
			'@': '/src'
		}
	}
});
