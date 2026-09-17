import { beforeEach, describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import type { BagItem } from "../data/types";
import { clearAll, KEYS, readBagState, writeBagState } from "./storage";

const item: BagItem = { id: "item-1", mealType: "bowl", ingredientIds: ["white-rice", "tofu"], quantity: 1 };

describe("storage", () => {
  beforeEach(() => {
    const dom = new JSDOM("", { url: "http://localhost" });
    Object.defineProperty(globalThis, "window", { configurable: true, value: dom.window });
  });

  it("round-trips a bag state with plan and promo", () => {
    const state = { items: [item], plan: 7 as const, promo: "CYCLONE10" };
    writeBagState(state);
    expect(readBagState()).toEqual(state);
  });

  it("throws when stored JSON is corrupt", () => {
    window.localStorage.setItem(KEYS.bag, "{oops");
    expect(() => readBagState()).toThrow(/andrews\.bag/);
  });

  it("throws when a bag item is missing mealType", () => {
    window.localStorage.setItem(KEYS.bag, JSON.stringify({ items: [{ id: "bad", ingredientIds: [], quantity: 1 }], plan: 5 }));
    expect(() => readBagState()).toThrow(/mealType/);
  });

  it("returns the five-meal default when no bag state is stored", () => {
    expect(readBagState()).toEqual({ items: [], plan: 5 });
  });

  it("clears every PrepPal key", () => {
    for (const key of Object.values(KEYS)) window.localStorage.setItem(key, "anything");
    clearAll();
    for (const key of Object.values(KEYS)) expect(window.localStorage.getItem(key)).toBeNull();
  });
});
