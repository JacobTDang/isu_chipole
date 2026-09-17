import { ALLERGENS } from "../data/menu";
import type { Allergen } from "../data/types";

export const PREFS_KEY = "preppal.prefs";
export const LEGACY_PREFS_KEY = "andrews.prefs";

export type Goal = "muscle" | "lose" | "maintain";
export const GOALS: Goal[] = ["muscle", "lose", "maintain"];

export type Preferences = {
  vegetarian: boolean;
  highProtein: boolean;
  glutenFree: boolean;
  allergies: Allergen[];
  goal: Goal | null;
  budget: number | null;
};

export const EMPTY_PREFERENCES: Preferences = {
  vegetarian: false,
  highProtein: false,
  glutenFree: false,
  allergies: [],
  goal: null,
  budget: null,
};

function invalid(reason: string): never {
  throw new Error(`preppal storage: ${PREFS_KEY} is invalid: ${reason}`);
}

const isAllergen = (value: unknown): value is Allergen => ALLERGENS.includes(value as Allergen);
const isGoal = (value: unknown): value is Goal => GOALS.includes(value as Goal);

function migrate(value: unknown): Preferences {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return invalid("preferences shape is invalid");
  const candidate = value as Record<string, unknown>;
  const { vegetarian, highProtein, glutenFree } = candidate;
  if (typeof vegetarian !== "boolean" || typeof highProtein !== "boolean" || typeof glutenFree !== "boolean") {
    return invalid("preferences shape is invalid");
  }
  const allergies = candidate.allergies === undefined ? [] : candidate.allergies;
  if (!Array.isArray(allergies) || !allergies.every(isAllergen)) return invalid("allergies is invalid");
  const goal = candidate.goal === undefined ? null : candidate.goal;
  if (goal !== null && !isGoal(goal)) return invalid("goal is invalid");
  const budget = candidate.budget === undefined ? null : candidate.budget;
  if (budget !== null && (typeof budget !== "number" || !Number.isFinite(budget))) return invalid("budget is invalid");
  return { vegetarian, highProtein, glutenFree, allergies, goal, budget };
}

export function readPreferences(): Preferences {
  if (typeof window === "undefined") return EMPTY_PREFERENCES;
  const raw = window.localStorage.getItem(PREFS_KEY) ?? window.localStorage.getItem(LEGACY_PREFS_KEY);
  if (raw === null) return EMPTY_PREFERENCES;
  let value: unknown;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    return invalid("not valid JSON");
  }
  return migrate(value);
}

export function writePreferences(preferences: Preferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
}

export function clearPreferences(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFS_KEY);
  window.localStorage.removeItem(LEGACY_PREFS_KEY);
}
