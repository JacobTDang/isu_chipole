"use client";

export type SegmentOption = { id: string; label: string };

export function SegmentedControl({ options, value, onChange }: {
  options: SegmentOption[]; value: string; onChange(id: string): void;
}) {
  const compact = options.length > 4;
  return (
    <div role="radiogroup" className="flex min-h-11 rounded-xl border border-line bg-tabletop p-1">
      {options.map((option) => (
        <button key={option.id} type="button" role="radio" aria-checked={value === option.id} onClick={() => onChange(option.id)} className={`min-h-11 flex-1 rounded-lg font-semibold transition-colors ${compact ? "min-w-0 px-1 text-[13px]" : "min-w-fit px-3 text-[13px]"} ${value === option.id ? "bg-card text-cardinal shadow-sm" : "text-ink-soft"}`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
