"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Selection } from "../../../data/types";
import { useBag } from "../../../state/BagProvider";
import { Builder } from "../../../components/builder/Builder";
import { InlineNav } from "../../../components/InlineNav";

type MenuPageProps = { initial: Selection; title: string; image: string };

export function MenuPageClient(props: MenuPageProps) {
  return <Suspense fallback={null}><MenuPageContent {...props} /></Suspense>;
}

function MenuPageContent({ initial, title, image }: MenuPageProps) {
  const editingId = useSearchParams().get("edit") ?? undefined;
  const { items, ready } = useBag();
  if (!ready) return null;
  if (!editingId) return <Builder initial={initial} title={title} image={image} />;
  const item = items.find((candidate) => candidate.id === editingId);
  if (!item) return <><InlineNav title={title} backHref="/bag" /><div className="mx-4 mt-8 rounded-2xl border border-line bg-card p-5 text-center"><h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">Meal not found</h2><p className="mt-2 text-[15px] text-ink-soft">Return to your bag and choose a meal to edit.</p></div></>;
  return <Builder key={item.id} initial={item} title={title} image={image} editingId={item.id} />;
}
