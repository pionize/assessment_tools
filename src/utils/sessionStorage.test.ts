import { beforeEach, describe, expect, it } from "vitest";
import type { Assessment, Candidate, Challenge } from "../contexts/context";
import { sessionStorage } from "./sessionStorage";

describe("sessionStorage", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	describe("candidate operations", () => {
		const mockCandidate: Candidate = {
			id: "test-candidate-1",
			name: "John Doe",
			email: "john@example.com",
			assessmentId: "assessment-123",
			token: "mock-token",
			timeLimit: 180,
			startedAt: "2023-01-01T10:00:00.000Z",
		};

		it("should save and retrieve candidate", () => {
			sessionStorage.saveCandidate(mockCandidate);
			const retrieved = sessionStorage.getCandidate();

			expect(retrieved).toEqual(mockCandidate);
		});

		it("should return null when no candidate is saved", () => {
			const retrieved = sessionStorage.getCandidate();
			expect(retrieved).toBeNull();
		});

		it("should handle invalid JSON in localStorage", () => {
			// Mock console.error to suppress expected error message
			const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			
			localStorage.setItem("candidate_session", "invalid json");
			const retrieved = sessionStorage.getCandidate();
			expect(retrieved).toBeNull();
			
			// Verify that console.error was called
			expect(consoleSpy).toHaveBeenCalledWith(
				"Error getting candidate from localStorage:", 
				expect.any(SyntaxError)
			);
			
			consoleSpy.mockRestore();
		});
	});

	describe("assessment operations", () => {
		const mockAssessment: Assessment = {
			id: "assessment-123",
			title: "JavaScript Test",
			description: "Test your JavaScript skills",
			challenges: ["challenge-1", "challenge-2"],
			timeLimit: 180,
		};

		it("should save and retrieve assessment", () => {
			sessionStorage.saveAssessment(mockAssessment);
			const retrieved = sessionStorage.getAssessment();

			expect(retrieved).toEqual(mockAssessment);
		});

		it("should return null when no assessment is saved", () => {
			const retrieved = sessionStorage.getAssessment();
			expect(retrieved).toBeNull();
		});
	});

	describe("submissions operations", () => {
		const mockSubmissions = {
			"challenge-1": "My answer to challenge 1",
			"challenge-2": { answer: "My answer to challenge 2" },
			"challenge-3": ["file1.js", "file2.js"],
		};

		it("should save and retrieve submissions", () => {
			sessionStorage.saveSubmissions(mockSubmissions);
			const retrieved = sessionStorage.getSubmissions();

			expect(retrieved).toEqual(mockSubmissions);
		});

		it("should return empty object when no submissions are saved", () => {
			const retrieved = sessionStorage.getSubmissions();
			expect(retrieved).toEqual({});
		});
	});

	describe("completed challenges operations", () => {
		const mockCompleted = new Set(["challenge-1", "challenge-3"]);

		it("should save and retrieve completed challenges", () => {
			sessionStorage.saveCompletedChallenges(mockCompleted);
			const retrieved = sessionStorage.getCompletedChallenges();

			expect(retrieved).toEqual(mockCompleted);
		});

		it("should return empty Set when no completed challenges are saved", () => {
			const retrieved = sessionStorage.getCompletedChallenges();
			expect(retrieved).toEqual(new Set());
		});
	});

	describe("current challenge operations", () => {
		const mockChallenge: Challenge = {
			id: "challenge-1",
			title: "JavaScript Basics",
			type: "code",
			description: "Test JavaScript fundamentals",
			instructions: "Write a function that...",
			timeLimit: 30,
			language: "javascript",
		};

		it("should save and retrieve current challenge", () => {
			sessionStorage.saveCurrentChallenge(mockChallenge);
			const retrieved = sessionStorage.getCurrentChallenge();

			expect(retrieved).toEqual(mockChallenge);
		});

		it("should return null when no current challenge is saved", () => {
			const retrieved = sessionStorage.getCurrentChallenge();
			expect(retrieved).toBeNull();
		});
	});

	describe("session management", () => {
		it("should check if session exists for assessment", () => {
			const mockCandidate: Candidate = {
				id: "test-candidate-1",
				name: "John Doe",
				email: "john@example.com",
				assessmentId: "assessment-123",
				token: "mock-token",
				timeLimit: 180,
				startedAt: "2023-01-01T10:00:00.000Z",
			};

			sessionStorage.saveCandidate(mockCandidate);

			expect(sessionStorage.hasSessionForAssessment("assessment-123")).toBe(true);
			expect(sessionStorage.hasSessionForAssessment("other-assessment")).toBe(false);
		});

		it("should clear entire session", () => {
			const mockCandidate: Candidate = {
				id: "test-candidate-1",
				name: "John Doe",
				email: "john@example.com",
				assessmentId: "assessment-123",
				token: "mock-token",
				timeLimit: 180,
				startedAt: "2023-01-01T10:00:00.000Z",
			};

			sessionStorage.saveCandidate(mockCandidate);
			sessionStorage.saveSubmissions({ "challenge-1": "answer" });

			sessionStorage.clearSession();

			expect(sessionStorage.getCandidate()).toBeNull();
			expect(sessionStorage.getSubmissions()).toEqual({});
		});

		it("should clear only candidate session", () => {
			const mockCandidate: Candidate = {
				id: "test-candidate-1",
				name: "John Doe",
				email: "john@example.com",
				assessmentId: "assessment-123",
				token: "mock-token",
				timeLimit: 180,
				startedAt: "2023-01-01T10:00:00.000Z",
			};

			const mockAssessment: Assessment = {
				id: "assessment-123",
				title: "JavaScript Test",
				description: "Test your JavaScript skills",
				challenges: ["challenge-1", "challenge-2"],
			};

			sessionStorage.saveCandidate(mockCandidate);
			sessionStorage.saveAssessment(mockAssessment);

			sessionStorage.clearCandidateSession();

			expect(sessionStorage.getCandidate()).toBeNull();
			expect(sessionStorage.getAssessment()).toEqual(mockAssessment); // Assessment should remain
		});
	});

	describe("app state operations", () => {
		it("should save and load complete app state", () => {
			const mockCandidate: Candidate = {
				id: "test-candidate-1",
				name: "John Doe",
				email: "john@example.com",
				assessmentId: "assessment-123",
				token: "mock-token",
				timeLimit: 180,
				startedAt: "2023-01-01T10:00:00.000Z",
			};

			const mockAssessment: Assessment = {
				id: "assessment-123",
				title: "JavaScript Test",
				description: "Test your JavaScript skills",
				challenges: ["challenge-1", "challenge-2"],
			};

			const mockSubmissions = { "challenge-1": "answer" };
			const mockCompleted = new Set(["challenge-1"]);

			const state = {
				candidate: mockCandidate,
				assessment: mockAssessment,
				submissions: mockSubmissions,
				completedChallenges: mockCompleted,
				currentChallenge: null,
			};

			sessionStorage.saveAppState(state);
			const loaded = sessionStorage.loadAppState();

			expect(loaded.candidate).toEqual(mockCandidate);
			expect(loaded.assessment).toEqual(mockAssessment);
			expect(loaded.submissions).toEqual(mockSubmissions);
			expect(loaded.completedChallenges).toEqual(mockCompleted);
			expect(loaded.currentChallenge).toBeNull();
		});
	});
});
