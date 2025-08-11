import { expect, test } from "@playwright/test";

test.describe("Multiple Choice Challenge", () => {
	test.beforeEach(async ({ page }) => {
		// Login and navigate to multiple choice challenge
		await page.goto("/assessment/assessment-123");
		await page.getByLabel(/full name/i).fill("Test User");
		await page.getByLabel(/email address/i).fill("test@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();

		await expect(page).toHaveURL(/.*\/challenges$/);
		await page
			.getByRole("button", { name: /start.*javascript.*quiz/i })
			.click();

		await expect(page).toHaveURL(/.*\/challenge\/challenge-3$/);
	});

	test("should display challenge content", async ({ page }) => {
		await expect(page.getByText("JavaScript Fundamentals Quiz")).toBeVisible();
		await expect(
			page.getByText("Test your knowledge of JavaScript fundamentals"),
		).toBeVisible();
		await expect(
			page.getByText("Answer the following multiple-choice questions"),
		).toBeVisible();
	});

	test("should show questions and options", async ({ page }) => {
		await expect(
			page.getByText("What is the output of `console.log(typeof null);`?"),
		).toBeVisible();
		await expect(page.getByText('"null"')).toBeVisible();
		await expect(page.getByText('"object"')).toBeVisible();
		await expect(page.getByText('"undefined"')).toBeVisible();
		await expect(page.getByText('"boolean"')).toBeVisible();
	});

	test("should allow selecting answers", async ({ page }) => {
		// Click on an option
		await page.getByLabel('"object"').click();

		// Should be selected
		await expect(page.getByLabel('"object"')).toBeChecked();
	});

	test("should update progress counter", async ({ page }) => {
		await expect(page.getByText("0/6 answered")).toBeVisible();

		// Answer first question
		await page.getByLabel('"object"').click();
		await expect(page.getByText("1/6 answered")).toBeVisible();
	});

	test("should disable submit when incomplete", async ({ page }) => {
		const submitButton = page.getByRole("button", { name: /submit answers/i });
		await expect(submitButton).toBeDisabled();
	});

	test("should enable submit when all questions answered", async ({ page }) => {
		// Answer all questions (simplified - clicking first option for each)
		const questions = await page.locator(".challenge-question").count();

		for (let i = 0; i < questions; i++) {
			const questionOptions = page
				.locator(".challenge-question")
				.nth(i)
				.locator('input[type="radio"]');
			await questionOptions.first().click();
		}

		const submitButton = page.getByRole("button", { name: /submit answers/i });
		await expect(submitButton).not.toBeDisabled();
	});

	test("should show confirmation for incomplete submission", async ({
		page,
	}) => {
		// Answer only one question
		await page.getByLabel('"object"').click();

		// Try to submit
		await page.getByRole("button", { name: /submit answers/i }).click();

		// Should show confirmation dialog
		page.on("dialog", (dialog) => {
			expect(dialog.message()).toContain("unanswered");
			dialog.dismiss(); // Cancel submission
		});
	});

	test("should submit and show results", async ({ page }) => {
		// Answer all questions correctly
		await page.getByLabel('"object"').click(); // Q1: typeof null
		await page.locator('label:has-text("push()")').click(); // Q2: array method
		await page.locator('label:has-text("true")').click(); // Q3: truthy values
		await page.locator('label:has-text("3")').click(); // Q4: array length
		await page.locator('label:has-text("ReferenceError")').click(); // Q5: hoisting
		await page.locator('label:has-text("number")').click(); // Q6: parseInt

		// Submit answers
		await page.getByRole("button", { name: /submit answers/i }).click();

		// Handle success alert
		page.on("dialog", (dialog) => dialog.accept());

		// Should show results
		await expect(page.getByText("Quiz Complete!")).toBeVisible();
		await expect(page.getByText(/final score/i)).toBeVisible();

		// Should show explanations
		await expect(page.getByText("Explanation:")).toBeVisible();
	});

	test("should navigate back to challenge list after submission", async ({
		page,
	}) => {
		// Answer all questions
		const questions = await page.locator('[data-testid="question"]').count();

		for (let i = 0; i < questions; i++) {
			const questionOptions = page
				.locator('[data-testid="question"]')
				.nth(i)
				.locator('input[type="radio"]');
			await questionOptions.first().click();
		}

		// Submit
		await page.getByRole("button", { name: /submit answers/i }).click();

		// Handle alert and wait for navigation
		page.on("dialog", (dialog) => dialog.accept());

		// Should navigate back to challenges
		await expect(page).toHaveURL(/.*\/challenges$/, { timeout: 10000 });
	});

	test("should handle back button", async ({ page }) => {
		await page.getByRole("button", { name: /back to challenges/i }).click();
		await expect(page).toHaveURL(/.*\/challenges$/);
	});

	test("should show time remaining in header", async ({ page }) => {
		await expect(page.getByText(/time remaining/i)).toBeVisible();
	});

	test("should be accessible with keyboard navigation", async ({ page }) => {
		// Tab through options
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab"); // Skip back button

		// Should be able to select with Enter/Space
		await page.keyboard.press("Enter");

		// Should be selected
		await expect(page.locator('input[type="radio"]:checked')).toHaveCount(1);
	});

	test("should show different styles for correct/incorrect in results", async ({
		page,
	}) => {
		// Answer questions (mix of correct/incorrect)
		await page.getByLabel('"object"').click(); // Correct
		await page.locator('label:has-text("append()")').click(); // Incorrect
		await page.locator('label:has-text("true")').click();
		await page.locator('label:has-text("3")').click();
		await page.locator('label:has-text("ReferenceError")').click();
		await page.locator('label:has-text("number")').click();

		// Submit
		await page.getByRole("button", { name: /submit answers/i }).click();

		// Handle alert
		page.on("dialog", (dialog) => dialog.accept());

		// Should show different visual indicators for correct/incorrect
		await expect(page.locator(".bg-green-100")).toBeVisible(); // Correct answer styling
		await expect(page.locator(".bg-red-100")).toBeVisible(); // Wrong answer styling
	});

	test("should work on mobile devices", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should still be functional on mobile
		await expect(page.getByText("JavaScript Fundamentals Quiz")).toBeVisible();
		await page.getByLabel('"object"').click();
		await expect(page.getByLabel('"object"')).toBeChecked();
	});
});
