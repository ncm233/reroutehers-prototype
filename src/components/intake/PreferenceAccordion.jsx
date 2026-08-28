import { useState } from 'react';
import { PREFERENCE_TAXONOMY } from '../../config/preferenceTaxonomy.js';

export default function PreferenceAccordion({ selections, onChange }) {
  const [openId, setOpenId] = useState(null);

  function toggleOption(categoryId, optionId) {
    const current = selections[categoryId] ?? [];

    onChange(
      categoryId,
      current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId]
    );
  }

  return (
    <div className="divide-y divide-ink-faint/15">
      {PREFERENCE_TAXONOMY.map((category) => {
        const open = openId === category.id;
        const chosen = selections[category.id] ?? [];

        return (
          <div key={category.id}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : category.id)}
              className="flex w-full items-center justify-between gap-3 py-4 text-left text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span>
                {category.label}
                {chosen.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-pink-600">{chosen.length}</span>
                )}
              </span>
              <span aria-hidden="true" className="text-ink-faint">
                {open ? '▴' : '▾'}
              </span>
            </button>

            {open && (
              <div className="flex flex-wrap gap-2 pb-4">
                {category.options.map((option) => {
                  const checked = chosen.includes(option.id);

                  return (
                    <label
                      key={option.id}
                      className={[
                        'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition',
                        'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-600',
                        checked
                          ? 'border-mint-600/40 bg-mint-100 font-medium text-mint-700'
                          : 'border-ink-faint/25 bg-white/60 text-ink-soft hover:border-pink-500/45',
                      ].join(' ')}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(category.id, option.id)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
