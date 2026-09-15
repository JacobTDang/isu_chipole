"use client";

import { useState } from "react";
import { readPreferences } from "../../components/account/prefs";
import { LargeTitle } from "../../components/LargeTitle";
import { FilterChips, type OrderFilter } from "../../components/order/FilterChips";
import { PresetList } from "../../components/order/PresetList";
import { RequireAuth } from "../../components/RequireAuth";
import { SegmentedControl } from "../../components/SegmentedControl";
import { PRESETS } from "../../data/menu";
import type { MealTypeId } from "../../data/types";
import { itemPrice, macros } from "../../lib/pricing";

const segments = [
  { id: "all", label: "All" },
  { id: "bowl", label: "Bowls" },
  { id: "wrap", label: "Wraps" },
  { id: "pasta", label: "Pasta" },
  { id: "salad", label: "Salads" },
  { id: "breakfast", label: "Breakfast" },
];

function initialFilters(): OrderFilter[] {
  const preferences = readPreferences();
  const selected: OrderFilter[] = [];
  if (preferences.highProtein) selected.push("high-protein");
  if (preferences.vegetarian) selected.push("vegetarian");
  return selected;
}

function OrderContent() {
  const [segment, setSegment] = useState("all");
  const [filters, setFilters] = useState<OrderFilter[]>(initialFilters);
  const buildType: MealTypeId = segment === "all" ? "bowl" : segment as MealTypeId;
  const meals = PRESETS.filter((meal) => {
    if (segment !== "all" && meal.mealType !== segment) return false;
    const selection = { mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id };
    if (filters.includes("high-protein") && macros(selection).protein < 30) return false;
    if (filters.includes("vegetarian") && !meal.tags.includes("veg")) return false;
    if (filters.includes("under-10") && itemPrice(selection) >= 10) return false;
    return true;
  });

  return (
    <div className="pb-8">
      <LargeTitle>Order</LargeTitle>
      <div className="space-y-4 px-4">
        <SegmentedControl options={segments} value={segment} onChange={setSegment} />
        <FilterChips selected={filters} onChange={setFilters} />
        <PresetList meals={meals} buildType={buildType} />
        {meals.length === 0 && <div className="rounded-2xl border border-line bg-card p-5 text-center"><p className="text-[15px] text-ink-soft">No preset meals match these filters. Build your own instead.</p></div>}
      </div>
    </div>
  );
}

export default function OrderPage() {
  return <RequireAuth><OrderContent /></RequireAuth>;
}
