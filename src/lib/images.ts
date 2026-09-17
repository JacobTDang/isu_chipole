import { ingredient, mealType, preset } from "../data/menu";
import type { Selection } from "../data/types";

const ADD_ON_IMAGES: Record<string, string> = {
  "protein-shake": "/meals/protein-shake.jpg",
  cookie: "/meals/cookie.jpg",
};

export function selectionImage(sel: Selection): string {
  const selected = sel.ingredientIds.map(ingredient);
  const extrasOnly = selected.length > 0 && selected.every((item) => item.group === "extras");
  if (extrasOnly) {
    const addOns = selected.filter((item) => item.id in ADD_ON_IMAGES);
    if (addOns.length === 1) return ADD_ON_IMAGES[addOns[0].id];
  }
  if (sel.presetId) return preset(sel.presetId).image;
  return mealType(sel.mealType).image;
}
