import { expect, test } from '@playwright/test';
import { openTemplatePicker, startFreshResume } from './helpers';

test.describe('Tier Features', () => {
  test.describe('Free Tier', () => {
    test('should show limited templates in template picker', async ({ page }) => {
      await startFreshResume(page);
      await openTemplatePicker(page);

      const lockedTemplates = page.locator('[data-locked="true"]');
      await expect(lockedTemplates.first()).toBeVisible();
      expect(await lockedTemplates.count()).toBeGreaterThan(0);
    });

    test('should show upgrade prompts for locked features', async ({ page }) => {
      await startFreshResume(page);
      await openTemplatePicker(page);

      await expect(page.locator('[data-locked="true"]').first()).toBeVisible();
      await expect(page.getByText(/unlock pro colors/i)).toBeVisible();
    });
  });

  test.describe('Export Modal', () => {
    test('should open export modal', async ({ page }) => {
      await startFreshResume(page);

      await page.getByLabel(/first name/i).fill('Test');
      await page.getByLabel(/last name/i).fill('User');

      await page.getByRole('button', { name: /export pdf/i }).first().click();

      await expect(page.getByRole('heading', { name: /export resume/i })).toBeVisible();
    });

    test('should show format options in export modal', async ({ page }) => {
      await startFreshResume(page);

      await page.getByLabel(/first name/i).fill('Test');
      await page.getByLabel(/last name/i).fill('User');

      await page.getByRole('button', { name: /export pdf/i }).first().click();

      await expect(page.getByText(/^pdf$/i).first()).toBeVisible();
      await expect(page.getByText(/word \(\.docx\)/i)).toBeVisible();
      await expect(page.getByText(/upgrade to pro to unlock docx and txt formats/i)).toBeVisible();
    });
  });
});
