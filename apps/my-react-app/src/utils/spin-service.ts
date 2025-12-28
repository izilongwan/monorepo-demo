type Listener = (active: boolean, count: number) => void;

class SpinServiceImpl {
	private count = 0;
	private active = false;
	private listeners = new Set<Listener>();

	private notify() {
		for (const cb of this.listeners) cb(this.active, this.count);
	}

	subscribe(cb: Listener): () => void {
		this.listeners.add(cb);
		// 立即推送当前状态
		cb(this.active, this.count);
		return () => this.listeners.delete(cb);
	}

	show() {
		this.count += 1;
		if (!this.active) {
			this.active = true;
		}
		this.notify();
	}

	hide() {
		this.count = Math.max(0, this.count - 1);
		if (this.count === 0) {
			this.active = false;
		}
		this.notify();
	}

	reset() {
		this.count = 0;
		this.active = false;
		this.notify();
	}

	getState() {
		return { active: this.active, count: this.count };
	}
}

export const SpinService = new SpinServiceImpl();
