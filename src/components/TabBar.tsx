"use client";

import { Home, ShoppingBag, UserRound, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mealCount } from "../lib/pricing";
import { useBag } from "../state/BagProvider";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/order", label: "Order", icon: Utensils },
  { href: "/bag", label: "Bag", icon: ShoppingBag },
  { href: "/account", label: "Account", icon: UserRound },
];

export function TabBar() {
  const pathname = usePathname();
  const { items } = useBag();
  const count = mealCount(items);
  const previous = useRef(count);
  const [bounce, setBounce] = useState(false);
  useEffect(() => {
    if (count > previous.current) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 320);
      previous.current = count;
      return () => clearTimeout(timer);
    }
    previous.current = count;
  }, [count]);
  if (pathname === "/login" || /^\/order\/[^/]+$/.test(pathname)) return null;
  const isActive = (href: string) => href === "/" ? pathname === "/" : href === "/order" ? pathname === "/order" || pathname.startsWith("/menu/") || pathname.startsWith("/meal/") : pathname.startsWith(href);
  return (
    <nav aria-label="Primary" className="absolute right-0 bottom-0 left-0 z-30 flex h-[calc(49px+max(34px,env(safe-area-inset-bottom)))] border-t border-line bg-card pb-[max(34px,env(safe-area-inset-bottom))]">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`relative flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${active ? "text-cardinal" : "text-ink-soft"}`}><span className="relative"><Icon size={22} strokeWidth={1.5} />{label === "Bag" && count > 0 && <span className={`absolute -top-2 -right-3 flex min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] leading-4 text-ink ${bounce ? "bag-badge-bounce" : ""}`}>{count}</span>}</span>{label}</Link>;
      })}
    </nav>
  );
}
