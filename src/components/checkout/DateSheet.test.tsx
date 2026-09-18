import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateSheet } from "./DateSheet";

const now = new Date(2026, 8, 18, 10, 5);

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

let container: HTMLDivElement;
let root: Root;

function render(props: Partial<Parameters<typeof DateSheet>[0]> = {}) {
  const onChange = vi.fn();
  const onClose = vi.fn();
  act(() => {
    root.render(
      <DateSheet open title="Pickup date" value="2026-09-18" now={now} onChange={onChange} onClose={onClose} {...props} />,
    );
  });
  return { onChange, onClose };
}

const button = (label: string): HTMLButtonElement => {
  const match = container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  if (!match) throw new Error(`no button labelled ${label}`);
  return match;
};

describe("DateSheet", () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("shows the selected date's month with Sunday to Saturday headers", () => {
    render();
    expect(container.querySelector("h3")?.textContent).toBe("September 2026");
    const headers = [...container.querySelectorAll("[role=columnheader]")].map((cell) => cell.textContent);
    expect(headers).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    expect(container.querySelectorAll("[role=radio]")).toHaveLength(30);
  });

  it("disables days before today and days with no slots left", () => {
    render();
    expect(button("Thu, Sep 17").disabled).toBe(true);
    expect(button("Fri, Sep 18").disabled).toBe(false);
    expect(button("Sat, Sep 19").disabled).toBe(false);
    render({ now: new Date(2026, 8, 18, 19, 45) });
    expect(button("Fri, Sep 18").disabled).toBe(true);
  });

  it("marks today and the selected day", () => {
    render({ value: "2026-09-24" });
    expect(button("Fri, Sep 18").getAttribute("aria-current")).toBe("date");
    expect(button("Fri, Sep 18").getAttribute("aria-checked")).toBe("false");
    expect(button("Thu, Sep 24").getAttribute("aria-checked")).toBe("true");
    expect(button("Thu, Sep 24").getAttribute("aria-current")).toBeNull();
  });

  it("selects a day, then closes", () => {
    const { onChange, onClose } = render();
    act(() => button("Thu, Sep 24").click());
    expect(onChange).toHaveBeenCalledWith("2026-09-24");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cannot go before the current month but can go forward and back", () => {
    render();
    expect(button("Previous month").disabled).toBe(true);
    act(() => button("Next month").click());
    expect(container.querySelector("h3")?.textContent).toBe("October 2026");
    expect(button("Previous month").disabled).toBe(false);
    expect(button("Thu, Oct 1").disabled).toBe(false);
    act(() => button("Previous month").click());
    expect(container.querySelector("h3")?.textContent).toBe("September 2026");
  });

  it("opens on the selected date's month even when it is later than today", () => {
    render({ value: "2026-11-03" });
    expect(container.querySelector("h3")?.textContent).toBe("November 2026");
    expect(button("Previous month").disabled).toBe(false);
  });

  it("renders nothing when closed", () => {
    render({ open: false });
    expect(container.innerHTML).toBe("");
  });
});
