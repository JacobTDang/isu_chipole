"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BagItem, PlanSize, Selection } from "../data/types";
import { newBagItemId } from "../lib/ids";
import { readBagState, writeBagState } from "../lib/storage";

type BagValue = {
  items: BagItem[]; plan: PlanSize; promo?: string; ready: boolean;
  add(sel: Selection): void; update(id: string, sel: Selection): void; remove(id: string): void;
  duplicate(id: string): void; setQuantity(id: string, q: number): void;
  setPlan(p: PlanSize): void; setPromo(code?: string): void; replaceAll(items: BagItem[]): void; clear(): void;
};
const BagContext = createContext<BagValue | null>(null);

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [plan, setPlanState] = useState<PlanSize>(5);
  const [promo, setPromoState] = useState<string>();
  const [ready, setReady] = useState(false);
  useEffect(() => { const state = readBagState(); setItems(state.items); setPlanState(state.plan); setPromoState(state.promo); setReady(true); }, []);
  useEffect(() => { if (ready) writeBagState({ items, plan, ...(promo ? { promo } : {}) }); }, [items, plan, promo, ready]);

  const value = useMemo<BagValue>(() => ({
    items, plan, promo, ready,
    add: (sel) => setItems((current) => [...current, { ...sel, id: newBagItemId() }]),
    update: (id, sel) => setItems((current) => current.map((item) => item.id === id ? { ...sel, id } : item)),
    remove: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    duplicate: (id) => setItems((current) => {
      const found = current.find((item) => item.id === id);
      if (!found) throw new Error(`Unknown bag item: ${id}`);
      return [...current, { ...found, id: newBagItemId() }];
    }),
    setQuantity: (id, q) => {
      if (!Number.isInteger(q) || q < 1 || q > 10) throw new Error("Quantity must be from 1 to 10");
      setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: q } : item));
    },
    setPlan: setPlanState,
    setPromo: setPromoState,
    replaceAll: setItems,
    clear: () => { setItems([]); setPromoState(undefined); },
  }), [items, plan, promo, ready]);
  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagValue {
  const value = useContext(BagContext);
  if (!value) throw new Error("useBag must be used inside BagProvider");
  return value;
}
