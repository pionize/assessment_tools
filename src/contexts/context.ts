import type React from "react";
import { createContext } from "react";

// Type definitions for the context
export interface Candidate {
	id: string;
	name: string;
	email: string;
	assessmentId: string;
	token: string;
	timeLimit: number;
	startedAt: string;
}

export interface Assessment {
	id: string;
	title: string;
	description: string;
	challenges: string[];
	timeLimit?: number;
}

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
		correctAnswer: string;
		explanation: string;
	}>;
}

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

export interface AssessmentState {
	candidate: Candidate | null;
	assessment: Assessment | null;
	challenges: Challenge[];
	currentChallenge: Challenge | null;
	loading: boolean;
	error: string | null;
	submissions: Record<string, SubmissionData>;
	completedChallenges: Set<string>;
}

export interface AssessmentAction {
	type: string;
	payload?: unknown;
}

export interface AssessmentContextType {
	state: AssessmentState;
	dispatch: React.Dispatch<AssessmentAction>;
}

// Create the context with proper typing
export const AssessmentContext = createContext<
	AssessmentContextType | undefined
>(undefined);
