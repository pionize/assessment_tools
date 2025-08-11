// API service implementing real HTTP calls per docs/api-contract

import type {
	Assessment,
	AssessmentSession,
	AssessmentSubmissionResponse,
	AuthResponse,
	Challenge,
	CodeSubmission,
	MultipleChoiceSubmission,
	OpenEndedSubmission,
	SubmissionResponse,
} from "../contexts/context";

// Re-export types for external consumers
export type {
	Assessment,
	AssessmentSession,
	AssessmentSubmissionResponse,
	AuthResponse,
	Challenge,
	CodeSubmission,
	MultipleChoiceSubmission,
	OpenEndedSubmission,
	SubmissionResponse,
};

type ChallengeSummary = Pick<
	Challenge,
	"id" | "title" | "type" | "description" | "timeLimit"
>;

// Submission types now imported from contexts

// AuthResponse type imported from contexts

// AssessmentSession type imported from contexts

import { sessionStorage as sessionStore } from "../utils/sessionStorage";
import type { AssessmentDetailResponseDTO } from "./dto/assessment";
import type {
	AuthenticateRequestDTO,
	AuthenticateResponseDTO,
} from "./dto/auth";
import type {
	ChallengeDetailDTO,
	ChallengeDetailResponseDTO,
	ChallengeListResponseDTO,
} from "./dto/challenge";
import { get, post } from "./httpClient";

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
		timeLimit: dto.time_limit || 0,
	};
}

function toChallengeDetail(dto: ChallengeDetailDTO): Challenge {
	// TODO: Backend may return files as string content; normalize to { content, language } strictly.
	const normalizedFiles: Record<string, { content: string; language: string }> =
		{};
	if (dto.files) {
		for (const [path, value] of Object.entries(dto.files)) {
			if (typeof value === "string") {
				normalizedFiles[path] = {
					content: value,
					// TODO: Choose a better default; falling back to dto.language or 'plaintext'.
					language: dto.language || "plaintext",
				};
			} else if (value && typeof value === "object") {
				const fileValue = value as { content?: string; language?: string };
				normalizedFiles[path] = {
					content: fileValue.content || "",
					language: fileValue.language || dto.language || "plaintext",
				};
			}
		}
	}

	return {
		id: dto.id,
		title: dto.title,
		type: dto.type,
		description: dto.description,
		// TODO: Confirm instructions always present; domain model marks it required.
		instructions: (dto as { instructions?: string }).instructions || "",
		timeLimit: (dto as { time_limit?: number }).time_limit || 0,
		language: dto.language,
		files: normalizedFiles,
		questions: dto.questions?.map((q) => ({
			// Normalize id to string for UI components.
			id: String(q.id),
			question: q.question,
			options:
				q.options?.map((o) => ({ id: String(o.id), text: o.text })) || [],
			// TODO: DTO marks these optional; UI expects present on MC details. Guard/null-check in components if needed.
			explanation: (q as { explanation?: string }).explanation || "",
		})),
	} as Challenge;
}

