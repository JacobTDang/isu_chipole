import { describe, expect, it } from "vitest";
import { preset } from "../data/menu";
import type { BagItem, Selection } from "../data/types";
import { DELIVERY_FEE, bagSubtotal, itemPrice, macros, mealCount, orderTotals, planDiscountRate, promoRate } from "./pricing";

const bowl: Selection = { mealType: "bowl", ingredientIds: ["cilantro-lime-rice", "grilled-chicken"], quantity: 1 };

describe("pricing", () => {
  it("prices a basic bowl", () => expect(itemPrice(bowl)).toBe(8.5));
  it("multiplies by quantity", () => expect(itemPrice({ ...bowl, quantity: 2 })).toBe(17));
  it("adds ingredient upcharges", () => expect(itemPrice({ ...bowl, ingredientIds: [...bowl.ingredientIds, "guac"] })).toBe(10.25));
  it("prices an extras-only item without a meal base", () => expect(itemPrice({ mealType: "bowl", ingredientIds: ["protein-shake"], quantity: 1 })).toBe(3.5));
  it("calculates bag subtotal and meal count", () => {
    const items: BagItem[] = [{ ...bowl, id: "one", quantity: 2 }];
    expect(bagSubtotal(items)).toBe(17);
    expect(mealCount(items)).toBe(2);
  });
  it("applies plan discounts only when filled", () => {
    expect(planDiscountRate(5, 4)).toBe(0);
    expect(planDiscountRate(5, 5)).toBe(0.15);
    expect(planDiscountRate(7, 6)).toBe(0);
    expect(planDiscountRate(7, 7)).toBe(0.2);
    expect(planDiscountRate(10, 12)).toBe(0.25);
  });
  it("recognizes the promo code case-insensitively", () => {
    expect(promoRate("cyclone10")).toBe(0.1);
    expect(promoRate("nope")).toBe(0);
  });
  it("calculates order totals", () => {
    const items: BagItem[] = [{ ...bowl, id: "ten", quantity: 10 }];
    expect(orderTotals(items, 10, "CYCLONE10")).toEqual({ subtotal: 85, discount: 29.75, tax: 3.87, delivery: 0, total: 59.12 });
  });
  it("adds the untaxed delivery fee to the total", () => {
    const items: BagItem[] = [{ ...bowl, id: "ten", quantity: 10 }];
    expect(DELIVERY_FEE).toBe(2.99);
    expect(orderTotals(items, 10, "CYCLONE10", DELIVERY_FEE)).toEqual({ subtotal: 85, discount: 29.75, tax: 3.87, delivery: 2.99, total: 62.11 });
  });
  it("returns money with at most two decimal places", () => {
    const values = Object.values(orderTotals([{ ...bowl, id: "three", quantity: 3 }], 5));
    for (const value of values) expect(String(value).split(".")[1]?.length ?? 0).toBeLessThanOrEqual(2);
  });
  it("sums macros", () => expect(macros(bowl)).toEqual({ calories: 395, protein: 39 }));
  it("sums the Cyclone Bowl preset macros", () => {
    const { mealType: type, ingredientIds } = preset("cyclone-bowl");
    expect(macros({ mealType: type, ingredientIds, quantity: 1 })).toEqual({ calories: 805, protein: 59 });
  });
});
