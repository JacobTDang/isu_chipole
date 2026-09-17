"use client";

import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PlanSize } from "../../data/types";
import { mealCount } from "../../lib/pricing";
import { useBag } from "../../state/BagProvider";
import { Sheet } from "../Sheet";

const options: Array<{ size: PlanSize; discount: string }> = [
  { size: 5, discount: "Save 15%" },
  { size: 7, discount: "Save 20%" },
  { size: 10, discount: "Save 25%" },
];

export function PlanCard() {
  const { items, plan, setPlan } = useBag();
  const [open, setOpen] = useState(false);
  const count = mealCount(items);
  const remaining = Math.max(plan - count, 0);
  const selected = options.find((option) => option.size === plan);
  if (!selected) throw new Error(`Unknown plan size: ${plan}`);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="mx-4 my-5 flex min-h-11 w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-line bg-card p-4 text-left shadow-sm">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold font-display text-[18px] font-extrabold text-ink">{plan}</div>
        <div className="min-w-0 flex-1"><p className="text-[17px] font-semibold text-ink">Meals this week</p><p className="text-[13px] text-ink-soft">{count} of {plan} meals · {selected.discount}</p>{remaining > 0 && <p className="mt-1 text-[13px] font-semibold text-cardinal">Add {remaining} more to fill your plan</p>}</div>
        <ChevronRight size={20} strokeWidth={1.5} className="text-ink-soft" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Meals this week">
        <div className="divide-y divide-line overflow-hidden rounded-xl border border-line">
          {options.map((option) => <button key={option.size} type="button" onClick={() => { setPlan(option.size); setOpen(false); }} className="flex min-h-14 w-full items-center gap-3 bg-card px-4 text-left"><span className="flex-1"><span className="block text-[17px] font-semibold text-ink">{option.size} meals</span><span className="block text-[13px] text-ink-soft">{option.discount}</span></span>{plan === option.size && <Check size={20} strokeWidth={1.5} className="text-cardinal" />}</button>)}
        </div>
      </Sheet>
    </>
  );
}
