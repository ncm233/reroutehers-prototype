export const HIGH_CONFIDENCE_THRESHOLD = 0.7;

/** Normalises confidence to a 0–1 fraction, accepting either 0–1 or 0–100. */
export function toFraction(confidence) {
  return confidence > 1 ? confidence / 100 : confidence;
}

export function isHighConfidence(confidence) {
  return toFraction(confidence) >= HIGH_CONFIDENCE_THRESHOLD;
}
