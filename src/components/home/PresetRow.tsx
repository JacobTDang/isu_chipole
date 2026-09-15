import Link from "next/link";
import { PRESETS } from "../../data/menu";
import { itemPrice, macros } from "../../lib/pricing";
import { MealImage } from "../MealImage";

export function PresetRow() {
  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
      {PRESETS.map((meal) => {
        const selection = { mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id };
        const nutrition = macros(selection);
        return <Link key={meal.id} href={`/meal/${meal.id}`} className="min-w-[250px] snap-start overflow-hidden rounded-2xl border border-line bg-card shadow-sm"><div className="relative h-32"><MealImage src={meal.image} alt={meal.name} fallbackLetter={meal.name} /></div><div className="p-4"><div className="flex items-start justify-between gap-2"><h3 className="font-display text-[19px] leading-tight font-extrabold tracking-[-0.02em] text-ink">{meal.name}</h3><span className="shrink-0 text-[15px] font-semibold tabular-nums text-cardinal">${itemPrice(selection).toFixed(2)}</span></div><p className="mt-2 text-[13px] text-ink-soft">{nutrition.calories} cal · {nutrition.protein}g protein</p></div></Link>;
      })}
    </div>
  );
}
