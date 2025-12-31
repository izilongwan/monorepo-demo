import { SpinService } from '@/utils/spin-service';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';

export default function GlobalSpin() {
	const [active, setActive] = useState(false);

	useEffect(() => {
		const unsub = SpinService.subscribe((isActive) => {
			setActive(isActive);
		});
		return () => unsub();
	}, []);

	if (!active) return null;

	return (
		<div className="tw-absolute tw-inset-0 tw-z-[9999] tw-bg-black/20 tw-flex tw-items-center tw-justify-center">
			<Spin size="large" tip="加载中..." />
		</div>
	);
}
