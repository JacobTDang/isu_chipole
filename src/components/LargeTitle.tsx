import type { ReactNode } from "react";

export function LargeTitle({ children }: { children: ReactNode }) {
  return <h1 className="px-4 pt-2 pb-5 font-display text-[34px] leading-tight font-extrabold tracking-[-0.02em] text-ink">{children}</h1>;
}
