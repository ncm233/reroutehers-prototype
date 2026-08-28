import { http, HttpResponse } from 'msw';
import cvParsed from './fixtures/cv-parse.200.json';
import snapshotHighConfidence from './fixtures/snapshot.high-confidence.json';
import gapDefault from './fixtures/gap.default.json';
import gapAltRole from './fixtures/gap.alt-role.json';
import { validateCvFile } from '../api/cv.js';

const DEFAULT_ROLE = 'Senior UX/UI Designer';

export const handlers = [
  http.post('*/api/cv/parse', async ({ request }) => {
    const form = await request.formData();
    const file = form.get('file');

    const message = validateCvFile(file);
    if (message) return HttpResponse.json({ error: message }, { status: 400 });

    return HttpResponse.json(cvParsed);
  }),

  http.post('*/api/snapshot/generate', () => HttpResponse.json(snapshotHighConfidence)),

  http.post('*/api/gap/compute', async ({ request }) => {
    const { target_role: targetRole } = await request.json();
    return HttpResponse.json(targetRole === DEFAULT_ROLE ? gapDefault : gapAltRole);
  }),
];
