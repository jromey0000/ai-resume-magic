import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 1, name: /start getting interviews/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /build your resume free/i })).toBeVisible();
  });

  test('should have sign in button', async ({ page }) => {
    await page.goto('/');

    const signInLink = page.getByRole('link', { name: /^sign in$/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/auth/sign-in');
  });

  test('should have get started button', async ({ page }) => {
    await page.goto('/');

    const getStartedLink = page.getByRole('link', { name: /^get started$/i });
    await expect(getStartedLink).toBeVisible();
    await expect(getStartedLink).toHaveAttribute('href', '/dashboard/new');
  });

  test('should navigate to guest onboarding when clicking get started', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /^get started$/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/new/);
    await expect(page.getByRole('heading', { name: /how would you like to get started/i })).toBeVisible();
  });
});
