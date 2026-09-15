"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({ value, onChange, min = 1, max = 10, label = "Quantity" }: {
  value: number;
  onChange(value: number): void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-line bg-card" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)} className="flex size-11 items-center justify-center text-cardinal disabled:text-ink-soft/40"><Minus size={18} strokeWidth={1.5} /></button>
      <output aria-live="polite" className="min-w-9 text-center text-[17px] font-semibold tabular-nums text-ink">{value}</output>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className="flex size-11 items-center justify-center text-cardinal disabled:text-ink-soft/40"><Plus size={18} strokeWidth={1.5} /></button>
    </div>
  );
}
