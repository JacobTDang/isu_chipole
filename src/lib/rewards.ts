import type { Order } from "../data/types";

type Tier = {
  name: "Cyclone" | "Cardinal" | "Gold";
  nextName: string | null;
  nextAt: number | null;
};

export function points(orders: Order[]): number {
  return Math.floor(orders.reduce((sum, order) => sum + order.total, 0));
}

export function tier(pts: number): Tier {
  if (pts >= 1500) return { name: "Gold", nextName: null, nextAt: null };
  if (pts >= 500) return { name: "Cardinal", nextName: "Gold", nextAt: 1500 };
  return { name: "Cyclone", nextName: "Cardinal", nextAt: 500 };
}
