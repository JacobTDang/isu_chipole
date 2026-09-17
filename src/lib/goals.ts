import type { Goal } from "./prefs";

export type Macros = { calories: number; protein: number };
export type GoalStatus = { onTarget: boolean; message: string };
export type BudgetStatus = { over: boolean; remaining: number };

type Target = { calories: number; band: "about" | "atMost"; protein: number };

const TARGETS: Record<Goal, Target> = {
  muscle: { calories: 700, band: "about", protein: 45 },
  lose: { calories: 500, band: "atMost", protein: 35 },
  maintain: { calories: 600, band: "about", protein: 30 },
};

const BAND_RATE = 0.15;
const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function goalTarget(goal: Goal): string {
  const target = TARGETS[goal];
  const prefix = target.band === "about" ? "About" : "At most";
  return `${prefix} ${target.calories} cal and ${target.protein}g+ protein per meal`;
}

export function goalStatus(goal: Goal, macros: Macros): GoalStatus {
  const target = TARGETS[goal];
  const proteinShort = target.protein - macros.protein;
  if (proteinShort > 0) return { onTarget: false, message: `${proteinShort}g protein short` };
  const difference = macros.calories - target.calories;
  if (target.band === "atMost") {
    if (difference > 0) return { onTarget: false, message: `${difference} cal over` };
    return { onTarget: true, message: "On target" };
  }
  const tolerance = Math.round(target.calories * BAND_RATE);
  if (difference > tolerance) return { onTarget: false, message: `${difference} cal over` };
  if (difference < -tolerance) return { onTarget: false, message: `${-difference} cal under` };
  return { onTarget: true, message: "On target" };
}

export function budgetStatus(budget: number, itemPrice: number): BudgetStatus {
  const remaining = money(budget - itemPrice);
  return { over: remaining < 0, remaining };
}
