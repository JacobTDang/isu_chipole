"use client";

import { usePreferences } from "../../state/PreferencesProvider";

export const BUDGET_MIN = 6;
export const BUDGET_MAX = 20;
export const BUDGET_STEP = 0.5;
const BUDGET_DEFAULT = 10;

export function Budget() {
  const { preferences, update } = usePreferences();
  const budget = preferences.budget;
  return (
    <div className="px-4 py-3">
      <p aria-live="polite" className="text-[17px] font-semibold tabular-nums text-ink">{budget === null ? "No budget" : `$${budget.toFixed(2)} per meal`}</p>
      <input
        type="range"
        aria-label="Budget per meal"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={BUDGET_STEP}
        value={budget ?? BUDGET_DEFAULT}
        disabled={budget === null}
        onChange={(event) => update({ budget: Number(event.target.value) })}
        className="mt-2 h-11 w-full accent-cardinal disabled:opacity-45"
      />
      <label className="flex min-h-11 items-center gap-3 text-[17px] text-ink">
        <input type="checkbox" checked={budget === null} onChange={(event) => update({ budget: event.target.checked ? null : BUDGET_DEFAULT })} className="size-5 accent-cardinal" />
        No budget
      </label>
    </div>
  );
}
