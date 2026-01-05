import type { NextApiRequest, NextApiResponse } from 'next';

export interface Post {
	id: number;
	title: string;
	date: string;
	content?: string;
}

export interface BlogProps {
	post: Post;
}

export interface PostsProps {
	posts: Post[];
}

export type ResponseData = Post[] | { error: string };

export const POSTS_DATA = [
	{ id: 1, title: 'Getting Started with Next.js', date: '2024-01-01' },
	{ id: 2, title: 'Next.js SSR vs SSG', date: '2024-01-02' },
	{ id: 3, title: 'API Routes in Next.js', date: '2024-01-03' }
];

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	if (req.method === 'GET') {
		// 获取所有文章
		const posts: Post[] = POSTS_DATA;

		res.status(200).json(posts);
	} else if (req.method === 'POST') {
		// 创建新文章
		const { title } = req.body;

		if (!title) {
			res.status(400).json({ error: 'Title is required' });
			return;
		}

		const newPost: Post = {
			id: 4,
			title,
			date: new Date().toISOString()
		};

		POSTS_DATA.push(newPost);

		res.status(201).json([newPost]);
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
