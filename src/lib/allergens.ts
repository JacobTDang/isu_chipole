import { ALLERGENS } from "../data/menu";
import type { Allergen, Ingredient } from "../data/types";

const LABELS: Record<Allergen, string> = { dairy: "Dairy", gluten: "Gluten", nuts: "Nuts", soy: "Soy", eggs: "Eggs", fish: "Fish" };

export function allergenLabel(allergen: Allergen): string {
  return LABELS[allergen];
}

export function matchingAllergens(item: Ingredient, allergies: Allergen[]): Allergen[] {
  return ALLERGENS.filter((allergen) => item.allergens.includes(allergen) && allergies.includes(allergen));
}

export function containsCaption(allergens: Allergen[]): string {
  return `Contains ${allergens.join(", ")}`;
}

function listNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function removedCaption(removed: Ingredient[], allergies: Allergen[]): string {
  const names = removed.map((item) => item.name.charAt(0).toLowerCase() + item.name.slice(1));
  const allergens = ALLERGENS.filter((allergen) => removed.some((item) => matchingAllergens(item, allergies).includes(allergen)));
  const verb = removed.length === 1 ? "It contains" : "They contain";
  return `We removed ${listNames(names)}. ${verb} ${allergens.join(", ")}.`;
}
