import { describe, expect, it } from 'vitest';
import { JOURNEY_STAGES, STAGE_IDS, stageIndex } from '../../src/config/journeyStages.js';

describe('JOURNEY_STAGES', () => {
  it('lists the three stages in journey order', () => {
    expect(JOURNEY_STAGES.map((stage) => stage.label)).toEqual([
      'Tell your story',
      'See your skills',
      'Know your next move',
    ]);
  });

  it('gives every stage a blurb and a stepper label', () => {
    for (const stage of JOURNEY_STAGES) {
      expect(stage.blurb.length).toBeGreaterThan(0);
    }
  });

  it('resolves a stage id to its position', () => {
    expect(stageIndex('snapshot')).toBe(1);
    expect(stageIndex('unknown')).toBe(-1);
    expect(STAGE_IDS).toHaveLength(3);
  });
});
