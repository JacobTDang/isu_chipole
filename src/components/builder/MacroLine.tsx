import { Flame, Dumbbell, Target } from "lucide-react";
import type { GoalStatus } from "../../lib/goals";

export function MacroLine({ calories, protein, status }: { calories: number; protein: number; status?: GoalStatus }) {
  return (
    <div className="flex items-center justify-center gap-6 border-b border-line bg-card px-4 py-3 text-[13px] font-semibold text-ink-soft">
      <span className="flex items-center gap-1.5"><Flame size={16} strokeWidth={1.5} className="text-cardinal" />{calories} cal</span>
      <span className="flex items-center gap-1.5"><Dumbbell size={16} strokeWidth={1.5} className="text-cardinal" />{protein}g protein</span>
      {status && <span className={`flex items-center gap-1.5 ${status.onTarget ? "text-veg" : "text-cardinal"}`}><Target size={16} strokeWidth={1.5} />{status.message}</span>}
    </div>
  );
}
