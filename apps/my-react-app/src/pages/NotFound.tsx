import style from '@/styles/modules/NotFound.module.css';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Result, Space } from 'antd';
import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const showReturnBtn = params.get('show-return-btn') !== '0';
  const [routeParams, setRouteParams] = useSearchParams();

  useEffect(() => {
    console.log('NotFound routeParams:', routeParams.get('test'));
  }, [routeParams]);

  function handleSetParam(e: React.MouseEvent) {
		// 如果点击的是按钮，不执行此逻辑
		if ((e.target as HTMLElement).closest('button')) {
			return;
		}
		const value = Number(routeParams.get('test') ?? 0) + 1;
		routeParams.set('test', String(value));
		setRouteParams({ ...Object.fromEntries(routeParams) });
	}

	return (
		<div className={style.container} onClick={handleSetParam}>
			<Result
				status="404"
				title="404"
				subTitle="抱歉，您访问的页面不存在"
				extra={
					showReturnBtn && (
						<Space>
							<Button
								type="primary"
								size="large"
								icon={<HomeOutlined />}
								onClick={() => navigate('/home')}>
								回到首页
							</Button>
							<Button
								size="large"
								icon={<ArrowLeftOutlined />}
								onClick={() => navigate(-1)}>
								返回上一页
							</Button>
						</Space>
					)
				}
			/>
		</div>
	);
}
