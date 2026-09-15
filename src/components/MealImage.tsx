"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function MealImage({ src, alt, fallbackLetter, className = "" }: { src: string; alt: string; fallbackLetter: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed) return <div role="img" aria-label={alt} className={`flex items-center justify-center bg-gradient-to-br from-cardinal to-cardinal-deep font-display text-[34px] font-extrabold text-card ${className}`}>{fallbackLetter.slice(0, 1).toUpperCase()}</div>;
  return <Image src={src} alt={alt} fill sizes="390px" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
