import { refreshAccessToken, setRedirectUrl } from '@/apis/user-auth';
import { PageApiCodeResult } from '@/types/apicode.d';
import { message } from 'antd';
import { SpinService } from './spin-service';
import { tokenUtil } from './tokenUtil';

enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH'
}

enum HttpStatus {
	OK = 200,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500
}

interface RequestOptions {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: any;
	params?: Record<string, any>;
	timeout?: number;
	retries?: number;
	retryDelay?: number;
	cacheTime?: number;
	rawResponse?: boolean;
	needToken?: boolean;
	codeErrorTip?: boolean;
	globalLoading?: boolean;
}

export interface ResponseRawResult<T> {
	code: number;
	data: T;
	message: string;
	timestamp: number;
	timecost: number;
	total: number;
	path: string;
	success: boolean;
}

export interface RequestResult<T> {
	promise: Promise<T>;
	abort: () => void;
}

interface CacheItem {
	promise: Promise<any>;
	timestamp: number;
}

enum CODE_STATUS {
	SUCCESS = 0
}

class HttpClient {
	private cache = new Map<string, CacheItem>();
	private defaultOptions: RequestOptions = {
		method: HttpMethod.GET,
		timeout: 10000,
		retries: 3,
		retryDelay: 1000,
		cacheTime: 500,
		rawResponse: false,
		needToken: true
	};

	private generateCacheKey(url: string, options: RequestOptions): string {
		return `${options.method || HttpMethod.GET}_${url}_${JSON.stringify(
			options.body || {}
		)}`;
	}

