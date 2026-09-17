"use client";

import Link from "next/link";
import type { BagItem } from "../../data/types";
import { ingredient, mealType, preset } from "../../data/menu";
import { selectionImage } from "../../lib/images";
import { itemPrice } from "../../lib/pricing";
import { useBag } from "../../state/BagProvider";
import { MealImage } from "../MealImage";
import { QuantityStepper } from "../builder/QuantityStepper";

export function BagRow({ item }: { item: BagItem }) {
  const { duplicate, setQuantity } = useBag();
  const type = mealType(item.mealType);
  const presetMeal = item.presetId ? preset(item.presetId) : undefined;
  const title = item.name || presetMeal?.name || `Custom ${type.name}`;
  const image = selectionImage(item);
  const summary = item.ingredientIds.map((id) => ingredient(id).name).join(", ");
  const unitPrice = itemPrice({ ...item, quantity: 1 });

  return (
    <article className="border-b border-line bg-card px-4 py-5 last:border-b-0">
      <div className="flex gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cream"><MealImage src={image} alt={title} fallbackLetter={title} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2"><h2 className="font-display text-[19px] leading-tight font-extrabold tracking-[-0.02em] text-ink">{title}</h2><span className="shrink-0 text-[15px] font-semibold tabular-nums text-cardinal">${unitPrice.toFixed(2)}</span></div>
          <p className="mt-1 truncate text-[13px] text-ink-soft">{summary}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <QuantityStepper value={item.quantity} onChange={(quantity) => setQuantity(item.id, quantity)} label={`Quantity for ${title}`} />
        <div className="flex items-center">
          <Link href={`/menu/${item.mealType}?edit=${item.id}`} className="flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold text-cardinal">Edit</Link>
          <button type="button" onClick={() => duplicate(item.id)} className="min-h-11 rounded-lg px-3 text-[15px] font-semibold text-cardinal">Duplicate</button>
        </div>
      </div>
    </article>
  );
}
