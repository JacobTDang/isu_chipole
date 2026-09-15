import type { ReactNode } from "react";

export type TicketLine = { label: ReactNode; amount: ReactNode; muted?: boolean };

function Line({ label, amount, muted }: TicketLine) {
  return (
    <div className={`flex items-end gap-2 ${muted ? "text-ink-soft" : "text-ink"}`}>
      <span className="shrink-0">{label}</span>
      <span aria-hidden="true" className="mb-1 h-[2px] min-w-3 flex-1 bg-[radial-gradient(circle,var(--color-line)_1px,transparent_1.5px)] bg-[length:5px_2px]" />
      <span className="shrink-0 tabular-nums">{amount}</span>
    </div>
  );
}

export function Ticket({ title, lines = [], total, children }: {
  title?: string; lines?: TicketLine[]; total?: { label: ReactNode; amount: ReactNode }; children?: ReactNode;
}) {
  return (
    <section className="ticket-edge bg-card px-4 pt-6 pb-4 font-ticket text-[13px] shadow-lg">
      {title && <h2 className="mb-4 font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">{title}</h2>}
      <div className="space-y-2">{lines.map((line, index) => <Line key={index} {...line} />)}</div>
      {total && <div className="mt-4 border-t-2 border-dashed border-cardinal pt-3 text-[15px] font-semibold"><Line {...total} /></div>}
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}
