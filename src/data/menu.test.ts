import { describe, expect, it } from "vitest";
import { ALLERGENS, INGREDIENTS, ingredient } from "./menu";

describe("allergen data", () => {
  it("marks the cookie with gluten, dairy, and eggs", () => {
    expect(ingredient("cookie").allergens).toEqual(["gluten", "dairy", "eggs"]);
  });

  it("leaves grilled chicken free of allergens", () => {
    expect(ingredient("grilled-chicken").allergens).toEqual([]);
  });

  it("uses only the six known allergen values", () => {
    for (const item of INGREDIENTS) {
      for (const allergen of item.allergens) expect(ALLERGENS).toContain(allergen);
    }
  });
});
