"use client";

export function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle(): void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left"
    >
      <span className="text-[17px] text-ink">{label}</span>
      <span
        aria-hidden="true"
        className={`relative h-8 w-[52px] shrink-0 rounded-full border transition-colors ${
          enabled ? "border-cardinal bg-cardinal" : "border-line bg-tabletop"
        }`}
      >
        <span
          className={`absolute top-[3px] size-6 rounded-full bg-card shadow-sm transition-transform ${
            enabled ? "translate-x-[23px]" : "translate-x-[3px]"
          }`}
        />
      </span>
    </button>
  );
}
