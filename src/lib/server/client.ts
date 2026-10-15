import { BACKEND_URL, NODE_ENV, BACKEND_URL_DEV } from '$app/env/private';

const API_URL = NODE_ENV === "development" ? BACKEND_URL_DEV : BACKEND_URL;

export class RequestError extends Error {
	status: number;
	data: unknown;

	constructor(message: string, status: number, data: unknown) {
		super(message);
		this.name = 'RequestError';
		this.status = status;
		this.data = data;
	}
}

type Credentials = 'include' | 'omit' | 'same-origin';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type QueryValue = string | number | boolean | undefined | null;
type QueryParams = Record<string, QueryValue>;

interface RequestProps<TBody> {
	endpoint: string;
	credentials?: Credentials;
	query?: QueryParams;
	props?: {
		method?: HttpMethod;
		headers?: Record<string, string>;
		body?: TBody;
	};
}

type ResultSuccess<T> = { ok: true; data: T };
type ResultFailure = { ok: false; status: number; message: string; data: unknown };
export type Result<T> = ResultSuccess<T> | ResultFailure;

function buildQueryString(query?: QueryParams): string {
	if (!query) return '';

	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null) continue;
		params.append(key, String(value));
	}

	const qs = params.toString();
	return qs ? `?${qs}` : '';
}

function buildFetchOptions<TBody>(
	props: RequestProps<TBody>['props']
): { method: string; headers: Record<string, string>; body: string | undefined } {
	const { method = 'GET', headers = {}, body } = props ?? {};
	return {
		method,
		headers: { 'Content-Type': 'application/json', ...headers },
		body: body === undefined ? undefined : JSON.stringify(body)
	};
}

async function parseResponse<TResponse>(res: Response): Promise<TResponse> {
	if (res.status === 204) return null as TResponse;
	if (res.status === 401) console.warn('Sesión expirada. Redirigiendo...');

	return res.headers.get('content-type')?.includes('application/json')
		? res.json()
		: (null as TResponse);
}

async function request<TResponse, TBody = undefined>({
	endpoint,
	query,
	credentials,
	props
}: RequestProps<TBody>): Promise<TResponse> {
	try {
		const url = `${API_URL}${endpoint}${buildQueryString(query)}`;
		const res = await fetch(url, { credentials, ...buildFetchOptions(props) });
		const data = await parseResponse<TResponse>(res);

		if (!res.ok) {
			throw new RequestError(
				(data as Record<string, unknown>)?.message as string || `Error del servidor (${res.status})`,
				res.status,
				data
			);
		}

		return data;
	} catch (error: unknown) {
		if (error instanceof RequestError) throw error;
		throw new RequestError('An unexpected error occurred', 500, error);
	}
}

async function requestSafe<TResponse, TBody = undefined>(
	props: RequestProps<TBody>
): Promise<Result<TResponse>> {
	try {
		const data = await request<TResponse, TBody>(props);
		return { ok: true, data };
	} catch (error: unknown) {
		if (error instanceof RequestError) {
			return { ok: false, status: error.status, message: error.message, data: error.data };
		}
		return { ok: false, status: 500, message: 'An unexpected error occurred', data: error };
	}
}

export const API = {
	get<TResponse>(endpoint: string, query?: QueryParams) {
		return request<TResponse>({ endpoint, query, props: { method: 'GET' } });
	},

	post<TResponse, TBody = undefined>(endpoint: string, body?: TBody, query?: QueryParams) {
		return request<TResponse, TBody>({ endpoint, query, props: { method: 'POST', body } });
	},

	put<TResponse, TBody = undefined>(endpoint: string, body?: TBody, query?: QueryParams) {
		return request<TResponse, TBody>({ endpoint, query, props: { method: 'PUT', body } });
	},

	delete<TResponse>(endpoint: string, query?: QueryParams) {
		return request<TResponse>({ endpoint, query, props: { method: 'DELETE' } });
	},

	getSafe<TResponse>(endpoint: string, query?: QueryParams) {
		return requestSafe<TResponse>({ endpoint, query, props: { method: 'GET' } });
	},

	postSafe<TResponse, TBody = undefined>(endpoint: string, body?: TBody, query?: QueryParams) {
		return requestSafe<TResponse, TBody>({ endpoint, query, props: { method: 'POST', body } });
	},

	putSafe<TResponse, TBody = undefined>(endpoint: string, body?: TBody, query?: QueryParams) {
		return requestSafe<TResponse, TBody>({ endpoint, query, props: { method: 'PUT', body } });
	},

	deleteSafe<TResponse>(endpoint: string, query?: QueryParams) {
		return requestSafe<TResponse>({ endpoint, query, props: { method: 'DELETE' } });
	}
};