export const apiService = {
	async getAssessment(assessmentId: string): Promise<Assessment> {
		const { data } = await get<AssessmentDetailResponseDTO>(
			`/assessments/${encodeURIComponent(assessmentId)}`,
			{ headers: authHeader() },
		);
		const detail = (
			data as {
				response_output?: {
					detail?: { id: string; title: string; description: string };
				};
			}
		)?.response_output?.detail;
		if (!detail) {
			throw new Error(
				(data as { response_schema?: { response_message?: string } })
					?.response_schema?.response_message || "Failed to load assessment",
			);
		}
		return {
			id: detail.id,
			title: detail.title,
			description: detail.description,
			// TODO: Backend assessment detail does not include time_limit. Consider deriving from authenticate response when displaying.
		} as Assessment;
	},

	async getChallenges(assessmentId: string): Promise<ChallengeSummary[]> {
		const { data } = await get<ChallengeListResponseDTO>(
			`/assessments/${encodeURIComponent(assessmentId)}/challenges`,
			{ headers: authHeader() },
		);
		const list = (data as { response_output?: { content?: unknown } })
			?.response_output?.content;
		if (!Array.isArray(list)) {
			throw new Error(
				(data as { response_schema?: { response_message?: string } })
					?.response_schema?.response_message || "Failed to load challenges",
			);
		}
		return list.map(toChallengeSummary);
	},

	async getChallengeDetails(challengeId: string): Promise<Challenge> {
		const { data } = await get<ChallengeDetailResponseDTO>(
			`/challenges/${encodeURIComponent(challengeId)}`,
			{ headers: authHeader() },
		);
		const detail = (data as { response_output?: { detail?: unknown } })
			?.response_output?.detail;
		if (!detail) {
			throw new Error(
				(data as { response_schema?: { response_message?: string } })
					?.response_schema?.response_message || "Failed to load challenge",
			);
		}
		return toChallengeDetail(detail as ChallengeDetailDTO);
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
			Record<string, unknown>,
			{
				response_output?: {
					detail?: { submission_id: string; message?: string };
				};
				response_schema?: { response_message?: string };
			}
		>("/challenges/submissions", body, { headers: authHeader() });

		const detail = (
			data as {
				response_output?: {
					detail?: { submission_id: string; message?: string };
				};
			}
		)?.response_output?.detail;
		if (!detail) {
			throw new Error(
				(data as { response_schema?: { response_message?: string } })
					?.response_schema?.response_message || "Failed to submit challenge",
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
					detail?: {
						submission_id: string;
						message?: string;
						assessment_id: string;
					};
				};
				response_schema?: { response_message?: string };
			}
		>(
			"/assessments/submissions",
			{ assessment_id: data.assessmentId },
			{ headers: authHeader() },
		);
		const detail = (
			resp as {
				response_output?: {
					detail?: {
						submission_id: string;
						message?: string;
						assessment_id: string;
					};
				};
			}
		)?.response_output?.detail;
		if (!detail) {
			throw new Error(
				(resp as { response_schema?: { response_message?: string } })
					?.response_schema?.response_message || "Failed to submit assessment",
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
		const rd = (data as { response_detail?: { detail?: unknown } | unknown })
			?.response_detail;
		const detail = (rd as { detail?: unknown })?.detail ?? rd;
		const detailTyped = detail as {
			success?: boolean;
			candidate_id?: string;
			name?: string;
			email?: string;
			assessment_id?: string;
			token?: string;
			time_limit_minutes?: number;
			start_at?: string;
		};
		if (!detailTyped?.success) {
			const code =
				(data as { response_schema?: { response_code?: string } })
					?.response_schema?.response_code || "UNKNOWN";
			const msg =
				(data as { response_schema?: { response_message?: string } })
					?.response_schema?.response_message || "Authentication failed";
			throw new Error(`${code}: ${msg}`);
		}
		const resp: AuthResponse = {
			success: true,
			candidateId: detailTyped.candidate_id || "",
			name: detailTyped.name || "",
			email: detailTyped.email || "",
			assessmentId: detailTyped.assessment_id || "",
			token: detailTyped.token || "",
			timeLimit: detailTyped.time_limit_minutes || 0,
			startedAt: detailTyped.start_at || new Date().toISOString(),
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
		if (
			!candidate ||
			candidate.assessmentId !== assessmentId ||
			candidate.email !== email
		) {
			throw new Error(
				"No active assessment session found. Please login first.",
			);
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

	// Alias for authenticate method to maintain backward compatibility
	authenticateCandidate: async (
		name: string,
		email: string,
		assessmentId: string,
	): Promise<AuthResponse> => {
		return apiService.authenticate(name, email, assessmentId);
	},

	// Alias for submitAssessment method to maintain backward compatibility
	finalizeAssessment: async (data: {
		assessmentId: string;
		candidateName: string;
		candidateEmail: string;
	}): Promise<AssessmentSubmissionResponse> => {
		return apiService.submitAssessment(data);
	},
};
