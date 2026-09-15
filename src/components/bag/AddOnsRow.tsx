"use client";

import { Cookie, CupSoda, Plus } from "lucide-react";
import type { Selection } from "../../data/types";
import { ingredient } from "../../data/menu";
import { useBag } from "../../state/BagProvider";
import { useToast } from "../Toast";

const addOns = [
  { id: "protein-shake", icon: CupSoda },
  { id: "cookie", icon: Cookie },
];

export function AddOnsRow() {
  const { add } = useBag();
  const { show } = useToast();
  const addItem = (id: string, name: string) => {
    const selection: Selection = { mealType: "bowl", ingredientIds: [id], quantity: 1, name };
    add(selection);
    show("Added to bag.");
  };
  return (
    <section className="px-4 pb-6">
      <h2 className="mb-3 font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">Add-ons</h2>
      <div className="grid grid-cols-2 gap-3">
        {addOns.map(({ id, icon: Icon }) => {
          const item = ingredient(id);
          return <button key={id} type="button" onClick={() => addItem(id, item.name)} className="relative min-h-24 rounded-2xl border border-line bg-card p-4 text-left shadow-sm"><Icon size={24} strokeWidth={1.5} className="mb-3 text-cardinal" /><span className="block text-[15px] font-semibold text-ink">{item.name}</span><span className="mt-1 block text-[13px] tabular-nums text-ink-soft">${item.price.toFixed(2)}</span><span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-gold text-ink"><Plus size={17} strokeWidth={1.5} /></span></button>;
        })}
      </div>
    </section>
  );
}
