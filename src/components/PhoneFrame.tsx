"use client";

import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

const PHONE_HEIGHT = 844;
const DESKTOP_GUTTER = 48;

function subscribeToViewport(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function viewportScale() {
  if (!window.matchMedia("(min-width: 768px)").matches) return 1;
  return Math.min(1, (window.innerHeight - DESKTOP_GUTTER) / PHONE_HEIGHT);
}

function usePhoneScale() {
  return useSyncExternalStore(subscribeToViewport, viewportScale, () => 1);
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const scale = usePhoneScale();
  const scaleVariable = { "--phone-scale": scale } as CSSProperties;
  return (
    <div className="min-h-dvh bg-cream md:flex md:h-dvh md:min-h-0 md:items-center md:justify-center md:overflow-hidden md:bg-tabletop md:p-6">
      <div
        data-phone-frame-wrapper
        className="md:h-[calc(844px*var(--phone-scale))] md:w-[calc(390px*var(--phone-scale))]"
        style={scaleVariable}
      >
        <div
          data-phone-frame
          className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-cream pt-[max(16px,env(safe-area-inset-top))] pb-[calc(83px+env(safe-area-inset-bottom))] md:h-[844px] md:min-h-0 md:w-[390px] md:origin-top md:rounded-[48px] md:border md:border-line md:pt-[54px] md:pb-[83px] md:shadow-2xl"
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        >
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
          <div aria-hidden="true" className="absolute bottom-2 left-1/2 z-50 hidden h-[5px] w-32 -translate-x-1/2 rounded-full bg-ink md:block" />
        </div>
      </div>
    </div>
  );
}
