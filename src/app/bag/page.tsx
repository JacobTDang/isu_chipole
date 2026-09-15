"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddOnsRow } from "../../components/bag/AddOnsRow";
import { BagRow } from "../../components/bag/BagRow";
import { PlanCard } from "../../components/bag/PlanCard";
import { Button } from "../../components/Button";
import { LargeTitle } from "../../components/LargeTitle";
import { RequireAuth } from "../../components/RequireAuth";
import { Ticket, type TicketLine } from "../../components/Ticket";
import { orderTotals } from "../../lib/pricing";
import { useBag } from "../../state/BagProvider";

function BagContent() {
  const { items, plan, ready } = useBag();
  const router = useRouter();
  if (!ready) return null;
  if (items.length === 0) {
    return (
      <div>
        <LargeTitle>Bag</LargeTitle>
        <div className="mx-4 mt-10 rounded-3xl border border-line bg-card px-6 py-9 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold"><ShoppingBag size={28} strokeWidth={1.5} className="text-cardinal" /></div>
          <h2 className="mt-5 font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">Your bag is empty</h2>
          <p className="mx-auto mt-2 max-w-64 text-[15px] leading-6 text-ink-soft">Build a bowl or grab a preset.</p>
          <Button full className="mt-6" onClick={() => router.push("/order")}>Start an order</Button>
        </div>
      </div>
    );
  }

  const totals = orderTotals(items, plan);
  const lines: TicketLine[] = [{ label: "Subtotal", amount: `$${totals.subtotal.toFixed(2)}` }];
  if (totals.discount > 0) lines.push({ label: "Plan discount", amount: `−$${totals.discount.toFixed(2)}` });
  lines.push({ label: "Tax · 7%", amount: `$${totals.tax.toFixed(2)}`, muted: true });

  return (
    <div className="pb-4">
      <LargeTitle>Bag</LargeTitle>
      <section className="mx-4 overflow-hidden rounded-2xl border border-line shadow-sm">{items.map((item) => <BagRow key={item.id} item={item} />)}</section>
      <PlanCard />
      <AddOnsRow />
      <div className="sticky bottom-0 z-20 border-t border-line shadow-[0_-10px_30px_var(--color-cream)]">
        <Ticket title="Order total" lines={lines} total={{ label: "Total", amount: `$${totals.total.toFixed(2)}` }}>
          <Button full onClick={() => router.push("/checkout")}>Check out</Button>
        </Ticket>
      </div>
    </div>
  );
}

export default function BagPage() {
  return <RequireAuth><BagContent /></RequireAuth>;
}
