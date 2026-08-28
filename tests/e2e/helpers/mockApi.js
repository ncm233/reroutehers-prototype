import { readFile } from 'node:fs/promises';

const FIXTURE_DIR = new URL('../../../src/mocks/fixtures/', import.meta.url);

const CLOSEST_ROLE = 'Senior UX/UI Designer';

async function fixture(name) {
  return JSON.parse(await readFile(new URL(`${name}.json`, FIXTURE_DIR), 'utf8'));
}

/**
 * Fulfils the diagnostic endpoints from fixtures.
 *
 * `gap` defaults to a role-aware resolver so switching target role returns a
 * different result, as the real endpoint would. Naming a gap fixture pins every
 * role to it instead.
 *
 * Pass `E2E_MOCK=0` to let requests reach a real API.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ cv?: string, snapshot?: string, gap?: string }} [scenario]
 */
export async function mockApi(page, scenario = {}) {
  if (process.env.E2E_MOCK === '0') return;

  const { cv = 'cv-parse.200', snapshot = 'snapshot.high-confidence', gap } = scenario;

  for (const [pattern, name] of [
    ['**/api/cv/parse', cv],
    ['**/api/snapshot/generate', snapshot],
  ]) {
    const body = await fixture(name);
    const status = name.includes('.400') ? 400 : 200;

    await page.route(pattern, (route) => route.fulfill({ status, json: body }));
  }

  const [gapDefault, gapAltRole] = await Promise.all([
    fixture(gap ?? 'gap.default'),
    fixture(gap ?? 'gap.alt-role'),
  ]);

  await page.route('**/api/gap/compute', (route) => {
    const { target_role: targetRole } = route.request().postDataJSON();

    return route.fulfill({ json: targetRole === CLOSEST_ROLE ? gapDefault : gapAltRole });
  });
}
