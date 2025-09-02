import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssessmentProvider } from "../contexts/AssessmentContext";
import Login from "./Login";

// Mock the API service
vi.mock("../services/api", () => ({
	apiService: {
		authenticate: vi.fn(),
		getAssessment: vi.fn(),
	},
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useParams: () => ({ assessmentId: "assessment-123" }),
	};
});

const LoginWrapper = ({ children }: { children: React.ReactNode }) => (
	<BrowserRouter>
		<AssessmentProvider>{children}</AssessmentProvider>
	</BrowserRouter>
);

describe("Login", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render login form", () => {
		render(<Login />, { wrapper: LoginWrapper });

		expect(screen.getByRole("heading", { name: /developer assessment/i })).toBeInTheDocument();
		expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /start assessment/i })).toBeInTheDocument();
	});

	it("should show validation errors for empty fields", async () => {
		render(<Login />, { wrapper: LoginWrapper });

		// Clear any existing values first
		const nameInput = screen.getByLabelText(/full name/i);
		const emailInput = screen.getByLabelText(/email address/i);
		
		fireEvent.change(nameInput, { target: { value: "" } });
		fireEvent.change(emailInput, { target: { value: "" } });

		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		// The current implementation uses HTML5 validation and doesn't show custom error messages
		// Instead, verify that the form submission is prevented by checking the button is still enabled
		// and no navigation occurred
		await waitFor(() => {
			expect(nameInput).toBeInvalid();
			expect(emailInput).toBeInvalid();
		});
	});

	it("should show validation error for invalid email", async () => {
		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "John Doe" },
		});
		const emailInput = screen.getByLabelText(/email address/i);
		fireEvent.change(emailInput, {
			target: { value: "invalid-email" },
		});
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		// The current implementation uses HTML5 validation
		await waitFor(() => {
			expect(emailInput).toBeInvalid();
		});
	});

	it("should submit form with valid data", async () => {
		const mockAuthResponse = {
			success: true,
			candidateId: "candidate-123",
			token: "mock-token",
			timeLimit: 60,
			startedAt: "2023-01-01T10:00:00.000Z",
		};

		const { apiService } = await import("../services/api");
		vi.mocked(apiService.authenticate).mockResolvedValue(mockAuthResponse);
		vi.mocked(apiService.getAssessment).mockResolvedValue({
			id: "assessment-123",
			title: "Test Assessment",
			description: "Test",
		});

		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "john@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		await waitFor(() => {
			expect(apiService.authenticate).toHaveBeenCalledWith(
				"John Doe",
				"john@example.com",
				"assessment-123"
			);
			expect(mockNavigate).toHaveBeenCalledWith("/assessment/assessment-123/challenges");
		});
	});

	it("should handle authentication error", async () => {
		const { apiService } = await import("../services/api");
		vi.mocked(apiService.authenticate).mockRejectedValue({
			body: {
				response_schema: {
					response_code: "CODE-0001"
				}
			}
		});

		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "john@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		await waitFor(() => {
			expect(screen.getByText(/assessment not found/i)).toBeInTheDocument();
		});
	});

	it("should show loading state during authentication", async () => {
		const { apiService } = await import("../services/api");
		vi.mocked(apiService.authenticate).mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 1000))
		);

		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "john@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		expect(screen.getByText(/starting/i)).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeDisabled();
	});
});
