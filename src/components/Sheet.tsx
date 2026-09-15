"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose(): void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onClose, open]);
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close sheet" className="absolute inset-0 min-h-11 w-full bg-ink/35" onClick={onClose} />
      <section className="relative z-10 max-h-[80%] w-full overflow-y-auto rounded-t-2xl bg-card px-4 pt-2 pb-[max(16px,env(safe-area-inset-bottom))] shadow-2xl">
        <div aria-hidden="true" className="mx-auto mb-3 h-1 w-9 rounded-full bg-line" />
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em]">{title}</h2>
          <Button variant="secondary" onClick={onClose}>Done</Button>
        </div>
        {children}
      </section>
    </div>
  );
}
