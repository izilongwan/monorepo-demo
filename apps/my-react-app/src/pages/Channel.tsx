import { useGlobalStore } from '@/stores/global';
import {
	Button,
	Card,
	Divider,
	InputNumber,
	message,
	Space,
	Typography
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useMemo, useState } from 'react';

export default () => {
	const { updateGlobalState, globalState: state = {} } = useGlobalStore();
	const [countValue, setCountValue] = useState<number | null>(null);
	const [infoValue, setInfoValue] = useState('');

	const formattedState = useMemo(() => JSON.stringify(state, null, 4), [state]);

	const handleCountUpdate = () => {
		if (countValue === null || Number.isNaN(countValue)) {
			message.warning('Please enter a valid count before updating.');
			return;
		}

		updateGlobalState({ count: countValue });
		setCountValue(null);
	};

	const handleInfoUpdate = () => {
		if (!infoValue.trim()) {
			message.warning('Info cannot be empty.');
			return;
		}

		updateGlobalState({ info: infoValue.trim() });
		setInfoValue('');
	};

	const btns = [
		{
			type: 'primary',
			text: 'Update Count',
			action: handleCountUpdate
		},
		{ type: 'dashed', text: 'Update Info', action: handleInfoUpdate }
	];

	return (
		<section className="tw-space-y-4">
			<Typography.Title level={4}>Channel Page - React App</Typography.Title>

			<Card className="tw-px-4 tw-py-3 tw-bg-slate-50">
				<Typography.Paragraph className="tw-mb-2">
					当前 Global State
				</Typography.Paragraph>
				<pre className="tw-text-xs tw-overflow-x-auto">{formattedState}</pre>
			</Card>

			<Card className="tw-flex tw-flex-col tw-gap-3">
				<Space direction="vertical" size="middle" className="tw-w-full">
					<InputNumber
						style={{ width: '220px' }}
						placeholder="Type new count"
						value={countValue}
						onChange={(value) => setCountValue(value)}
					/>
					<TextArea
						rows={4}
						value={infoValue}
						onChange={(event) => setInfoValue(event.target.value)}
						placeholder="Type new info"
					/>
				</Space>

				<Space className="tw-mt-2">
					{btns.map((btn) => (
						<Button key={btn.text} type={btn.type as any} onClick={btn.action}>
							{btn.text}
						</Button>
					))}
				</Space>
			</Card>
		</section>
	);
};
