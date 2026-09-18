import { beforeEach, describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import type { BagItem, Order } from "../data/types";
import { clearAll, KEYS, readBagState, readOrders, writeBagState, writeOrders } from "./storage";

const item: BagItem = { id: "item-1", mealType: "bowl", ingredientIds: ["white-rice", "tofu"], quantity: 1 };
const location = { id: "memorial-union", name: "Memorial Union", note: "Main Lounge entrance" };
const undated = {
  id: "PP-0001", items: [item], plan: 5 as const, location, time: "4:30 PM",
  subtotal: 7.5, discount: 0, tax: 0.53, total: 8.03, placedAt: "2026-09-01T12:00:00.000Z",
};
const legacyOrder = { ...undated, date: "2026-09-06" };

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
    expect(() => readBagState()).toThrow(/preppal\.bag/);
  });

  it("throws when a bag item is missing mealType", () => {
    window.localStorage.setItem(KEYS.bag, JSON.stringify({ items: [{ id: "bad", ingredientIds: [], quantity: 1 }], plan: 5 }));
    expect(() => readBagState()).toThrow(/mealType/);
  });

  it("returns the five-meal default when no bag state is stored", () => {
    expect(readBagState()).toEqual({ items: [], plan: 5 });
  });

  it("round-trips a delivery order", () => {
    const order: Order = { ...legacyOrder, fulfillment: "delivery", address: "Friley Hall, room 2310", deliveryFee: 2.99, total: 11.02 };
    writeOrders([order]);
    expect(readOrders()).toEqual([order]);
  });

  it("reads orders stored before delivery as pickup with no fee", () => {
    window.localStorage.setItem(KEYS.orders, JSON.stringify([legacyOrder]));
    expect(readOrders()).toEqual([{ ...legacyOrder, fulfillment: "pickup", address: null, deliveryFee: 0 }]);
  });

  it("throws when a delivery order has no address", () => {
    window.localStorage.setItem(KEYS.orders, JSON.stringify([{ ...legacyOrder, fulfillment: "delivery", address: null, deliveryFee: 2.99 }]));
    expect(() => readOrders()).toThrow(/preppal\.orders/);
  });

  it("accepts an order with a calendar date", () => {
    const order: Order = { ...legacyOrder, date: "2026-09-24", fulfillment: "pickup", address: null, deliveryFee: 0 };
    writeOrders([order]);
    expect(readOrders()).toEqual([order]);
  });

  it("migrates a legacy weekday to the first matching date on or after it was placed", () => {
    window.localStorage.setItem(KEYS.orders, JSON.stringify([{ ...undated, day: "Sunday" }]));
    expect(readOrders()).toEqual([{ ...legacyOrder, date: "2026-09-06", fulfillment: "pickup", address: null, deliveryFee: 0 }]);
  });

  it("throws when an order has a malformed date", () => {
    window.localStorage.setItem(KEYS.orders, JSON.stringify([{ ...legacyOrder, date: "2026-02-30" }]));
    expect(() => readOrders()).toThrow(/preppal\.orders/);
    window.localStorage.setItem(KEYS.orders, JSON.stringify([{ ...legacyOrder, date: "Thursday" }]));
    expect(() => readOrders()).toThrow(/preppal\.orders/);
  });

  it("throws when an order has neither a date nor a day", () => {
    window.localStorage.setItem(KEYS.orders, JSON.stringify([undated]));
    expect(() => readOrders()).toThrow(/preppal\.orders/);
  });

  it("clears every PrepPal key", () => {
    for (const key of Object.values(KEYS)) window.localStorage.setItem(key, "anything");
    clearAll();
    for (const key of Object.values(KEYS)) expect(window.localStorage.getItem(key)).toBeNull();
  });
});
