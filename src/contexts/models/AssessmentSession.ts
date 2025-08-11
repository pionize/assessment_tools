export interface AssessmentSession {
	assessmentId: string;
	candidateId: string;
	name: string;
	email: string;
	timeLimit: number;
	startedAt: string;
	remainingTimeSeconds: number;
	isExpired: boolean;
}

