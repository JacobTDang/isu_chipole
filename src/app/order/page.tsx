"use client";

import { useState } from "react";
import { LargeTitle } from "../../components/LargeTitle";
import { FilterChips, type OrderFilter } from "../../components/order/FilterChips";
import { PresetList } from "../../components/order/PresetList";
import { RequireAuth } from "../../components/RequireAuth";
import { SegmentedControl } from "../../components/SegmentedControl";
import { PRESETS } from "../../data/menu";
import type { MealTypeId } from "../../data/types";
import type { Preferences } from "../../lib/prefs";
import { itemPrice, macros } from "../../lib/pricing";
import { usePreferences } from "../../state/PreferencesProvider";

const segments = [
  { id: "all", label: "All" },
  { id: "bowl", label: "Bowls" },
  { id: "wrap", label: "Wraps" },
  { id: "pasta", label: "Pasta" },
  { id: "salad", label: "Salads" },
  { id: "breakfast", label: "Breakfast" },
];

function initialFilters(preferences: Preferences): OrderFilter[] {
  const selected: OrderFilter[] = [];
  if (preferences.highProtein) selected.push("high-protein");
  if (preferences.vegetarian) selected.push("vegetarian");
  return selected;
}

function OrderContent({ preferences }: { preferences: Preferences }) {
  const [segment, setSegment] = useState("all");
  const [filters, setFilters] = useState<OrderFilter[]>(() => initialFilters(preferences));
  const { allergies, goal, budget } = preferences;
  const buildType: MealTypeId = segment === "all" ? "bowl" : segment as MealTypeId;
  const meals = PRESETS.filter((meal) => {
    if (segment !== "all" && meal.mealType !== segment) return false;
    const selection = { mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id };
    if (filters.includes("high-protein") && macros(selection).protein < 30) return false;
    if (filters.includes("vegetarian") && !meal.tags.includes("veg")) return false;
    if (filters.includes("under-10") && itemPrice(selection) >= 10) return false;
    if (filters.includes("in-budget") && budget !== null && itemPrice(selection) > budget) return false;
    return true;
  });

  return (
    <div className="pb-8">
      <LargeTitle>Order</LargeTitle>
      <div className="space-y-4 px-4">
        <SegmentedControl options={segments} value={segment} onChange={setSegment} />
        <FilterChips selected={filters} onChange={setFilters} hasBudget={budget !== null} />
        <PresetList meals={meals} buildType={buildType} allergies={allergies} goal={goal} />
        {meals.length === 0 && <div className="rounded-2xl border border-line bg-card p-5 text-center"><p className="text-[15px] text-ink-soft">No preset meals match these filters. Build your own instead.</p></div>}
      </div>
    </div>
  );
}

function OrderGate() {
  const { preferences, ready } = usePreferences();
  if (!ready) return null;
  return <OrderContent preferences={preferences} />;
}

export default function OrderPage() {
  return <RequireAuth><OrderGate /></RequireAuth>;
}
