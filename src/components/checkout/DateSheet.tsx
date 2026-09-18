"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { availableSlots, formatDate, formatMonth, monthGrid, shiftMonth, todayISO } from "../../lib/schedule";
import { Sheet } from "../Sheet";

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DateSheet({
  open,
  title,
  value,
  now,
  onChange,
  onClose,
}: {
  open: boolean;
  title: string;
  value: string;
  now: Date;
  onChange(date: string): void;
  onClose(): void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <Calendar
        value={value}
        now={now}
        onSelect={(date) => {
          onChange(date);
          onClose();
        }}
      />
    </Sheet>
  );
}

function Calendar({ value, now, onSelect }: { value: string; now: Date; onSelect(date: string): void }) {
  const today = todayISO(now);
  const [month, setMonth] = useState(value.slice(0, 7));
  const atCurrentMonth = month <= today.slice(0, 7);
  const navStyles = "flex size-11 items-center justify-center rounded-full text-cardinal disabled:text-ink-soft/40";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={atCurrentMonth}
          onClick={() => setMonth(shiftMonth(month, -1))}
          className={navStyles}
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <h3 className="text-[17px] font-semibold text-ink">{formatMonth(month)}</h3>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setMonth(shiftMonth(month, 1))}
          className={navStyles}
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      </div>
      <div role="row" className="grid grid-cols-7">
        {WEEKDAY_HEADERS.map((weekday) => (
          <span key={weekday} role="columnheader" className="py-2 text-center text-[13px] font-semibold text-ink-soft">
            {weekday}
          </span>
        ))}
      </div>
      <div role="radiogroup" aria-label={formatMonth(month)} className="grid grid-cols-7 gap-y-1">
        {monthGrid(month).map((iso, index) => {
          if (iso === null) return <span key={index} aria-hidden="true" className="min-h-11" />;
          const selected = iso === value;
          const isToday = iso === today;
          const disabled = availableSlots(iso, now).length === 0;
          return (
            <button
              key={iso}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-current={isToday ? "date" : undefined}
              aria-label={formatDate(iso)}
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={`mx-auto flex size-11 items-center justify-center rounded-full border-2 text-[15px] font-semibold tabular-nums transition-colors disabled:cursor-not-allowed ${
                selected
                  ? "border-cardinal bg-gold text-ink"
                  : isToday
                    ? "border-cardinal bg-transparent text-cardinal"
                    : "border-transparent text-ink disabled:text-ink-soft/40"
              }`}
            >
              {Number(iso.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
