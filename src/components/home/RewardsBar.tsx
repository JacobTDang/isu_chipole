import type { Order } from "../../data/types";
import { points, tier } from "../../lib/rewards";

export function RewardsBar({ orders }: { orders: Order[] }) {
  const totalPoints = points(orders);
  const currentTier = tier(totalPoints);
  const start = currentTier.name === "Cardinal" ? 500 : 0;
  const progress = currentTier.nextAt ? Math.min(((totalPoints - start) / (currentTier.nextAt - start)) * 100, 100) : 100;
  return (
    <section className="mx-4 rounded-2xl border border-line bg-card p-4 shadow-sm" aria-label="Rewards">
      <div className="flex items-end justify-between gap-4"><div><p className="text-[13px] font-semibold text-ink-soft">{currentTier.name} rewards</p><p className="mt-0.5 font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink tabular-nums">{totalPoints} pts</p></div>{currentTier.nextAt && <p className="pb-1 text-[13px] text-ink-soft">{currentTier.nextAt - totalPoints} to {currentTier.nextName}</p>}</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-gold transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
    </section>
  );
}
