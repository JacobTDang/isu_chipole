"use client";

export function Pill({ selected, onToggle, label, price, veg = false, disabled = false, caption }: {
  selected: boolean; onToggle(): void; label: string; price?: number; veg?: boolean; disabled?: boolean; caption?: string;
}) {
  const tone = disabled
    ? "border-line bg-tabletop text-ink-soft opacity-60"
    : selected ? "border-cardinal bg-gold text-ink" : "border-line bg-card text-ink";
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={`min-h-11 rounded-full border px-4 py-2 text-left text-[15px] font-semibold transition duration-120 active:scale-96 disabled:cursor-not-allowed disabled:active:scale-100 ${tone}`}
    >
      <span className="inline-flex items-center gap-2">
        {veg && <span aria-label="Vegetarian" className="size-2 rounded-full bg-veg" />}
        <span>{label}</span>
        {price !== undefined && price > 0 && <span className={disabled ? "text-ink-soft" : selected ? "text-cardinal-deep" : "text-cardinal"}>+${price.toFixed(2)}</span>}
      </span>
      {caption && <span className="block text-[11px] leading-tight font-normal text-cardinal">{caption}</span>}
    </button>
  );
}
