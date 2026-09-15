"use client";

import { useState } from "react";
import { promoRate } from "../../lib/pricing";
import { Button } from "../Button";

export function PromoField({
  value,
  onApply,
}: {
  value?: string;
  onApply(code: string): void;
}) {
  const [code, setCode] = useState(value ?? "");
  const [error, setError] = useState<string>();
  const applied = promoRate(value) > 0;

  function apply() {
    if (promoRate(code) === 0) {
      setError("That code isn't valid.");
      return;
    }
    setError(undefined);
    onApply(code.trim().toUpperCase());
  }

  return (
    <div className="px-4 py-4">
      <label htmlFor="promo-code" className="mb-2 block text-[15px] font-semibold text-ink">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError(undefined);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") apply();
          }}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          placeholder="Enter code"
          aria-describedby={error ? "promo-error" : applied ? "promo-success" : undefined}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line bg-cream px-3 text-[16px] text-ink placeholder:text-ink-soft"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={apply}
          className="min-h-11 px-4"
        >
          Apply
        </Button>
      </div>
      {error && (
        <p id="promo-error" role="alert" className="mt-2 text-[13px] font-semibold text-cardinal">
          {error}
        </p>
      )}
      {!error && applied && (
        <p id="promo-success" className="mt-2 text-[13px] font-semibold text-veg">
          10% off applied.
        </p>
      )}
    </div>
  );
}
