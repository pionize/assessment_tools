import type { ApiResponseOutputDetail, ApiResponseOutputList } from "./common";

export interface ChallengeSummaryDTO {
	id: string;
	title: string;
	type: "code" | "open-ended" | "multiple-choice";
	description: string;
	time_limit?: number;
}

export type ChallengeListResponseDTO =
	ApiResponseOutputList<ChallengeSummaryDTO>;

export interface ChallengeDetailDTO {
	id: string;
	title: string;
	type: "code" | "open-ended" | "multiple-choice";
	description: string;
	instructions?: string;
	time_limit?: number;
	language?: string;
	files?: Record<string, { content: string; language: string } | string>;
	questions?: Array<{
		id: string;
		question: string;
		options: Array<{ id: string; text: string }>;
	}>;
}

export type ChallengeDetailResponseDTO =
	ApiResponseOutputDetail<ChallengeDetailDTO>;
