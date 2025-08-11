import type { ApiResponseOutputDetail } from "./common";

export interface AssessmentDetailDTO {
	id: string;
	title: string;
	description: string;
}

export type AssessmentDetailResponseDTO =
	ApiResponseOutputDetail<AssessmentDetailDTO>;

