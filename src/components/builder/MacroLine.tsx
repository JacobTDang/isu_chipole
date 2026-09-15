import { Flame, Dumbbell } from "lucide-react";

export function MacroLine({ calories, protein }: { calories: number; protein: number }) {
  return (
    <div className="flex items-center justify-center gap-6 border-b border-line bg-card px-4 py-3 text-[13px] font-semibold text-ink-soft">
      <span className="flex items-center gap-1.5"><Flame size={16} strokeWidth={1.5} className="text-cardinal" />{calories} cal</span>
      <span className="flex items-center gap-1.5"><Dumbbell size={16} strokeWidth={1.5} className="text-cardinal" />{protein}g protein</span>
    </div>
  );
}
