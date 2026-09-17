import { describe, expect, it } from "vitest";
import { budgetStatus, goalStatus, goalTarget } from "./goals";

describe("goalStatus", () => {
  it("is on target for muscle with the Cyclone Bowl macros", () => {
    expect(goalStatus("muscle", { calories: 805, protein: 59 })).toEqual({ onTarget: true, message: "On target" });
  });

  it("reports calories over for lose with the Cyclone Bowl macros", () => {
    expect(goalStatus("lose", { calories: 805, protein: 59 })).toEqual({ onTarget: false, message: "305 cal over" });
  });

  it("reports the protein miss before the calorie miss", () => {
    expect(goalStatus("muscle", { calories: 600, protein: 30 })).toEqual({ onTarget: false, message: "15g protein short" });
  });

  it("is on target for maintain at the top of the calorie band", () => {
    expect(goalStatus("maintain", { calories: 690, protein: 30 })).toEqual({ onTarget: true, message: "On target" });
  });

  it("reports calories under the target", () => {
    expect(goalStatus("maintain", { calories: 400, protein: 40 })).toEqual({ onTarget: false, message: "200 cal under" });
  });

  it("describes each goal target", () => {
    expect(goalTarget("muscle")).toBe("About 700 cal and 45g+ protein per meal");
    expect(goalTarget("lose")).toBe("At most 500 cal and 35g+ protein per meal");
    expect(goalTarget("maintain")).toBe("About 600 cal and 30g+ protein per meal");
  });
});

describe("budgetStatus", () => {
  it("reports what is left under budget", () => {
    expect(budgetStatus(10, 7.75)).toEqual({ over: false, remaining: 2.25 });
  });

  it("reports a negative remainder when over budget", () => {
    expect(budgetStatus(10, 11.5)).toEqual({ over: true, remaining: -1.5 });
  });
});
