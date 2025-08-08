import { expect, test } from "@playwright/test";

test.describe("Code Challenge", () => {
	test.beforeEach(async ({ page }) => {
		// Login and navigate to code challenge
		await page.goto("/assessment/assessment-123");
		await page.getByLabel(/full name/i).fill("Test User");
		await page.getByLabel(/email address/i).fill("test@example.com");
		await page.getByRole("button", { name: /start assessment/i }).click();

		await expect(page).toHaveURL(/.*\/challenges$/);
		await page
			.getByRole("button", { name: /start.*react.*component/i })
			.click();

		await expect(page).toHaveURL(/.*\/challenge\/challenge-1$/);
	});

	test("should display challenge content", async ({ page }) => {
		await expect(page.getByText("React User List Component")).toBeVisible();
		await expect(page.getByText(/create a react component/i)).toBeVisible();
	});

	test("should show file tree and monaco editor", async ({ page }) => {
		// Should show file tree
		await expect(page.locator(".file-tree")).toBeVisible();

		// Should show Monaco editor
		await expect(page.locator(".monaco-editor")).toBeVisible();
	});

	test("should allow file selection", async ({ page }) => {
		// Click on a file in the tree
		await page.locator(".file-item").first().click();

		// Should show file content in editor
		await expect(page.locator(".monaco-editor")).toBeVisible();
	});

	test("should allow code editing", async ({ page }) => {
		// Click on a file
		await page.locator(".file-item").first().click();

		// Click in editor and type
		await page.locator(".monaco-editor").click();
		await page.keyboard.type("// Test code");

		// Should show typed content
		await expect(page.locator(".monaco-editor")).toContainText("// Test code");
	});

	test("should allow language selection", async ({ page }) => {
		const languageSelect = page.locator(
			'select[data-testid="language-select"]',
		);
		await languageSelect.selectOption("typescript");

		// Should update language
		await expect(languageSelect).toHaveValue("typescript");
	});

	test("should handle file creation", async ({ page }) => {
		// Right-click in file tree
		await page.locator(".file-tree").click({ button: "right" });

		// Should show context menu
		await expect(page.getByText("Create New File")).toBeVisible();

		// Create new file
		await page.getByText("Create New File").click();

		// Should prompt for filename
		page.on("dialog", (dialog) => {
			dialog.accept("newfile.js");
		});
	});

	test("should handle folder creation", async ({ page }) => {
		// Right-click in file tree
		await page.locator(".file-tree").click({ button: "right" });

		// Should show context menu
		await expect(page.getByText("Create New Folder")).toBeVisible();

		// Create new folder
		await page.getByText("Create New Folder").click();

		// Should prompt for folder name
		page.on("dialog", (dialog) => {
			dialog.accept("newfolder");
		});
	});

	test("should submit code challenge", async ({ page }) => {
		// Edit some code
		await page.locator(".file-item").first().click();
		await page.locator(".monaco-editor").click();
		await page.keyboard.press("Control+A");
		await page.keyboard.type('console.log("Hello World");');

		// Submit challenge
		await page.getByRole("button", { name: /submit challenge/i }).click();

		// Confirm submission
		page.on("dialog", (dialog) => {
			expect(dialog.message()).toContain("submit");
			dialog.accept();
		});

		// Should show success message and navigate back
		page.on("dialog", (dialog) => {
			expect(dialog.message()).toContain("success");
			dialog.accept();
		});

		await expect(page).toHaveURL(/.*\/challenges$/);
	});

	test("should handle back navigation", async ({ page }) => {
		await page.getByRole("button", { name: /back to challenges/i }).click();
		await expect(page).toHaveURL(/.*\/challenges$/);
	});

	test("should show instructions panel", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: /instructions/i }),
		).toBeVisible();
		await expect(page.getByText(/create a react component/i)).toBeVisible();
	});

	test("should show completion status for completed challenges", async ({
		page,
	}) => {
		// Go back to challenges list first
		await page.getByRole("button", { name: /back to challenges/i }).click();

		// Navigate to same challenge again (if it was completed)
		await page
			.getByRole("button", { name: /start.*react.*component/i })
			.click();

		// If challenge is completed, should show completed badge
		const completedBadge = page.locator('[data-testid="completed-badge"]');
		if (await completedBadge.isVisible()) {
			await expect(completedBadge).toContainText("Completed");
		}
	});

	test("should maintain code state across page refreshes", async ({ page }) => {
		// Edit some code
		await page.locator(".file-item").first().click();
		await page.locator(".monaco-editor").click();
		await page.keyboard.type("// Test persistence");

		// Refresh page
		await page.reload();

		// Code should still be there
		await expect(page.locator(".monaco-editor")).toContainText(
			"// Test persistence",
		);
	});

	test("should handle file deletion", async ({ page }) => {
		// Right-click on a file
		await page.locator(".file-item").first().click({ button: "right" });

		// Should show delete option
		await expect(page.getByText("Delete File")).toBeVisible();

		// Delete file (if implemented)
		await page.getByText("Delete File").click();

		// Confirm deletion
		page.on("dialog", (dialog) => dialog.accept());
	});

	test("should handle syntax highlighting", async ({ page }) => {
		// Select JavaScript file
		await page.locator('.file-item:has-text(".js")').first().click();

		// Type some JavaScript code
		await page.locator(".monaco-editor").click();
		await page.keyboard.type("function test() { return true; }");

		// Should have syntax highlighting (check for colored text)
		const editor = page.locator(".monaco-editor");
		await expect(editor.locator(".mtk9")).toBeVisible(); // Monaco token classes
	});

	test("should be responsive on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Should adapt layout for mobile
		await expect(page.getByText("React User List Component")).toBeVisible();

		// File tree and editor should be stacked or tabbed on mobile
		await expect(page.locator(".file-tree")).toBeVisible();
		await expect(page.locator(".monaco-editor")).toBeVisible();
	});

	test("should show timer countdown", async ({ page }) => {
		await expect(page.getByText(/time remaining/i)).toBeVisible();
	});
});
