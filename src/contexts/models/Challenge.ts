export interface Challenge {
	id: string;
	title: string;
	type: "code" | "open-ended" | "multiple-choice";
	description: string;
	instructions: string;
	timeLimit: number;
	language?: string;
	files?: Record<string, { content: string; language: string }>;
	questions?: Array<{
		id: string;
		question: string;
		options: Array<{ id: string; text: string }>;
	}>;
}
