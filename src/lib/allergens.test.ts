import { describe, expect, it } from "vitest";
import { ingredient } from "../data/menu";
import { allergenLabel, containsCaption, matchingAllergens, removedCaption } from "./allergens";

describe("allergens", () => {
  it("labels each allergen in sentence case", () => {
    expect(allergenLabel("dairy")).toBe("Dairy");
    expect(allergenLabel("fish")).toBe("Fish");
  });

  it("lists the selected allergens an ingredient contains, in menu order", () => {
    expect(matchingAllergens(ingredient("cookie"), ["eggs", "gluten"])).toEqual(["gluten", "eggs"]);
    expect(matchingAllergens(ingredient("cookie"), ["nuts"])).toEqual([]);
    expect(matchingAllergens(ingredient("grilled-chicken"), ["dairy"])).toEqual([]);
  });

  it("writes a contains caption", () => {
    expect(containsCaption(["dairy"])).toBe("Contains dairy");
    expect(containsCaption(["dairy", "eggs"])).toBe("Contains dairy, eggs");
  });

  it("writes the preset removal banner", () => {
    expect(removedCaption([ingredient("cheese"), ingredient("ranch")], ["dairy"])).toBe("We removed cheese and ranch. They contain dairy.");
    expect(removedCaption([ingredient("cheese")], ["dairy"])).toBe("We removed cheese. It contains dairy.");
    expect(removedCaption([ingredient("pasta"), ingredient("cheese"), ingredient("cookie")], ["dairy", "gluten"])).toBe("We removed pasta, cheese, and cookie. They contain dairy, gluten.");
  });
});
