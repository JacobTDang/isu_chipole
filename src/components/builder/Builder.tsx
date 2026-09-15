"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ingredientsInGroup } from "../../data/menu";
import type { IngredientGroup, Selection } from "../../data/types";
import { itemPrice, macros } from "../../lib/pricing";
import { useBag } from "../../state/BagProvider";
import { useOrders } from "../../state/OrdersProvider";
import { Button } from "../Button";
import { InlineNav } from "../InlineNav";
import { MealImage } from "../MealImage";
import { Ticket } from "../Ticket";
import { useToast } from "../Toast";
import { BuilderSection } from "./BuilderSection";
import { MacroLine } from "./MacroLine";
import { QuantityStepper } from "./QuantityStepper";

const sections: Array<{ group: IngredientGroup; title: string; rule: string; mode: "one" | "many" }> = [
  { group: "base", title: "Base", rule: "Choose one · required", mode: "one" },
  { group: "protein", title: "Protein", rule: "Choose one · required", mode: "one" },
  { group: "veggies", title: "Veggies", rule: "Choose any", mode: "many" },
  { group: "toppings", title: "Toppings", rule: "Choose any", mode: "many" },
  { group: "sauce", title: "Sauce", rule: "Choose one", mode: "one" },
  { group: "extras", title: "Extras", rule: "Choose any", mode: "many" },
];

function AnimatedPrice({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const previous = useRef(value);
  useEffect(() => {
    const start = previous.current;
    const difference = value - start;
    previous.current = value;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => setDisplayed(value));
      return;
    }
    const started = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      const progress = Math.min((now - started) / 200, 1);
      setDisplayed(start + difference * progress);
      if (progress < 1) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span className="font-display text-[24px] font-extrabold tracking-[-0.02em] text-ink tabular-nums">${displayed.toFixed(2)}</span>;
}

export function Builder({ initial, title, image, editingId }: { initial: Selection; title: string; image: string; editingId?: string }) {
  const [selection, setSelection] = useState(initial);
  const { add, update } = useBag();
  const { save } = useOrders();
  const { show } = useToast();
  const router = useRouter();
  const selectedGroups = (group: IngredientGroup) => selection.ingredientIds.filter((id) => ingredientsInGroup(group).some((option) => option.id === id));
  const requiredComplete = selectedGroups("base").length === 1 && selectedGroups("protein").length === 1;
  const nutrition = macros(selection);
  const total = itemPrice(selection);

  const changeGroup = (group: IngredientGroup, ids: string[]) => {
    const groupIds = new Set(ingredientsInGroup(group).map((option) => option.id));
    setSelection((current) => ({ ...current, ingredientIds: [...current.ingredientIds.filter((id) => !groupIds.has(id)), ...ids] }));
  };

  const submit = () => {
    if (!requiredComplete) return;
    const cleanName = selection.name?.trim();
    const finalSelection: Selection = { ...selection, ...(cleanName ? { name: cleanName } : {}) };
    if (!cleanName) delete finalSelection.name;
    if (editingId) update(editingId, finalSelection);
    else {
      add(finalSelection);
      if (cleanName) save(finalSelection);
    }
    show(editingId ? "Saved changes." : "Added to bag.");
    router.back();
  };

  return (
    <div className="pb-4">
      <InlineNav title={title} backHref="/order" />
      <div className="relative h-[200px] overflow-hidden bg-card">
        <MealImage src={image} alt={title} fallbackLetter={title} />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink/45 to-transparent" />
      </div>
      <MacroLine calories={nutrition.calories} protein={nutrition.protein} />
      <div className="bg-cream">
        {sections.map((section) => <BuilderSection key={section.group} {...section} options={ingredientsInGroup(section.group)} selected={selectedGroups(section.group)} onChange={(ids) => changeGroup(section.group, ids)} />)}
        <section className="border-t border-line px-4 py-6">
          <label htmlFor="meal-name" className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">Name this meal</label>
          <p className="mt-1 text-[13px] text-ink-soft">Optional — save a favorite for next time.</p>
          <input id="meal-name" value={selection.name ?? ""} onChange={(event) => setSelection((current) => ({ ...current, name: event.target.value }))} placeholder="My post-workout bowl" className="mt-3 min-h-11 w-full rounded-xl border border-line bg-card px-4 text-[17px] text-ink placeholder:text-ink-soft/70" />
          <div className="mt-5 flex items-center justify-between"><span className="text-[17px] font-semibold text-ink">Quantity</span><QuantityStepper value={selection.quantity} onChange={(quantity) => setSelection((current) => ({ ...current, quantity }))} /></div>
        </section>
      </div>
      <div className="sticky bottom-0 z-20 border-t border-line shadow-[0_-10px_30px_var(--color-cream)]">
        <Ticket lines={requiredComplete ? [{ label: `${selection.quantity} meal${selection.quantity === 1 ? "" : "s"}`, amount: <AnimatedPrice value={total} /> }] : [{ label: "Choose a base and a protein", amount: "" }]}>
          <Button full disabled={!requiredComplete} onClick={submit}>{editingId ? "Save changes" : "Add to bag"}</Button>
        </Ticket>
      </div>
    </div>
  );
}
