import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import type { ConfigEnv, PluginOption } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig(({ mode }: ConfigEnv) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			react(),
			qiankun('my-react-app', { useDevMode: true })
		] as PluginOption[],
		build: {
			outDir: 'dist',
			entry: resolve(__dirname, './src/main.ts'),
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
		},
		server: {
			// 允许通过 IPv4/局域网访问（修复仅绑定到 ::1 导致 127.0.0.1 无法访问）
			host: '0.0.0.0',
			port: 5173,
			strictPort: true,
			cors: true,
			hmr: {
				protocol: 'wss',
				host: 'nima.cc.cd',
				clientPort: 443
			},
			https: {
				key: readFileSync(env.FRP_CERT_KEY_PATH),
				cert: readFileSync(env.FRP_CERT_PATH)
			},
			proxy: {
				'/api': {
					target: 'https://localhost:9000',
					changeOrigin: true,
					secure: false,
					rewrite: (path: string) => path.replace(/^\/api/, '')
				}
			}
		}
	};
});
