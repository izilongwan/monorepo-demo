import { useEffect, useRef, useState } from 'react';

export function useObserveDom<T extends HTMLElement = any>(
	callback?: () => void
) {
	const containerRef = useRef<T>(null);
	const [key, setKey] = useState(1);

	useEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			setKey((prev) => -prev);
			callback && callback();
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => resizeObserver.disconnect();
	}, []);

	return { containerRef, key };
}
