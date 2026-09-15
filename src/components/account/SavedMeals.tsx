"use client";

import { mealType } from "../../data/menu";
import type { Selection } from "../../data/types";

export function SavedMeals({
  meals,
  onAdd,
}: {
  meals: Selection[];
  onAdd(selection: Selection): void;
}) {
  const namedMeals = meals.filter((meal) => meal.name?.trim());

  if (namedMeals.length === 0) {
    return (
      <div className="px-4 py-5">
        <p className="font-semibold text-ink">No saved meals yet.</p>
        <p className="mt-1 text-[15px] text-ink-soft">Name a custom build to save it here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-line">
      {namedMeals.map((meal, index) => (
        <div key={`${meal.name}-${index}`} className="flex min-h-16 items-center gap-3 px-4 py-3">
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-ink">{meal.name}</span>
            <span className="mt-0.5 block text-[13px] text-ink-soft">
              {mealType(meal.mealType).name}
            </span>
          </span>
          <button
            type="button"
            onClick={() => onAdd(meal)}
            className="min-h-11 shrink-0 rounded-xl border border-line bg-cream px-3 text-[15px] font-semibold text-cardinal"
          >
            Add to bag
          </button>
        </div>
      ))}
    </div>
  );
}
