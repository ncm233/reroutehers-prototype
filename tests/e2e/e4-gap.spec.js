import { expect, test } from '@playwright/test';
import { mockApi } from './helpers/mockApi.js';

const VALID_CV = 'tests/fixtures/cv/valid-cv.pdf';

/** Walks the full intake and snapshot so the gap page is reached as a guest reaches it. */
async function reachGap(page) {
  await page.goto('/diagnostic/background');
  await page.locator('input[type="file"]').setInputFiles(VALID_CV);
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByRole('slider').fill('5');
  await page.getByText('Childcare', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue to Skill Snapshot' }).click();

  await page.getByRole('button', { name: 'See my readiness & gaps' }).click();
  await expect(page).toHaveURL(/\/diagnostic\/gap$/);
}

const focusAreas = (page) =>
  page.getByRole('listitem').filter({ has: page.getByText(/% if learned/) });

/** The radio itself is visually hidden, so selection goes through its label. */
const selectRole = (page, role) => page.getByText(role, { exact: true }).click();

test.describe('E4 — Role Readiness & Skill Gap', () => {
  test('US4.1 — the readiness page shows Gap as the current stage', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.locator('[data-state="complete"]')).toHaveCount(3);
    await expect(page.locator('[data-state="current"]')).toContainText('Gap');
  });

  test('US4.1 — the selected target role is shown on load', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.getByRole('heading', { name: 'Senior UX/UI Designer' })).toBeVisible();
  });

  test('US4.1 — readiness renders as a percentage on a gauge @smoke', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.getByRole('img', { name: '78% Ready today' })).toBeVisible();
  });

  test('US4.1 — an explanation of what the score represents is shown', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.getByText(/weighs each required skill/i)).toBeVisible();
  });

  test('US4.1 — the selector offers the recommended roles with the closest match default', async ({
    page,
  }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.getByRole('radio')).toHaveCount(3);
    await expect(page.getByRole('radio', { checked: true })).toHaveValue('role_ux');
    await expect(page.getByText('Closest match', { exact: true })).toBeVisible();
  });

  test('US4.1 — switching role recomputes readiness without a full reload', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);
    await expect(page.getByRole('img', { name: '78% Ready today' })).toBeVisible();

    let navigated = false;
    page.on('load', () => {
      navigated = true;
    });

    await selectRole(page, 'Digital Marketing');

    await expect(page.getByRole('img', { name: '54% Ready today' })).toBeVisible();
    expect(navigated).toBe(false);
  });

  test('US4.1 — a reload restores the role and readiness without recomputing', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);
    await expect(page.getByRole('img', { name: '78% Ready today' })).toBeVisible();

    let recomputed = false;
    await page.route('**/api/gap/compute', (route) => {
      recomputed = true;
      return route.abort();
    });

    await page.reload();

    await expect(page.getByRole('img', { name: '78% Ready today' })).toBeVisible();
    await expect(page.getByRole('radio', { checked: true })).toHaveValue('role_ux');
    expect(recomputed).toBe(false);
  });

  test('US4.1 — the snapshot can be reopened and the readiness is kept on return', async ({
    page,
  }) => {
    await mockApi(page);
    await reachGap(page);

    await page.getByRole('button', { name: 'Back to Skill Snapshot' }).click();
    await expect(page).toHaveURL(/\/diagnostic\/snapshot$/);

    await page.getByRole('button', { name: 'See my readiness & gaps' }).click();
    await expect(page.getByRole('img', { name: '78% Ready today' })).toBeVisible();
  });

  test('US4.2 — the page shows skills she has and her priority focus areas', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    const met = page.getByRole('button', { name: /You meet 7 of 11 requirements/ });
    await expect(met).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Missing for this role' })).toBeVisible();
    await expect(page.getByText(/Your top \d to start with/)).toBeVisible();

    // The names she already covers are detail behind the count, not a second list.
    await expect(page.getByText('User Research & Persona Synthesis')).toBeHidden();
    await met.click();
    await expect(page.getByText('User Research & Persona Synthesis')).toBeVisible();
  });

  test('US4.2 — gaps beyond the top three are still named, without a ranking', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    // 7 met + 3 focus areas + 1 also-missing must reconcile with "7 of 11".
    await expect(page.getByRole('button', { name: /You meet 7 of 11 requirements/ })).toBeVisible();
    await expect(page.getByText('Prompt Engineering for UX Workflows')).toBeVisible();
  });

  test('US4.2 — no more than three focus areas are shown', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(focusAreas(page)).toHaveCount(3);
  });

  test('US4.2 — with fewer than three gaps, only the actual gaps are shown', async ({ page }) => {
    await mockApi(page, { gap: 'gap.two-gaps' });
    await reachGap(page);

    await expect(focusAreas(page)).toHaveCount(2);
  });

  test('US4.2 — the focus list can contain both role and AI-literacy gaps', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.getByText('AI literacy').first()).toBeVisible();
    await expect(page.getByText('Role skill').first()).toBeVisible();
  });

  test('US4.2 — gaps read as specific skills, not vague labels', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.getByText('AI Design Tools (Figma AI, Midjourney)')).toBeVisible();
    await expect(page.getByText(/^Improve AI skills$/i)).toHaveCount(0);
  });

  test('US4.2 — switching role updates the priority gaps', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);
    await expect(page.getByText('AI Design Tools (Figma AI, Midjourney)')).toBeVisible();

    await selectRole(page, 'Digital Marketing');

    await expect(page.getByText('Campaign Analytics & Attribution')).toBeVisible();
    await expect(page.getByText('AI Design Tools (Figma AI, Midjourney)')).toHaveCount(0);
  });

  test('US4.3 — each gap shows the readiness improvement returned by the backend', async ({
    page,
  }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.getByText('+9% if learned')).toBeVisible();
    await expect(page.getByText('+7% if learned')).toBeVisible();
    await expect(page.getByText('+3% if learned')).toBeVisible();
  });

  test('US4.3 — role skills lead the focus areas, AI-literacy comes last', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(focusAreas(page).first()).toContainText('Role skill');
    await expect(focusAreas(page).last()).toContainText('AI literacy');
  });

  test('US4.3 — the estimate disclaimer is shown', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);

    await expect(page.getByText(/not a guarantee of employment/i)).toBeVisible();
  });

  test('US4.3 — switching role updates each gap uplift', async ({ page }) => {
    await mockApi(page);
    await reachGap(page);
    await expect(page.getByText('+9% if learned')).toBeVisible();

    await selectRole(page, 'Digital Marketing');

    await expect(page.getByText('+14% if learned')).toBeVisible();
    await expect(page.getByText('+9% if learned')).toHaveCount(0);
  });
});
