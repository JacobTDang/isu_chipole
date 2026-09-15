"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "dark";
  full?: boolean;
  children: ReactNode;
};

export function Button({ variant = "primary", full = false, className = "", children, ...props }: Props) {
  const styles = {
    primary: "border-cardinal bg-cardinal text-card hover:bg-cardinal-deep",
    secondary: "border-line bg-cream text-cardinal hover:border-cardinal",
    dark: "border-ink bg-ink text-card hover:bg-cardinal-deep",
  }[variant];
  return (
    <button className={`min-h-[50px] rounded-[14px] border px-5 text-[17px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${full ? "w-full" : ""} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
