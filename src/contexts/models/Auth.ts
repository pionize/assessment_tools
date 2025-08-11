export interface AuthResponse {
	success: boolean;
	candidateId: string;
	name: string;
	email: string;
	assessmentId: string;
	token: string;
	timeLimit: number;
	startedAt?: string;
}
