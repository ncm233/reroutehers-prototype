import { expect, test } from '@playwright/test';
import { JOURNEY_STAGES } from '../../src/config/journeyStages.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('E1 — Public Landing Page & Guest Entry', () => {
  test('US1.1 — "Get started" opens the Background step with no signup or login prompt @smoke', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Get started' }).click();

    await expect(page).toHaveURL(/\/diagnostic\/background$/);
    await expect(page.getByText(/sign ?up|log ?in|create an account/i)).toHaveCount(0);
  });

  test('US1.1 — the button takes keyboard focus, shows a focus ring, and activates on Enter and Space', async ({
    page,
  }) => {
    const button = page.getByRole('button', { name: 'Get started' });

    await button.focus();
    await expect(button).toBeFocused();

    const outlineWidth = await button.evaluate((node) => getComputedStyle(node).outlineWidth);
    expect(parseFloat(outlineWidth)).toBeGreaterThan(0);

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/diagnostic\/background$/);

    await page.goBack();
    await page.getByRole('button', { name: 'Get started' }).focus();
    await page.keyboard.press('Space');
    await expect(page).toHaveURL(/\/diagnostic\/background$/);
  });

  test('US1.2 — the three journey stages render in order', async ({ page }) => {
    const headings = page.getByRole('list').getByRole('heading', { level: 3 });

    await expect(headings).toHaveText(JOURNEY_STAGES.map((stage) => stage.label));
  });

  test('US1.2 — each stage displays its explanation text', async ({ page }) => {
    for (const stage of JOURNEY_STAGES) {
      await expect(page.getByText(stage.blurb, { exact: true })).toBeVisible();
    }
  });

  test('US1.2 — stages stay ordered and readable at this viewport', async ({ page }) => {
    const headings = page.getByRole('list').getByRole('heading', { level: 3 });
    await expect(headings).toHaveText(JOURNEY_STAGES.map((stage) => stage.label));

    // Untruncated: every stage keeps a real rendered height at this width.
    for (const stage of JOURNEY_STAGES) {
      const blurb = page.getByText(stage.blurb, { exact: true });
      await expect(blurb).toBeVisible();

      const box = await blurb.boundingBox();
      expect(box.height).toBeGreaterThan(0);
      expect(box.width).toBeLessThanOrEqual(page.viewportSize().width);
    }
  });
});
