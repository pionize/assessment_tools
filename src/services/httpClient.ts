import axios, { type AxiosResponse, type AxiosError } from "axios";
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
	headers: Record<string, string>;
}

interface ApiError extends Error {
	status: number;
	body: unknown;
}

// Create axios instance with base configuration
const createAxiosInstance = () => {
	const baseURL = assertApiBaseUrl();
	return axios.create({
		baseURL,
		headers: {
			"Content-Type": "application/json",
		},
		timeout: 30000, // 30 seconds timeout
	});
};

function handleAxiosError(error: AxiosError): never {
	const status = error.response?.status || 0;
	const data = error.response?.data;
	
	const apiError = new Error(
		`Request failed ${status}: ${typeof data === "string" ? data : JSON.stringify(data)}`,
	) as ApiError;
	apiError.status = status;
	apiError.body = data;
	throw apiError;
}

export async function post<TReq extends object, TRes = unknown>(
	path: string,
	body: TReq,
	config?: { headers?: Record<string, string> },
): Promise<ApiResponse<TRes>> {
	try {
		const axiosInstance = createAxiosInstance();
		const response: AxiosResponse<TRes> = await axiosInstance.post(path, body, {
			headers: config?.headers,
		});
		
		return {
			data: response.data,
			status: response.status,
			headers: response.headers as Record<string, string>,
		};
	} catch (error) {
		handleAxiosError(error as AxiosError);
	}
}

export async function get<TRes = unknown>(
	path: string,
	config?: { headers?: Record<string, string> },
): Promise<ApiResponse<TRes>> {
	try {
		const axiosInstance = createAxiosInstance();
		const response: AxiosResponse<TRes> = await axiosInstance.get(path, {
			headers: config?.headers,
		});
		
		return {
			data: response.data,
			status: response.status,
			headers: response.headers as Record<string, string>,
		};
	} catch (error) {
		handleAxiosError(error as AxiosError);
	}
}
