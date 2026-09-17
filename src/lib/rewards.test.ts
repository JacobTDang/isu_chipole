import { describe, expect, it } from "vitest";
import type { Order } from "../data/types";
import { points, tier } from "./rewards";

function order(total: number): Order {
  return {
    id: "PP-1234", items: [], plan: 5,
    location: { id: "memorial-union", name: "Memorial Union", note: "Main Lounge entrance" },
    day: "Sunday", time: "4:30 PM", subtotal: total, discount: 0, tax: 0, total,
    placedAt: "2026-09-15T00:00:00.000Z",
  };
}

describe("rewards", () => {
  it("starts at zero points", () => expect(points([])).toBe(0));
  it("floors total dollars spent", () => expect(points([order(72.76), order(40.1)])).toBe(112));
  it("returns the Cyclone tier", () => expect(tier(0)).toEqual({ name: "Cyclone", nextName: "Cardinal", nextAt: 500 }));
  it("returns the Cardinal tier", () => expect(tier(500)).toEqual({ name: "Cardinal", nextName: "Gold", nextAt: 1500 }));
  it("returns the Gold tier", () => expect(tier(1500)).toEqual({ name: "Gold", nextName: null, nextAt: null }));
});
