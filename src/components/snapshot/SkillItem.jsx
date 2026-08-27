import { ACTIVITY_LABELS } from '../../config/activityTaxonomy.js';

export default function SkillItem({ skill }) {
  const fromBreak = skill.source === 'break';
  const activityLabel = fromBreak
    ? (ACTIVITY_LABELS[skill.from_activity] ?? skill.from_activity)
    : null;

  return (
    <li
      className={[
        'rounded-2xl border px-4 py-3',
        fromBreak ? 'border-mint-600/25 bg-mint-100/70' : 'border-ink-faint/15 bg-white/60',
      ].join(' ')}
    >
      <p className={`text-sm font-medium ${fromBreak ? 'text-mint-700' : 'text-ink'}`}>
        {skill.skill}
      </p>

      {/* The section heading already names the source, so only the activity that
          produced this skill adds anything. */}
      {activityLabel && <p className="mt-0.5 text-xs text-ink-faint">from {activityLabel}</p>}

      {skill.evidence && <p className="mt-1 text-xs text-ink-soft">{skill.evidence}</p>}
    </li>
  );
}
