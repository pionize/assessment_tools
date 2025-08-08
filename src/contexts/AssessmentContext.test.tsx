import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssessmentProvider, useAssessment } from "./AssessmentContext";
import type {
	Assessment,
	Candidate,
	Challenge,
	SubmissionData,
} from "./context";

// Mock sessionStorage
vi.mock("../utils/sessionStorage", () => ({
	sessionStorage: {
		loadAppState: vi.fn(() => ({
			candidate: null,
			assessment: null,
			submissions: {},
			completedChallenges: new Set(),
			currentChallenge: null,
		})),
		saveAppState: vi.fn(),
	},
}));

describe("AssessmentContext", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<AssessmentProvider>{children}</AssessmentProvider>
	);

	it("should provide initial state", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		expect(result.current.state).toEqual({
			candidate: null,
			assessment: null,
			challenges: [],
			currentChallenge: null,
			loading: false, // Initial loading is false from mock sessionStorage
			error: null,
			submissions: {},
			completedChallenges: new Set(),
		});
	});

	it("should handle SET_CANDIDATE action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		const mockCandidate: Candidate = {
			id: "test-candidate-1",
			name: "John Doe",
			email: "john@example.com",
			assessmentId: "assessment-123",
			token: "mock-token",
			timeLimit: 180,
			startedAt: "2023-01-01T10:00:00.000Z",
		};

		act(() => {
			result.current.dispatch({
				type: "SET_CANDIDATE",
				payload: mockCandidate,
			});
		});

		expect(result.current.state.candidate).toEqual(mockCandidate);
	});

	it("should handle SET_ASSESSMENT action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		const mockAssessment: Assessment = {
			id: "assessment-123",
			title: "JavaScript Test",
			description: "Test your JavaScript skills",
			challenges: ["challenge-1", "challenge-2"],
		};

		act(() => {
			result.current.dispatch({
				type: "SET_ASSESSMENT",
				payload: mockAssessment,
			});
		});

		expect(result.current.state.assessment).toEqual(mockAssessment);
	});

	it("should handle SET_CHALLENGES action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		const mockChallenges: Challenge[] = [
			{
				id: "challenge-1",
				title: "JavaScript Basics",
				type: "code",
				description: "Test JavaScript fundamentals",
				instructions: "Write a function that...",
				timeLimit: 30,
				language: "javascript",
			},
			{
				id: "challenge-2",
				title: "Multiple Choice Quiz",
				type: "multiple-choice",
				description: "Answer questions about JavaScript",
				instructions: "Select the correct answers",
				timeLimit: 15,
			},
		];

		act(() => {
			result.current.dispatch({
				type: "SET_CHALLENGES",
				payload: mockChallenges,
			});
		});

		expect(result.current.state.challenges).toEqual(mockChallenges);
	});

	it("should handle SET_LOADING action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		act(() => {
			result.current.dispatch({
				type: "SET_LOADING",
				payload: false,
			});
		});

		expect(result.current.state.loading).toBe(false);
	});

	it("should handle SET_ERROR action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		act(() => {
			result.current.dispatch({
				type: "SET_ERROR",
				payload: "Test error message",
			});
		});

		expect(result.current.state.error).toBe("Test error message");
		expect(result.current.state.loading).toBe(false);
	});

	it("should handle CLEAR_ERROR action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		// First set an error
		act(() => {
			result.current.dispatch({
				type: "SET_ERROR",
				payload: "Test error message",
			});
		});

		// Then clear it
		act(() => {
			result.current.dispatch({
				type: "CLEAR_ERROR",
			});
		});

		expect(result.current.state.error).toBeNull();
	});

	it("should handle UPDATE_SUBMISSION action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		const submissionData: SubmissionData = {
			challengeId: "challenge-1",
			type: "code",
			files: { "index.js": 'console.log("Hello World")' },
			language: "javascript",
			timestamp: "2023-01-01T10:00:00.000Z",
		};

		act(() => {
			result.current.dispatch({
				type: "UPDATE_SUBMISSION",
				payload: {
					challengeId: "challenge-1",
					submission: submissionData,
				},
			});
		});

		expect(result.current.state.submissions["challenge-1"]).toEqual(
			submissionData,
		);
	});

	it("should handle COMPLETE_CHALLENGE action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		act(() => {
			result.current.dispatch({
				type: "COMPLETE_CHALLENGE",
				payload: { challengeId: "challenge-1" },
			});
		});

		expect(result.current.state.completedChallenges.has("challenge-1")).toBe(
			true,
		);
	});

	it("should handle SET_CURRENT_CHALLENGE action", () => {
		const { result } = renderHook(() => useAssessment(), { wrapper });

		const mockChallenge: Challenge = {
			id: "challenge-1",
			title: "JavaScript Basics",
			type: "code",
			description: "Test JavaScript fundamentals",
			instructions: "Write a function that...",
			timeLimit: 30,
			language: "javascript",
		};

		act(() => {
			result.current.dispatch({
				type: "SET_CURRENT_CHALLENGE",
				payload: mockChallenge,
			});
		});

		expect(result.current.state.currentChallenge).toEqual(mockChallenge);
	});

	it("should throw error when useAssessment is used outside provider", () => {
		// Suppress console.error for this test
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		expect(() => {
			renderHook(() => useAssessment());
		}).toThrow("useAssessment must be used within an AssessmentProvider");

		consoleSpy.mockRestore();
	});
});
