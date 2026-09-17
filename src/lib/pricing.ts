import { ingredient, mealType } from "../data/menu";
import type { BagItem, PlanSize, Selection } from "../data/types";

export type Totals = { subtotal: number; discount: number; tax: number; delivery: number; total: number };
export const TAX_RATE = 0.07;
export const DELIVERY_FEE = 2.99;

const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function itemPrice(sel: Selection): number {
  const selected = sel.ingredientIds.map(ingredient);
  const extrasOnly = selected.length > 0 && selected.every((item) => item.group === "extras");
  const base = extrasOnly ? 0 : mealType(sel.mealType).basePrice;
  return money((base + selected.reduce((sum, item) => sum + item.price, 0)) * sel.quantity);
}

export function bagSubtotal(items: BagItem[]): number {
  return money(items.reduce((sum, item) => sum + itemPrice(item), 0));
}

export function mealCount(items: BagItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function planDiscountRate(plan: PlanSize, count: number): number {
  if (count < plan) return 0;
  if (plan === 5) return 0.15;
  if (plan === 7) return 0.2;
  if (plan === 10) return 0.25;
  return 0;
}

export function promoRate(code: string | undefined): number {
  return code?.trim().toUpperCase() === "CYCLONE10" ? 0.1 : 0;
}

export function orderTotals(items: BagItem[], plan: PlanSize, promo?: string, deliveryFee = 0): Totals {
  const subtotalRaw = items.reduce((sum, item) => sum + itemPrice(item), 0);
  const discountRaw = subtotalRaw * (planDiscountRate(plan, mealCount(items)) + promoRate(promo));
  const taxRaw = (subtotalRaw - discountRaw) * TAX_RATE;
  return {
    subtotal: money(subtotalRaw),
    discount: money(discountRaw),
    tax: money(taxRaw),
    delivery: money(deliveryFee),
    total: money(subtotalRaw - discountRaw + taxRaw + deliveryFee),
  };
}

export function macros(sel: Selection): { calories: number; protein: number } {
  const result = sel.ingredientIds.map(ingredient).reduce(
    (sum, item) => ({ calories: sum.calories + item.calories, protein: sum.protein + item.protein }),
    { calories: 0, protein: 0 },
  );
  return { calories: result.calories * sel.quantity, protein: result.protein * sel.quantity };
}
