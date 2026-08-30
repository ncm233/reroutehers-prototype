// @ts-check

/**
 * Compose the focus areas from the backend's uplift-ranked gaps.
 *
 * One slot is reserved for the highest-uplift AI-literacy gap so AI upskilling
 * stays visible even when its uplift is small; the remaining slots go to the
 * highest-uplift role gaps, shown first (AI-literacy last). If there is no
 * AI-literacy gap, every slot is filled with role gaps.
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

  return chosen;
}
