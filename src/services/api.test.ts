import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	apiService,
	type CodeSubmission,
	type MultipleChoiceSubmission,
	type OpenEndedSubmission,
} from "./api";

describe("API Service", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	describe("authenticateCandidate", () => {
		it("should authenticate candidate and return candidate and assessment data", async () => {
			const result = await apiService.authenticateCandidate(
				"John Doe",
				"john@example.com",
				"assessment-123"
			);

			expect(result).toHaveProperty("success", true);
			expect(result).toHaveProperty("name", "John Doe");
			expect(result).toHaveProperty("email", "john@example.com");
			expect(result).toHaveProperty("assessmentId", "assessment-123");
			expect(result).toHaveProperty("candidateId");
			expect(result).toHaveProperty("token");
			expect(result).toHaveProperty("timeLimit");
		});

		it("should return error for invalid assessment ID", async () => {
			const result = await apiService.authenticateCandidate(
				"John Doe",
				"john@example.com",
				"invalid-id"
			);

			expect(result).toHaveProperty("success", false);
			expect(result).toHaveProperty("error", "Assessment not found");
		});

		it("should resume existing session if valid", async () => {
			// First authentication
			await apiService.authenticateCandidate("John Doe", "john@example.com", "assessment-123");

			// Second authentication should resume session
			const result = await apiService.authenticateCandidate(
				"John Doe",
				"john@example.com",
				"assessment-123"
			);

			expect(result).toBeDefined();
			expect(result.name).toBe("John Doe");
			expect(result.email).toBe("john@example.com");
			expect(result.assessmentId).toBe("assessment-123");
		});

		it("should throw error if session expired", async () => {
			// Create an expired session by mocking time
			const originalDate = Date.now;
			Date.now = vi.fn(() => new Date("2023-01-01T10:00:00.000Z").getTime());

			await apiService.authenticateCandidate("John Doe", "john@example.com", "assessment-123");

			// Fast forward time beyond limit
			Date.now = vi.fn(() => new Date("2023-01-01T13:01:00.000Z").getTime());

			await expect(
				apiService.authenticateCandidate("assessment-123", "John Doe", "john@example.com")
			).rejects.toThrow("Assessment session has expired");

			// Restore original Date.now
			Date.now = originalDate;
		});
	});

	describe("getAssessmentSession", () => {
		it("should return session data for authenticated candidate", async () => {
			// First authenticate
			await apiService.authenticateCandidate("John Doe", "john@example.com", "assessment-123");

			const session = await apiService.getAssessmentSession("assessment-123", "john@example.com");

			expect(session).toHaveProperty("assessmentId", "assessment-123");
			expect(session).toHaveProperty("candidateId");
			expect(session).toHaveProperty("name", "John Doe");
			expect(session).toHaveProperty("email", "john@example.com");
			expect(session).toHaveProperty("remainingTimeSeconds");
			expect(session).toHaveProperty("isExpired", false);
		});

		it("should throw error for non-authenticated candidate", async () => {
			await expect(
				apiService.getAssessmentSession("assessment-123", "john@example.com")
			).rejects.toThrow("No active session found");
		});
	});

	describe("getChallenges", () => {
		it("should return challenges for assessment", async () => {
			const challenges = await apiService.getChallenges("assessment-123");

			expect(Array.isArray(challenges)).toBe(true);
			expect(challenges.length).toBeGreaterThan(0);
			expect(challenges[0]).toHaveProperty("id");
			expect(challenges[0]).toHaveProperty("title");
			expect(challenges[0]).toHaveProperty("type");
		});

		it("should throw error for invalid assessment ID", async () => {
			await expect(apiService.getChallenges("invalid-id")).rejects.toThrow("Assessment not found");
		});
	});

	describe("getChallengeDetails", () => {
		it("should return challenge details", async () => {
			const challenge = await apiService.getChallengeDetails("challenge-1");

			expect(challenge).toHaveProperty("id", "challenge-1");
			expect(challenge).toHaveProperty("title");
			expect(challenge).toHaveProperty("type");
			expect(challenge).toHaveProperty("description");
			expect(challenge).toHaveProperty("instructions");
		});

		it("should throw error for invalid challenge ID", async () => {
			await expect(apiService.getChallengeDetails("invalid-id")).rejects.toThrow(
				"Challenge not found"
			);
		});

		it("should return code challenge with files", async () => {
			const challenge = await apiService.getChallengeDetails("challenge-1");

			if (challenge.type === "code") {
				expect(challenge).toHaveProperty("files");
				expect(challenge).toHaveProperty("language");
			}
		});

		it("should return multiple choice challenge with questions", async () => {
			const challenge = await apiService.getChallengeDetails("challenge-3");

			if (challenge.type === "multiple-choice") {
				expect(challenge).toHaveProperty("questions");
				expect(Array.isArray(challenge.questions)).toBe(true);
				if (challenge.questions && challenge.questions.length > 0) {
					expect(challenge.questions[0]).toHaveProperty("id");
					expect(challenge.questions[0]).toHaveProperty("question");
					expect(challenge.questions[0]).toHaveProperty("options");
				}
			}
		});
	});

	describe("submitChallenge", () => {
		beforeEach(async () => {
			// Authenticate first
			await apiService.authenticateCandidate("John Doe", "john@example.com", "assessment-123");
		});

		it("should submit code challenge", async () => {
			const submission = {
				challengeId: "challenge-1",
				type: "code" as const,
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				files: {
					"index.js": 'console.log("Hello World");',
				},
				language: "javascript",
				timestamp: new Date().toISOString(),
			};

			await expect(apiService.submitChallenge(submission)).resolves.not.toThrow();
		});

		it("should submit multiple choice challenge", async () => {
			const submission = {
				challengeId: "challenge-3",
				type: "multiple-choice" as const,
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				answers: {
					q1: "option-a",
					q2: "option-b",
				},
				timestamp: new Date().toISOString(),
				autoSubmit: false,
			};

			await expect(apiService.submitChallenge(submission)).resolves.not.toThrow();
		});

		it("should submit open-ended challenge", async () => {
			const submission = {
				challengeId: "challenge-2",
				type: "open-ended" as const,
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				answer: "This is my answer to the open-ended question.",
				timestamp: new Date().toISOString(),
			};

			await expect(apiService.submitChallenge(submission)).resolves.not.toThrow();
		});

		it("should throw error for invalid challenge ID", async () => {
			const submission = {
				challengeId: "invalid-challenge",
				type: "code" as const,
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				files: {
					"index.js": 'console.log("Hello World");',
				},
				language: "javascript",
				timestamp: new Date().toISOString(),
			};

			await expect(apiService.submitChallenge(submission)).rejects.toThrow("Challenge not found");
		});

		it("should throw error when session expired", async () => {
			// Mock expired session
			const originalDate = Date.now;
			Date.now = vi.fn(() => new Date("2023-01-01T13:01:00.000Z").getTime());

			const submission = {
				challengeId: "challenge-1",
				type: "code" as const,
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				files: {
					"index.js": 'console.log("Hello World");',
				},
				language: "javascript",
				timestamp: new Date().toISOString(),
			};

			await expect(apiService.submitChallenge(submission)).rejects.toThrow(
				"Assessment session has expired"
			);

			Date.now = originalDate;
		});

		it("should validate code submission has files", async () => {
			const submission = {
				challengeId: "challenge-1",
				type: "code" as const,
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				// Missing files
				language: "javascript",
				timestamp: new Date().toISOString(),
			} as unknown as CodeSubmission;

			await expect(apiService.submitChallenge(submission)).rejects.toThrow(
				"Code submission must include files"
			);
		});

		it("should validate multiple choice submission has answers", async () => {
			const submission = {
				challengeId: "challenge-3",
				type: "multiple-choice" as const,
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				// Missing answers
				timestamp: new Date().toISOString(),
				autoSubmit: false,
			} as unknown as MultipleChoiceSubmission;

			await expect(apiService.submitChallenge(submission)).rejects.toThrow(
				"Multiple choice submission must include answers"
			);
		});

		it("should validate open-ended submission has answer", async () => {
			const submission = {
				challengeId: "challenge-2",
				type: "open-ended" as const,
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				// Missing answer
				timestamp: new Date().toISOString(),
			} as unknown as OpenEndedSubmission;

			await expect(apiService.submitChallenge(submission)).rejects.toThrow(
				"Open-ended submission must include an answer"
			);
		});
	});

	describe("finalize assessment", () => {
		beforeEach(async () => {
			// Authenticate first
			await apiService.authenticateCandidate("John Doe", "john@example.com", "assessment-123");
		});

		it("should finalize assessment", async () => {
			await expect(
				apiService.finalizeAssessment({
					assessmentId: "assessment-123",
					candidateName: "John Doe",
					candidateEmail: "john@example.com",
				})
			).resolves.not.toThrow();
		});

		it("should throw error for invalid assessment", async () => {
			await expect(
				apiService.finalizeAssessment({
					assessmentId: "invalid-id",
					candidateName: "John Doe",
					candidateEmail: "john@example.com",
				})
			).rejects.toThrow("No active session found");
		});
	});
});
