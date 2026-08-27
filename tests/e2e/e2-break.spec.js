import { expect, test } from '@playwright/test';
import { ACTIVITY_TAXONOMY } from '../../src/config/activityTaxonomy.js';
import { mockApi } from './helpers/mockApi.js';

const VALID_CV = 'tests/fixtures/cv/valid-cv.pdf';

/** Completes the Background step so the break step is reachable as a user reaches it. */
async function reachBreakStep(page) {
  await page.goto('/diagnostic/background');
  await page.locator('input[type="file"]').setInputFiles(VALID_CV);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/\/diagnostic\/break$/);
}

const slider = (page) => page.getByRole('slider');
const activity = (page, label) => page.getByText(label, { exact: true });

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await reachBreakStep(page);
});

test.describe('E2 — Career Break (US2.2)', () => {
  test('US2.2 — the step shows a duration slider and the grouped activity section', async ({
    page,
  }) => {
    await expect(slider(page)).toBeVisible();
    await expect(page.getByText('2. What did you do during this time? *')).toBeVisible();
  });

  test('US2.2 — moving the slider updates the duration shown in years', async ({ page }) => {
    await slider(page).fill('7');
    await expect(page.getByText('7 years', { exact: true })).toBeVisible();

    await slider(page).fill('1');
    await expect(page.getByText('1 year', { exact: true })).toBeVisible();
  });

  test('US2.2 — activities appear grouped under the four categories', async ({ page }) => {
    for (const category of ACTIVITY_TAXONOMY) {
      await expect(page.getByText(category.label, { exact: true })).toBeVisible();
    }

    const first = ACTIVITY_TAXONOMY[0].activities[0];
    await expect(activity(page, first.label)).toBeVisible();
  });

  test('US2.2 — selecting several activities keeps all of them selected', async ({ page }) => {
    await activity(page, 'Childcare').click();
    await activity(page, 'Budgeting').click();
    await activity(page, 'Volunteering').click();

    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(3);
  });

  test('US2.2 — every activity is offered up front, with no free-text entry', async ({ page }) => {
    const count = ACTIVITY_TAXONOMY.reduce((total, c) => total + c.activities.length, 0);

    await expect(page.getByRole('checkbox')).toHaveCount(count);
    await expect(page.getByRole('searchbox')).toHaveCount(0);
    await expect(page.getByRole('textbox')).toHaveCount(0);
  });

  test('US2.2 — continuing needs a duration and at least one activity @smoke', async ({ page }) => {
    const cta = page.getByRole('button', { name: 'Continue to Skill Snapshot' });
    await expect(cta).toBeDisabled();

    await slider(page).fill('5');
    await expect(cta).toBeDisabled();

    await activity(page, 'Childcare').click();
    await expect(cta).toBeEnabled();

    await cta.click();
    await expect(page).toHaveURL(/\/diagnostic\/snapshot$/);
  });

  test('US2.2 — a reload restores the duration and the selected activities', async ({ page }) => {
    await slider(page).fill('9');
    await activity(page, 'Childcare').click();
    await activity(page, 'Running the household').click();

    await page.reload();

    await expect(page.getByText('9 years', { exact: true })).toBeVisible();
    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(2);
  });
});
