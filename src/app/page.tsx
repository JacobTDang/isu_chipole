"use client";

import { MealTypeGrid } from "../components/home/MealTypeGrid";
import { PresetRow } from "../components/home/PresetRow";
import { RewardsBar } from "../components/home/RewardsBar";
import { UsualRow } from "../components/home/UsualRow";
import { LargeTitle } from "../components/LargeTitle";
import { RequireAuth } from "../components/RequireAuth";
import { useAuth } from "../state/AuthProvider";
import { useOrders } from "../state/OrdersProvider";

function HomeContent() {
  const { user } = useAuth();
  const { orders, ready } = useOrders();
  if (!user || !ready) return null;
  return (
    <div className="pb-8">
      <LargeTitle>Hey, {user.firstName}</LargeTitle>
      <RewardsBar orders={orders} />
      <section className="px-4 pt-7"><h2 className="mb-3 font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">Your usual</h2><UsualRow orders={orders} /></section>
      <section className="px-4 pt-7"><h2 className="mb-3 font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">Start an order</h2><MealTypeGrid /></section>
      <section className="px-4 pt-7"><h2 className="mb-3 font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">Preset meals</h2><PresetRow /></section>
    </div>
  );
}

export default function HomePage() {
  return <RequireAuth><HomeContent /></RequireAuth>;
}
