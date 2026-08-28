import { postJson } from './client.js';

/**
 * @param {import('../types/api.js').Snapshot} snapshot
 * @param {string} targetRole
 * @returns {Promise<import('../types/api.js').GapResult>}
 */
export function computeGap(snapshot, targetRole) {
  const skills = [...snapshot.professional_skills, ...snapshot.reframed_skills].map(
    ({ skill, source }) => ({ skill, source })
  );

  return postJson('/api/gap/compute', { skills, target_role: targetRole });
}
