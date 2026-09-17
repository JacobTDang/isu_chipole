"use client";

import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PlanSize } from "../../data/types";
import { mealCount, planDiscountRate } from "../../lib/pricing";
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
  const effectivePlan: PlanSize = count >= 10 ? 10 : count >= 7 ? (Math.max(plan, 7) as PlanSize) : count >= 5 ? (Math.max(plan, 5) as PlanSize) : plan;
  const discountRate = planDiscountRate(effectivePlan, count);
  const discountPercent = Math.round(discountRate * 100);
  const discountText = discountPercent > 0 ? `Save ${discountPercent}% auto-applied` : (options.find((o) => o.size === effectivePlan)?.discount ?? "Save up to 25%");

  const nextTier = count < 5 ? { target: 5, discount: "15%" } : count < 7 ? { target: 7, discount: "20%" } : count < 10 ? { target: 10, discount: "25%" } : null;
  const remainingForNext = nextTier ? nextTier.target - count : 0;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="mx-4 my-5 flex min-h-11 w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-line bg-card p-4 text-left shadow-sm">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold font-display text-[18px] font-extrabold text-ink">{effectivePlan}</div>
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-semibold text-ink">Meals this week</p>
          <p className="text-[13px] text-ink-soft">{count} meal{count === 1 ? "" : "s"} · {discountText}</p>
          {nextTier ? (
            <p className="mt-1 text-[13px] font-semibold text-cardinal">
              Add {remainingForNext} more to {discountPercent > 0 ? `bump to ${nextTier.discount} off` : `save ${nextTier.discount}`}
            </p>
          ) : (
            <p className="mt-1 text-[13px] font-semibold text-cardinal">Max 25% bulk discount unlocked!</p>
          )}
        </div>
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
