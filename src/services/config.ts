export const API_BASE_URL = process.env.VITE_API_BASE_URL
	? String(process.env.VITE_API_BASE_URL).replace(/\/+$/, "")
	: "";

export function assertApiBaseUrl(): string {
	if (!API_BASE_URL) {
		throw new Error(
			"VITE_API_BASE_URL is not set. Define it in your environment (.env).",
		);
	}
	return API_BASE_URL;
}
