import { initialState, store } from '@/store';
import '@/styles/index.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		initialState();
	}, []);

	return (
		<>
			<Head>
				<title>My Next.js App</title>
				<meta name="description" content="Next.js application in monorepo" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/logo.gif" />
			</Head>
			<nav>
				<a href="/">Home</a>
				<a href="/blog">Blog</a>
				<a href="/car">Car</a>
			</nav>

			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		</>
	);
}
