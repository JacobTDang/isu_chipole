import { notFound } from "next/navigation";
import { PRESETS, preset } from "../../../data/menu";
import { Builder } from "../../../components/builder/Builder";
import { RequireAuth } from "../../../components/RequireAuth";

export default async function PresetPage({ params }: { params: Promise<{ presetId: string }> }) {
  const { presetId } = await params;
  if (!PRESETS.some((meal) => meal.id === presetId)) notFound();
  const meal = preset(presetId);
  return <RequireAuth><Builder initial={{ mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id }} title={meal.name} image={meal.image} /></RequireAuth>;
}
