import { postJson } from './client.js';

/**
 * @param {import('../types/intake.js').StoredCv} cv
 * @param {{ duration_years: number, activities: string[] }} careerBreak
 * @returns {Promise<import('../types/api.js').Snapshot>}
 */
export function generateSnapshot(cv, careerBreak) {
  // fileName is local bookkeeping and is not part of the request contract.
  const { fileName: _fileName, ...structuredCv } = cv;

  return postJson('/api/snapshot/generate', { cv: structuredCv, break: careerBreak });
}
