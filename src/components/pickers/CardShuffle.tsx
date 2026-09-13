"use client";

import React from "react";
import { motion } from "motion/react";
import type { PickerModeProps } from "./types";
import { Utensils, Sparkles } from "lucide-react";
import { formatVND } from "@/lib/utils";

export function CardShuffle({
  selectedDish,
  isSpinning,
  className,
}: PickerModeProps) {
  return (
    <div className={`relative flex h-64 w-full max-w-xs items-center justify-center ${className || ""}`}>
      {/* 3 cards stack shuffling */}
      <div className="relative h-56 w-44 [perspective:1000px]">
        {/* Background Deck Card 1 */}
        <motion.div
          animate={
            isSpinning
              ? {
                  x: [-20, 25, -15, 0],
                  rotate: [-8, 10, -5, -4],
                  scale: [0.95, 1.05, 0.95, 0.96],
                }
              : { rotate: -4, x: -6 }
          }
          transition={{
            repeat: isSpinning ? Infinity : 0,
            duration: 0.5,
          }}
          className="absolute inset-0 rounded-2xl border border-stone-200 bg-stone-100 shadow-sm dark:border-stone-800 dark:bg-stone-800"
        />

        {/* Background Deck Card 2 */}
        <motion.div
          animate={
            isSpinning
              ? {
                  x: [20, -25, 15, 0],
                  rotate: [8, -10, 5, 4],
                  scale: [1.02, 0.94, 1.02, 0.98],
                }
              : { rotate: 4, x: 6 }
          }
          transition={{
            repeat: isSpinning ? Infinity : 0,
            duration: 0.55,
          }}
          className="absolute inset-0 rounded-2xl border border-orange-200 bg-orange-50 shadow-sm dark:border-orange-950 dark:bg-orange-950/40"
        />

        {/* Primary Foreground Card with 3D Flip */}
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{
            rotateY: isSpinning ? [0, 180, 360, 540, 720] : selectedDish ? 180 : 0,
          }}
          transition={{
            duration: isSpinning ? 0.8 : 0.6,
            repeat: isSpinning ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {/* Card Back (mystery pattern) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-amber-600 p-4 text-white shadow-xl [backface-visibility:hidden]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
              <Utensils className="h-7 w-7 text-white" />
            </div>
            <span className="mt-3 text-xs font-bold tracking-wider uppercase">
              Bí Mật Bữa Trưa
            </span>
            <Sparkles className="mt-2 h-4 w-4 animate-bounce text-amber-200" />
          </div>

          {/* Card Front (revealed dish info) */}
          <div className="absolute inset-0 flex flex-col items-center justify-between rounded-2xl border-2 border-orange-400 bg-white p-4 text-stone-900 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] dark:bg-stone-900 dark:text-stone-100">
            <div className="flex w-full items-center justify-between">
              <span className="text-[10px] font-bold text-orange-600 uppercase">
                {selectedDish?.rarity || "Món Trưa"}
              </span>
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            </div>

            <div className="flex flex-col items-center text-center my-auto">
              <h4 className="text-sm font-extrabold text-stone-900 line-clamp-2 dark:text-stone-100">
                {selectedDish?.name || "Món Ăn"}
              </h4>
              <span className="mt-2 text-xs font-black text-orange-600 dark:text-orange-400">
                {selectedDish ? formatVND(selectedDish.price) : "—"}
              </span>
            </div>

            <div className="w-full text-center text-[10px] font-medium text-stone-400">
              Chạm để đổi món
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
