import type { GetStaticPaths, GetStaticProps } from 'next';
import { BlogProps, Post, POSTS_DATA } from '../api/posts';

export default function BlogPost({ post }: BlogProps) {
	return (
		<article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
			<h1>{post.title}</h1>
			<p style={{ color: '#666', marginBottom: '2rem' }}>
				Published on {new Date(post.date).toLocaleDateString()}
			</p>
			<div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
				{post.content}
			</div>
			<hr style={{ margin: '2rem 0' }} />
			<a href="/blog" style={{ color: '#0066cc' }}>
				← Back to Posts
			</a>
		</article>
	);
}

// 静态生成路径
export const getStaticPaths: GetStaticPaths = async () => {
	// 从 API 获取所有文章 ID
	const posts = POSTS_DATA;

	return {
		paths: posts.map((post) => ({ params: { id: post.id.toString() } })),
		fallback: 'blocking' // 生成缺失的页面
	};
};

// 静态生成属性
export const getStaticProps: GetStaticProps<BlogProps> = async ({ params }) => {
	const post = POSTS_DATA.find((post) => post.id === Number(params?.id))!;

	if (!post) {
		return { notFound: true };
	}

	return {
		props: { post },
		revalidate: 3600 // 1小时重新生成
	};
};
