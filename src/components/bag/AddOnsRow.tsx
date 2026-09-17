"use client";

import { Plus } from "lucide-react";
import type { Selection } from "../../data/types";
import { ingredient } from "../../data/menu";
import { selectionImage } from "../../lib/images";
import { useBag } from "../../state/BagProvider";
import { MealImage } from "../MealImage";
import { useToast } from "../Toast";

const addOns = ["protein-shake", "cookie"];

export function AddOnsRow() {
  const { add } = useBag();
  const { show } = useToast();
  const selectionFor = (id: string, name: string): Selection => ({ mealType: "bowl", ingredientIds: [id], quantity: 1, name });
  const addItem = (id: string, name: string) => {
    add(selectionFor(id, name));
    show("Added to bag.");
  };
  return (
    <section className="px-4 pb-6">
      <h2 className="mb-3 font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">Add-ons</h2>
      <div className="grid grid-cols-2 gap-3">
        {addOns.map((id) => {
          const item = ingredient(id);
          return <button key={id} type="button" onClick={() => addItem(id, item.name)} className="relative min-h-24 rounded-2xl border border-line bg-card p-4 text-left shadow-sm"><div className="relative mb-3 size-12 overflow-hidden rounded-xl bg-cream"><MealImage src={selectionImage(selectionFor(id, item.name))} alt={item.name} fallbackLetter={item.name} /></div><span className="block text-[15px] font-semibold text-ink">{item.name}</span><span className="mt-1 block text-[13px] tabular-nums text-ink-soft">${item.price.toFixed(2)}</span><span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-gold text-ink"><Plus size={17} strokeWidth={1.5} /></span></button>;
        })}
      </div>
    </section>
  );
}
