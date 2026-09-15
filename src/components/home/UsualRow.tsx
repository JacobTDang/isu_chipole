"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Order } from "../../data/types";
import { newBagItemId } from "../../lib/ids";
import { useBag } from "../../state/BagProvider";
import { Button } from "../Button";
import { useToast } from "../Toast";

export function UsualRow({ orders }: { orders: Order[] }) {
  const { replaceAll } = useBag();
  const { show } = useToast();
  const router = useRouter();
  const recent = [...orders].sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt)).slice(0, 3);
  if (recent.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
        <p className="text-[17px] font-semibold text-ink">No orders yet. Your first week starts here.</p>
        <Button className="mt-4" onClick={() => router.push("/menu/bowl")}>Build a bowl</Button>
      </div>
    );
  }
  const reorder = (order: Order) => {
    replaceAll(order.items.map((item) => ({ ...item, id: newBagItemId() })));
    show("Added to bag.");
  };
  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
      {recent.map((order) => <article key={order.id} className="min-w-[240px] snap-start rounded-2xl border border-line bg-card p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="font-ticket text-[13px] text-cardinal">{order.id}</span><span className="text-[13px] tabular-nums text-ink-soft">${order.total.toFixed(2)}</span></div><p className="mt-3 text-[17px] font-semibold text-ink">{order.items.reduce((sum, item) => sum + item.quantity, 0)} meals</p><button type="button" onClick={() => reorder(order)} className="mt-3 flex min-h-11 items-center gap-2 rounded-lg text-[15px] font-semibold text-cardinal"><RotateCcw size={18} strokeWidth={1.5} />Reorder</button></article>)}
    </div>
  );
}
