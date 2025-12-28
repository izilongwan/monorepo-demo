import {
	addApiCode,
	deleteApiCode,
	getApiCodePageList2,
	updateApiCode
} from '@/apis/apicode';
import { createFilterDropdown, createFilterIcon } from '@/components/Filter';
import { useUserStore } from '@/stores';
import { API_CODE_STATE } from '@/types/apicode';
import { ApiCode } from '@/types/apicode.d';
import { CommonObjectType } from '@/types/common';
import { USER_AUTHORITITY } from '@/types/user-auth';
import {
	API_CODE_SQL_TYPE_OPTIONS,
	API_CODE_STATE_MAP,
	API_CODE_STATE_OPTIONS,
	INITIAL_PAGINATION,
	OUTPUT_OPTIONS
} from '@/utils/const';
import { TABLE_COLUMN_MAP } from '@/utils/table';
import {
	formatListWithIndex,
	formatTableFilter,
	noAuthTip
} from '@/utils/tool';
import {
	CloudDownloadOutlined,
	CloudUploadOutlined,
	DeleteOutlined,
	EditOutlined,
	PlusOutlined
} from '@ant-design/icons';
import {
	Button,
	Form,
	Input,
	message,
	Modal,
	Radio,
	Space,
	Switch,
	Table,
	Tag
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useState } from 'react';

