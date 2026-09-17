import type { Dish } from "@/db/schema";

export type PickerMode = "cards" | "slot";

export interface PickerModeProps {
  candidates: Dish[];
  selectedDish: Dish | null;
  isSpinning: boolean;
  onSpinEnd?: () => void;
  onSelectDish?: (dish: Dish) => void;
  onRespin?: () => void;
  className?: string;
}
