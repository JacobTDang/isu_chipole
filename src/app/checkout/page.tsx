"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { GroupedList, GroupedRow } from "../../components/GroupedList";
import { InlineNav } from "../../components/InlineNav";
import { RequireAuth } from "../../components/RequireAuth";
import { SegmentedControl } from "../../components/SegmentedControl";
import { Ticket } from "../../components/Ticket";
import { LocationSheet } from "../../components/checkout/LocationSheet";
import { PromoField } from "../../components/checkout/PromoField";
import { TimeSheet } from "../../components/checkout/TimeSheet";
import { LOCATIONS, PICKUP_DAYS, TIME_SLOTS } from "../../data/locations";
import type { PickupLocation } from "../../data/types";
import {
  mealCount,
  orderTotals,
  planDiscountRate,
  promoRate,
} from "../../lib/pricing";
import { useBag } from "../../state/BagProvider";
import { useOrders } from "../../state/OrdersProvider";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type Payment = "Visa ending 4242" | "Apple Pay";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, plan, promo, ready, setPromo, clear } = useBag();
  const { place } = useOrders();
  const [location, setLocation] = useState<PickupLocation>(LOCATIONS[0]);
  const [day, setDay] = useState<(typeof PICKUP_DAYS)[number]>("Sunday");
  const [time, setTime] = useState("4:30 PM");
  const [payment, setPayment] = useState<Payment>("Visa ending 4242");
  const [locationOpen, setLocationOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const placingOrder = useRef(false);
  const totals = orderTotals(items, plan, promo);
  const planRate = planDiscountRate(plan, mealCount(items));
  const currentPromoRate = promoRate(promo);
  const planDiscount = planRate > 0
    ? Math.round(totals.subtotal * planRate * 100) / 100
    : 0;
  const promoDiscount = currentPromoRate > 0
    ? Math.round((totals.discount - planDiscount) * 100) / 100
    : 0;

  useEffect(() => {
    if (ready && items.length === 0 && !placingOrder.current) router.replace("/bag");
  }, [items.length, ready, router]);

  if (!ready || items.length === 0) {
    return <RequireAuth><InlineNav title="Checkout" backHref="/bag" /></RequireAuth>;
  }

  function placeOrder() {
    if (placingOrder.current) return;
    placingOrder.current = true;
    setIsPlacing(true);
    const { subtotal, discount, tax, total } = totals;
    const order = place({
      items,
      plan,
      ...(promo ? { promo } : {}),
      fulfillment: "pickup",
      address: null,
      deliveryFee: 0,
      location,
      day,
      time,
      subtotal,
      discount,
      tax,
      total,
    });
    clear();
    router.replace(`/confirmation?id=${order.id}`);
  }

  const lines = [
    { label: "Subtotal", amount: currency.format(totals.subtotal) },
    ...(planDiscount > 0
      ? [{ label: `Plan discount (${Math.round(planRate * 100)}%)`, amount: `−${currency.format(planDiscount)}` }]
      : []),
    ...(promoDiscount > 0
      ? [{ label: "Promo (10%)", amount: `−${currency.format(promoDiscount)}` }]
      : []),
    { label: "Tax", amount: currency.format(totals.tax), muted: true },
  ];

  return (
    <RequireAuth>
      <div className="min-h-full pb-3">
        <InlineNav title="Checkout" backHref="/bag" />

        <GroupedList>
          <GroupedRow
            label="Pickup spot"
            value={location.name}
            chevron
            onClick={() => setLocationOpen(true)}
          />
          <fieldset className="px-4 py-3">
            <legend className="mb-2 text-[15px] text-ink-soft">Pickup day</legend>
            <SegmentedControl
              options={PICKUP_DAYS.map((pickupDay) => ({
                id: pickupDay,
                label: pickupDay,
              }))}
              value={day}
              onChange={(value) => setDay(value as (typeof PICKUP_DAYS)[number])}
            />
          </fieldset>
          <GroupedRow
            label="Pickup time"
            value={time}
            chevron
            onClick={() => setTimeOpen(true)}
          />
          <GroupedRow
            label="Payment"
            value={payment}
            chevron
            onClick={() => setPayment("Visa ending 4242")}
          />
        </GroupedList>

        <div className="mx-4 -mt-2 mb-5">
          <Button
            type="button"
            variant="dark"
            full
            onClick={() => setPayment("Apple Pay")}
            aria-pressed={payment === "Apple Pay"}
          >
            Pay with Apple Pay
          </Button>
        </div>

        <GroupedList>
          <PromoField value={promo} onApply={setPromo} />
        </GroupedList>

        <div className="sticky bottom-0 z-20 mt-6" aria-live="polite">
          <Ticket
            title="Order total"
            lines={lines}
            total={{ label: "Total", amount: currency.format(totals.total) }}
          >
            <Button type="button" full disabled={isPlacing} onClick={placeOrder}>
              {isPlacing ? "Placing order…" : "Place order"}
            </Button>
          </Ticket>
        </div>
      </div>

      <LocationSheet
        open={locationOpen}
        locations={LOCATIONS}
        value={location}
        onChange={setLocation}
        onClose={() => setLocationOpen(false)}
      />
      <TimeSheet
        open={timeOpen}
        slots={TIME_SLOTS}
        value={time}
        onChange={setTime}
        onClose={() => setTimeOpen(false)}
      />
    </RequireAuth>
  );
}
