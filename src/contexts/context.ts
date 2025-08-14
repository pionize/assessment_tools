import type React from "react";
import { createContext } from "react";
import type { Assessment } from "./models/Assessment";
import type { AssessmentSession } from "./models/AssessmentSession";
import type { AuthResponse } from "./models/Auth";
import type { Candidate } from "./models/Candidate";
import type { Challenge } from "./models/Challenge";
import type {
	AssessmentSubmissionResponse,
	CodeSubmission,
	MultipleChoiceSubmission,
	OpenEndedSubmission,
	SubmissionResponse,
} from "./models/Submission";
import type { SubmissionData } from "./models/SubmissionData";

export type {
	Candidate,
	Assessment,
	Challenge,
	AssessmentSession,
	SubmissionData,
	SubmissionResponse,
	AssessmentSubmissionResponse,
	CodeSubmission,
	OpenEndedSubmission,
	MultipleChoiceSubmission,
	AuthResponse,
};

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
export const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);
