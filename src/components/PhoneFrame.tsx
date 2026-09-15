import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream md:flex md:items-center md:justify-center md:bg-tabletop md:p-6">
      <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-cream pt-[max(16px,env(safe-area-inset-top))] pb-[calc(83px+env(safe-area-inset-bottom))] md:h-[844px] md:min-h-0 md:w-[390px] md:rounded-[48px] md:border md:border-line md:pt-[54px] md:pb-[83px] md:shadow-2xl">
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        <div aria-hidden="true" className="absolute bottom-2 left-1/2 z-50 hidden h-[5px] w-32 -translate-x-1/2 rounded-full bg-ink md:block" />
      </div>
    </div>
  );
}
