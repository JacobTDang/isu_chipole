"use client";

import { Pill } from "../Pill";

export type OrderFilter = "high-protein" | "vegetarian" | "under-10" | "in-budget";

const filters: Array<{ id: OrderFilter; label: string }> = [
  { id: "high-protein", label: "High protein" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "under-10", label: "Under $10" },
  { id: "in-budget", label: "In budget" },
];

export function FilterChips({ selected, onChange, hasBudget }: { selected: OrderFilter[]; onChange(filters: OrderFilter[]): void; hasBudget: boolean }) {
  const toggle = (id: OrderFilter) => onChange(selected.includes(id) ? selected.filter((filter) => filter !== id) : [...selected, id]);
  const shown = filters.filter((filter) => filter.id !== "in-budget" || hasBudget);
  return <div className="flex flex-wrap gap-2">{shown.map((filter) => <Pill key={filter.id} label={filter.label} selected={selected.includes(filter.id)} onToggle={() => toggle(filter.id)} />)}</div>;
}
