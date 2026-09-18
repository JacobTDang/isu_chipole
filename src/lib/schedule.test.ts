import { describe, expect, it } from "vitest";
import { TIME_SLOTS } from "../data/locations";
import {
  availableSlots,
  defaultSchedule,
  formatDate,
  isISODate,
  monthGrid,
  nextDateForWeekday,
  todayISO,
  weekdayName,
} from "./schedule";

const morning = new Date(2026, 8, 18, 10, 5);

describe("todayISO", () => {
  it("returns the local calendar date", () => {
    expect(todayISO(morning)).toBe("2026-09-18");
  });

  it("keeps the local date just before midnight", () => {
    expect(todayISO(new Date(2026, 8, 18, 23, 59))).toBe("2026-09-18");
  });

  it("pads single-digit months and days", () => {
    expect(todayISO(new Date(2026, 0, 5, 12))).toBe("2026-01-05");
  });
});

describe("formatDate and weekdayName", () => {
  it("formats a date as weekday, month and day", () => {
    expect(formatDate("2026-09-24")).toBe("Thu, Sep 24");
  });

  it("names the weekday in full", () => {
    expect(weekdayName("2026-09-24")).toBe("Thursday");
  });

  it("throws on a malformed date", () => {
    expect(() => formatDate("2026-9-24")).toThrow(/2026-9-24/);
    expect(() => weekdayName("2026-02-30")).toThrow(/2026-02-30/);
  });
});

describe("isISODate", () => {
  it("accepts a real calendar date", () => {
    expect(isISODate("2026-09-24")).toBe(true);
    expect(isISODate("2028-02-29")).toBe(true);
  });

  it("rejects malformed and impossible dates", () => {
    expect(isISODate("2026-9-24")).toBe(false);
    expect(isISODate("2026-02-30")).toBe(false);
    expect(isISODate("2026-13-01")).toBe(false);
    expect(isISODate("Thursday")).toBe(false);
    expect(isISODate(20260924)).toBe(false);
  });
});

describe("availableSlots", () => {
  it("hides today's slots that start less than 30 minutes from now", () => {
    const slots = availableSlots("2026-09-18", morning);
    expect(slots[0]).toBe("11:00 AM");
    expect(slots[slots.length - 1]).toBe("8:00 PM");
    expect(slots).not.toContain("10:30 AM");
  });

  it("returns nothing for today once the last slot is under 30 minutes away", () => {
    expect(availableSlots("2026-09-18", new Date(2026, 8, 18, 19, 45))).toEqual([]);
  });

  it("keeps the 8:00 PM slot at exactly 30 minutes before it", () => {
    expect(availableSlots("2026-09-18", new Date(2026, 8, 18, 19, 30))).toEqual(["8:00 PM"]);
  });

  it("starts at 7:00 AM early in the morning", () => {
    expect(availableSlots("2026-09-18", new Date(2026, 8, 18, 6, 0))[0]).toBe("7:00 AM");
  });

  it("returns all 27 slots for a date after today", () => {
    expect(availableSlots("2026-09-19", morning)).toEqual(TIME_SLOTS);
    expect(availableSlots("2026-09-19", morning)).toHaveLength(27);
  });

  it("returns no slots for a past date", () => {
    expect(availableSlots("2026-09-17", morning)).toEqual([]);
  });
});

describe("defaultSchedule", () => {
  it("returns today and its first available slot", () => {
    expect(defaultSchedule(morning)).toEqual({ date: "2026-09-18", time: "11:00 AM" });
  });

  it("returns tomorrow at 7:00 AM when today has no slots left", () => {
    expect(defaultSchedule(new Date(2026, 8, 18, 19, 45))).toEqual({ date: "2026-09-19", time: "7:00 AM" });
  });

  it("rolls into the next month when today is the last day", () => {
    expect(defaultSchedule(new Date(2026, 8, 30, 20, 0))).toEqual({ date: "2026-10-01", time: "7:00 AM" });
  });
});

describe("nextDateForWeekday", () => {
  it("returns the next date with that weekday", () => {
    expect(nextDateForWeekday("2026-09-18", "Sunday")).toBe("2026-09-20");
  });

  it("returns the same date when the weekday already matches", () => {
    expect(nextDateForWeekday("2026-09-18", "Friday")).toBe("2026-09-18");
  });

  it("returns the day before next week when the weekday just passed", () => {
    expect(nextDateForWeekday("2026-09-18", "Thursday")).toBe("2026-09-24");
  });

  it("throws on an unknown weekday", () => {
    expect(() => nextDateForWeekday("2026-09-18", "Someday")).toThrow(/Someday/);
  });
});

describe("monthGrid", () => {
  it("lays September 2026 out from Sunday with the first on a Tuesday", () => {
    const grid = monthGrid("2026-09");
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBeNull();
    expect(grid[1]).toBeNull();
    expect(grid[2]).toBe("2026-09-01");
    expect(grid[31]).toBe("2026-09-30");
    expect(grid[32]).toBeNull();
    expect(grid.filter((cell) => cell !== null)).toHaveLength(30);
  });

  it("handles a leap February", () => {
    const grid = monthGrid("2028-02");
    expect(grid.filter((cell) => cell !== null)).toHaveLength(29);
    expect(grid[2]).toBe("2028-02-01");
  });

  it("throws on a malformed month", () => {
    expect(() => monthGrid("2026-9")).toThrow(/2026-9/);
    expect(() => monthGrid("2026-13")).toThrow(/2026-13/);
  });
});
