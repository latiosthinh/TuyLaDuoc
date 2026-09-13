"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import type { PickerModeProps } from "./types";

export function RouletteWheel({
  candidates,
  selectedDish,
  isSpinning,
  className,
}: PickerModeProps) {
  // Cap displayed slices to avoid visual clutter (max 12)
  const displayDishes = useMemo(() => {
    if (candidates.length <= 12) return candidates;
    // ensure selectedDish is in slice if exists
    const pool = candidates.slice(0, 12);
    if (selectedDish && !pool.some((d) => d.id === selectedDish.id)) {
      pool[0] = selectedDish;
    }
    return pool;
  }, [candidates, selectedDish]);

  const numSlices = Math.max(displayDishes.length, 1);
  const sliceAngle = 360 / numSlices;

  // Calculate target rotation angle so pointer lands on selected dish
  const targetRotation = useMemo(() => {
    if (!selectedDish) return 1440; // 4 full spins idle
    const targetIdx = displayDishes.findIndex((d) => d.id === selectedDish.id);
    const sliceCenter = (targetIdx >= 0 ? targetIdx : 0) * sliceAngle + sliceAngle / 2;
    // 5 full rotations (1800) + alignment to top pointer (270deg offset)
    return 1800 + (360 - sliceCenter);
  }, [selectedDish, displayDishes, sliceAngle]);

  const colors = [
    "#ea580c", "#f97316", "#fb923c", "#fdba74",
    "#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc",
    "#16a34a", "#22c55e", "#4ade80", "#86efac",
  ];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className || ""}`}>
      {/* Top pointer triangle */}
      <div className="z-20 -mb-3 h-0 w-0 border-x-8 border-t-14 border-x-transparent border-t-orange-600 drop-shadow-md" />

      {/* Outer Wheel Rim */}
      <div className="relative flex h-64 w-64 items-center justify-center rounded-full border-4 border-white bg-white p-1 shadow-xl sm:h-72 sm:w-72 dark:border-stone-800 dark:bg-stone-900">
        <motion.div
          className="relative h-full w-full rounded-full overflow-hidden"
          animate={{
            rotate: isSpinning ? [0, targetRotation] : 0,
          }}
          transition={{
            duration: isSpinning ? 2.5 : 0.4,
            ease: [0.15, 0.9, 0.25, 1], // natural decelerating spin
          }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {displayDishes.map((dish, i) => {
              const startAngle = (i * sliceAngle * Math.PI) / 180;
              const endAngle = (((i + 1) * sliceAngle) * Math.PI) / 180;
              const x1 = 50 + 50 * Math.cos(startAngle);
              const y1 = 50 + 50 * Math.sin(startAngle);
              const x2 = 50 + 50 * Math.cos(endAngle);
              const y2 = 50 + 50 * Math.sin(endAngle);
              const largeArc = sliceAngle > 180 ? 1 : 0;
              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={dish.id}
                  d={pathData}
                  fill={colors[i % colors.length]}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>

          {/* Labels inside slices */}
          {displayDishes.map((dish, i) => {
            const angle = i * sliceAngle + sliceAngle / 2;
            return (
              <div
                key={`label-${dish.id}`}
                className="absolute top-1/2 left-1/2 flex origin-left items-center pr-2"
                style={{
                  transform: `rotate(${angle}deg) translateY(-50%)`,
                  width: "48%",
                }}
              >
                <span className="truncate pl-3 text-[9px] font-bold text-white drop-shadow-xs sm:text-[10px]">
                  {dish.name}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Wheel Center Cap */}
        <div className="absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-stone-900 text-[10px] font-extrabold text-white shadow-md sm:h-14 sm:w-14 dark:border-stone-700">
          <span className="text-orange-400">QUAY</span>
        </div>
      </div>
    </div>
  );
}
