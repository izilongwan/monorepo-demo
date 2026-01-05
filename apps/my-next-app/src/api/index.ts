import { http } from '@/util/http';

const API = process.env.NEXT_PUBLIC_API_URL;

export const getHelloData = () =>
	http(`${API}/hello`, {}, { checkCode: false });

export const getPostData = () => http(`${API}/posts`, {}, { checkCode: false });