export default function ApiCodePage() {
	const [data, setData] = useState<ApiCode[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<ApiCode | null>(null);
	const [pagination, setPagination] =
		useState<TablePaginationConfig>(INITIAL_PAGINATION);

	const [filterObj, setFilterObj] = useState<CommonObjectType>({});

	const user = useUserStore((state) => state.user);

	const hasApiCreateAuth = user?.authorities.includes(
		USER_AUTHORITITY['API_CODE:CREATE']
	);
	const hasPublishAuth = user?.authorities.includes(
		editingRecord?.publishAuth!
	);

	const [form] = Form.useForm();

	// 获取数据，支持分页
	const fetchData = (param = {}) => {
		setLoading(true);
		const { current, pageSize } = pagination;

		getApiCodePageList2(current!, pageSize!, {
			param: { __filter: filterObj, ...param }
		})
			.promise.then((response) => {
				setData(formatListWithIndex(response?.records, current, pageSize));
				setPagination((prev) => ({
					...prev,
					total: response.total || 0
				}));
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(fetchData, [pagination.current, pagination.pageSize, filterObj]);

	useEffect(freshData, [pagination.pageSize]);

	function freshData(param = {}) {
		if (pagination.current !== INITIAL_PAGINATION.current) {
			setPagination((prev) => ({
				...prev,
				current: INITIAL_PAGINATION.current
			}));
			return;
		}
		fetchData(param);
	}

	// 打开编辑模态框
	const handleEdit = (record: ApiCode) => {
		const { id, apiCode, output, apiSql, state } = record;
		setEditingRecord({ ...record });
		form.setFieldsValue({ id, apiCode, output, apiSql, state });
		setIsModalVisible(true);
	};

	// 打开新增模态框
	const handleAdd = () => {
		const data = { output: OUTPUT_OPTIONS[1].value } as ApiCode;
		setEditingRecord(data);
		form.resetFields();
		form.setFieldsValue(data);
		setIsModalVisible(true);
	};

	// 保存数据
	const handleSave = async () => {
		try {
			editingRecord!.editLoading = true;
			setEditingRecord({ ...editingRecord! });
			const values = await form.validateFields();
			const fn = editingRecord?.id ? updateApiCode : addApiCode;
			const newRecord = { ...values, id: editingRecord?.id };
			const updated = await fn(newRecord).promise;
			const messageText = editingRecord?.id ? '更新成功' : '新增成功';

			if (updated) {
				message.success(messageText);
				freshData({ now: Date.now() });
				setIsModalVisible(false);
			}
		} finally {
			if (editingRecord) {
				editingRecord.editLoading = false;
				setEditingRecord({ ...editingRecord });
			}
		}
	};

	async function handlePublishToggle(record: ApiCode): Promise<void> {
		const newState =
			record.state === API_CODE_STATE.PUBLISH
				? API_CODE_STATE.UNPUBLISH
				: API_CODE_STATE.PUBLISH;

		record.fetchLoading = true;
		setData([...data]);
		const { id, apiCode, output, apiSql } = record;
		const isOk = await updateApiCode({
			id,
			apiCode,
			output,
			apiSql,
			state: newState
		}).promise;
		if (isOk) {
			record.state = newState;
			message.info(API_CODE_STATE_MAP[newState] + '成功');
			freshData({ now: Date.now() });
		}
		record.fetchLoading = false;
		setData([...data]);
	}

	// 删除数据
	const handleDelete = (record: ApiCode) => {
		Modal.confirm({
			title: '确认删除',
			content: `确定要删除 ${record.apiCode} 吗？`,
			okText: '确定',
			cancelText: '取消',
			onOk() {
				record.deleteLoading = true;
				setData([...data]);

				deleteApiCode([record.id])
					.promise.then((isOk) => {
						if (isOk) {
							freshData();
							message.success('删除成功');
						} else {
							message.error('删除失败');
						}
					})
					.finally(() => {
						record.deleteLoading = false;
						setData([...data]);
					});
			}
		});
	};

	const columns: ColumnsType<ApiCode> = [
		{
			title: '#',
			dataIndex: 'index',
			key: 'index',
			width: 60,
			fixed: 'left'
		},
		{
			title: 'API Code',
			dataIndex: 'apiCode',
			key: 'apiCode',
			width: 220,
			fixed: 'left',
			ellipsis: true,
			filterDropdown: createFilterDropdown({
				placeholder: '搜索 API Code'
			}),
			filterIcon: createFilterIcon()
		},
		{
			title: 'API SQL类型',
			dataIndex: 'apiSqlType',
			key: 'apiSqlType',
			width: 120,
			ellipsis: true,
			filters: API_CODE_SQL_TYPE_OPTIONS,
			filterMultiple: false,
			render: (type) =>
				type && <Tag className="tw-border-dashed">{type?.toUpperCase()}</Tag>
		},
		{
			title: 'API SQL',
			dataIndex: 'apiSql',
			key: 'apiSql',
			ellipsis: true,
			width: 120
		},
		{
			title: '状态',
			dataIndex: 'state',
			key: 'state',
			width: 80,
			filterMultiple: false,
			filters: API_CODE_STATE_OPTIONS,
			render: (state: API_CODE_STATE) => (
				<Tag
					bordered={false}
					color={state === API_CODE_STATE.PUBLISH ? 'green' : 'red'}>
					{API_CODE_STATE_MAP[state]}
				</Tag>
			)
		},
		{
			title: '输出',
			dataIndex: 'output',
			key: 'output',
			width: 150,
			filters: OUTPUT_OPTIONS.map(({ label, value }) => ({
				text: value,
				value
			})),
			filterMultiple: false
		},
		TABLE_COLUMN_MAP.CREATE_USER,
		TABLE_COLUMN_MAP.UPDATE_USER,
		TABLE_COLUMN_MAP.CREATE_TIME,
		TABLE_COLUMN_MAP.UPDATE_TIME,
		{
			title: '操作',
			key: 'action',
			width: 250,
			fixed: 'right',
			render: (_, record) => {
				const authorities = user?.authorities || [];
				const isCreator = user?.loginUsername === record.createUser;
				const hasAuth = (auth: USER_AUTHORITITY) => authorities.includes(auth);
				const hasApiUpdateAuth =
					isCreator ||
					[record.updateAuth, USER_AUTHORITITY['API_CODE:UPDATE']].some(
						hasAuth
					);
				const hasApiDeleteAuth =
					isCreator ||
					[record.deleteAuth, USER_AUTHORITITY['API_CODE:DELETE']].some(
						hasAuth
					);
				const hasPublishAuth = [
					record.publishAuth,
					USER_AUTHORITITY['API_CODE:PUBLISH']
				].some(hasAuth);
				return (
					<Space>
						<Button
							type="text"
							size="small"
							icon={<EditOutlined />}
							disabled={!hasApiUpdateAuth}
							title={
								hasApiUpdateAuth
									? '编辑'
									: noAuthTip(USER_AUTHORITITY['API_CODE:UPDATE'])
							}
							loading={record.editLoading}
							onClick={() => handleEdit(record)}>
							编辑
						</Button>
						<Button
							type="text"
							size="small"
							loading={record.fetchLoading}
							disabled={!hasPublishAuth}
							color={
								record.state === API_CODE_STATE.PUBLISH ? 'pink' : undefined
							}
							icon={
								record.state === API_CODE_STATE.PUBLISH ? (
									<CloudDownloadOutlined
										className={hasPublishAuth ? 'tw-text-[#ffa807ff]' : ''}
									/>
								) : (
									<CloudUploadOutlined
										className={hasPublishAuth ? 'tw-text-[#52c41aff]' : ''}
									/>
								)
							}
							onClick={() => handlePublishToggle(record)}>
							{record.state === API_CODE_STATE.PUBLISH ? (
							<span
								className={hasPublishAuth ? 'tw-text-[#ffa807ff]' : ''}>
									{API_CODE_STATE_MAP[API_CODE_STATE.UNPUBLISH]}
								</span>
							) : (
							<span
								className={hasPublishAuth ? 'tw-text-[#52c41aff]' : ''}>
									{API_CODE_STATE_MAP[API_CODE_STATE.PUBLISH]}
								</span>
							)}
						</Button>
						<Button
							type="text"
							danger
							size="small"
							loading={record.deleteLoading}
							icon={<DeleteOutlined />}
							disabled={!hasApiDeleteAuth}
							title={
								hasApiDeleteAuth
									? '删除'
									: noAuthTip(USER_AUTHORITITY['API_CODE:DELETE'])
							}
							onClick={() => handleDelete(record)}>
							删除
						</Button>
					</Space>
				);
			}
		}
	];

	const handleTableChange = (
		pagination: TablePaginationConfig,
		filters: CommonObjectType,
		sorter: CommonObjectType
	) => {
		setPagination((prev) => ({
			...prev,
			current: pagination.current,
			pageSize: pagination.pageSize
		}));
		setFilterObj(formatTableFilter(filters));
	};

	return (
		<div className="tw-px-5">
			<div className="tw-mb-4">
				<Button
					disabled={!hasApiCreateAuth}
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleAdd}>
					新增 API
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				loading={loading}
				pagination={pagination}
				onChange={handleTableChange}
				scroll={{ x: 1200, y: 'calc(100vh - 328px)' }}
			/>

			<Modal
				title={editingRecord?.id ? '编辑 API' : '新增 API'}
				open={isModalVisible}
				onOk={handleSave}
				confirmLoading={editingRecord?.editLoading}
				onCancel={() => setIsModalVisible(false)}
				width={600}>
				<Form form={form} layout="vertical" requiredMark="optional">
					<Form.Item
						label="API Code"
						name="apiCode"
						rules={[{ required: true, message: '请输入 API Code' }]}>
						<Input placeholder="e.g., GET_USER" />
					</Form.Item>

					<Form.Item
						label="API SQL"
						name="apiSql"
						rules={[{ required: true, message: '请输入 API SQL' }]}>
						<Input.TextArea rows={10} placeholder="输入 SQL 语句" />
					</Form.Item>

					<Form.Item
						label="输出"
						name="output"
						rules={[{ required: true, message: '请输入输出' }]}>
						<Radio.Group>
							{OUTPUT_OPTIONS.map((option) => (
								<Radio
									key={option.value}
									value={option.value}
									title={option.label}>
									{option.value}
								</Radio>
							))}
						</Radio.Group>
					</Form.Item>

					{editingRecord?.id && (
						<Form.Item
							label="状态"
							name="state"
							rules={[{ required: true, message: '请选择状态' }]}>
							<Switch
								checkedChildren={API_CODE_STATE_MAP[API_CODE_STATE.PUBLISH]}
								unCheckedChildren={API_CODE_STATE_MAP[API_CODE_STATE.UNPUBLISH]}
								disabled={!hasPublishAuth}
								defaultChecked={
									form.getFieldValue('state') === API_CODE_STATE.PUBLISH
								}
								onChange={(checked: any) =>
									form.setFieldsValue({
										state: checked
											? API_CODE_STATE.PUBLISH
											: API_CODE_STATE.UNPUBLISH
									})
								}
							/>
						</Form.Item>
					)}
				</Form>
			</Modal>
		</div>
	);
}
