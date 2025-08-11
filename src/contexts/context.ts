import type React from "react";
import { createContext } from "react";
export type { Candidate } from "./models/Candidate";
export type { Assessment } from "./models/Assessment";
export type { Challenge } from "./models/Challenge";
export type { AssessmentSession } from "./models/AssessmentSession";
export type { SubmissionData } from "./models/SubmissionData";
export type {
	SubmissionResponse,
	AssessmentSubmissionResponse,
	CodeSubmission,
	OpenEndedSubmission,
	MultipleChoiceSubmission,
} from "./models/Submission";
export type { AuthResponse } from "./models/Auth";

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
