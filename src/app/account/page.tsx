"use client";

import { useRouter } from "next/navigation";
import { GroupedList, GroupedRow } from "../../components/GroupedList";
import { LargeTitle } from "../../components/LargeTitle";
import { RequireAuth } from "../../components/RequireAuth";
import { useToast } from "../../components/Toast";
import { Allergies } from "../../components/account/Allergies";
import { Budget } from "../../components/account/Budget";
import { HealthGoal } from "../../components/account/HealthGoal";
import { OrderHistory } from "../../components/account/OrderHistory";
import { Preferences } from "../../components/account/Preferences";
import { SavedMeals } from "../../components/account/SavedMeals";
import { clearPreferences } from "../../lib/prefs";
import type { Order, Selection } from "../../data/types";
import { newBagItemId } from "../../lib/ids";
import { points, tier } from "../../lib/rewards";
import { clearAll } from "../../lib/storage";
import { useAuth } from "../../state/AuthProvider";
import { useBag } from "../../state/BagProvider";
import { useOrders } from "../../state/OrdersProvider";

export default function AccountPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { add, replaceAll } = useBag();
  const { orders, saved } = useOrders();
  const { show } = useToast();
  const rewardPoints = points(orders);
  const currentTier = tier(rewardPoints);
  const tierStart = currentTier.name === "Cardinal" ? 500 : currentTier.name === "Gold" ? 1500 : 0;
  const progress = currentTier.nextAt === null
    ? 100
    : Math.min(100, ((rewardPoints - tierStart) / (currentTier.nextAt - tierStart)) * 100);
  const pointsToNext = currentTier.nextAt === null ? null : currentTier.nextAt - rewardPoints;

  function reorder(order: Order) {
    replaceAll(order.items.map((item) => ({ ...item, id: newBagItemId() })));
    show("Added to bag.");
  }

  function addSaved(selection: Selection) {
    add(selection);
    show("Added to bag.");
  }

  function resetDemo() {
    clearAll();
    clearPreferences();
    window.location.replace("/login");
  }

  function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  return (
    <RequireAuth>
      <div className="pb-5">
        <LargeTitle>Account</LargeTitle>

        <GroupedList header="Rewards">
          <div className="px-4 py-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-[30px] leading-none font-extrabold tracking-[-0.02em] text-ink">
                  {rewardPoints} pts
                </p>
                <p className="mt-1 text-[15px] font-semibold text-cardinal">{currentTier.name}</p>
              </div>
              <p className="text-right text-[13px] text-ink-soft">
                {pointsToNext === null
                  ? "Top tier reached"
                  : `${pointsToNext} pts to ${currentTier.nextName}`}
              </p>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              className="mt-4 h-2 overflow-hidden rounded-full bg-line"
            >
              <div
                className="h-full rounded-full bg-gold transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </GroupedList>

        <GroupedList header="Order history">
          <OrderHistory orders={orders} onReorder={reorder} />
        </GroupedList>

        <GroupedList header="Saved meals">
          <SavedMeals meals={saved} onAdd={addSaved} />
        </GroupedList>

        <GroupedList header="Dietary preferences">
          <Preferences />
        </GroupedList>

        <GroupedList header="Health goal">
          <HealthGoal />
        </GroupedList>

        <GroupedList header="Allergies">
          <Allergies />
        </GroupedList>

        <GroupedList header="Budget per meal">
          <Budget />
        </GroupedList>

        <GroupedList header="Demo">
          <GroupedRow label="Reset demo data" danger onClick={resetDemo} />
          <GroupedRow label="Sign out" onClick={handleSignOut} />
        </GroupedList>
      </div>
    </RequireAuth>
  );
}
