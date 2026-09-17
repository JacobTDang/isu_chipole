"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Order, Selection } from "../data/types";
import { newOrderId } from "../lib/ids";
import { readOrders, readSaved, writeOrders, writeSaved } from "../lib/storage";

type OrdersValue = {
  orders: Order[]; saved: Selection[]; ready: boolean;
  place(order: Omit<Order, "id" | "placedAt">): Order; save(selection: Selection): void;
};
const OrdersContext = createContext<OrdersValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [saved, setSaved] = useState<Selection[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) { setOrders(readOrders()); setSaved(readSaved()); setReady(true); } });
    return () => { active = false; };
  }, []);

  const value = useMemo<OrdersValue>(() => ({
    orders, saved, ready,
    place(input) {
      if (input.fulfillment === "delivery" && !input.address?.trim()) throw new Error("Delivery orders need an address");
      if (input.fulfillment === "pickup" && (input.address !== null || input.deliveryFee !== 0)) throw new Error("Pickup orders have no address or delivery fee");
      const order: Order = { ...input, id: newOrderId(), placedAt: new Date().toISOString() };
      const next = [...orders, order];
      writeOrders(next);
      setOrders(next);
      return order;
    },
    save(selection) {
      const next = [...saved, selection];
      writeSaved(next);
      setSaved(next);
    },
  }), [orders, ready, saved]);
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersValue {
  const value = useContext(OrdersContext);
  if (!value) throw new Error("useOrders must be used inside OrdersProvider");
  return value;
}
