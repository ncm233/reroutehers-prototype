/**
 * Career-break activities, grouped into the four categories shown on the break step.
 *
 * Ids are the payload sent to the snapshot endpoint, which looks them up to produce
 * reframed skills. Components render from this config rather than repeating an id
 * as a string literal, so every id lives in one file.
 */
export const ACTIVITY_TAXONOMY = [
  {
    id: 'care_household',
    label: 'Care & Household',
    activities: [
      { id: 'cared_for_children', label: 'Childcare' },
      { id: 'ran_the_household', label: 'Running the household' },
      { id: 'cared_for_elderly_or_sick', label: 'Cared for elderly / sick family' },
    ],
  },
  {
    id: 'planning_organisation',
    label: 'Planning & Organisation',
    activities: [
      { id: 'organised_family_logistics', label: 'Day-to-day coordination' },
      { id: 'managed_multiple_schedules', label: 'Managing schedules' },
      { id: 'planned_events_gatherings', label: 'Event planning' },
      { id: 'kept_household_records', label: 'Paperwork and records' },
    ],
  },
  {
    id: 'finance_coordination',
    label: 'Finance & Negotiation',
    activities: [
      { id: 'managed_budget_finances', label: 'Budgeting' },
      { id: 'managed_home_repairs_vendors', label: 'Home repairs and contractors' },
      { id: 'handled_disputes_negotiations', label: 'Negotiation' },
    ],
  },
  {
    id: 'learning_community',
    label: 'Learning & Community',
    activities: [
      { id: 'taught_or_tutored_children', label: 'Teaching or tutoring' },
      { id: 'volunteered_community_roles', label: 'Volunteering' },
    ],
  },
];

/** Flat id -> label lookup, used to name the source activity on a reframed skill. */
export const ACTIVITY_LABELS = Object.fromEntries(
  ACTIVITY_TAXONOMY.flatMap((category) =>
    category.activities.map((activity) => [activity.id, activity.label])
  )
);
