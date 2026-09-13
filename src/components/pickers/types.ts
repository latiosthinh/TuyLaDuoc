import type { Dish } from "@/db/schema";

export type PickerMode = "roulette" | "cards" | "slot" | "random";

export interface PickerModeProps {
  candidates: Dish[];
  selectedDish: Dish | null;
  isSpinning: boolean;
  onSpinEnd?: () => void;
  className?: string;
}
