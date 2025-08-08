/* eslint-disable react-refresh/only-export-components */
import type React from "react";
import { useContext, useEffect, useReducer } from "react";
import { sessionStorage } from "../utils/sessionStorage";
import type { AssessmentAction, AssessmentState, SubmissionData, Candidate, Assessment, Challenge } from "./context";
import type { Submissions } from "../utils/sessionStorage";
import { AssessmentContext } from "./context";

const initialState: AssessmentState = {
	candidate: null,
	assessment: null,
	challenges: [],
	currentChallenge: null,
	loading: true, // Start with loading true
	error: null,
	submissions: {},
	completedChallenges: new Set(),
};

// This function runs only once to initialize the state
const init = (initialState: AssessmentState): AssessmentState => {
	const loadedState = sessionStorage.loadAppState();
	if (loadedState?.candidate) {
		// Convert sessionStorage submissions to AssessmentState format
		const convertedSubmissions: Record<string, SubmissionData> = {};
		if (loadedState.submissions) {
			for (const [challengeId, value] of Object.entries(loadedState.submissions)) {
				if (value !== null) {
					if (typeof value === 'string') {
						convertedSubmissions[challengeId] = {
							challengeId,
							type: 'open-ended',
							answer: value,
							timestamp: new Date().toISOString()
						};
					} else if (Array.isArray(value)) {
						convertedSubmissions[challengeId] = {
							challengeId,
							type: 'code',
							files: value.reduce((acc, file, idx) => { acc[`file${idx}`] = file; return acc; }, {} as Record<string, string>),
							timestamp: new Date().toISOString()
						};
					} else if (typeof value === 'object' && 'answer' in value) {
						convertedSubmissions[challengeId] = {
							challengeId,
							type: 'open-ended',
							answer: value.answer,
							timestamp: new Date().toISOString()
						};
					}
				}
			}
		}
		return { 
			...initialState, 
			candidate: loadedState.candidate,
			assessment: loadedState.assessment,
			challenges: loadedState.challenges || [],
			currentChallenge: loadedState.currentChallenge,
			submissions: convertedSubmissions,
			completedChallenges: loadedState.completedChallenges,
			loading: false 
		};
	}
	return { ...initialState, loading: false }; // Ensure loading is false if no session
};

function assessmentReducer(
	state: AssessmentState,
	action: AssessmentAction,
): AssessmentState {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload as boolean };
		case "SET_ERROR":
			return { ...state, error: action.payload as string | null, loading: false };
		case "CLEAR_ERROR":
			return { ...state, error: null };
		case "SET_CANDIDATE":
			return { ...state, candidate: action.payload as Candidate | null };
		case "SET_ASSESSMENT":
			return { ...state, assessment: action.payload as Assessment | null };
		case "SET_CHALLENGES":
			return { ...state, challenges: action.payload as Challenge[] };
		case "SET_CURRENT_CHALLENGE":
			return { ...state, currentChallenge: action.payload as Challenge | null };
		case "UPDATE_SUBMISSION": {
			const payload = action.payload as { challengeId: string; submission: SubmissionData };
			return {
				...state,
				submissions: {
					...state.submissions,
					[payload.challengeId]: payload.submission,
				},
			};
		}
		case "COMPLETE_CHALLENGE": {
			const payload = action.payload as { challengeId: string };
			const newCompleted = new Set(state.completedChallenges);
			newCompleted.add(payload.challengeId);
			return {
				...state,
				completedChallenges: newCompleted,
			};
		}
		case "RESET_ASSESSMENT":
			sessionStorage.clearSession(); // Clear storage on reset
			return { ...initialState, loading: false }; // Return a clean state
		default:
			return state;
	}
}

export function AssessmentProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [state, dispatch] = useReducer(assessmentReducer, initialState, init);

	// This effect synchronizes state changes back to session storage
	useEffect(() => {
		// We don't save loading/error states
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { loading: _loading, error: _error, ...stateToSave } = state;
		// Convert AssessmentState submissions back to sessionStorage format
		const convertedSubmissions: Submissions = {};
		for (const [challengeId, submission] of Object.entries(stateToSave.submissions)) {
			if (submission.type === 'open-ended' && submission.answer) {
				convertedSubmissions[challengeId] = { answer: submission.answer };
			} else if (submission.type === 'multiple-choice' && submission.answers) {
				convertedSubmissions[challengeId] = submission.answers;
			} else if (submission.type === 'code' && submission.files) {
				convertedSubmissions[challengeId] = Object.values(submission.files);
			}
		}
		sessionStorage.saveAppState({
			...stateToSave,
			submissions: convertedSubmissions
		});
	}, [state]);

	return (
		<AssessmentContext.Provider value={{ state, dispatch }}>
			{children}
		</AssessmentContext.Provider>
	);
}

export function useAssessment() {
	const context = useContext(AssessmentContext);
	if (context === undefined) {
		throw new Error("useAssessment must be used within an AssessmentProvider");
	}
	return context;
}
