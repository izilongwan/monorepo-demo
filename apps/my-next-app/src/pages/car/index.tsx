import { Car } from '@/api/index.d';
import { getCarData } from '@/api/server';
import { useRouter } from 'next/router';

interface CarProps {
	cars: Car[];
}

export default (props: CarProps) => {
	const router = useRouter();

	return (
		<div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-slate-900 tw-to-slate-800 tw-py-12 tw-px-4">
			<div className="tw-max-w-6xl tw-mx-auto">
				{/* 页头 */}
				<div className="tw-mb-12 tw-text-center">
					<h1 className="tw-text-5xl tw-font-bold tw-text-white tw-mb-4">
						🚗 Car List
					</h1>
					<p className="tw-text-lg tw-text-gray-300">
						Discover our amazing collection of {props.cars.length} cars
					</p>
				</div>

				{/* 汽车卡片网格 */}
				<div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
					{props.cars.map((car) => (
						<div
							key={car.id}
							className="tw-group tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-hover:shadow-2xl tw-transition-all tw-duration-300 tw-transform tw-hover:-tw-translate-y-2"
							onClick={() => router.push(`/car/${car.name}`)}>
							{/* 卡片头部背景 */}
							<div className="tw-bg-gradient-to-r tw-from-blue-500 tw-to-purple-500 tw-h-24 tw-relative tw-overflow-hidden">
								<div className="tw-absolute tw-inset-0 tw-opacity-0 group-hover:tw-opacity-20 tw-transition-opacity tw-duration-300">
									✨
								</div>
							</div>

							{/* 卡片内容 */}
							<div className="tw-p-6 tw--mt-12 tw-relative tw-z-10">
								{/* 汽车图标 */}
								<div className="tw-mb-4">
									<div className="tw-inline-block tw-bg-gradient-to-r tw-from-blue-500 tw-to-purple-500 tw-rounded-full tw-p-4 tw-text-white tw-text-3xl">
										🚙
									</div>
								</div>

								{/* 汽车信息 */}
								<h2 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2">
									{car.name}
								</h2>

								<div className="tw-space-y-2 tw-mb-4">
									<div className="tw-flex tw-items-center tw-text-gray-600">
										<span className="tw-font-semibold tw-text-blue-600 tw-mr-2">
											Brand:
										</span>
										<span className="tw-text-lg">{car.brand}</span>
									</div>
									<div className="tw-flex tw-items-center tw-text-gray-600">
										<span className="tw-font-semibold tw-text-purple-600 tw-mr-2">
											Country:
										</span>
										<span className="tw-text-lg">{car.country}</span>
									</div>
								</div>

								{/* 按钮 */}
								<button className="tw-w-full tw-bg-gradient-to-r tw-from-blue-500 tw-to-purple-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded-lg tw-hover:shadow-lg tw-transition-all tw-duration-300 tw-transform tw-hover:scale-105">
									View Details
								</button>
							</div>
						</div>
					))}
				</div>

				{/* 空状态 */}
				{props.cars.length === 0 && (
					<div className="tw-text-center tw-py-12">
						<p className="tw-text-xl tw-text-gray-400">
							No cars found. Please check back later!
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export async function getStaticProps() {
	const cars = await getCarData();

	return {
		props: { cars },
		revalidate: 3600
	};
}
