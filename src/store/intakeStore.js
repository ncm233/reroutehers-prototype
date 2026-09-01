import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const STORAGE_KEY = 'rerouteher.guestSession';

/** @type {import('../types/intake.js').IntakeState} */
const initialState = {
  cv: null,
  cvParsed: false,
  break: { duration_years: 0, activities: [] },
  preferences: {},
  snapshot: null,
  selectedRole: null,
  gapResult: null,
  currentStepIndex: 0,
};

const emptyBreak = () => ({ duration_years: 0, activities: [] });

// State owned by pages after the changed one, cleared in the mutators so a stale
// result never survives an upstream edit (journey order lives in config/flowSteps.js).
const resetAfterBreak = () => ({ snapshot: null, selectedRole: null, gapResult: null });
const resetAfterCv = () => ({ break: emptyBreak(), ...resetAfterBreak() });

export const useIntakeStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      setCv: (cv) => set({ cv, cvParsed: true, ...resetAfterCv() }),
      clearCv: () => set({ cv: null, cvParsed: false, ...resetAfterCv() }),

      setBreakDuration: (years) =>
        set((state) => ({
          break: { ...state.break, duration_years: years },
          ...resetAfterBreak(),
        })),

      toggleActivity: (id) =>
        set((state) => {
          const selected = state.break.activities;
          return {
            break: {
              ...state.break,
              activities: selected.includes(id)
                ? selected.filter((a) => a !== id)
                : [...selected, id],
            },
            ...resetAfterBreak(),
          };
        }),

      setPreference: (categoryId, optionIds) =>
        set((state) => ({ preferences: { ...state.preferences, [categoryId]: optionIds } })),

      setSnapshot: (snapshot) =>
        set({
          snapshot,
          // Index 0 is her previous occupation and the default target role. Held as the
          // full role object ({ role, role_id, similarity }) so the gap resolves by id.
          selectedRole: snapshot?.recommended_roles?.[0] ?? null,
          // Drop any gap from a previous snapshot so it is recomputed for the new role.
          gapResult: null,
        }),

      setSelectedRole: (role) => set({ selectedRole: role, gapResult: null }),
      setGapResult: (gapResult) => set({ gapResult }),
      setCurrentStepIndex: (currentStepIndex) => set({ currentStepIndex }),

      /** True once at least one activity is recorded. Duration 0 ("less than a year") is valid. */
      canGenerateSnapshot: () => {
        const { break: careerBreak } = get();
        return careerBreak.activities.length > 0;
      },

      reset: () => set(initialState),
    }),
    // v2: selectedRole changed from a role-title string to the full role object.
    { name: STORAGE_KEY, version: 2 }
  )
);
