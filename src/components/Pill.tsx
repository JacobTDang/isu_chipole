"use client";

export function Pill({ selected, onToggle, label, price, veg = false }: {
  selected: boolean; onToggle(): void; label: string; price?: number; veg?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`min-h-11 rounded-full border px-4 py-2 text-[15px] font-semibold transition duration-120 active:scale-96 ${selected ? "border-cardinal bg-gold text-ink" : "border-line bg-card text-ink"}`}
    >
      <span className="inline-flex items-center gap-2">
        {veg && <span aria-label="Vegetarian" className="size-2 rounded-full bg-veg" />}
        <span>{label}</span>
        {price !== undefined && price > 0 && <span className={selected ? "text-cardinal-deep" : "text-cardinal"}>+${price.toFixed(2)}</span>}
      </span>
    </button>
  );
}
