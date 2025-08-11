export interface SubmissionResponse {
	success: boolean;
	submissionId: string;
	timestamp: string;
	message: string;
}

export interface AssessmentSubmissionResponse extends SubmissionResponse {
	assessmentId: string;
	candidateName?: string;
	candidateEmail?: string;
}

export interface CodeSubmission {
	challengeId: string;
	type: "code";
	assessmentId: string;
	candidateName: string;
	candidateEmail: string;
	files: Record<string, string>;
	language: string;
	timestamp: string;
}

export interface OpenEndedSubmission {
	challengeId: string;
	type: "open-ended";
	assessmentId: string;
	candidateName: string;
	candidateEmail: string;
	answer: string;
	timestamp: string;
}

export interface MultipleChoiceSubmission {
	challengeId: string;
	type: "multiple-choice";
	assessmentId: string;
	candidateName: string;
	candidateEmail: string;
	answers: Record<string, string>;
	timestamp: string;
	autoSubmit?: boolean;
}

