import { minus } from '@monorepo-demo/u2';
import { minus as m2 } from '@monorepo-demo/u3';

export { minus, m2 };

export function add(a: number) {
  return a + 20;
}

export function chain(num: number) {
  const queue: Function[] = [];

  const proxy: Record<string, any> = new Proxy({}, {
    get(_: any, prop: string) {
      if (prop === 'end') {
        return queue.reduce((acc, fn) => fn(acc), num);
      }

      const fn = fnMap[prop as keyof typeof fnMap];

      fn && queue.push(fn);
      return proxy;
    },
  });

  return proxy;
}

const fnMap = { add, minus };

const r = chain(90).add.minus.end; // 120

console.log(r);
