import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function InlineNav({ title, backHref = "/" }: { title: string; backHref?: string }) {
  return (
    <header className="relative flex min-h-11 items-center justify-center border-b border-line px-14">
      <Link href={backHref} aria-label="Go back" className="absolute left-2 flex size-11 items-center justify-center rounded-full text-cardinal">
        <ChevronLeft size={20} strokeWidth={1.5} />
      </Link>
      <h1 className="truncate text-[17px] font-semibold text-ink">{title}</h1>
    </header>
  );
}
