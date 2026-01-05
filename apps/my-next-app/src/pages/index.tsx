import { getHelloData } from '@/api';
import {
	countDecrement,
	countIncrement,
	selectCountValue
} from '@/store/count';
import { decrement, increment, selectSomeValue } from '@/store/some';
import { useFetchData } from '@monorepo-demo/react-util';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export default function Home() {
	const {
		data: helloData,
		error,
		isLoading,
		refetch
	} = useFetchData(getHelloData);

	const dispatch = useDispatch();
	const someValue = useSelector(selectSomeValue, shallowEqual);
	const countValue = useSelector(selectCountValue, shallowEqual);

	return (
		<main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
			<h1>Welcome to Next.js in Monorepo</h1>
			<p>This is a Next.js application integrated into the monorepo.</p>

			<section style={{ marginTop: '2rem' }}>
				<h2>Features:</h2>
				<ul>
					<li>
						<a href="/blog">Blog System (SSG)</a>
					</li>
					<li>
						<a href="/api">API Routes</a>
					</li>
					<li>Server-side Rendering (SSR)</li>
					<li>Static Generation (SSG)</li>
				</ul>
			</section>

			<section
				style={{
					marginTop: '2rem',
					padding: '1rem',
					borderRadius: '8px'
				}}>
				<h3>Try it out:</h3>
				<p>
					<button
						onClick={refetch}
						style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
						Call API Route
					</button>
				</p>
				<div style={{ marginTop: '1rem' }}>
					{isLoading && <p>Loading...</p>}
					{error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
					{helloData && (
						<div
							style={{
								backgroundColor: '#f0f0f0',
								padding: '1rem',
								borderRadius: '4px'
							}}>
							<pre>{JSON.stringify(helloData, null, 2)}</pre>
						</div>
					)}
				</div>
			</section>

			<section>
				<h2>Redux State Value:</h2>
				<p>Current Value: {someValue}</p>
				<button
					onClick={() => dispatch(increment())}
					style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
					Increment Value
				</button>
				<button
					onClick={() => dispatch(decrement())}
					style={{
						padding: '0.5rem 1rem',
						cursor: 'pointer',
						marginLeft: '1rem'
					}}>
					Decrement Value
				</button>
			</section>

			<section>
				<h2>Count State Value:</h2>
				<p>Current Count: {countValue}</p>
				<button
					onClick={() => dispatch(countIncrement(10))}
					style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
					Increment Count
				</button>
				<button
					onClick={() => dispatch(countDecrement(10))}
					style={{
						padding: '0.5rem 1rem',
						cursor: 'pointer',
						marginLeft: '1rem'
					}}>
					Decrement Count
				</button>
			</section>
		</main>
	);
}
