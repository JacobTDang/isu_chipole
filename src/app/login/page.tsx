import Image from "next/image";

export default function LoginPage() {
  return <div className="flex min-h-full flex-col items-center px-6 pt-20 text-center"><Image className="h-auto" src="/isu-logo.png" alt="Iowa State University" width={240} height={96} priority /><h1 className="mt-10 font-display text-[34px] font-extrabold tracking-[-0.02em] text-ink">Andrew&apos;s</h1><p className="mt-2 text-[15px] text-ink-soft">Meal prep for Cyclones. Pick up on campus.</p></div>;
}
