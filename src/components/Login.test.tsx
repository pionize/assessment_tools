import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssessmentProvider } from "../contexts/AssessmentContext";
import Login from "./Login";

// Mock the API service
vi.mock("../services/api", () => ({
	apiService: {
		authenticateCandidate: vi.fn(),
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

		expect(
			screen.getByRole("heading", { name: /developer assessment/i }),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /start assessment/i }),
		).toBeInTheDocument();
	});

	it("should show validation errors for empty fields", async () => {
		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		await waitFor(() => {
			expect(screen.getByText(/name is required/i)).toBeInTheDocument();
			expect(screen.getByText(/email is required/i)).toBeInTheDocument();
		});
	});

	it("should show validation error for invalid email", async () => {
		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "invalid-email" },
		});
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		await waitFor(() => {
			expect(
				screen.getByText(/please enter a valid email address/i),
			).toBeInTheDocument();
		});
	});

	it("should submit form with valid data", async () => {
		const mockAuthResponse = {
			success: true,
			session: {
				assessmentId: "assessment-123",
				candidateName: "John Doe",
				candidateEmail: "john@example.com",
				startedAt: "2023-01-01T10:00:00.000Z",
				submissions: {},
				isFinalized: false,
			},
		};

		const { apiService } = await import("../services/api");
		vi.mocked(apiService.authenticateCandidate).mockResolvedValue(
			mockAuthResponse,
		);

		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "john@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		await waitFor(() => {
			expect(apiService.authenticateCandidate).toHaveBeenCalledWith(
				"assessment-123",
				"John Doe",
				"john@example.com",
			);
			expect(mockNavigate).toHaveBeenCalledWith(
				"/assessment/assessment-123/challenges",
			);
		});
	});

	it("should handle authentication error", async () => {
		const { apiService } = await import("../services/api");
		vi.mocked(apiService.authenticateCandidate).mockRejectedValue(
			new Error("Authentication failed"),
		);

		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "john@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		await waitFor(() => {
			expect(screen.getByText(/authentication failed/i)).toBeInTheDocument();
		});
	});

	it("should show loading state during authentication", async () => {
		const { apiService } = await import("../services/api");
		vi.mocked(apiService.authenticateCandidate).mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 1000)),
		);

		render(<Login />, { wrapper: LoginWrapper });

		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "John Doe" },
		});
		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: "john@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		expect(screen.getByText(/starting assessment/i)).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeDisabled();
	});
});
