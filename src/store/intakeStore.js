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

export const useIntakeStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      setCv: (cv) => set({ cv, cvParsed: true }),
      clearCv: () => set({ cv: null, cvParsed: false }),

      setBreakDuration: (years) =>
        set((state) => ({ break: { ...state.break, duration_years: years } })),

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
          };
        }),

      setPreference: (categoryId, optionIds) =>
        set((state) => ({ preferences: { ...state.preferences, [categoryId]: optionIds } })),

      setSnapshot: (snapshot) =>
        set({
          snapshot,
          // Index 0 is her previous occupation and the default target role.
          selectedRole: snapshot?.recommended_roles?.[0]?.role ?? null,
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
    { name: STORAGE_KEY, version: 1 }
  )
);
