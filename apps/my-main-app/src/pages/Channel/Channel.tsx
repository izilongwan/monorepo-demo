import {
	onGlobalStateChange,
	QiankunStore,
	setGlobalState
} from '@/stores/qiankun';
import { useEffect, useState } from 'react';

// ... useQiankunState Hook 保持不变 ...
const useQiankunState = () => {
	const [info, setInfo] = useState<QiankunStore>({} as QiankunStore);

	useEffect(() => {
		onGlobalStateChange((state) => {
			console.log('Channel sub app - global state changed:', state);
			setInfo(state as QiankunStore);
		}, true);
	}, []);

	const updateState = (newState: Partial<QiankunStore>) => {
		setGlobalState({ ...info, ...newState });
	};

	return [info, updateState] as const;
};

export default () => {
	const [state, updateState] = useQiankunState();
	const [inputValue, setInputValue] = useState(
		'Set new info from channel sub app'
	);

	// ✅ 按钮配置数组
	const actions = [
		{
			label: 'Update Info Text',
			onClick: () => {
				updateState({ info: inputValue });
				setInputValue('');
			},
			className:
				'tw-bg-yellow-100 tw-text-yellow-800 tw-border-yellow-200 hover:tw-bg-yellow-200'
		},
		{
			label: 'Increase Count',
			onClick: () => updateState({ count: (state.count || 0) + 1 }),
			className:
				'tw-bg-pink-500 tw-text-white hover:tw-bg-pink-600 tw-shadow-sm tw-border-transparent'
		},
		{
			label: 'Update Timestamp',
			onClick: () => updateState({ now: new Date().toLocaleString() }),
			className:
				'tw-bg-blue-100 tw-text-blue-800 tw-border-blue-200 hover:tw-bg-blue-200'
		}
	];

	return (
		<div className="tw-p-6 tw-max-w-4xl tw-mx-auto">
			<h1 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-gray-800">
				Channel Page
			</h1>

			{/* 信息展示区域保持不变 */}
			<div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6 tw-mb-8 tw-border tw-border-gray-100">
				<h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-gray-700">
					Global State Info
				</h2>
				<div className="tw-space-y-2">
					{Object.entries(state).map(([key, value]) => (
						<div
							key={key}
							className="tw-flex tw-items-start tw-border-b tw-border-gray-50 tw-pb-2 last:tw-border-0">
							<span className="tw-font-medium tw-text-gray-600 tw-w-24 tw-shrink-0">
								{key}:
							</span>
							<span className="tw-text-gray-800 tw-break-all tw-font-mono tw-text-sm">
								{JSON.stringify(value)}
							</span>
						</div>
					))}
					{Object.keys(state).length === 0 && (
						<p className="tw-text-gray-400 tw-italic">
							No global state data available.
						</p>
					)}
				</div>
			</div>

			{/* 操作区域 */}
			<div className="tw-bg-gray-50 tw-rounded-lg tw-p-6 tw-border tw-border-gray-200">
				<h2 className="tw-text-lg tw-font-semibold tw-mb-4 tw-text-gray-700">
					Update State
				</h2>

				<div className="tw-mb-4">
					<textarea
						className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-p-3 tw-focus:tw-ring-2 tw-focus:tw-ring-blue-500 tw-focus:tw-border-transparent tw-outline-none tw-transition-all"
						placeholder="Type something to update info..."
						value={inputValue}
						rows={3}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</div>

				<div className="tw-flex tw-flex-wrap tw-gap-3">
					{/* ✅ 使用 map 渲染按钮 */}
					{actions.map((action, index) => (
						<button
							key={index}
							className={`tw-px-3 tw-py-1 tw-rounded-md tw-border tw-transition-colors tw-font-medium ${action.className}`}
							onClick={action.onClick}>
							{action.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
