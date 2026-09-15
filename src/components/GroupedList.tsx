"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function GroupedList({ header, children }: { header?: string; children: ReactNode }) {
  return (
    <section className="mx-4 my-5">
      {header && <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-ink-soft">{header}</h2>}
      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">{children}</div>
    </section>
  );
}

export function GroupedRow({ label, value, chevron = false, onClick, danger = false }: {
  label: ReactNode; value?: ReactNode; chevron?: boolean; onClick?: () => void; danger?: boolean;
}) {
  const content = <><span className={danger ? "text-cardinal" : "text-ink"}>{label}</span><span className="ml-auto flex items-center gap-1 text-[15px] text-ink-soft">{value}{chevron && <ChevronRight size={20} strokeWidth={1.5} />}</span></>;
  const styles = "flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left text-[17px]";
  return onClick ? <button type="button" onClick={onClick} className={styles}>{content}</button> : <div className={styles}>{content}</div>;
}
