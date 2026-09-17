import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { ingredient, mealType } from "../../data/menu";
import type { Allergen, MealTypeId, PresetMeal } from "../../data/types";
import { containsCaption } from "../../lib/allergens";
import { goalStatus } from "../../lib/goals";
import type { Goal } from "../../lib/prefs";
import { itemPrice, macros } from "../../lib/pricing";
import { MealImage } from "../MealImage";

function presetAllergens(meal: PresetMeal, allergies: Allergen[]): Allergen[] {
  const items = meal.ingredientIds.map(ingredient);
  return allergies.filter((allergen) => items.some((item) => item.allergens.includes(allergen)));
}

export function PresetList({ meals, buildType, allergies, goal }: { meals: PresetMeal[]; buildType: MealTypeId; allergies: Allergen[]; goal: Goal | null }) {
  const type = mealType(buildType);
  return (
    <div className="space-y-3">
      <Link href={`/menu/${buildType}`} className="group flex min-h-24 items-center gap-4 rounded-2xl bg-gradient-to-br from-cardinal to-cardinal-deep p-4 text-card shadow-sm">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold text-ink"><Plus size={22} strokeWidth={1.5} /></span>
        <span className="min-w-0 flex-1"><span className="block font-display text-[20px] font-extrabold tracking-[-0.02em]">Build your own {type.name.toLowerCase()}</span><span className="mt-1 block text-[13px] text-card/80">Start from ${type.basePrice.toFixed(2)}</span></span>
        <ArrowRight size={20} strokeWidth={1.5} />
      </Link>
      {meals.map((meal, index) => {
        const selection = { mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id };
        const nutrition = macros(selection);
        const status = goal ? goalStatus(goal, nutrition) : undefined;
        const contained = presetAllergens(meal, allergies);
        return <Link key={meal.id} href={`/meal/${meal.id}`} className="flex min-h-28 gap-3 overflow-hidden rounded-2xl border border-line bg-card p-3 shadow-sm"><div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl"><MealImage src={meal.image} alt={meal.name} fallbackLetter={meal.name} priority={index === 0} /></div><div className="min-w-0 flex-1 py-1"><div className="flex items-start justify-between gap-2"><h2 className="font-display text-[18px] leading-tight font-extrabold tracking-[-0.02em] text-ink">{meal.name}</h2><span className="shrink-0 text-[15px] font-semibold tabular-nums text-cardinal">${itemPrice(selection).toFixed(2)}</span></div><p className="mt-1 line-clamp-2 text-[13px] leading-5 text-ink-soft">{meal.blurb}</p><p className="mt-2 text-[13px] font-semibold text-ink-soft">{nutrition.calories} cal · {nutrition.protein}g protein{status && <> · <span className={status.onTarget ? "text-veg" : "text-cardinal"}>{status.message}</span></>}</p>{contained.length > 0 && <p className="mt-1 text-[13px] text-cardinal">{containsCaption(contained)}</p>}</div></Link>;
      })}
    </div>
  );
}
