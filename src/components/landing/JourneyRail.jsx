import { JOURNEY_STAGES } from '../../config/journeyStages.js';

// Each marker picks up its own position along the pink -> violet -> blue track.
const MARKER_FILL = [
  'from-pink-500 to-violet-400',
  'from-violet-400 to-violet-600',
  'from-violet-600 to-blue-600',
];
const TRACK_SEGMENT = ['from-pink-500 to-violet-400', 'from-violet-400 to-blue-600'];

const SEGMENT_BASE = 'absolute left-4 top-4 -translate-x-1/2 bg-gradient-to-b';

export default function JourneyRail() {
  return (
    <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
      {JOURNEY_STAGES.map((stage, index) => {
        const last = index === JOURNEY_STAGES.length - 1;

        return (
          <li key={stage.id} className="relative flex gap-4 sm:block">
            {/* Runs marker centre to marker centre, passing behind the next marker. */}
            {!last && (
              <span
                aria-hidden="true"
                className={[
                  SEGMENT_BASE,
                  'h-[calc(100%+2rem)] w-0.5',
                  'sm:h-0.5 sm:w-[calc(100%+1.5rem)] sm:translate-x-0 sm:-translate-y-1/2 sm:bg-gradient-to-r',
                  TRACK_SEGMENT[index],
                ].join(' ')}
              />
            )}

            {/* Carries the track to the container edge so the rail spans the same
                width as the cards below. Fades out rather than stopping dead. */}
            {last && (
              <span
                aria-hidden="true"
                className={[
                  'absolute left-4 top-4 hidden h-0.5 w-[calc(100%-1rem)] -translate-y-1/2',
                  'bg-gradient-to-r from-blue-600 to-transparent sm:block',
                ].join(' ')}
              />
            )}

            <span
              className={[
                'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full',
                'bg-gradient-to-br text-sm font-semibold text-white shadow-card',
                MARKER_FILL[index],
              ].join(' ')}
            >
              {index + 1}
            </span>

            <div className="sm:mt-4">
              <h3 className="font-semibold text-ink">{stage.label}</h3>
              <p className="mt-1 max-w-[30ch] text-sm text-ink-soft">{stage.blurb}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
