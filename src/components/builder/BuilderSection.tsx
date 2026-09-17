"use client";

import type { Allergen, Ingredient } from "../../data/types";
import { containsCaption, matchingAllergens } from "../../lib/allergens";
import { Pill } from "../Pill";

export function BuilderSection({ title, rule, options, selected, mode, allergies, onChange }: {
  title: string;
  rule: string;
  options: Ingredient[];
  selected: string[];
  mode: "one" | "many";
  allergies: Allergen[];
  onChange(ids: string[]): void;
}) {
  const toggle = (id: string) => {
    if (mode === "one") {
      onChange(selected.includes(id) ? [] : [id]);
      return;
    }
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  };

  return (
    <section className="border-t border-line px-4 py-6 first:border-t-0">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
        <p className="shrink-0 text-[13px] text-ink-soft">{rule}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const conflicts = matchingAllergens(option, allergies);
          return (
            <Pill
              key={option.id}
              selected={selected.includes(option.id)}
              onToggle={() => toggle(option.id)}
              label={option.name}
              price={option.price}
              veg={option.tags.includes("veg")}
              disabled={conflicts.length > 0}
              caption={conflicts.length > 0 ? containsCaption(conflicts) : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
