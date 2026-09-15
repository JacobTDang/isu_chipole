"use client";

import { Check } from "lucide-react";
import type { PickupLocation } from "../../data/types";
import { Sheet } from "../Sheet";

export function LocationSheet({
  open,
  locations,
  value,
  onChange,
  onClose,
}: {
  open: boolean;
  locations: PickupLocation[];
  value: PickupLocation;
  onChange(location: PickupLocation): void;
  onClose(): void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title="Pickup spot">
      <div
        role="radiogroup"
        aria-label="Pickup locations"
        className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card"
      >
        {locations.map((location) => {
          const selected = location.id === value.id;
          return (
            <button
              key={location.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(location)}
              className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{location.name}</span>
                <span className="mt-0.5 block text-[15px] text-ink-soft">{location.note}</span>
              </span>
              <span
                aria-hidden="true"
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-cardinal bg-gold text-cardinal"
                    : "border-line text-transparent"
                }`}
              >
                <Check size={17} strokeWidth={2} />
              </span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
