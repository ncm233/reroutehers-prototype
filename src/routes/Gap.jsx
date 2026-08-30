import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import IntakeStepper from '../components/intake/IntakeStepper.jsx';
import BackLink from '../components/intake/BackLink.jsx';
import ReadinessGauge from '../components/gap/ReadinessGauge.jsx';
import RoleSelector from '../components/gap/RoleSelector.jsx';
import MetRequirements from '../components/gap/MetRequirements.jsx';
import FocusAreaList, { MAX_FOCUS_AREAS } from '../components/gap/FocusAreaList.jsx';
import { computeGap } from '../api/gap.js';
import { useIntakeStore } from '../store/intakeStore.js';

export default function Gap() {
  const snapshot = useIntakeStore((state) => state.snapshot);
  const selectedRole = useIntakeStore((state) => state.selectedRole);
  const gapResult = useIntakeStore((state) => state.gapResult);
  const setSelectedRole = useIntakeStore((state) => state.setSelectedRole);
  const setGapResult = useIntakeStore((state) => state.setGapResult);

  const [error, setError] = useState(null);
  const [computing, setComputing] = useState(false);

  // Skips the request when a result for this role is already in the store.
  const hasResult = Boolean(gapResult);
  const requestedRole = useRef(null);

  useEffect(() => {
    if (!snapshot || !selectedRole || hasResult) return;
    if (requestedRole.current === selectedRole) return;

    requestedRole.current = selectedRole;
    setError(null);
    setComputing(true);

    computeGap(snapshot, selectedRole)
      .then(setGapResult)
      .catch((cause) => setError(cause.message))
      .finally(() => setComputing(false));
  }, [snapshot, selectedRole, hasResult, setGapResult]);

  if (!snapshot) return <Navigate to="/diagnostic/background" replace />;

  const projected =
    gapResult &&
    Math.round(
      (gapResult.readiness +
        gapResult.gaps.slice(0, MAX_FOCUS_AREAS).reduce((sum, gap) => sum + gap.uplift, 0)) * 100,
    ) / 100;

  return (
    <div className="flex min-h-screen flex-col bg-grad-page">
      <Header />

      <main className="mx-auto w-full max-w-[1000px] flex-1 px-4 py-8 sm:px-6">
        <IntakeStepper currentIndex={3} />

        <div className="mt-8">
          <BackLink to="/diagnostic/snapshot">Back to Skill Snapshot</BackLink>
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
          Where do you want to go next?
        </h1>

        <div className="mt-5">
          <RoleSelector
            roles={snapshot.recommended_roles}
            selected={selectedRole}
            onSelect={setSelectedRole}
            disabled={computing}
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-pink-600">
            {error}
          </p>
        )}

        {gapResult && (
          /* The score is a narrow summary rail; the focus areas are the work, so
             they take the dominant column. */
          <div className="mt-5 grid items-start gap-5 md:grid-cols-[19rem_1fr]">
            <GlassCard className="p-6">
              <h2 className="font-display text-lg font-bold text-ink">{selectedRole}</h2>

              <div className="mt-3">
                <ReadinessGauge value={gapResult.readiness} />
              </div>

              {projected > gapResult.readiness && (
                <p className="mt-3 inline-flex rounded-full bg-pink-100 px-3 py-1.5 text-sm font-semibold text-pink-600">
                  {gapResult.readiness}% today → {projected}% after your focus areas
                </p>
              )}

              <div className="mt-5 border-t border-ink-faint/15 pt-4">
                <MetRequirements
                  skills={gapResult.skills_have}
                  total={gapResult.skills_have.length + gapResult.gaps.length}
                />
              </div>

              <p className="mt-4 text-xs text-ink-soft">
                Readiness weighs each required skill by how much the role depends on it, so it is
                not a plain count of skills covered.
              </p>
            </GlassCard>

            <FocusAreaList gaps={gapResult.gaps} />
          </div>
        )}

        {computing && !gapResult && <p className="mt-6 text-sm text-ink-soft">Working it out…</p>}
      </main>
    </div>
  );
}
