import { describe, expect, it } from "vitest";
import { ingredient, preset } from "../data/menu";
import { allergenLabel, containsCaption, matchingAllergens, removeConflicts, removedCaption } from "./allergens";

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

  it("removes conflicting ingredients from a preset and names them", () => {
    const { kept, removed } = removeConflicts(preset("cyclone-bowl").ingredientIds, ["dairy"]);
    expect(kept).toEqual(["cilantro-lime-rice", "grilled-chicken", "black-beans", "corn", "corn-salsa"]);
    expect(removed.map((item) => item.id)).toEqual(["cheese", "chipotle-crema"]);
    expect(removedCaption(removed, ["dairy"])).toBe("We removed cheese and chipotle crema. They contain dairy.");
  });

  it("keeps everything when no allergies are set", () => {
    const ids = preset("cyclone-bowl").ingredientIds;
    expect(removeConflicts(ids, [])).toEqual({ kept: ids, removed: [] });
  });
});
