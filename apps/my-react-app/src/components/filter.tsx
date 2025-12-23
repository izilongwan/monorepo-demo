import { formatMapToUnderline } from '@/utils/tool';
import {
	ClearOutlined,
	FilterOutlined,
	SearchOutlined
} from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';

export interface FilterConfig {
	placeholder: string;
	dataIndex?: string;
	getValue?: (record: any) => string | number;
	/**
	 * 枚举选项；提供该字段时直接使用 Table filters 选项
	 */
	enumOptions?: Array<{ label: string; value: string | number }>;
}

export interface SortConfig {
	dataIndex: string;
	sortFn?: (a: any, b: any, direction?: 'ascend' | 'descend') => any;
}

/**
 * 创建搜索过滤的下拉框内容
 */
export const createFilterDropdown = (config: FilterConfig) => {
	return ({
		setSelectedKeys,
		selectedKeys,
		confirm,
		clearFilters
	}: FilterDropdownProps) => (
		<div style={{ padding: 8 }}>
			<Input
				placeholder={config.placeholder}
				value={selectedKeys[0]}
				onChange={(e) =>
					setSelectedKeys(e.target.value ? [e.target.value] : [])
				}
				onPressEnter={() => {
					confirm();
				}}
				allowClear
				style={{ width: 200, marginBottom: 8, display: 'block' }}
			/>
			<Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<Button
					type="primary"
					icon={<SearchOutlined />}
					onClick={() => {
						confirm();
					}}
					size="small">
					搜索
				</Button>
				<Button
					icon={<ClearOutlined />}
					onClick={() => {
						clearFilters && clearFilters();
					}}
					size="small">
					重置
				</Button>
			</Space>
		</div>
	);
};

/**
 * 创建搜索过滤函数
 */
export const createFilterFn = (
	dataIndex: string,
	getValue?: (record: any) => string
) => {
	return (value: any, record: any) => {
		const fieldValue = getValue ? getValue(record) : record[dataIndex];
		return (
			fieldValue &&
			fieldValue
				.toString()
				.toLowerCase()
				.includes(value.toString().toLowerCase())
		);
	};
};

/**
 * 高级筛选函数：支持枚举精确匹配或文本包含
 */
export const createFilterFnAdvanced = (filterConfig: FilterConfig) => {
	const { dataIndex = '', getValue, enumOptions } = filterConfig;
	return (value: any, record: any) => {
		const fieldValue = getValue ? getValue(record) : record[dataIndex];
		if (enumOptions && enumOptions.length) {
			// 枚举筛选：精确匹配
			return String(fieldValue) === String(value);
		}
		if (!fieldValue) return false;
		// 文本筛选：包含匹配（不区分大小写）
		return String(fieldValue)
			.toLowerCase()
			.includes(String(value).toLowerCase());
	};
};

/**
 * 创建自定义搜索过滤函数（支持事件回调）
 */
export interface CustomFilterOptions {
	filterFn: (value: any, record: any) => boolean;
	onFilter?: (value: any, dataIndex: string) => void;
}

export const createCustomFilter = (options: CustomFilterOptions) => {
	return (value: any, record: any) => {
		const result = options.filterFn(value, record);
		if (result && options.onFilter) {
			options.onFilter(value, record.dataIndex || '');
		}
		return result;
	};
};

/**
 * 创建过滤图标渲染函数
 */
export const createFilterIcon =
	(isSearch = true) =>
	(filtered: boolean) =>
		isSearch ? (
			<SearchOutlined
				style={{
					color: filtered ? '#1890ff' : 'rgba(0, 0, 0, 0.45)',
					fontSize: '14px',
					lineHeight: 1
				}}
			/>
		) : (
			<FilterOutlined
				style={{
					color: filtered ? '#1890ff' : 'rgba(0, 0, 0, 0.45)',
					fontSize: '14px',
					lineHeight: 1
				}}
			/>
		);

/**
 * 创建时间排序函数
 * @param config - 排序配置，可以是字符串(dataIndex) 或 SortConfig 对象
 * @returns 排序函数
 */
export const createDateSorter = (config: string | SortConfig) => {
	const dataIndex = typeof config === 'string' ? config : config.dataIndex;
	const customSortFn = typeof config === 'object' ? config.sortFn : undefined;

	return (a: any, b: any) => {
		if (customSortFn) {
			return customSortFn(a, b);
		}
		return new Date(a[dataIndex]).getTime() - new Date(b[dataIndex]).getTime();
	};
};

/**
 * 为列配置添加搜索和排序功能
 */
export const withSearchAndSort = (
	columnConfig: any,
	options: {
		searchable?: boolean;
		searchPlaceholder?: string;
		sortable?: boolean;
		filterConfig?: FilterConfig;
	}
) => {
	const config = { ...columnConfig };

	if (options.searchable && options.filterConfig) {
		if (options.filterConfig.enumOptions?.length) {
			config.filters = options.filterConfig.enumOptions;
			config.filterMultiple = false;
			config.onFilter = createFilterFnAdvanced(options.filterConfig);
			config.filterIcon = createFilterIcon(false);
		} else {
			config.filterDropdown = createFilterDropdown(options.filterConfig);
			config.onFilter = createFilterFnAdvanced(options.filterConfig);
			config.filterIcon = createFilterIcon();
		}
	}

	config.sorter = true;
	config.sortDirections = ['ascend', 'descend'];

	return config;
};

/**
 * 在 Table onChange 中解析排序信息
 * @example
 * const handleTableChange = (pagination, filters, sorter) => {
 *   const sortInfo = parseSortInfo(sorter);
 *   console.log(sortInfo); // { field: 'createTime', order: 'ascend' | 'descend' | null }
 * };
 */
export const parseSortInfo = (sorter: any) => {
	if (!sorter || Array.isArray(sorter)) {
		return formatMapToUnderline({ orderBy: null, orderType: null });
	}

	const direction = sorter.order as 'ascend' | 'descend' | undefined;
	let orderType = '';

	if (direction) {
		orderType = direction === 'ascend' ? 'ASC' : 'DESC';
	}

	return formatMapToUnderline({
		orderBy: (sorter.field || sorter.columnKey || '')
			.replace(/([A-Z])/g, '_$1')
			.toLowerCase(),
		orderType
	});
};
