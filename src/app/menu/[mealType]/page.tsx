import { notFound } from "next/navigation";
import { MEAL_TYPES, mealType } from "../../../data/menu";
import type { MealTypeId, Selection } from "../../../data/types";
import { RequireAuth } from "../../../components/RequireAuth";
import { MenuPageClient } from "./MenuPageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return MEAL_TYPES.map((type) => ({ mealType: type.id }));
}

export default async function MenuPage({ params }: { params: Promise<{ mealType: string }> }) {
  const { mealType: id } = await params;
  if (!MEAL_TYPES.some((type) => type.id === id)) notFound();
  const type = mealType(id as MealTypeId);
  const initial: Selection = { mealType: type.id, ingredientIds: [], quantity: 1 };
  return <RequireAuth><MenuPageClient initial={initial} title={type.name} image={type.image} /></RequireAuth>;
}
