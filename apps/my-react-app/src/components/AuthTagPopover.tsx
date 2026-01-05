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
				<div className="tw-max-h-80 tw-overflow-y-auto tw-flex tw-flex-col tw-gap-1.5">
					<span className="tw-text-gray-500 tw-text-xs tw-sticky tw-top-0 tw-bg-white tw-z-50 tw-text-right">
						共 {auths.length} 个
					</span>
					{auths.map((auth) => (
						<div key={auth.id}>
							<Tag title={auth.description} color={auth.color}>
								{auth.name}
							</Tag>
							{auth.type && (
								<span className="tw-ml-2 tw-text-gray-500 tw-text-xs">
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
