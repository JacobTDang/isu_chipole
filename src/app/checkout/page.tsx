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
import { LOCATIONS, TIME_SLOTS } from "../../data/locations";
import type { Fulfillment, PickupLocation } from "../../data/types";
import {
  DELIVERY_FEE,
  mealCount,
  orderTotals,
  planDiscountRate,
  promoRate,
} from "../../lib/pricing";
import { defaultSchedule, formatDate } from "../../lib/schedule";
import { useBag } from "../../state/BagProvider";
import { useOrders } from "../../state/OrdersProvider";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type Payment = "Visa ending 4242" | "Apple Pay";

const fulfillmentOptions: Array<{ id: Fulfillment; label: string }> = [
  { id: "pickup", label: "Pickup" },
  { id: "delivery", label: "Delivery" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, plan, promo, ready, setPromo, clear } = useBag();
  const { place } = useOrders();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<PickupLocation>(LOCATIONS[0]);
  const [schedule, setSchedule] = useState(() => defaultSchedule(new Date()));
  const { date, time } = schedule;
  const setTime = (next: string) => setSchedule({ date, time: next });
  const [payment, setPayment] = useState<Payment>("Visa ending 4242");
  const [locationOpen, setLocationOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const placingOrder = useRef(false);
  const delivery = fulfillment === "delivery";
  const deliveryFee = delivery ? DELIVERY_FEE : 0;
  const cleanAddress = address.trim();
  const canPlace = !isPlacing && (!delivery || cleanAddress.length > 0);
  const totals = orderTotals(items, plan, promo, deliveryFee);
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
    if (placingOrder.current || !canPlace) return;
    placingOrder.current = true;
    setIsPlacing(true);
    const { subtotal, discount, tax, total } = totals;
    const order = place({
      items,
      plan,
      ...(promo ? { promo } : {}),
      fulfillment,
      address: delivery ? cleanAddress : null,
      deliveryFee,
      location,
      date,
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
    ...(delivery ? [{ label: "Delivery", amount: currency.format(totals.delivery) }] : []),
  ];

  return (
    <RequireAuth>
      <div className="min-h-full pb-3">
        <InlineNav title="Checkout" backHref="/bag" />

        <fieldset className="mx-4 mt-5">
          <legend className="sr-only">Fulfillment</legend>
          <SegmentedControl
            options={fulfillmentOptions}
            value={fulfillment}
            onChange={(value) => setFulfillment(value as Fulfillment)}
          />
        </fieldset>

        <GroupedList>
          {delivery ? (
            <div className="px-4 py-3">
              <label htmlFor="delivery-address" className="mb-2 block text-[15px] text-ink-soft">
                Deliver to
              </label>
              <input
                id="delivery-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Friley Hall, room 2310"
                autoComplete="street-address"
                className="min-h-11 w-full rounded-xl border border-line bg-cream px-3 text-[16px] text-ink placeholder:text-ink-soft"
              />
            </div>
          ) : (
            <GroupedRow
              label="Pickup spot"
              value={location.name}
              chevron
              onClick={() => setLocationOpen(true)}
            />
          )}
          <GroupedRow label={delivery ? "Delivery date" : "Pickup date"} value={formatDate(date)} />
          <GroupedRow
            label={delivery ? "Delivery time" : "Pickup time"}
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
            <Button type="button" full disabled={!canPlace} onClick={placeOrder}>
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
        title={delivery ? "Delivery time" : "Pickup time"}
        slots={TIME_SLOTS}
        value={time}
        onChange={setTime}
        onClose={() => setTimeOpen(false)}
      />
    </RequireAuth>
  );
}
