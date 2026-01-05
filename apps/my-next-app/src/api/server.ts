import { http } from '@/util/http';
import { Car } from './index.d';

const PROXY = process.env.NEXT_PUBLIC_API_PROXY_TARGET;

export const getCarData = (name = '') =>
	http<Car[]>(`${PROXY}/test/car?carEnum=${name}`);
