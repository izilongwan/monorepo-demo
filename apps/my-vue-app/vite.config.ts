import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import qiankun from 'vite-plugin-qiankun';
import { readFileSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		base: env.VITE_APP_BASE_URL || './',
		plugins: [vue(), qiankun('my-vue-app', { useDevMode: true })],
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
		server: {
			host: '0.0.0.0',
			port: 5174, // ✅ 必须显式指定端口，与主应用配置一致
			strictPort: true, // 端口被占用时直接退出，避免自动切换导致主应用连不上
			cors: true, // ✅ 允许跨域,
			https: {
				key: readFileSync(env.FRP_CERT_KEY_PATH),
				cert: readFileSync(env.FRP_CERT_PATH)
			},
			hmr: {
				protocol: 'wss',
				host: 'nima.cc.cd',
				clientPort: 443
			}
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, './src')
			}
		}
	};
});
