import Header from '../layout/Header.jsx';
import IntakeStepper from './IntakeStepper.jsx';

/**
 * Shared frame for every intake screen: stepper, heading, and body.
 */
export default function IntakeLayout({ stageIndex, back, title, intro, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-grad-page">
      <Header />

      <main className="mx-auto w-full max-w-[760px] flex-1 px-4 py-8 sm:px-6">
        <IntakeStepper currentIndex={stageIndex} />

        {back && <div className="mt-8">{back}</div>}

        <h1
          className={`${back ? 'mt-3' : 'mt-8'} font-display text-2xl font-bold text-ink sm:text-3xl`}
        >
          {title}
        </h1>
        {intro && <p className="mt-2 text-sm text-ink-soft sm:text-base">{intro}</p>}

        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
