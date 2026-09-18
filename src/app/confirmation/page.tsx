"use client";

import { Check } from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "../../components/Button";
import { RequireAuth } from "../../components/RequireAuth";
import { Ticket } from "../../components/Ticket";
import { mealType, preset } from "../../data/menu";
import type { BagItem } from "../../data/types";
import { itemPrice } from "../../lib/pricing";
import { formatDate, weekdayName } from "../../lib/schedule";
import { useOrders } from "../../state/OrdersProvider";
import styles from "./confirmation.module.css";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function itemName(item: BagItem): string {
  if (item.name) return item.name;
  if (item.presetId) return preset(item.presetId).name;
  return `Custom ${mealType(item.mealType).name}`;
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <Confirmation />
    </Suspense>
  );
}

function Confirmation() {
  const orderId = useSearchParams().get("id");
  const router = useRouter();
  const { orders, ready } = useOrders();
  const order = orders.find((candidate) => candidate.id === orderId);

  if (!ready) return <RequireAuth><div className="min-h-full" /></RequireAuth>;
  if (!order) notFound();

  const delivery = order.fulfillment === "delivery";
  if (delivery && !order.address) throw new Error(`Delivery order ${order.id} has no address`);
  const lines = [
    delivery ? { label: "Deliver to", amount: order.address } : { label: "Pickup", amount: order.location.name },
    { label: "Date", amount: formatDate(order.date) },
    { label: "Time", amount: order.time },
    ...order.items.map((item) => ({
      label: `${item.quantity}× ${itemName(item)}`,
      amount: currency.format(itemPrice(item)),
    })),
    ...(delivery ? [{ label: "Delivery", amount: currency.format(order.deliveryFee) }] : []),
  ];

  return (
    <RequireAuth>
      <div className="flex min-h-full flex-col px-4 pt-7 pb-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-cardinal text-gold shadow-lg">
            <Check size={58} strokeWidth={2.25} aria-hidden="true" />
          </div>
          <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.16em] text-cardinal">
            Order confirmed
          </p>
          <h1 className="mt-1 font-display text-[34px] leading-tight font-extrabold tracking-[-0.02em] text-ink">
            See you {weekdayName(order.date)}.
          </h1>
        </div>

        <div className={`${styles.ticketReveal} mt-8 [&_h2]:text-[30px]`}>
          <Ticket
            title={order.id}
            lines={lines}
            total={{ label: "Total", amount: currency.format(order.total) }}
          />
        </div>

        <p className="mt-5 text-center text-[17px] font-semibold text-ink">
          {delivery ? "Arrives at" : "Ready at"} {order.time}
        </p>
        {!delivery && (
          <p className="mt-1 text-center text-[15px] text-ink-soft">
            {order.location.note}
          </p>
        )}

        <div className="mt-auto pt-7">
          <Button type="button" full onClick={() => router.replace("/")}>
            Back to home
          </Button>
        </div>
      </div>
    </RequireAuth>
  );
}
