"use client";

import { Check } from "lucide-react";
import { Sheet } from "../Sheet";

export function TimeSheet({
  open,
  slots,
  value,
  onChange,
  onClose,
}: {
  open: boolean;
  slots: string[];
  value: string;
  onChange(time: string): void;
  onClose(): void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title="Pickup time">
      <div role="radiogroup" className="grid grid-cols-2 gap-2">
        {slots.map((time) => {
          const selected = time === value;
          return (
            <button
              key={time}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(time)}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-[15px] font-semibold transition-colors ${
                selected
                  ? "border-cardinal bg-gold text-cardinal"
                  : "border-line bg-cream text-ink"
              }`}
            >
              {selected && <Check size={17} strokeWidth={2} />}
              {time}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
