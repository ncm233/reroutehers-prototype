import { Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import IntakeStepper from '../components/intake/IntakeStepper.jsx';
import BackLink from '../components/intake/BackLink.jsx';
import OccupationLine from '../components/snapshot/OccupationLine.jsx';
import SkillSection from '../components/snapshot/SkillSection.jsx';
import { useIntakeStore } from '../store/intakeStore.js';

export default function Snapshot() {
  const navigate = useNavigate();
  const snapshot = useIntakeStore((state) => state.snapshot);

  // Reached without a generated snapshot: send her back to the start of the intake.
  if (!snapshot) return <Navigate to="/diagnostic/background" replace />;

  return (
    <div className="flex min-h-screen flex-col bg-grad-page">
      <Header />

      <main className="mx-auto w-full max-w-[1000px] flex-1 px-4 py-8 sm:px-6">
        <IntakeStepper currentIndex={2} />

        <div className="mt-8">
          <BackLink to="/diagnostic/break">Back to Career Break</BackLink>
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
          Your skill snapshot
        </h1>
        <OccupationLine occupation={snapshot.previous_occupation} />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <SkillSection
            title="From your CV"
            skills={snapshot.professional_skills}
            emptyMessage="No professional skills matched confidently enough to list. Go back to Step 1 and upload a CV to fill this in."
          />

          <SkillSection
            title="From your career break"
            note="These come from the activities you did during your career break."
            skills={snapshot.reframed_skills}
            emptyMessage="None of your selected activities mapped to a recognised skill yet."
          />
        </div>

        <div className="mt-8 flex justify-end">
          <GradientButton onClick={() => navigate('/diagnostic/gap')}>
            See my readiness &amp; gaps
          </GradientButton>
        </div>
      </main>
    </div>
  );
}
