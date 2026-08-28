import { describe, expect, it } from 'vitest';
import { ACTIVITY_LABELS, ACTIVITY_TAXONOMY } from '../../src/config/activityTaxonomy.js';

describe('ACTIVITY_TAXONOMY', () => {
  it('groups activities under the four categories', () => {
    expect(ACTIVITY_TAXONOMY.map((category) => category.label)).toEqual([
      'Care & Household',
      'Planning & Organisation',
      'Finance & Negotiation',
      'Learning & Community',
    ]);
  });

  it('keeps activity ids unique across categories', () => {
    const ids = Object.keys(ACTIVITY_LABELS);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(12);
  });

  it('labels every activity', () => {
    for (const category of ACTIVITY_TAXONOMY) {
      for (const activity of category.activities) {
        expect(ACTIVITY_LABELS[activity.id]).toBe(activity.label);
        expect(activity.label.length).toBeGreaterThan(0);
      }
    }
  });
});
