import { expect, test } from '@playwright/test';
import { gotoGuestOnboarding, startFreshResume } from './helpers';

test.describe('Guest Resume Editor', () => {
  test('should display onboarding options', async ({ page }) => {
    await gotoGuestOnboarding(page);

    await expect(page.getByText(/start with a job posting/i)).toBeVisible();
    await expect(page.getByText(/upload existing resume/i)).toBeVisible();
    await expect(page.getByText(/start fresh/i)).toBeVisible();
  });

  test('should start fresh resume flow', async ({ page }) => {
    await gotoGuestOnboarding(page);

    await page.getByRole('button', { name: /start from scratch/i }).click();
    await expect(page.getByRole('heading', { name: /let's build something great/i })).toBeVisible();

    await page.getByRole('button', { name: /^start building$/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/resume\/guest\/edit/);
    await expect(page.getByRole('heading', { name: /^personal$/i })).toBeVisible();
  });

  test('should navigate between form sections', async ({ page }) => {
    await startFreshResume(page);

    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/job title/i).fill('Software Engineer');
    await page.getByLabel(/^email$/i).fill('john.doe@example.com');
    await page.getByLabel(/^phone$/i).fill('555-123-4567');

    await page.getByRole('button', { name: /^continue$/i }).click();
    await expect(page.getByRole('heading', { name: /^summary$/i })).toBeVisible();
  });

  test('should show resume preview panel', async ({ page }) => {
    await startFreshResume(page);

    const previewPanel = page.locator('#resume-preview');
    await expect(previewPanel).toBeVisible();
  });
});
