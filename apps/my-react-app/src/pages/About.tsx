import { CommonObjectType } from '@/types/common';
import { CodeOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Row,
	Space,
	Typography
} from 'antd';
import { useImperativeHandle, useRef } from 'react';

const { Title, Paragraph, Text } = Typography;

export default function About() {
	// const inputRef = useRef<HTMLInputElement>(null);
	// const fnRef = useRef<CommonObjectType>(null);

	// const handleBtnClick = () => {
	// 	if (inputRef.current) {
	// 		inputRef.current.focus();
	// 	}
	// 	fnRef.current?.doit();
	// };

	return (
		<div
			style={{
				padding: '20px',
				background: '#f5f5f5',
				height: '100%',
				boxSizing: 'border-box'
			}}>
			{/* <Button onClick={handleBtnClick}>Focus</Button>
			<InputTest inputRef={inputRef} fnRef={fnRef} /> */}

			<Row justify="center">
				<Col xs={24} sm={22} md={20} lg={20}>
					<Card
						style={{
							textAlign: 'center',
							borderRadius: '10px',
							boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
						}}
						cover={
							<div
								style={{
									background:
										'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									height: '200px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
								<Avatar
									size={80}
									icon={<UserOutlined />}
									style={{ background: '#fff', color: '#667eea' }}
								/>
							</div>
						}>
						<Title level={2} style={{ marginBottom: '10px' }}>
							关于我们
						</Title>
						<Paragraph style={{ fontSize: '16px', color: '#666' }}>
							我们致力于创造优秀的用户体验和创新的技术解决方案。
						</Paragraph>

						<Divider />

						<Space direction="vertical" size="large" style={{ width: '100%' }}>
							<Row gutter={16}>
								<Col span={8}>
									<Card size="small" style={{ textAlign: 'center' }}>
										<CodeOutlined
											style={{ fontSize: '24px', color: '#1890ff' }}
										/>
										<br />
										<Text strong>技术驱动</Text>
										<br />
										<Text type="secondary">使用最新技术栈</Text>
									</Card>
								</Col>
								<Col span={8}>
									<Card size="small" style={{ textAlign: 'center' }}>
										<UserOutlined
											style={{ fontSize: '24px', color: '#52c41a' }}
										/>
										<br />
										<Text strong>用户至上</Text>
										<br />
										<Text type="secondary">以用户为中心设计</Text>
									</Card>
								</Col>
								<Col span={8}>
									<Card size="small" style={{ textAlign: 'center' }}>
										<HeartOutlined
											style={{ fontSize: '24px', color: '#f5222d' }}
										/>
										<br />
										<Text strong>热爱创新</Text>
										<br />
										<Text type="secondary">不断追求卓越</Text>
									</Card>
								</Col>
							</Row>

							<Paragraph style={{ marginTop: '20px' }}>
								<Text strong>我们的使命：</Text>{' '}
								通过技术改变生活，让世界变得更美好。
							</Paragraph>
							<Paragraph>
								<Text strong>我们的愿景：</Text> 成为行业领先的创新企业。
							</Paragraph>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
}

interface InputProps {
	inputRef: React.Ref<HTMLInputElement>;
	fnRef: React.Ref<CommonObjectType>;
}

const InputTest = ({ inputRef, fnRef }: InputProps) => {
	useImperativeHandle(fnRef, () => ({
		doit: () => {
			console.log('fnref doit');
		}
	}));

	return <input placeholder="Test Input" ref={inputRef} />;
};
