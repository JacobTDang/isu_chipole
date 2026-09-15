import { beforeEach, describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import type { BagItem } from "../data/types";
import { clearAll, KEYS, readBag, writeBag } from "./storage";

const item: BagItem = { id: "item-1", mealType: "bowl", ingredientIds: ["white-rice", "tofu"], quantity: 1 };

describe("storage", () => {
  beforeEach(() => {
    const dom = new JSDOM("", { url: "http://localhost" });
    Object.defineProperty(globalThis, "window", { configurable: true, value: dom.window });
  });

  it("round-trips a bag", () => {
    writeBag([item]);
    expect(readBag()).toEqual([item]);
  });

  it("throws when stored JSON is corrupt", () => {
    window.localStorage.setItem(KEYS.bag, "{oops");
    expect(() => readBag()).toThrow(/andrews\.bag/);
  });

  it("throws when a bag item is missing mealType", () => {
    window.localStorage.setItem(KEYS.bag, JSON.stringify({ items: [{ id: "bad", ingredientIds: [], quantity: 1 }], plan: 5 }));
    expect(() => readBag()).toThrow(/mealType/);
  });

  it("stores plan and promo with the bag", () => {
    writeBag([item]);
    expect(JSON.parse(window.localStorage.getItem(KEYS.bag) as string)).toEqual({ items: [item], plan: 5 });
  });

  it("clears every Andrew's key", () => {
    for (const key of Object.values(KEYS)) window.localStorage.setItem(key, "anything");
    clearAll();
    for (const key of Object.values(KEYS)) expect(window.localStorage.getItem(key)).toBeNull();
  });
});
