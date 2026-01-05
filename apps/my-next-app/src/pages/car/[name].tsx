import { Car } from '@/api/index.d';
import { getCarData } from '@/api/server';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

interface CarDetailProps {
	car: Car;
}

export default ({ car }: CarDetailProps) => {
	const router = useRouter();

	return (
		<div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-slate-900 tw-via-slate-800 tw-to-slate-900 tw-py-12 tw-px-4">
			{/* 返回按钮 */}
			<div className="tw-max-w-4xl tw-mx-auto tw-mb-8">
				<button
					onClick={() => router.back()}
					className="tw-flex tw-items-center tw-text-blue-400 tw-hover:text-blue-300 tw-transition-colors tw-duration-200">
					<span className="tw-mr-2">←</span>
					<span className="tw-text-lg tw-font-semibold">Back</span>
				</button>
			</div>

			{/* 详情卡片 */}
			<div className="tw-max-w-4xl tw-mx-auto">
				<div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-overflow-hidden">
					{/* 头部装饰 */}
					<div className="tw-bg-gradient-to-r tw-from-blue-500 tw-via-purple-500 tw-to-pink-500 tw-h-40 tw-relative tw-overflow-hidden">
						<div className="tw-absolute tw-inset-0 tw-opacity-20">
							<div className="tw-text-9xl tw-absolute tw-top-1/2 tw-left-1/2 tw--translate-x-1/2 tw--translate-y-1/2">
								🚗
							</div>
						</div>
					</div>

					{/* 内容区域 */}
					<div className="tw-px-8 tw-py-12 tw--mt-8 tw-relative tw-z-10">
						{/* 车型标题 */}
						<div className="tw-mb-8">
							<h1 className="tw-text-5xl tw-font-bold tw-text-gray-900 tw-mb-3">
								{car.name}
							</h1>
							<div className="tw-flex tw-flex-wrap tw-gap-3">
								<span className="tw-inline-block tw-bg-blue-100 tw-text-blue-800 tw-px-4 tw-py-2 tw-rounded-full tw-font-semibold">
									{car.brand}
								</span>
								<span className="tw-inline-block tw-bg-purple-100 tw-text-purple-800 tw-px-4 tw-py-2 tw-rounded-full tw-font-semibold">
									{car.country}
								</span>
							</div>
						</div>

						{/* 分割线 */}
						<div className="tw-my-8 tw-h-px tw-bg-gradient-to-r tw-from-transparent tw-via-gray-300 tw-to-transparent"></div>

						{/* 详细信息 */}
						<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
							{/* 基本信息 */}
							<div className="tw-space-y-6">
								<h2 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-6">
									Basic Information
								</h2>

								<div className="tw-bg-gray-50 tw-rounded-lg tw-p-6 tw-border-l-4 tw-border-blue-500">
									<p className="tw-text-sm tw-text-gray-600 tw-mb-2">
										Car Name
									</p>
									<p className="tw-text-2xl tw-font-bold tw-text-gray-900">
										{car.name}
									</p>
								</div>

								<div className="tw-bg-gray-50 tw-rounded-lg tw-p-6 tw-border-l-4 tw-border-purple-500">
									<p className="tw-text-sm tw-text-gray-600 tw-mb-2">Brand</p>
									<p className="tw-text-2xl tw-font-bold tw-text-gray-900">
										{car.brand}
									</p>
								</div>

								<div className="tw-bg-gray-50 tw-rounded-lg tw-p-6 tw-border-l-4 tw-border-pink-500">
									<p className="tw-text-sm tw-text-gray-600 tw-mb-2">Country</p>
									<p className="tw-text-2xl tw-font-bold tw-text-gray-900">
										{car.country}
									</p>
								</div>
							</div>

							{/* 特色信息 */}
							<div className="tw-space-y-6">
								<h2 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-6">
									Features
								</h2>

								<div className="tw-bg-gradient-to-r tw-from-blue-50 tw-to-blue-100 tw-rounded-lg tw-p-6">
									<div className="tw-flex tw-items-center tw-mb-3">
										<span className="tw-text-2xl tw-mr-3">⚙️</span>
										<p className="tw-text-sm tw-text-gray-600">
											Premium Quality
										</p>
									</div>
									<p className="tw-text-gray-700">
										High-performance vehicle with advanced features
									</p>
								</div>

								<div className="tw-bg-gradient-to-r tw-from-purple-50 tw-to-purple-100 tw-rounded-lg tw-p-6">
									<div className="tw-flex tw-items-center tw-mb-3">
										<span className="tw-text-2xl tw-mr-3">🌍</span>
										<p className="tw-text-sm tw-text-gray-600">
											Global Standard
										</p>
									</div>
									<p className="tw-text-gray-700">
										Manufactured according to international standards
									</p>
								</div>

								<div className="tw-bg-gradient-to-r tw-from-pink-50 tw-to-pink-100 tw-rounded-lg tw-p-6">
									<div className="tw-flex tw-items-center tw-mb-3">
										<span className="tw-text-2xl tw-mr-3">✨</span>
										<p className="tw-text-sm tw-text-gray-600">
											Elegant Design
										</p>
									</div>
									<p className="tw-text-gray-700">
										Modern styling with excellent aerodynamics
									</p>
								</div>
							</div>
						</div>

						{/* 底部行动按钮 */}
						<div className="tw-mt-12 tw-pt-8 tw-border-t tw-border-gray-200 tw-flex tw-gap-4">
							<button className="tw-flex-1 tw-bg-gradient-to-r tw-from-blue-500 tw-to-blue-600 tw-text-white tw-font-bold tw-py-3 tw-px-6 tw-rounded-lg tw-hover:shadow-lg tw-transition-all tw-duration-300 tw-transform tw-hover:scale-105">
								Request Info
							</button>
							<button
								onClick={() => router.back()}
								className="tw-flex-1 tw-bg-gray-200 tw-text-gray-900 tw-font-bold tw-py-3 tw-px-6 tw-rounded-lg tw-hover:bg-gray-300 tw-transition-all tw-duration-300">
								Back to List
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async (
	context: GetServerSidePropsContext<{ name: string }>
) => {
	const { name } = context.params || {};
	const cars = await getCarData(name).catch((err) => err);

	const car = cars?.[0];

	return car
		? {
				props: { car }
		  }
		: { notFound: true };
};
