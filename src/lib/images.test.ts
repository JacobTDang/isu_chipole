import { describe, expect, it } from "vitest";
import { selectionImage } from "./images";

describe("selectionImage", () => {
  it("returns the add-on photo for a single extras add-on", () => {
    expect(selectionImage({ mealType: "bowl", ingredientIds: ["cookie"], quantity: 1 })).toBe("/meals/cookie.jpg");
    expect(selectionImage({ mealType: "bowl", ingredientIds: ["protein-shake"], quantity: 1 })).toBe("/meals/protein-shake.jpg");
  });
  it("returns the preset photo when a preset is set", () => {
    expect(selectionImage({ mealType: "bowl", ingredientIds: ["cilantro-lime-rice", "cookie"], quantity: 1, presetId: "cyclone-bowl" })).toBe("/meals/cyclone-bowl.jpg");
  });
  it("returns the meal type photo otherwise", () => {
    expect(selectionImage({ mealType: "wrap", ingredientIds: ["mixed-greens", "tofu"], quantity: 1 })).toBe("/meals/wrap.jpg");
    expect(selectionImage({ mealType: "salad", ingredientIds: ["cookie", "protein-shake"], quantity: 1 })).toBe("/meals/salad.jpg");
    expect(selectionImage({ mealType: "pasta", ingredientIds: ["double-protein"], quantity: 1 })).toBe("/meals/pasta.jpg");
  });
});
