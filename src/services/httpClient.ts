import { assertApiBaseUrl } from "./config";

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface ApiResponse<T> {
	data: T;
	status: number;
	headers: Headers;
}

function joinUrl(base: string, path: string) {
	const b = base.replace(/\/+$/, "");
	const p = path.replace(/^\/+/, "");
	return `${b}/${p}`;
}

interface ApiError extends Error {
	status: number;
	body: unknown;
}

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
	const contentType = res.headers.get("content-type") || "";
	const isJson = contentType.includes("application/json");
	const body = isJson ? await res.json() : await res.text();
	if (!res.ok) {
		const error = new Error(
			`Request failed ${res.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`,
		) as ApiError;
		error.status = res.status;
		error.body = body;
		throw error;
	}
	return { data: body as T, status: res.status, headers: res.headers };
}

export async function post<TReq extends object, TRes = unknown>(
	path: string,
	body: TReq,
	init?: RequestInit,
): Promise<ApiResponse<TRes>> {
	const base = assertApiBaseUrl();
	const url = joinUrl(base, path);
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
		body: JSON.stringify(body),
		...init,
	});
	return handleResponse<TRes>(res);
}

export async function get<TRes = unknown>(
	path: string,
	init?: RequestInit,
): Promise<ApiResponse<TRes>> {
	const base = assertApiBaseUrl();
	const url = joinUrl(base, path);
	const res = await fetch(url, { method: "GET", ...(init || {}) });
	return handleResponse<TRes>(res);
}

