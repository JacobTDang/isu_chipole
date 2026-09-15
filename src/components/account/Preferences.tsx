"use client";

import { useEffect, useState } from "react";
import {
  readPreferences,
  writePreferences,
  type Preferences as PreferencesState,
} from "./prefs";

const options: Array<{ key: keyof PreferencesState; label: string }> = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "highProtein", label: "High protein" },
  { key: "glutenFree", label: "Gluten free" },
];

export function Preferences() {
  const [preferences, setPreferences] = useState<PreferencesState>({
    vegetarian: false,
    highProtein: false,
    glutenFree: false,
  });

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setPreferences(readPreferences());
    });
    return () => {
      active = false;
    };
  }, []);

  function toggle(key: keyof PreferencesState) {
    setPreferences((current) => {
      const next = { ...current, [key]: !current[key] };
      writePreferences(next);
      return next;
    });
  }

  return (
    <div className="divide-y divide-line">
      {options.map((option) => {
        const enabled = preferences[option.key];
        return (
          <button
            key={option.key}
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => toggle(option.key)}
            className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left"
          >
            <span className="text-[17px] text-ink">{option.label}</span>
            <span
              aria-hidden="true"
              className={`relative h-8 w-[52px] shrink-0 rounded-full border transition-colors ${
                enabled ? "border-cardinal bg-cardinal" : "border-line bg-tabletop"
              }`}
            >
              <span
                className={`absolute top-[3px] size-6 rounded-full bg-card shadow-sm transition-transform ${
                  enabled ? "translate-x-[23px]" : "translate-x-[3px]"
                }`}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
