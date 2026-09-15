"use client";

export type SegmentOption = { id: string; label: string };

export function SegmentedControl({ options, value, onChange }: {
  options: SegmentOption[]; value: string; onChange(id: string): void;
}) {
  return (
    <div role="radiogroup" className="flex min-h-11 overflow-x-auto rounded-xl border border-line bg-tabletop p-1">
      {options.map((option) => (
        <button key={option.id} type="button" role="radio" aria-checked={value === option.id} onClick={() => onChange(option.id)} className={`min-h-11 min-w-fit flex-1 rounded-lg px-3 text-[13px] font-semibold transition-colors ${value === option.id ? "bg-card text-cardinal shadow-sm" : "text-ink-soft"}`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
