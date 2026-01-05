import type { NextApiRequest, NextApiResponse } from 'next';

interface ResponseData {
	message: string;
	timestamp: string;
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	res.status(200).json({
		message: 'Hello from Next.js API Route!',
		timestamp: new Date().toISOString()
	});
}
