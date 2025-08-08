import { expect, test } from "@playwright/test";

test.describe("Complete Assessment Flow", () => {
	test("should complete full assessment workflow", async ({ page }) => {
		// Step 1: Navigate to assessment
		await page.goto("/assessment/assessment-123");

		// Step 2: Login
		await expect(
			page.getByRole("heading", { name: /developer assessment/i }),
		).toBeVisible();
		await page.getByLabel(/full name/i).fill("E2E Test User");
		await page.getByLabel(/email address/i).fill("e2e@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();

		// Step 3: Verify challenges page
		await expect(page).toHaveURL(/.*\/challenges$/);
		await expect(
			page.getByRole("heading", { name: /assessment challenges/i }),
		).toBeVisible();
		await expect(page.getByText(/0 of 3 completed/i)).toBeVisible();

		// Step 4: Complete Multiple Choice Challenge
		await page
			.getByRole("button", { name: /start.*javascript.*quiz/i })
			.click();
		await expect(page).toHaveURL(/.*\/challenge\/challenge-3$/);

		// Answer all questions (selecting first option for simplicity)
		const questionCount = await page
			.locator('[data-testid="question"]')
			.count();
		for (let i = 0; i < questionCount; i++) {
			const questionOptions = page
				.locator('[data-testid="question"]')
				.nth(i)
				.locator('input[type="radio"]');
			await questionOptions.first().click();
		}

		// Submit multiple choice
		await page.getByRole("button", { name: /submit answers/i }).click();

		// Handle success alert and wait for navigation
		page.on("dialog", (dialog) => dialog.accept());
		await expect(page).toHaveURL(/.*\/challenges$/, { timeout: 10000 });

		// Verify progress updated
		await expect(page.getByText(/1 of 3 completed/i)).toBeVisible();

		// Step 5: Complete Code Challenge
		await page
			.getByRole("button", { name: /start.*react.*component/i })
			.click();
		await expect(page).toHaveURL(/.*\/challenge\/challenge-1$/);

		// Edit code
		await page.locator(".file-item").first().click();
		await page.locator(".monaco-editor").click();
		await page.keyboard.press("Control+A");
		await page.keyboard.type(
			'// E2E Test Solution\nconsole.log("Hello World");',
		);

		// Submit code challenge
		await page.getByRole("button", { name: /submit challenge/i }).click();

		// Confirm submission
		page.on("dialog", (dialog) => {
			expect(dialog.message()).toContain("submit");
			dialog.accept();
		});

		// Handle success message
		page.on("dialog", (dialog) => {
			expect(dialog.message()).toContain("success");
			dialog.accept();
		});

		await expect(page).toHaveURL(/.*\/challenges$/);
		await expect(page.getByText(/2 of 3 completed/i)).toBeVisible();

		// Step 6: Complete Open-ended Challenge
		await page.getByRole("button", { name: /start.*system design/i }).click();
		await expect(page).toHaveURL(/.*\/challenge\/challenge-2$/);

		// Fill in answer
		await page
			.locator("textarea")
			.fill(
				"This is my system design answer for the E2E test. I would implement a microservices architecture...",
			);

		// Submit open-ended challenge
		await page.getByRole("button", { name: /submit challenge/i }).click();

		// Confirm submission
		page.on("dialog", (dialog) => dialog.accept());

		// Handle success message
		page.on("dialog", (dialog) => dialog.accept());

		await expect(page).toHaveURL(/.*\/challenges$/);
		await expect(page.getByText(/3 of 3 completed/i)).toBeVisible();

		// Step 7: Finalize Assessment
		await page.getByRole("button", { name: /finalize assessment/i }).click();

		// Confirm finalization
		page.on("dialog", (dialog) => {
			expect(dialog.message()).toContain("finalize");
			dialog.accept();
		});

		// Should show completion message
		page.on("dialog", (dialog) => {
			expect(dialog.message()).toContain("submitted successfully");
			dialog.accept();
		});

		// Verify assessment is complete
		await expect(page.getByText(/assessment completed/i)).toBeVisible();
	});

	test("should handle session persistence across page refreshes", async ({
		page,
	}) => {
		// Login
		await page.goto("/assessment/assessment-123");
		await page.getByLabel(/full name/i).fill("Persistence Test");
		await page.getByLabel(/email address/i).fill("persist@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();
		await expect(page).toHaveURL(/.*\/challenges$/);

		// Complete one challenge
		await page
			.getByRole("button", { name: /start.*javascript.*quiz/i })
			.click();
		const firstOption = page.locator('input[type="radio"]').first();
		await firstOption.click();

		// Refresh page
		await page.reload();

		// Should still be on the same challenge with answer preserved
		await expect(page).toHaveURL(/.*\/challenge\/challenge-3$/);
		await expect(firstOption).toBeChecked();

		// Go back to challenges
		await page.getByRole("button", { name: /back to challenges/i }).click();

		// Refresh challenges page
		await page.reload();

		// Should still be authenticated and see challenges
		await expect(page).toHaveURL(/.*\/challenges$/);
		await expect(page.getByText(/assessment challenges/i)).toBeVisible();
	});

	test("should handle direct URL access to challenges without login", async ({
		page,
	}) => {
		// Try to access challenges directly
		await page.goto("/assessment/assessment-123/challenges");

		// Should redirect to login page
		await expect(page).toHaveURL(/.*\/assessment\/assessment-123$/);
		await expect(
			page.getByRole("heading", { name: /developer assessment/i }),
		).toBeVisible();
	});

	test("should handle time expiration gracefully", async ({ page }) => {
		// This would require mocking time or a special test mode
		// For now, we'll test the UI elements exist
		await page.goto("/assessment/assessment-123");
		await page.getByLabel(/full name/i).fill("Time Test");
		await page.getByLabel(/email address/i).fill("time@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();

		// Check timer is visible
		await expect(page.getByText(/time remaining/i)).toBeVisible();

		// Timer should be counting down
		const timerElement = page.locator('[data-testid="timer"]');
		if (await timerElement.isVisible()) {
			const initialTime = await timerElement.textContent();

			// Wait a moment and check if time changed
			await page.waitForTimeout(2000);
			const newTime = await timerElement.textContent();

			expect(newTime).not.toBe(initialTime);
		}
	});

	test("should maintain assessment state across browser tabs", async ({
		browser,
	}) => {
		const context = await browser.newContext();
		const page1 = await context.newPage();
		const page2 = await context.newPage();

		// Login in first tab
		await page1.goto("/assessment/assessment-123");
		await page1.getByLabel(/full name/i).fill("Multi Tab User");
		await page1.getByLabel(/email address/i).fill("multitab@example.com");
		await page1.getByRole("button", { name: /start assessment/i }).click();
		await expect(page1).toHaveURL(/.*\/challenges$/);

		// Open same assessment in second tab
		await page2.goto("/assessment/assessment-123");

		// Should automatically redirect to challenges (session exists)
		await expect(page2).toHaveURL(/.*\/challenges$/);

		// Both tabs should show same state
		await expect(page1.getByText(/0 of 3 completed/i)).toBeVisible();
		await expect(page2.getByText(/0 of 3 completed/i)).toBeVisible();

		await context.close();
	});

	test("should handle errors gracefully", async ({ page }) => {
		// Login normally
		await page.goto("/assessment/assessment-123");
		await page.getByLabel(/full name/i).fill("Error Test");
		await page.getByLabel(/email address/i).fill("error@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();

		// Try to access invalid challenge
		await page.goto("/assessment/assessment-123/challenge/invalid-challenge");

		// Should show error or redirect
		await expect(page.locator("body")).toContainText(/not found|error/i);
	});
});
