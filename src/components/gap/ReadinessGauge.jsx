const RADIUS = 80;
const STROKE = 12;
const CENTER = RADIUS + STROKE;
const ARC_LENGTH = Math.PI * RADIUS;

/** Semi-circular gauge, drawn as a half-circle arc filled to `value` percent. */
export default function ReadinessGauge({ value, label = 'Ready today' }) {
  const clamped = Math.min(100, Math.max(0, value));
  const arc = `M ${STROKE} ${CENTER} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER * 2 - STROKE} ${CENTER}`;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${CENTER * 2} ${CENTER + STROKE}`}
        className="w-56 max-w-full"
        role="img"
        aria-label={`${clamped}% ${label}`}
      >
        <path
          d={arc}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className="text-ink-faint/15"
        />

        <path
          d={arc}
          fill="none"
          stroke="url(#readiness-gradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={ARC_LENGTH * (1 - clamped / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-spring"
        />

        <defs>
          <linearGradient id="readiness-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#de8ba8" />
            <stop offset="50%" stopColor="#b8acd4" />
            <stop offset="100%" stopColor="#5e6fa6" />
          </linearGradient>
        </defs>
      </svg>

      <p aria-hidden="true" className="-mt-8 font-display text-4xl font-bold text-ink">
        {clamped}%
      </p>
      <p aria-hidden="true" className="text-xs uppercase tracking-wide text-ink-faint">
        {label}
      </p>
    </div>
  );
}
