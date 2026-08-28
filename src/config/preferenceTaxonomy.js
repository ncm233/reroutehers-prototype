/**
 * Optional preferences captured after the career break step.
 *
 * Selections are held client-side only: no request carries them, and neither the
 * snapshot nor the gap payload includes them.
 */
export const PREFERENCE_TAXONOMY = [
  {
    id: 'work_arrangement',
    label: 'Work arrangement',
    options: [
      { id: 'remote', label: 'Remote' },
      { id: 'hybrid', label: 'Hybrid' },
      { id: 'on_site', label: 'On site' },
      { id: 'freelance', label: 'Freelance or contract' },
    ],
  },
  {
    id: 'time_schedule',
    label: 'Time & schedule',
    options: [
      { id: 'full_time', label: 'Full time' },
      { id: 'part_time', label: 'Part time' },
      { id: 'flexible_hours', label: 'Flexible hours' },
      { id: 'school_hours', label: 'School hours' },
    ],
  },
  {
    id: 'location_commute',
    label: 'Location & commute',
    options: [
      { id: 'short_commute', label: 'Short commute' },
      { id: 'no_commute', label: 'No commute' },
      { id: 'open_to_relocate', label: 'Open to relocating' },
    ],
  },
  {
    id: 'family_daily_needs',
    label: 'Family & daily needs',
    options: [
      { id: 'childcare_support', label: 'Childcare support' },
      { id: 'parental_leave', label: 'Strong parental leave' },
      { id: 'phased_return', label: 'Phased return to work' },
    ],
  },
];
