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

  it("filters base ingredients so pasta only allows pasta and no rice", async () => {
    const { ingredientsInGroup } = await import("./menu");
    const pastaBases = ingredientsInGroup("base", "pasta");
    expect(pastaBases.map((b) => b.id)).toEqual(["pasta"]);
    expect(pastaBases.some((b) => b.id.includes("rice"))).toBe(false);

    const bowlBases = ingredientsInGroup("base", "bowl");
    expect(bowlBases.some((b) => b.id === "pasta")).toBe(false);
    expect(bowlBases.some((b) => b.id === "white-rice")).toBe(true);
  });
});
