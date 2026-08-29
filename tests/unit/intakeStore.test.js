import { beforeEach, describe, expect, it } from 'vitest';
import { useIntakeStore } from '../../src/store/intakeStore.js';
import snapshot from '../../src/mocks/fixtures/snapshot.high-confidence.json';

const store = () => useIntakeStore.getState();

beforeEach(() => store().reset());

describe('intake store', () => {
  it('marks the CV as parsed when one is stored', () => {
    store().setCv({ fileName: 'cv.pdf', raw_text: '', experiences: [], skill_mentions: [] });
    expect(store().cvParsed).toBe(true);

    store().clearCv();
    expect(store().cv).toBeNull();
    expect(store().cvParsed).toBe(false);
  });

  it('toggles activities without duplicating them', () => {
    store().toggleActivity('cared_for_children');
    store().toggleActivity('ran_the_household');
    store().toggleActivity('cared_for_children');

    expect(store().break.activities).toEqual(['ran_the_household']);
  });

  it('requires at least one activity before generating a snapshot (duration 0 is valid)', () => {
    expect(store().canGenerateSnapshot()).toBe(false);

    store().setBreakDuration(3);
    expect(store().canGenerateSnapshot()).toBe(false); // a duration alone is not enough

    store().toggleActivity('cared_for_children');
    expect(store().canGenerateSnapshot()).toBe(true);

    // "Less than a year" (duration 0) with an activity is still valid
    store().setBreakDuration(0);
    expect(store().canGenerateSnapshot()).toBe(true);
  });

  it('defaults the target role to the first recommended role', () => {
    store().setSnapshot(snapshot);
    expect(store().selectedRole).toBe('Senior UX/UI Designer');
  });

  it('leaves the target role unset when nothing matched', () => {
    store().setSnapshot({ ...snapshot, previous_occupation: null, recommended_roles: [] });
    expect(store().selectedRole).toBeNull();
  });

  it('drops a stale gap result when the target role changes', () => {
    store().setGapResult({ readiness: 78, skills_have: [], gaps: [] });
    store().setSelectedRole('Digital Marketing');

    expect(store().gapResult).toBeNull();
  });

  it('persists the session under the shared storage key', () => {
    store().setBreakDuration(5);
    expect(localStorage.getItem('rerouteher.guestSession')).toContain('"duration_years":5');
  });
});
