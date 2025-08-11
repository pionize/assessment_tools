import type { ApiResponseEnvelope } from "./common";

export interface AuthenticateRequestDTO {
	name: string;
	email: string;
	assessment_id: string;
}

export interface AuthenticateDetailDTO {
	success: boolean;
	candidate_id: string;
	name: string;
	email: string;
	assessment_id: string;
	start_at: string;
	time_limit_minutes: number;
	token: string;
}

export type AuthenticateResponseDTO =
	ApiResponseEnvelope<AuthenticateDetailDTO>;
