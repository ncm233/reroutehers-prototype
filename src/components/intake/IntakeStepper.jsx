import { Fragment } from 'react';
import { FLOW_STEPS } from '../../config/flowSteps.js';

const MARKER_STATE = {
  complete: 'bg-grad-btn text-white',
  current: 'bg-grad-btn text-white shadow-card',
  upcoming: 'bg-white/60 text-ink-soft ring-1 ring-ink-faint/40',
};

const LABEL_STATE = {
  complete: 'text-ink-soft',
  current: 'font-semibold text-ink',
  upcoming: 'text-ink-soft',
};

// Markers size to their labels and the connectors absorb the slack, so the
// track always reaches both edges of the content column.
const CONNECTOR = 'mt-[17px] h-0.5 flex-1 rounded-full';

/**
 * Progress across the four diagnostic screens. Steps before `currentIndex` read
 * as complete; the rest are upcoming.
 */
export default function IntakeStepper({ currentIndex }) {
  return (
    <ol className="flex items-start" aria-label="Diagnostic progress">
      {FLOW_STEPS.map((step, index) => {
        const complete = index < currentIndex;
        const current = index === currentIndex;
        const state = complete ? 'complete' : current ? 'current' : 'upcoming';
        // A connector belongs to the step on its right, so it is travelled as
        // soon as the step on its left is done.
        const travelled = index <= currentIndex;

        return (
          <Fragment key={step.id}>
            {index > 0 && (
              <li
                aria-hidden="true"
                className={`${CONNECTOR} ${travelled ? 'bg-grad-btn' : 'bg-ink-faint/25'}`}
              />
            )}

            <li
              data-state={state}
              aria-current={current ? 'step' : undefined}
              className="flex shrink-0 flex-col items-center gap-2 px-2"
            >
              <span
                className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold transition ${MARKER_STATE[state]}`}
              >
                {complete ? '✓' : index + 1}
              </span>

              <span className={`text-xs ${LABEL_STATE[state]}`}>
                {step.label}
                <span className="sr-only">
                  {complete ? ' completed' : current ? ' current step' : ' not started'}
                </span>
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
