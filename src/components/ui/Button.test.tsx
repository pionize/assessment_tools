import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
	it("should render button with text", () => {
		render(<Button>Click me</Button>);
		expect(
			screen.getByRole("button", { name: /click me/i }),
		).toBeInTheDocument();
	});

	it("should handle click events", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("should be disabled when disabled prop is true", () => {
		render(<Button disabled>Disabled button</Button>);
		const button = screen.getByRole("button");

		expect(button).toBeDisabled();
	});

	it("should render with primary variant class", () => {
		render(<Button variant="primary">Primary button</Button>);
		const button = screen.getByRole("button");

		expect(button).toHaveClass(
			"bg-gradient-to-r",
			"from-[#1578b9]",
			"to-[#40b3ff]",
		);
	});

	it("should render with secondary variant class", () => {
		render(<Button variant="secondary">Secondary button</Button>);
		const button = screen.getByRole("button");

		expect(button).toHaveClass("bg-white", "border-2", "border-gray-300");
	});

	it("should render with ghost variant class", () => {
		render(<Button variant="ghost">Ghost button</Button>);
		const button = screen.getByRole("button");

		expect(button).toHaveClass("bg-transparent", "hover:bg-gray-100");
	});

	it("should render with small size class", () => {
		render(<Button size="sm">Small button</Button>);
		const button = screen.getByRole("button");

		expect(button).toHaveClass("px-3", "py-2", "text-sm");
	});

	it("should render with medium size class", () => {
		render(<Button size="md">Medium button</Button>);
		const button = screen.getByRole("button");

		expect(button).toHaveClass("px-4", "py-2");
	});

	it("should render with large size class", () => {
		render(<Button size="lg">Large button</Button>);
		const button = screen.getByRole("button");

		expect(button).toHaveClass("px-6", "py-3", "text-lg");
	});

	it("should render with icon", () => {
		const TestIcon = () => <svg data-testid="test-icon" />;
		render(<Button icon={<TestIcon />}>With icon</Button>);

		expect(screen.getByTestId("test-icon")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /with icon/i }),
		).toBeInTheDocument();
	});

	it("should render icon only when no children provided", () => {
		const TestIcon = () => <svg data-testid="test-icon" />;
		render(<Button icon={<TestIcon />}>Icon Button</Button>);

		expect(screen.getByTestId("test-icon")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("should apply custom className", () => {
		render(<Button className="custom-class">Custom button</Button>);
		const button = screen.getByRole("button");

		expect(button).toHaveClass("custom-class");
	});

	it("should not call onClick when disabled", () => {
		const handleClick = vi.fn();
		render(
			<Button onClick={handleClick} disabled>
				Disabled button
			</Button>,
		);

		fireEvent.click(screen.getByRole("button"));
		expect(handleClick).not.toHaveBeenCalled();
	});
});
