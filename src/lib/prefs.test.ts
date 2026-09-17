import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";
import {
  PREFS_KEY,
  clearPreferences,
  readPreferences,
  writePreferences,
  type Preferences,
} from "./prefs";

const defaults: Preferences = {
  vegetarian: false,
  highProtein: false,
  glutenFree: false,
  allergies: [],
  goal: null,
  budget: null,
};

describe("account preferences", () => {
  beforeEach(() => {
    const dom = new JSDOM("", { url: "http://localhost" });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: dom.window,
    });
  });

  it("returns disabled preferences when no value is stored", () => {
    expect(readPreferences()).toEqual(defaults);
  });

  it("round-trips valid preferences", () => {
    const preferences: Preferences = {
      vegetarian: true,
      highProtein: true,
      glutenFree: false,
      allergies: ["dairy", "nuts"],
      goal: "muscle",
      budget: 12,
    };

    writePreferences(preferences);

    expect(readPreferences()).toEqual(preferences);
  });

  it("fills defaults for preferences stored before goals, allergies, and budget", () => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify({ vegetarian: true, highProtein: false, glutenFree: true }));

    expect(readPreferences()).toEqual({ ...defaults, vegetarian: true, glutenFree: true });
  });

  it("throws when stored preferences are corrupt", () => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify({ vegetarian: "yes" }));

    expect(() => readPreferences()).toThrow(/andrews\.prefs/);
  });

  it("throws when a new field is present with the wrong type", () => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify({ ...defaults, budget: "10" }));
    expect(() => readPreferences()).toThrow(/andrews\.prefs/);

    window.localStorage.setItem(PREFS_KEY, JSON.stringify({ ...defaults, allergies: ["peanut"] }));
    expect(() => readPreferences()).toThrow(/andrews\.prefs/);

    window.localStorage.setItem(PREFS_KEY, JSON.stringify({ ...defaults, goal: "bulk" }));
    expect(() => readPreferences()).toThrow(/andrews\.prefs/);
  });

  it("clears stored preferences", () => {
    writePreferences({ ...defaults, vegetarian: true });

    clearPreferences();

    expect(window.localStorage.getItem(PREFS_KEY)).toBeNull();
  });
});
