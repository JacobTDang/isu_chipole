import { describe, expect, it } from "vitest";
import { TIME_SLOTS } from "./locations";

describe("pickup schedule", () => {
  it("offers 27 half-hour slots from 7:00 AM through 8:00 PM", () => {
    expect(TIME_SLOTS).toHaveLength(27);
    expect(TIME_SLOTS[0]).toBe("7:00 AM");
    expect(TIME_SLOTS[TIME_SLOTS.length - 1]).toBe("8:00 PM");
    expect(TIME_SLOTS).toContain("12:30 PM");
    expect(TIME_SLOTS).toContain("4:30 PM");
  });
});
