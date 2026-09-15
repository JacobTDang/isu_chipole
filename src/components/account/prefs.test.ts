import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";
import {
  PREFS_KEY,
  clearPreferences,
  readPreferences,
  writePreferences,
} from "./prefs";

describe("account preferences", () => {
  beforeEach(() => {
    const dom = new JSDOM("", { url: "http://localhost" });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: dom.window,
    });
  });

  it("returns disabled preferences when no value is stored", () => {
    expect(readPreferences()).toEqual({
      vegetarian: false,
      highProtein: false,
      glutenFree: false,
    });
  });

  it("round-trips valid preferences", () => {
    const preferences = {
      vegetarian: true,
      highProtein: true,
      glutenFree: false,
    };

    writePreferences(preferences);

    expect(readPreferences()).toEqual(preferences);
  });

  it("throws when stored preferences are corrupt", () => {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify({ vegetarian: "yes" }));

    expect(() => readPreferences()).toThrow(/andrews\.prefs/);
  });

  it("clears stored preferences", () => {
    writePreferences({
      vegetarian: true,
      highProtein: false,
      glutenFree: false,
    });

    clearPreferences();

    expect(window.localStorage.getItem(PREFS_KEY)).toBeNull();
  });
});
