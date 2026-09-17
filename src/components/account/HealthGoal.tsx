"use client";

import { goalTarget } from "../../lib/goals";
import type { Goal } from "../../lib/prefs";
import { usePreferences } from "../../state/PreferencesProvider";
import { SegmentedControl } from "../SegmentedControl";

const options: Array<{ id: Goal | "none"; label: string }> = [
  { id: "none", label: "None" },
  { id: "muscle", label: "Build muscle" },
  { id: "lose", label: "Lose weight" },
  { id: "maintain", label: "Maintain" },
];

export function HealthGoal() {
  const { preferences, update } = usePreferences();
  const goal = preferences.goal;
  return (
    <fieldset className="px-4 py-3">
      <legend className="sr-only">Health goal</legend>
      <SegmentedControl options={options} value={goal ?? "none"} onChange={(id) => update({ goal: id === "none" ? null : id as Goal })} />
      <p className="mt-3 text-[15px] text-ink-soft">{goal ? goalTarget(goal) : "No target set."}</p>
    </fieldset>
  );
}
