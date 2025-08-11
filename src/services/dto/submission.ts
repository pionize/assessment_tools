import type { ApiResponseOutputDetail } from "./common";

// Request DTOs use snake_case to match API examples

export interface CodeSubmissionRequestDTO {
	challenge_id: string;
	assessment_id: string;
	candidate_name: string;
	candidate_email: string;
	files: Record<string, string>;
	language: string;
	timestamp: string;
}

export interface OpenEndedSubmissionRequestDTO {
	challenge_id: string;
	assessment_id: string;
	candidate_name: string;
	candidate_email: string;
	answer: string;
	timestamp: string;
}

export interface MultipleChoiceSubmissionRequestDTO {
	challenge_id: string;
	assessment_id: string;
	candidate_name: string;
	candidate_email: string;
	answers: Record<string, string>;
	timestamp: string;
	auto_submit?: boolean;
}

export type SubmitChallengeRequestDTO =
	| ({ type: "code" } & CodeSubmissionRequestDTO)
	| ({ type: "open-ended" } & OpenEndedSubmissionRequestDTO)
	| ({ type: "multiple-choice" } & MultipleChoiceSubmissionRequestDTO);

export interface SubmitChallengeDetailDTO {
	success: boolean;
	submission_id: string;
	timestamp: string;
	message: string;
}

export type SubmitChallengeResponseDTO =
	ApiResponseOutputDetail<SubmitChallengeDetailDTO>;

export interface SubmitAssessmentRequestDTO {
	assessment_id: string;
	candidate_name: string;
	candidate_email: string;
}

export interface SubmitAssessmentDetailDTO {
	success: boolean;
	assessment_id: string;
	candidate_name: string;
	candidate_email: string;
	submission_id: string;
	timestamp: string;
	message: string;
}

export type SubmitAssessmentResponseDTO =
	ApiResponseOutputDetail<SubmitAssessmentDetailDTO>;
