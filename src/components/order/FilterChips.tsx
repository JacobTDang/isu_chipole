"use client";

import { Pill } from "../Pill";

export type OrderFilter = "high-protein" | "vegetarian" | "under-10";

const filters: Array<{ id: OrderFilter; label: string }> = [
  { id: "high-protein", label: "High protein" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "under-10", label: "Under $10" },
];

export function FilterChips({ selected, onChange }: { selected: OrderFilter[]; onChange(filters: OrderFilter[]): void }) {
  const toggle = (id: OrderFilter) => onChange(selected.includes(id) ? selected.filter((filter) => filter !== id) : [...selected, id]);
  return <div className="flex flex-wrap gap-2">{filters.map((filter) => <Pill key={filter.id} label={filter.label} selected={selected.includes(filter.id)} onToggle={() => toggle(filter.id)} />)}</div>;
}
