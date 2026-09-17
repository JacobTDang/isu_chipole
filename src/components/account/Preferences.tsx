"use client";

import { usePreferences } from "../../state/PreferencesProvider";
import { ToggleRow } from "./ToggleRow";

type DietKey = "vegetarian" | "highProtein" | "glutenFree";

const options: Array<{ key: DietKey; label: string }> = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "highProtein", label: "High protein" },
  { key: "glutenFree", label: "Gluten free" },
];

export function Preferences() {
  const { preferences, update } = usePreferences();
  return (
    <div className="divide-y divide-line">
      {options.map((option) => (
        <ToggleRow key={option.key} label={option.label} enabled={preferences[option.key]} onToggle={() => update({ [option.key]: !preferences[option.key] })} />
      ))}
    </div>
  );
}
