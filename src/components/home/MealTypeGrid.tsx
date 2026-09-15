import Link from "next/link";
import { MEAL_TYPES } from "../../data/menu";
import { MealImage } from "../MealImage";

export function MealTypeGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {MEAL_TYPES.map((type, index) => <Link key={type.id} href={`/menu/${type.id}`} className={`group relative h-36 overflow-hidden rounded-2xl border border-line bg-card shadow-sm ${index === MEAL_TYPES.length - 1 ? "col-span-2" : ""}`}><MealImage src={type.image} alt={type.name} fallbackLetter={type.name} priority={index === 0} /><div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" /><div className="absolute right-3 bottom-3 left-3 text-card"><h3 className="font-display text-[22px] font-extrabold tracking-[-0.02em]">{type.name}</h3><p className="text-[13px] font-semibold tabular-nums text-card/85">from ${type.basePrice.toFixed(2)}</p></div></Link>)}
    </div>
  );
}
