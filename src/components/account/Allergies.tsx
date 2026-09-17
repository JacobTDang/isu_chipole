"use client";

import { ALLERGENS } from "../../data/menu";
import { allergenLabel } from "../../lib/allergens";
import { usePreferences } from "../../state/PreferencesProvider";
import { ToggleRow } from "./ToggleRow";

export function Allergies() {
  const { preferences, update } = usePreferences();
  const toggle = (allergen: (typeof ALLERGENS)[number]) => {
    const current = preferences.allergies;
    update({ allergies: current.includes(allergen) ? current.filter((value) => value !== allergen) : ALLERGENS.filter((value) => value === allergen || current.includes(value)) });
  };
  return (
    <div className="divide-y divide-line">
      {ALLERGENS.map((allergen) => (
        <ToggleRow key={allergen} label={allergenLabel(allergen)} enabled={preferences.allergies.includes(allergen)} onToggle={() => toggle(allergen)} />
      ))}
      <p className="px-4 py-3 text-[13px] text-ink-soft">We&apos;ll grey out anything that contains these.</p>
    </div>
  );
}
