import { describe, expect, it } from 'vitest';
import { pickFocusAreas } from '../../src/lib/focusAreas.js';

const gap = (skill, band, uplift) => ({ skill, band, importance: 1, uplift });

describe('pickFocusAreas', () => {
  it('keeps one AI-literacy slot but presents the focus areas by uplift (highest first)', () => {
    const gaps = [
      gap('AI Design Tools', 'ai_usage', 9),
      gap('Scalable Design Systems', 'role', 7),
      gap('Prompt Engineering', 'ai_usage', 5),
      gap('Design Ops', 'role', 3),
    ];

    const picked = pickFocusAreas(gaps, 3);

    expect(picked.map((g) => g.skill)).toEqual([
      'AI Design Tools',
      'Scalable Design Systems',
      'Design Ops',
    ]);
    // exactly one AI-literacy gap, so role (technical) skills still surface
    expect(picked.filter((g) => g.band === 'ai_usage')).toHaveLength(1);
  });

  it('fills every slot with role skills when there is no AI-literacy gap', () => {
    const gaps = [
      gap('Campaign Analytics', 'role', 14),
      gap('Marketing Automation', 'role', 11),
      gap('SEO', 'role', 8),
      gap('Content Strategy', 'role', 4),
    ];

    const picked = pickFocusAreas(gaps, 3);

    expect(picked.map((g) => g.skill)).toEqual([
      'Campaign Analytics',
      'Marketing Automation',
      'SEO',
    ]);
    expect(picked.every((g) => g.band === 'role')).toBe(true);
  });

  it('backfills from remaining gaps when there are too few role skills', () => {
    const gaps = [
      gap('Use AI Coding Assistants', 'ai_usage', 6),
      gap('Debug Software', 'role', 4),
      gap('Check and Verify AI Output', 'ai_usage', 2),
    ];

    const picked = pickFocusAreas(gaps, 3);

    expect(picked).toHaveLength(3);
    expect(picked.map((g) => g.skill)).toContain('Debug Software');
    expect(picked.filter((g) => g.band === 'ai_usage')).toHaveLength(2);
  });

  it('never returns more than max', () => {
    const gaps = [gap('A', 'role', 3), gap('B', 'ai_usage', 2)];
    expect(pickFocusAreas(gaps, 3)).toHaveLength(2);
  });
});
