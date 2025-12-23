import { SortOrder } from 'antd/es/table/interface';

export const TABLE_COLUMN_MAP = {
	CREATE_TIME: {
		title: '创建时间',
		dataIndex: 'createTime',
		key: 'createTime',
		ellipsis: true,
		width: 180,
		sorter: true,
		sortDirections: ['descend', 'ascend'] as SortOrder[]
	},
	UPDATE_TIME: {
		title: '更新时间',
		dataIndex: 'updateTime',
		key: 'updateTime',
		ellipsis: true,
		width: 180,
		sorter: true,
		sortDirections: ['descend', 'ascend'] as SortOrder[]
	}
};
