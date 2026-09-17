import { describe, expect, it } from "vitest";
import { newOrderId } from "./ids";

describe("newOrderId", () => {
  it("uses the PP- prefix followed by four digits", () => {
    for (let i = 0; i < 50; i++) expect(newOrderId()).toMatch(/^PP-\d{4}$/);
  });
});
