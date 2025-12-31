import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		base: env.VITE_BASE_URL || './',
		plugins: [react()],
		build: {
			outDir: 'dist',
			entry: './src/main.tsx',
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
				'@': resolve(__dirname, './src')
			}
		},
		server: {
			host: '0.0.0.0',
			port: 5432,
			strictPort: true,
			cors: true,
			hmr: {
				protocol: 'wss',
				host: 'nima.cc.cd',
				clientPort: 443
			},
			// 临时注释 HTTPS 配置以便用 HTTP 测试
			https: {
				key: readFileSync(env.FRP_CERT_KEY_PATH),
				cert: readFileSync(env.FRP_CERT_PATH)
			},
			proxy: {
				'/api': {
					target: 'https://localhost:9000',
					changeOrigin: true,
					secure: false,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		}
	};
});
