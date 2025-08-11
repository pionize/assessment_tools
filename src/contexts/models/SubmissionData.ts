export interface SubmissionData {
	challengeId: string;
	type: "code" | "multiple-choice" | "open-ended";
	files?: Record<string, string>;
	language?: string;
	answers?: Record<string, string>;
	answer?: string;
	timestamp: string;
	autoSubmit?: boolean;
}
