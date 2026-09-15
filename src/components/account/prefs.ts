export const PREFS_KEY = "andrews.prefs";

export type Preferences = {
  vegetarian: boolean;
  highProtein: boolean;
  glutenFree: boolean;
};

const EMPTY_PREFERENCES: Preferences = {
  vegetarian: false,
  highProtein: false,
  glutenFree: false,
};

function invalid(reason: string): never {
  throw new Error(`andrews storage: ${PREFS_KEY} is invalid: ${reason}`);
}

function isPreferences(value: unknown): value is Preferences {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate.vegetarian === "boolean"
    && typeof candidate.highProtein === "boolean"
    && typeof candidate.glutenFree === "boolean";
}

export function readPreferences(): Preferences {
  if (typeof window === "undefined") return EMPTY_PREFERENCES;
  const raw = window.localStorage.getItem(PREFS_KEY);
  if (raw === null) return EMPTY_PREFERENCES;
  let value: unknown;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    return invalid("not valid JSON");
  }
  if (!isPreferences(value)) return invalid("preferences shape is invalid");
  return value;
}

export function writePreferences(preferences: Preferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
}

export function clearPreferences(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFS_KEY);
}
