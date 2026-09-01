// @ts-check

/**
 * Compose the focus areas from the backend's uplift-ranked gaps.
 *
 * Most returners have no AI skills on their CV, so AI-literacy gaps would other-
 * wise flood the list and crowd out role skills. To keep role (technical) skills
 * visible, only one slot is reserved for the highest-uplift AI-literacy gap and
 * the remaining slots go to the highest-uplift role gaps. If role gaps run out,
 * the leftover slots are backfilled from the remaining gaps (including more AI)
 * rather than left empty. The result is then presented in uplift order (highest
 * first); the reserved AI gap keeps its slot but is not forced last.
 *
 * @param {import('../types/api.js').Gap[]} gaps  ranked by uplift (backend order)
 * @param {number} max  how many focus areas to surface
 * @returns {import('../types/api.js').Gap[]}
 */
export function pickFocusAreas(gaps, max) {
  const roleGaps = gaps.filter((g) => g.band !== 'ai_usage');
  const topAi = gaps.find((g) => g.band === 'ai_usage');

  const roleSlots = topAi ? max - 1 : max;
  const chosen = roleGaps.slice(0, roleSlots);
  if (topAi) chosen.push(topAi);

  // Backfill any slots left empty (too few role gaps) from the remaining gaps.
  if (chosen.length < max) {
    for (const gap of gaps) {
      if (chosen.length >= max) break;
      if (!chosen.includes(gap)) chosen.push(gap);
    }
  }

  return chosen.sort((a, b) => b.uplift - a.uplift);
}
