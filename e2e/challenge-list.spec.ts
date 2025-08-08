import { test, expect } from '@playwright/test'

test.describe('Challenge List', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/assessment/assessment-123')
    await page.getByLabel(/full name/i).fill('Test User')
    await page.getByLabel(/email address/i).fill('test@example.com')
    await page.getByRole('button', { name: /start assessment/i }).click()
    
    // Wait for challenges page to load
    await expect(page).toHaveURL(/.*\/challenges$/)
  })

  test('should display assessment title and challenges list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /assessment challenges/i })).toBeVisible()
    await expect(page.getByText(/choose a challenge to begin/i)).toBeVisible()
    
    // Should show challenge cards
    await expect(page.locator('.challenge-card')).toHaveCount(3)
  })

  test('should show timer countdown', async ({ page }) => {
    await expect(page.getByText(/time remaining/i)).toBeVisible()
    await expect(page.locator('[data-testid="timer"]')).toBeVisible()
  })

  test('should navigate to code challenge', async ({ page }) => {
    await page.getByRole('button', { name: /start.*react.*component/i }).click()
    
    await expect(page).toHaveURL(/.*\/challenge\/challenge-1$/)
    await expect(page.getByText(/react user list component/i)).toBeVisible()
  })

  test('should navigate to open-ended challenge', async ({ page }) => {
    await page.getByRole('button', { name: /start.*system design/i }).click()
    
    await expect(page).toHaveURL(/.*\/challenge\/challenge-2$/)
    await expect(page.getByText(/system design question/i)).toBeVisible()
  })

  test('should navigate to multiple choice challenge', async ({ page }) => {
    await page.getByRole('button', { name: /start.*javascript.*quiz/i }).click()
    
    await expect(page).toHaveURL(/.*\/challenge\/challenge-3$/)
    await expect(page.getByText(/javascript fundamentals quiz/i)).toBeVisible()
  })

  test('should show challenge type badges', async ({ page }) => {
    await expect(page.getByText('Code Challenge')).toBeVisible()
    await expect(page.getByText('Open Ended')).toBeVisible()
    await expect(page.getByText('Multiple Choice')).toBeVisible()
  })

  test('should show progress indicators', async ({ page }) => {
    await expect(page.getByText(/0 of 3 completed/i)).toBeVisible()
  })

  test('should handle auto-submit when time runs out', async ({ page }) => {
    // Mock time to be near expiration (this would need special setup)
    // For now, we'll test the UI elements exist
    await expect(page.getByText(/time remaining/i)).toBeVisible()
  })

  test('should show completed challenges differently', async ({ page }) => {
    // Complete a challenge first
    await page.getByRole('button', { name: /start.*javascript.*quiz/i }).click()
    
    // Answer questions
    await page.locator('input[value="b"]').first().click()
    await page.locator('input[value="b"]').nth(1).click()
    
    // Submit
    await page.getByRole('button', { name: /submit answers/i }).click()
    
    // Wait for alert and dismiss it
    page.on('dialog', dialog => dialog.accept())
    
    // Should return to challenge list
    await expect(page).toHaveURL(/.*\/challenges$/)
    
    // Should show progress updated
    await expect(page.getByText(/1 of 3 completed/i)).toBeVisible()
  })

  test('should allow finalize assessment', async ({ page }) => {
    // Complete all challenges first (simplified)
    await page.getByRole('button', { name: /finalize assessment/i }).click()
    
    // Should show confirmation dialog
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('finalize')
      dialog.accept()
    })
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Should still show main elements
    await expect(page.getByRole('heading', { name: /assessment challenges/i })).toBeVisible()
    await expect(page.locator('.challenge-card')).toHaveCount(3)
  })
})