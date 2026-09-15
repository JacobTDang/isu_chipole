"use client";

import Image from "next/image";
import { useState } from "react";

export function MealImage({ src, alt, fallbackLetter, className = "" }: { src: string; alt: string; fallbackLetter: string; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (failedSrc === src) return <div role="img" aria-label={alt} className={`flex items-center justify-center bg-gradient-to-br from-cardinal to-cardinal-deep font-display text-[34px] font-extrabold text-card ${className}`}>{fallbackLetter.slice(0, 1).toUpperCase()}</div>;
  return <Image src={src} alt={alt} fill sizes="390px" onError={() => setFailedSrc(src)} className={`object-cover ${className}`} />;
}
