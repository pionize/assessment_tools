// API service implementing real HTTP calls per docs/api-contract

// --- TYPE DEFINITIONS ---

interface CodeFile {
	content: string;
	language: string;
}

interface QuestionOption {
	id: string;
	text: string;
}

interface Question {
	id: string | number;
	question: string;
	options: QuestionOption[];
	correctAnswer?: string;
	explanation?: string;
}

export interface Challenge {
	id: string;
	title: string;
	type: "code" | "open-ended" | "multiple-choice";
	description: string;
	instructions?: string;
	timeLimit?: number;
	language?: string;
	files?: Record<string, CodeFile | string>;
	questions?: Question[];
}

export type ChallengeSummary = Pick<
	Challenge,
	"id" | "title" | "type" | "description" | "timeLimit"
>;

export interface Assessment {
	id: string;
	title: string;
	description: string;
	challenges?: string[];
	timeLimit?: number;
}

interface SubmissionResponse {
	success: boolean;
	submissionId: string;
	timestamp: string;
	message: string;
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

interface AssessmentSubmissionResponse extends SubmissionResponse {
	assessmentId: string;
	candidateName?: string;
	candidateEmail?: string;
}

interface AuthResponse {
	success: boolean;
	candidateId: string;
	name: string;
	email: string;
	assessmentId: string;
	token: string;
	timeLimit: number;
	startedAt?: string;
}

interface AssessmentSession {
	assessmentId: string;
	candidateId: string;
	name: string;
	email: string;
	timeLimit: number;
	startedAt: string;
	remainingTimeSeconds: number;
	isExpired: boolean;
}

import { get, post } from "./httpClient";
import type { AuthenticateRequestDTO, AuthenticateResponseDTO } from "./dto/auth";
import type {
	ChallengeDetailDTO,
	ChallengeDetailResponseDTO,
	ChallengeListResponseDTO,
} from "./dto/challenge";
import type { AssessmentDetailResponseDTO } from "./dto/assessment";
import { sessionStorage as sessionStore } from "../utils/sessionStorage";

function authHeader() {
	const candidate = sessionStore.getCandidate?.();
	return candidate?.token
		? { Authorization: `Bearer ${candidate.token}` }
		: undefined;
}

function toChallengeSummary(dto: {
	id: string;
	title: string;
	type: "code" | "open-ended" | "multiple-choice";
	description: string;
	time_limit?: number;
}): ChallengeSummary {
	return {
		id: dto.id,
		title: dto.title,
		type: dto.type,
		description: dto.description,
		timeLimit: dto.time_limit,
	};
}

function toChallengeDetail(dto: ChallengeDetailDTO): Challenge {
	return {
		id: dto.id,
		title: dto.title,
		type: dto.type,
		description: dto.description,
		instructions: dto.instructions,
		timeLimit: dto.time_limit,
		language: dto.language,
		files: dto.files,
		questions: dto.questions?.map((q) => ({
			id: (q.id as unknown as string) ?? "",
			question: q.question,
			options: q.options?.map((o) => ({ id: String(o.id), text: o.text })) || [],
			correctAnswer: (q as any).correctAnswer,
			explanation: (q as any).explanation,
		})),
	};
}

export const apiService = {
	async getAssessment(assessmentId: string): Promise<Assessment> {
		const { data } = await get<AssessmentDetailResponseDTO>(
			`/assessments/${encodeURIComponent(assessmentId)}`,
			{ headers: authHeader() },
		);
		const detail = (data as any)?.response_output?.detail as
			| { id: string; title: string; description: string }
			| undefined;
		if (!detail) {
			throw new Error(
				(data as any)?.response_schema?.response_message ||
					"Failed to load assessment",
			);
		}
		return {
			id: detail.id,
			title: detail.title,
			description: detail.description,
		};
	},

	async getChallenges(assessmentId: string): Promise<ChallengeSummary[]> {
		const { data } = await get<ChallengeListResponseDTO>(
			`/assessments/${encodeURIComponent(assessmentId)}/challenges`,
			{ headers: authHeader() },
		);
		const list = (data as any)?.response_output?.content;
		if (!Array.isArray(list)) {
			throw new Error(
				(data as any)?.response_schema?.response_message ||
					"Failed to load challenges",
			);
		}
		return list.map(toChallengeSummary);
	},

	async getChallengeDetails(challengeId: string): Promise<Challenge> {
		const { data } = await get<ChallengeDetailResponseDTO>(
			`/challenges/${encodeURIComponent(challengeId)}`,
			{ headers: authHeader() },
		);
		const detail = (data as any)?.response_output?.detail;
		if (!detail) {
			throw new Error(
				(data as any)?.response_schema?.response_message ||
					"Failed to load challenge",
			);
		}
		return toChallengeDetail(detail);
	},

	async submitChallenge(
		submission: CodeSubmission | OpenEndedSubmission | MultipleChoiceSubmission,
	): Promise<SubmissionResponse> {
		// Transform per docs: POST /challenges/submissions
		let body: Record<string, unknown> = {
			challenge_id: submission.challengeId,
		};
		if (submission.type === "code") {
			body = {
				...body,
				files: (submission as CodeSubmission).files,
				language: (submission as CodeSubmission).language,
			};
		} else if (submission.type === "open-ended") {
			body = { ...body, answer: (submission as OpenEndedSubmission).answer };
		} else if (submission.type === "multiple-choice") {
			const answers = submission.answers || {};
			body = {
				...body,
				multiple_choice_answers: Object.entries(answers).map(
					([questionId, optionId]) => ({
						question_id: isNaN(Number(questionId))
							? questionId
							: Number(questionId),
						option_id: optionId,
					}),
				),
			};
		}
		const { data } = await post<
			record<string, unknown>,
			{
				response_output?: { detail?: { submission_id: string; message?: string } };
				response_schema?: { response_message?: string };
			}
		>("/challenges/submissions", body, { headers: authHeader() });

		const detail = (data as any)?.response_output?.detail;
		if (!detail) {
			throw new Error(
				(data as any)?.response_schema?.response_message ||
					"Failed to submit challenge",
			);
		}
		return {
			success: true,
			submissionId: detail.submission_id,
			timestamp: new Date().toISOString(),
			message: detail.message || "Challenge submitted successfully",
		};
	},

	async submitAssessment(data: {
		assessmentId: string;
		candidateName: string;
		candidateEmail: string;
	}): Promise<AssessmentSubmissionResponse> {
		const { data: resp } = await post<
			{ assessment_id: string },
			{
				response_output?: {
					detail?: { submission_id: string; message?: string; assessment_id: string };
				};
				response_schema?: { response_message?: string };
			}
		>(
			"/assessments/submissions",
			{ assessment_id: data.assessmentId },
			{ headers: authHeader() },
		);
		const detail = (resp as any)?.response_output?.detail;
		if (!detail) {
			throw new Error(
				(resp as any)?.response_schema?.response_message ||
					"Failed to submit assessment",
			);
		}
		return {
			success: true,
			assessmentId: detail.assessment_id,
			candidateName: data.candidateName,
			candidateEmail: data.candidateEmail,
			submissionId: detail.submission_id,
			timestamp: new Date().toISOString(),
			message: detail.message || "Assessment submitted successfully",
		};
	},

	async authenticate(
		name: string,
		email: string,
		assessmentId: string,
	): Promise<AuthResponse> {
		if (!name || !email || !assessmentId) {
			throw new Error("Name, email, and assessment ID are required");
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email format");
		}
		const { data } = await post<
			AuthenticateRequestDTO,
			AuthenticateResponseDTO
		>("/assessments/authenticate", {
			name,
			email,
			assessment_id: assessmentId,
		});
		// Support both shapes: response_detail or response_detail.detail
		const rd: any = (data as any)?.response_detail;
		const detail = rd?.detail ?? rd;
		if (!detail?.success) {
			const code = (data as any)?.response_schema?.response_code || "UNKNOWN";
			const msg = (data as any)?.response_schema?.response_message || "Authentication failed";
			throw new Error(`${code}: ${msg}`);
		}
		const resp: AuthResponse = {
			success: true,
			candidateId: detail.candidate_id,
			name: detail.name,
			email: detail.email,
			assessmentId: detail.assessment_id,
			token: detail.token,
			timeLimit: detail.time_limit_minutes,
			startedAt: detail.start_at,
		};
		return resp;
	},

	async getAssessmentSession(
		assessmentId: string,
		email: string,
	): Promise<AssessmentSession> {
		if (!assessmentId || !email) {
			throw new Error("Assessment ID and email are required");
		}
		const candidate = sessionStore.getCandidate();
		if (!candidate || candidate.assessmentId !== assessmentId || candidate.email !== email) {
			throw new Error("No active assessment session found. Please login first.");
		}
		const timeLimit = candidate.timeLimit || 0;
		const timeLimitMs = timeLimit * 60 * 1000;
		const startTime = new Date(candidate.startedAt);
		const now = new Date();
		const elapsed = Math.max(0, now.getTime() - startTime.getTime());
		const remaining = Math.max(0, timeLimitMs - elapsed);
		return {
			assessmentId,
			candidateId: candidate.id,
			name: candidate.name,
			email: candidate.email,
			timeLimit,
			startedAt: candidate.startedAt,
			remainingTimeSeconds: Math.floor(remaining / 1000),
			isExpired: remaining <= 0,
		};
	},
};

