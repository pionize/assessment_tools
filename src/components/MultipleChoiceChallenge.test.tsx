import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Challenge } from "../services/api";
import MultipleChoiceChallenge from "./MultipleChoiceChallenge";

const mockChallenge: Challenge = {
	id: "challenge-1",
	title: "JavaScript Fundamentals Quiz",
	type: "multiple-choice",
	description: "Test your knowledge of JavaScript fundamentals.",
	instructions: "Answer the following multiple-choice questions.",
	timeLimit: 25,
	questions: [
		{
			id: "q1",
			question: "What is the output of `console.log(typeof null);`?",
			options: [
				{ id: "a", text: '"null"' },
				{ id: "b", text: '"object"' },
				{ id: "c", text: '"undefined"' },
				{ id: "d", text: '"boolean"' },
			],
		},
		{
			id: "q2",
			question:
				"Which method is used to add an element to the end of an array?",
			options: [
				{ id: "a", text: "append()" },
				{ id: "b", text: "push()" },
				{ id: "c", text: "add()" },
				{ id: "d", text: "insert()" },
			],
		},
	],
};

describe("MultipleChoiceChallenge", () => {
	const mockOnSubmit = vi.fn();
	const mockOnBack = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render challenge questions and options", () => {
		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		expect(
			screen.getByText("JavaScript Fundamentals Quiz"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Test your knowledge of JavaScript fundamentals."),
		).toBeInTheDocument();
		expect(
			screen.getByText("What is the output of `console.log(typeof null);`?"),
		).toBeInTheDocument();
		expect(screen.getByText('"null"')).toBeInTheDocument();
		expect(screen.getByText('"object"')).toBeInTheDocument();
	});

	it("should allow selecting answers", () => {
		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		const option = screen.getByLabelText('"object"');
		fireEvent.click(option);

		expect(option).toBeChecked();
	});

	it("should show progress counter", () => {
		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		expect(screen.getByText("0/2 answered")).toBeInTheDocument();
		expect(
			screen.getByText("Progress: 0/2 questions completed"),
		).toBeInTheDocument();
	});

	it("should update progress when answers are selected", () => {
		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		// Answer first question
		fireEvent.click(screen.getByLabelText('"object"'));

		expect(screen.getByText("1/2 answered")).toBeInTheDocument();
		expect(
			screen.getByText("Progress: 1/2 questions completed"),
		).toBeInTheDocument();
	});

	it("should disable submit button when not all questions are answered", () => {
		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		const submitButton = screen.getByRole("button", {
			name: /submit answers/i,
		});
		expect(submitButton).toBeDisabled();
	});

	it("should enable submit button when all questions are answered", () => {
		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		// Answer both questions
		fireEvent.click(screen.getByLabelText('"object"'));
		fireEvent.click(screen.getByLabelText("push()"));

		const submitButton = screen.getByRole("button", {
			name: /submit answers/i,
		});
		expect(submitButton).not.toBeDisabled();
	});

	it("should call onSubmit when form is submitted with all answers", async () => {
		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		// Answer both questions
		fireEvent.click(screen.getByLabelText('"object"'));
		fireEvent.click(screen.getByLabelText("push()"));

		fireEvent.click(screen.getByRole("button", { name: /submit answers/i }));

		await waitFor(() => {
			expect(mockOnSubmit).toHaveBeenCalledWith({
				challengeId: "challenge-1",
				type: "multiple-choice",
				answers: {
					q1: "b",
					q2: "b",
				},
				timestamp: expect.any(String),
				autoSubmit: false,
			});
		});
	});

	it("should show confirmation dialog when submitting incomplete answers", () => {
		// Mock window.confirm
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		// Answer only first question
		fireEvent.click(screen.getByLabelText('"object"'));

		// Try to submit
		fireEvent.click(screen.getByRole("button", { name: /submit answers/i }));

		expect(confirmSpy).toHaveBeenCalledWith(
			"You have 1 unanswered question. Are you sure you want to submit?",
		);
		expect(mockOnSubmit).not.toHaveBeenCalled();

		confirmSpy.mockRestore();
	});

	it("should submit when user confirms incomplete submission", async () => {
		// Mock window.confirm to return true
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		// Answer only first question
		fireEvent.click(screen.getByLabelText('"object"'));

		// Try to submit
		fireEvent.click(screen.getByRole("button", { name: /submit answers/i }));

		await waitFor(() => {
			expect(mockOnSubmit).toHaveBeenCalledWith({
				challengeId: "challenge-1",
				type: "multiple-choice",
				answers: {
					q1: "b",
				},
				timestamp: expect.any(String),
				autoSubmit: false,
			});
		});

		confirmSpy.mockRestore();
	});

	it("should call onBack when back button is clicked", () => {
		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: /back to challenges/i }),
		);

		expect(mockOnBack).toHaveBeenCalledTimes(1);
	});

	it("should load saved answers", () => {
		const savedAnswers = {
			answers: { q1: "b", q2: "b" },
			submitted: false,
		};

		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
				savedAnswers={savedAnswers}
			/>,
		);

		// Check that saved answers are selected
		expect(screen.getByDisplayValue("b")).toBeChecked();
		expect(screen.getByText("2/2 answered")).toBeInTheDocument();
	});

	it("should show results when answers were previously submitted", () => {
		const savedAnswers = {
			answers: { q1: "b", q2: "b" },
			submitted: true,
		};

		render(
			<MultipleChoiceChallenge
				challenge={mockChallenge}
				onSubmit={mockOnSubmit}
				onBack={mockOnBack}
				savedAnswers={savedAnswers}
			/>,
		);

		expect(screen.getByText("Quiz Complete!")).toBeInTheDocument();
		expect(
			screen.getByText("You answered 2 out of 2 questions"),
		).toBeInTheDocument();
	});

});
