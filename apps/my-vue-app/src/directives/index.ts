import type { App, Directive } from 'vue';

const modules = import.meta.glob<{
	default: Directive;
}>('./*.ts', { eager: true });

export default {
	install(app: App<Element>) {
		Object.entries(modules).forEach(([path, mod]) => {
			if (!mod?.default) return;

			// 根据文件名生成指令名：my-if.ts -> my-if
			const match = path.match(/\.\/(.+)\.ts$/);
			if (!match) return;

			const name = match[1];
			if (!name || name === 'index') return;

			app.directive(name, mod.default);
		});
	}
};
