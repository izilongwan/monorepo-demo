import { Popover, Tag } from 'antd';

export interface AuthTagPopoverProps {
	auths: {
		description: string;
		name: string;
		id: number;
		color?: string;
		type?: string;
	}[];
	showMaxCount?: number;
}

export default function AuthTagPopover(props: AuthTagPopoverProps) {
	const { auths, showMaxCount = 3 } = props;

	return (
		<Popover
			content={
				<div
					style={{
						maxHeight: 300,
						overflowY: 'auto',
						display: 'flex',
						flexDirection: 'column',
						gap: 6
					}}>
					<span
						style={{
							color: '#999',
							fontSize: 12,
							position: 'sticky',
							top: 0,
							background: '#fff',
							zIndex: 99,
							textAlign: 'right'
						}}>
						{' '}
						共 {auths.length} 条
					</span>
					{auths.map((auth) => (
						<div key={auth.id}>
							<Tag title={auth.description} color={auth.color}>
								{auth.name}
							</Tag>
							{auth.type && (
								<span style={{ marginLeft: 8, color: '#999', fontSize: 12 }}>
									[{auth.type}]
								</span>
							)}
						</div>
					))}
				</div>
			}
			trigger="hover">
			<>
				{auths.slice(0, showMaxCount).map((auth) => (
					<Tag key={auth.id} title={auth.description} color={auth.color}>
						{auth.name}
					</Tag>
				))}
				{auths.length > showMaxCount && (
					<Tag color="default">+{auths.length - showMaxCount}</Tag>
				)}
			</>
		</Popover>
	);
}