	private async fetchWithTimeout(
		url: string,
		options: RequestInit,
		timeout: number
	): Promise<Response> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				...options,
				signal: controller.signal
			});
			clearTimeout(timeoutId);
			return response;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof Error && error.name === 'AbortError') {
				throw new Error('Request timeout');
			}
			throw error;
		}
	}

	private async fetchWithRetryAndAbort<T>(
		url: string,
		options: RequestOptions,
		retries: number,
		retryDelay: number,
		signal: AbortSignal
	): Promise<any> {
		let attempt = 0;
		let lastError: Error | any;

		const shouldRetry = (error: any): boolean => {
			// 对于 401 错误，不重试（因为已经尝试刷新 token）
			if (error instanceof Error && error.message.includes('Unauthorized')) {
				return false;
			}
			// 对于业务错误（有 code 字段），不重试
			if (
				typeof error === 'object' &&
				error !== null &&
				'code' in error &&
				error.code !== CODE_STATUS.SUCCESS
			) {
				return false;
			}
			return true;
		};
		options.globalLoading && SpinService.show();
		while (attempt <= retries) {
			try {
				const fetchOptions: RequestInit = {
					method: options.method,
					headers: options.headers || {},
					signal
				};

				if (options.needToken === true) {
					const accessToken = tokenUtil.getAccessToken();
					(fetchOptions.headers as Record<string, string>).Authorization =
						accessToken ? `Bearer ${accessToken}` : '';
				}

				if (options.body && typeof options.body === 'object') {
					fetchOptions.body = JSON.stringify(options.body);
					fetchOptions.headers = {
						...fetchOptions.headers,
						'Content-Type': 'application/json'
					};
				}

				const response = await this.fetchWithTimeout(
					url,
					fetchOptions,
					options.timeout || 10000
				);

				const value = await this.errorHandler<T>(response, {
					url,
					options,
					retries: 0,
					retryDelay,
					signal
				});
				if (value!) {
					return value;
				}

				const contentType = response.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					const data: ResponseRawResult<T> = await response.json();

					if (!options.rawResponse) {
						if (data.code === CODE_STATUS.SUCCESS) {
							return data.data;
						}
						if (options.codeErrorTip !== false) {
							message.error(`${data.message} [${data.code}]`);
						}
						throw data;
					}

					return data;
				}
				return await response.text();
			} catch (error) {
				lastError = error;
				if (attempt < retries && !signal.aborted && shouldRetry(error)) {
					attempt++;
					await new Promise((resolve) => setTimeout(resolve, retryDelay));
				} else {
					throw lastError;
				}
			} finally {
				options.globalLoading && SpinService.hide();
			}
		}

		throw lastError!;
	}

	async redirectGithubLoginAuthorization(response: Response): Promise<void> {
		const isOk = await setRedirectUrl().promise;
		const res = await response.json();
		isOk && location.replace(res.data);
		throw new Error('Unauthorized. Redirecting to login.');
	}

	private async errorHandler<T>(
		response: Response,
		{ url, options, retries, retryDelay, signal }: any
	): Promise<void> {
		if (response.status === HttpStatus.UNAUTHORIZED) {
			if (!tokenUtil.getRefreshToken() || url.includes('/auth/o/refresh/')) {
				tokenUtil.clearTokens();
				await this.redirectGithubLoginAuthorization(response);
			}

			tokenUtil.removeAccessToken();
			const refreshResponse = await refreshAccessToken().promise;

			if (refreshResponse?.accessToken) {
				tokenUtil.setAccessToken(refreshResponse.accessToken);
				// 重试原始请求，不再重试
				return this.fetchWithRetryAndAbort<T>(
					url,
					options,
					0,
					retryDelay,
					signal
				);
			}
		}

		if (response.status === HttpStatus.FORBIDDEN) {
			const msg = `没有权限访问该资源 [${response.status}]`;
			message.error(msg);
			throw new Error(msg);
		}

		if (response.status === HttpStatus.NOT_FOUND) {
			const msg = `请求的资源不存在 [${response.status}]`;
			message.error(msg);
			throw new Error(msg);
		}

		if (response.status === HttpStatus.UNAUTHORIZED) {
			if (!tokenUtil.getRefreshToken() || url.endsWith('/auth/o/refresh')) {
				tokenUtil.clearTokens();
				await this.redirectGithubLoginAuthorization(response);
			}

			tokenUtil.removeAccessToken();
			const refreshResponse = await refreshAccessToken().promise;

			if (refreshResponse?.accessToken) {
				tokenUtil.setAccessToken(refreshResponse.accessToken);
				// 重试原始请求，不再重试
				return this.fetchWithRetryAndAbort<T>(
					url,
					options,
					retries,
					retryDelay,
					signal
				);
			}
		}

		if (!response.ok) {
			const msg = `HTTP: ${response.statusText} [${response.status}]`;
			message.error(msg);
			throw new Error(msg);
		}
	}

	request<T = any>(
		url: string,
		options: RequestOptions = {}
	): RequestResult<T> {
		const mergedOptions = { ...this.defaultOptions, ...options };
		let finalUrl = url;

		// 处理查询参数
		if (mergedOptions.params && Object.keys(mergedOptions.params).length > 0) {
			let queryString = '';
			Object.entries(mergedOptions.params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					if (Array.isArray(value)) {
						value.forEach((v) => {
							queryString += `${encodeURIComponent(key)}=${encodeURIComponent(
								String(v)
							)}&`;
						});
					} else {
						queryString += `${encodeURIComponent(key)}=${encodeURIComponent(
							String(value)
						)}&`;
					}
				}
			});
			finalUrl = `${finalUrl}?${queryString.slice(0, -1)}`;
		}

		const cacheKey = this.generateCacheKey(finalUrl, mergedOptions);

		// 检查缓存
		if (mergedOptions.cacheTime && mergedOptions.cacheTime > 0) {
			const cached = this.cache.get(cacheKey);
			if (cached && Date.now() - cached.timestamp < mergedOptions.cacheTime) {
				return {
					promise: cached.promise,
					abort: () => {} // 缓存的请求无法取消
				};
			}
		}

		// 创建 AbortController
		const controller = new AbortController();

		// 创建请求 Promise
		const requestPromise = this.fetchWithRetryAndAbort<T>(
			finalUrl,
			mergedOptions,
			mergedOptions.retries || 0,
			mergedOptions.retryDelay || 1000,
			controller.signal
		);

		// 缓存请求
		if (mergedOptions.cacheTime && mergedOptions.cacheTime > 0) {
			this.cache.set(cacheKey, {
				promise: requestPromise,
				timestamp: Date.now()
			});

			// 清理过期缓存
			setTimeout(() => {
				this.cache.delete(cacheKey);
			}, mergedOptions.cacheTime);
		}

		return {
			promise: requestPromise,
			abort: () => controller.abort()
		};
	}

	// 便捷方法
	get<T = any>(
		url: string,
		params?: Record<string, any>,
		options: Omit<RequestOptions, 'method' | 'params'> = {}
	): RequestResult<T> {
		return this.request<T>(url, { ...options, method: HttpMethod.GET, params });
	}

	post<T = any>(
		url: string,
		data?: any,
		options: Omit<RequestOptions, 'method' | 'body'> = {}
	): RequestResult<T> {
		return this.request<T>(url, {
			...options,
			method: HttpMethod.POST,
			body: data
		});
	}

	postPage<T = any>(
		url: string,
		data?: any,
		options: Omit<RequestOptions, 'method' | 'body'> = {}
	): RequestResult<PageApiCodeResult<T>> {
		return this.request<PageApiCodeResult<T>>(url, {
			...options,
			method: HttpMethod.POST,
			body: data
		});
	}

	put<T = any>(
		url: string,
		data?: any,
		options: Omit<RequestOptions, 'method' | 'body'> = {}
	): RequestResult<T> {
		return this.request<T>(url, {
			...options,
			method: HttpMethod.PUT,
			body: data
		});
	}

	delete<T = any>(
		url: string,
		options: Omit<RequestOptions, 'method'> = {}
	): RequestResult<T> {
		return this.request<T>(url, { ...options, method: HttpMethod.DELETE });
	}

	// 取消所有缓存的请求（可选）
	clearCache(): void {
		this.cache.clear();
	}
}

// 导出单例实例
export const httpClient = new HttpClient();
export { HttpMethod };
export default httpClient;
