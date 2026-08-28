// @ts-check

/**
 * @typedef {import('./api.js').StructuredCv} StructuredCv
 * @typedef {import('./api.js').Snapshot} Snapshot
 * @typedef {import('./api.js').GapResult} GapResult
 */

/**
 * @typedef {StructuredCv & { fileName: string, fileSize: number }} StoredCv
 */

/**
 * Guest session state, persisted to local storage and rehydrated on load.
 *
 * @typedef {Object} IntakeState
 * @property {StoredCv | null} cv
 * @property {boolean} cvParsed
 * @property {{ duration_years: number, activities: string[] }} break
 * @property {Record<string, string[]>} preferences
 * @property {Snapshot | null} snapshot
 * @property {string | null} selectedRole
 * @property {GapResult | null} gapResult
 * @property {number} currentStepIndex
 */

export {};
