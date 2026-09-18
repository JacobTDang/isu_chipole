"use client";

import Link from "next/link";
import type { Order } from "../../data/types";
import { mealCount } from "../../lib/pricing";
import { formatDate } from "../../lib/schedule";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function OrderHistory({
  orders,
  onReorder,
}: {
  orders: Order[];
  onReorder(order: Order): void;
}) {
  if (orders.length === 0) {
    return (
      <div className="px-4 py-5">
        <p className="font-semibold text-ink">No orders yet.</p>
        <p className="mt-1 text-[15px] text-ink-soft">Your first week starts here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-line">
      {[...orders].reverse().map((order) => {
        const count = mealCount(order.items);
        return (
          <div key={order.id} className="flex items-center gap-2 px-4 py-3">
            <Link
              href={`/confirmation?id=${order.id}`}
              className="flex min-h-11 min-w-0 flex-1 items-center"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{order.id}</span>
                <span className="mt-0.5 block text-[13px] text-ink-soft">
                  {formatDate(order.date)} · {count} {count === 1 ? "item" : "items"} · {currency.format(order.total)}
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => onReorder(order)}
              className="min-h-11 shrink-0 rounded-xl border border-line bg-cream px-3 text-[15px] font-semibold text-cardinal"
            >
              Reorder
            </button>
          </div>
        );
      })}
    </div>
  );
}
