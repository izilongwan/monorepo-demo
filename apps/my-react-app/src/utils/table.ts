import { createFilterDropdown, createFilterIcon } from '@/components/filter';
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
	},
	CREATE_USER: {
		title: '创建人',
		dataIndex: 'createUser',
		key: 'createUser',
		ellipsis: true,
		width: 150
		// filterDropdown: createFilterDropdown({
		// 	placeholder: '搜索创建人'
		// }),
		// filterIcon: createFilterIcon()
	},
	UPDATE_USER: {
		title: '更新人',
		dataIndex: 'updateUser',
		key: 'updateUser',
		ellipsis: true,
		width: 150
		// filterDropdown: createFilterDropdown({
		// 	placeholder: '搜索更新人'
		// }),
		// filterIcon: createFilterIcon()
	}
};
