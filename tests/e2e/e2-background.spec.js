import { expect, test } from '@playwright/test';
import { mockApi } from './helpers/mockApi.js';

const VALID_CV = 'tests/fixtures/cv/valid-cv.pdf';
const NOT_A_PDF = 'tests/fixtures/cv/not-a-cv.png';
const OVERSIZED_CV = 'tests/fixtures/cv/oversized-cv.pdf';

const dropzone = (page) => page.locator('input[type="file"]');
const continueButton = (page) => page.getByRole('button', { name: 'Continue' });

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await page.goto('/diagnostic/background');
});

test.describe('E2 — Career Background (US2.1)', () => {
  test('US2.1 — the Background step shows a CV dropzone', async ({ page }) => {
    await expect(page.getByText('Drag a file, or click to browse')).toBeVisible();
    await expect(page.getByText('PDF, up to 10 MB')).toBeVisible();
  });

  test('US2.1 — a non-PDF is rejected before upload', async ({ page }) => {
    let uploadAttempted = false;
    await page.route('**/api/cv/parse', (route) => {
      uploadAttempted = true;
      return route.abort();
    });

    await dropzone(page).setInputFiles(NOT_A_PDF);

    await expect(page.getByRole('alert')).toContainText(/not a PDF/i);
    expect(uploadAttempted).toBe(false);
  });

  test('US2.1 — a file over 10 MB is rejected before upload', async ({ page }) => {
    let uploadAttempted = false;
    await page.route('**/api/cv/parse', (route) => {
      uploadAttempted = true;
      return route.abort();
    });

    await dropzone(page).setInputFiles(OVERSIZED_CV);

    await expect(page.getByRole('alert')).toContainText(/exceeds 10 MB/i);
    expect(uploadAttempted).toBe(false);
  });

  test('US2.1 — a valid PDF shows the file name and enables Continue @smoke', async ({ page }) => {
    await dropzone(page).setInputFiles(VALID_CV);

    await expect(page.getByText('valid-cv.pdf')).toBeVisible();
    await expect(page.getByText('Verified')).toBeVisible();

    await continueButton(page).click();
    await expect(page).toHaveURL(/\/diagnostic\/break$/);
  });

  test('US2.1 — continuing without a parsed CV is blocked and explains why', async ({ page }) => {
    await continueButton(page).click();

    await expect(page.getByRole('alert')).toContainText(/CV is required/i);
    await expect(page).toHaveURL(/\/diagnostic\/background$/);
  });

  test('US2.1 — a rejected upload shows the reason and leaves the dropzone available', async ({
    page,
  }) => {
    await page.route('**/api/cv/parse', (route) =>
      route.fulfill({ status: 400, json: { error: 'unreadable' } })
    );

    await dropzone(page).setInputFiles(VALID_CV);
    await expect(page.getByRole('alert')).toContainText('unreadable');
    await expect(page.getByText('Drag a file, or click to browse')).toBeVisible();

    await mockApi(page);
    await dropzone(page).setInputFiles(VALID_CV);
    await expect(page.getByText('valid-cv.pdf')).toBeVisible();
  });

  test('US2.1 — an uploaded CV can be removed and replaced', async ({ page }) => {
    await dropzone(page).setInputFiles(VALID_CV);
    await expect(page.getByText('valid-cv.pdf')).toBeVisible();

    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByText('Drag a file, or click to browse')).toBeVisible();

    await dropzone(page).setInputFiles(VALID_CV);
    await expect(page.getByText('Verified')).toBeVisible();
  });

  test('US2.1 — a reload restores the uploaded CV and keeps Continue enabled', async ({ page }) => {
    await dropzone(page).setInputFiles(VALID_CV);
    await expect(page.getByText('Verified')).toBeVisible();

    await page.reload();

    await expect(page.getByText('valid-cv.pdf')).toBeVisible();
    await expect(page.getByText('Verified')).toBeVisible();

    await continueButton(page).click();
    await expect(page).toHaveURL(/\/diagnostic\/break$/);
  });

  test('US2.1 — the stepper marks the current step and completed steps', async ({ page }) => {
    await expect(page.locator('[data-state="current"]')).toHaveCount(1);
    await expect(page.locator('[data-state="upcoming"]')).toHaveCount(3);
  });
});
