import { expect, type Page } from '@playwright/test';

export async function gotoGuestOnboarding(page: Page) {
  await page.goto('/dashboard/new');
  await expect(page.getByRole('heading', { name: /how would you like to get started/i })).toBeVisible();
}

export async function startFreshResume(page: Page) {
  await gotoGuestOnboarding(page);
  await page.getByRole('button', { name: /start from scratch/i }).click();
  await page.getByRole('button', { name: /^start building$/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/resume\/guest\/edit/);
  await expect(page.getByRole('heading', { name: /^personal$/i })).toBeVisible();
}

export async function openTemplatePicker(page: Page) {
  await page.getByRole('button', { name: /^template$/i }).click();
  await expect(page.getByRole('heading', { name: /customize your resume/i })).toBeVisible();
}
