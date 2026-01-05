import type { GetStaticProps } from 'next';
import { Post, POSTS_DATA, PostsProps } from '../api/posts';

export default function Posts({ posts }: PostsProps) {
	return (
		<div className="tw-max-w-3xl tw-mx-auto tw-p-8">
			<h1>Blog Posts</h1>
			<p>Welcome to our blog. Here are all published posts:</p>

			<div className="tw-mt-8">
				{posts.map((post) => (
					<article
						key={post.id}
						className="hover:tw-shadow-lg tw-transition-shadow hover:tw-border-gray-300 tw-p-4 tw-mb-4 tw-rounded-lg tw-border">
						<h2 className="tw-mb-1.5">
							<a
								href={`/blog/${post.id}`}
								className="tw-text-blue-600 tw-no-underline hover:tw-underline">
								{post.title}
							</a>
						</h2>
						<p className="tw-text-gray-600 tw-m-0">
							{new Date(post.date).toLocaleDateString()}
						</p>
					</article>
				))}
			</div>
		</div>
	);
}

// 静态生成页面
export const getStaticProps: GetStaticProps<PostsProps> = async () => {
	// 从 API 或数据库获取所有文章
	const posts: Post[] = POSTS_DATA;

	return {
		props: { posts },
		revalidate: 3600 // 1小时重新生成
	};
};
