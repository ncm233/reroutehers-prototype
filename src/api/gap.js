import { postJson } from './client.js';

/**
 * Compute the skill gap for a target role. The role and skills are passed as
 * deterministic ids (role primary key, ESCO skill_id) so ambiguous display names
 * never drive the computation; the role name is sent only as a log label.
 *
 * @param {import('../types/api.js').Snapshot} snapshot
 * @param {import('../types/api.js').RecommendedRole} targetRole
 * @returns {Promise<import('../types/api.js').GapResult>}
 */
export function computeGap(snapshot, targetRole) {
  const skill_ids = [...snapshot.professional_skills, ...snapshot.reframed_skills]
    .map((s) => s.skill_id)
    .filter(Boolean);

  return postJson('/api/gap/compute', {
    skill_ids,
    target_role_id: targetRole.role_id,
    target_role: targetRole.role,
  });
}
