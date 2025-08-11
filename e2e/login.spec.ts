import { expect, test } from "@playwright/test";

test.describe("Login Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/assessment/assessment-123");
	});

	test("should display login form", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: /developer assessment/i }),
		).toBeVisible();
		await expect(page.getByLabel(/full name/i)).toBeVisible();
		await expect(page.getByLabel(/email address/i)).toBeVisible();
		await expect(
			page.getByRole("button", { name: /start assessment/i }),
		).toBeVisible();
	});

	test("should show validation errors for empty fields", async ({ page }) => {
		await page.getByRole("button", { name: /start assessment/i }).click();

		await expect(page.getByText(/name is required/i)).toBeVisible();
		await expect(page.getByText(/email is required/i)).toBeVisible();
	});

	test("should show validation error for invalid email", async ({ page }) => {
		await page.getByLabel(/full name/i).fill("John Doe");
		await page.getByLabel(/email address/i).fill("invalid-email");
		await page.getByRole("button", { name: /start assessment/i }).click();

		await expect(
			page.getByText(/please enter a valid email address/i),
		).toBeVisible();
	});

	test("should successfully authenticate and navigate to challenges", async ({
		page,
	}) => {
		await page.getByLabel(/full name/i).fill("John Doe");
		await page.getByLabel(/email address/i).fill("john@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();

		// Should navigate to challenges page
		await expect(page).toHaveURL(/.*\/challenges$/);
		await expect(
			page.getByRole("heading", { name: /assessment challenges/i }),
		).toBeVisible();
	});

	test("should show loading state during authentication", async ({ page }) => {
		await page.getByLabel(/full name/i).fill("John Doe");
		await page.getByLabel(/email address/i).fill("john@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();

		// Should show loading state briefly
		await expect(page.getByText(/starting assessment/i)).toBeVisible();
	});

	test("should handle keyboard navigation", async ({ page }) => {
		// Tab through form fields
		await page.keyboard.press("Tab");
		await expect(page.getByLabel(/full name/i)).toBeFocused();

		await page.keyboard.press("Tab");
		await expect(page.getByLabel(/email address/i)).toBeFocused();

		await page.keyboard.press("Tab");
		await expect(
			page.getByRole("button", { name: /start assessment/i }),
		).toBeFocused();
	});

	test("should persist session on page refresh", async ({ page }) => {
		// First login
		await page.getByLabel(/full name/i).fill("John Doe");
		await page.getByLabel(/email address/i).fill("john@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();

		await expect(page).toHaveURL(/.*\/challenges$/);

		// Refresh page
		await page.reload();

		// Should still be on challenges page (session persisted)
		await expect(page).toHaveURL(/.*\/challenges$/);
	});
});
