"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EMPTY_PREFERENCES, readPreferences, writePreferences, type Preferences } from "../lib/prefs";

type PreferencesValue = { preferences: Preferences; ready: boolean; update(patch: Partial<Preferences>): void };
const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(EMPTY_PREFERENCES);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) { setPreferences(readPreferences()); setReady(true); } });
    return () => { active = false; };
  }, []);

  const value = useMemo<PreferencesValue>(() => ({
    preferences,
    ready,
    update(patch) {
      setPreferences((current) => {
        const next = { ...current, ...patch };
        writePreferences(next);
        return next;
      });
    },
  }), [preferences, ready]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("usePreferences must be used inside PreferencesProvider");
  return value;
}
