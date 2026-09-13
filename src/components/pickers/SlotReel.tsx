"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import type { PickerModeProps } from "./types";
import { formatVND } from "@/lib/utils";

export function SlotReel({
  candidates,
  selectedDish,
  isSpinning,
  className,
}: PickerModeProps) {
  // Build a repeating list to simulate tall slot reel
  const reelItems = useMemo(() => {
    if (candidates.length === 0) return [];
    const pool = [...candidates, ...candidates, ...candidates, ...candidates];
    if (selectedDish) {
      // Place selectedDish near middle-bottom so reel lands cleanly
      pool[14] = selectedDish;
    }
    return pool.slice(0, 20);
  }, [candidates, selectedDish]);

  const itemHeight = 64; // px per row
  const targetTranslateY = -14 * itemHeight; // land on index 14

  return (
    <div className={`relative flex flex-col items-center justify-center ${className || ""}`}>
      {/* Slot Machine Chassis */}
      <div className="relative h-44 w-72 overflow-hidden rounded-2xl border-4 border-stone-800 bg-stone-950 p-2 shadow-2xl dark:border-stone-700">
        {/* Top/Bottom Gradient Shadows for reel depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-stone-950 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-stone-950 to-transparent" />

        {/* Center Target Selection Bar */}
        <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 h-16 -translate-y-1/2 rounded-xl border-2 border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.2)]" />

        {/* Scrolling Strip */}
        <div className="relative pt-12">
          <motion.div
            className="flex flex-col"
            animate={{
              y: isSpinning
                ? [0, -itemHeight * 10, targetTranslateY]
                : selectedDish
                ? targetTranslateY
                : 0,
            }}
            transition={{
              duration: isSpinning ? 2.4 : 0.4,
              ease: [0.1, 0.9, 0.2, 1], // slot reel bounce/deceleration
            }}
          >
            {reelItems.map((dish, idx) => (
              <div
                key={`${dish.id}-${idx}`}
                className="flex h-16 items-center justify-between px-4 text-white"
              >
                <div className="flex flex-col text-left">
                  <span className="truncate text-xs font-bold text-stone-100">
                    {dish.name}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {dish.subtitle || "Món ngon"}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-orange-400">
                  {formatVND(dish.price)}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
