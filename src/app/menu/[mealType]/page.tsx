import { notFound } from "next/navigation";
import { MEAL_TYPES, mealType } from "../../../data/menu";
import type { MealTypeId, Selection } from "../../../data/types";
import { RequireAuth } from "../../../components/RequireAuth";
import { MenuPageClient } from "./MenuPageClient";

export default async function MenuPage({ params, searchParams }: {
  params: Promise<{ mealType: string }>;
  searchParams: Promise<{ edit?: string | string[] }>;
}) {
  const { mealType: id } = await params;
  if (!MEAL_TYPES.some((type) => type.id === id)) notFound();
  const type = mealType(id as MealTypeId);
  const query = await searchParams;
  const editingId = typeof query.edit === "string" ? query.edit : undefined;
  const initial: Selection = { mealType: type.id, ingredientIds: [], quantity: 1 };
  return <RequireAuth><MenuPageClient initial={initial} title={type.name} image={type.image} editingId={editingId} /></RequireAuth>;
}
