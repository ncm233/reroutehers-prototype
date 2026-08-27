import GlassCard from '../ui/GlassCard.jsx';
import SkillItem from './SkillItem.jsx';

/**
 * One labelled column of skills. An empty list renders `emptyMessage` rather
 * than placeholder skills.
 */
export default function SkillSection({ title, note, skills, emptyMessage }) {
  return (
    <GlassCard className="p-6">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {note && <p className="mt-1 text-xs text-ink-soft">{note}</p>}

      {skills.length === 0 ? (
        <p className="mt-4 text-sm italic text-ink-faint">{emptyMessage}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {skills.map((skill) => (
            <SkillItem key={`${skill.source}-${skill.skill}`} skill={skill} />
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
