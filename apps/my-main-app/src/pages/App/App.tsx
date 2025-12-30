import JumpButtons from '@/components/JumpButtons';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { start } from 'qiankun';
import { subAppPaths } from '@/router';
import styles from './app.module.css';

export default () => {
	const location = useLocation();
	const isMicroApp = subAppPaths.some((path) =>
		location.pathname.startsWith(`/${path}`)
	);

	useEffect(() => {
		start({
			sandbox: { experimentalStyleIsolation: true }
		});
	}, []);

	return (
		<div className="tw-w-full tw-h-full tw-overflow-y-auto tw-flex">
			<JumpButtons />
			<div className="tw-flex-1 tw-h-full tw-overflow-y-auto tw-p-4">
				<div
					id="subapp-container"
					style={{ display: isMicroApp ? 'block' : 'none' }}
					className={styles['subapp-container']}>
					<div id="subapp"></div>
				</div>
				{!isMicroApp && <Outlet />}
			</div>
		</div>
	);
};
