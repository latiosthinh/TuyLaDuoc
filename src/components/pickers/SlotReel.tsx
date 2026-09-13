"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import type { PickerModeProps } from "./types";
import { RarityBadge } from "@/components/public/RarityBadge";
import { formatVND } from "@/lib/utils";
import { Sparkles, Utensils, MapPin } from "lucide-react";

export function SlotReel({
  candidates,
  selectedDish,
  isSpinning,
  className,
}: PickerModeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Measure container width for exact centering
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const cardWidth = 250; // px per card
  const cardGap = 16; // px between cards
  const step = cardWidth + cardGap;
  const targetIndex = 14; // fixed landing slot in expanded pool

  // Construct a long sequence of items with selectedDish at targetIndex
  const reelItems = useMemo(() => {
    if (candidates.length === 0) return [];
    // Repeat candidate pool to fill at least 25 items
    const pool: typeof candidates = [];
    while (pool.length < 25) {
      pool.push(...candidates);
    }
    const items = pool.slice(0, 25);

    if (selectedDish) {
      items[targetIndex] = selectedDish;
    }
    return items;
  }, [candidates, selectedDish]);

  // Center the target card exactly in the viewport
  const targetX = useMemo(() => {
    const cardCenter = targetIndex * step + cardWidth / 2;
    return containerWidth / 2 - cardCenter;
  }, [containerWidth, targetIndex, step, cardWidth]);

  // Idle position: center the first card or selected card
  const idleX = useMemo(() => {
    if (selectedDish) {
      return targetX;
    }
    const firstCardCenter = 0 * step + cardWidth / 2;
    return containerWidth / 2 - firstCardCenter;
  }, [selectedDish, targetX, step, cardWidth, containerWidth]);

  return (
    <div
      ref={containerRef}
      className={`relative flex w-full max-w-5xl flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-stone-200/90 bg-stone-100/70 p-4 py-8 shadow-inner dark:border-stone-800/90 dark:bg-stone-900/60 ${
        className || ""
      }`}
    >
      {/* Top Center Indicator Pointer */}
      <div className="z-20 mb-2 flex items-center gap-1.5 rounded-full bg-orange-600 px-3 py-0.5 text-[11px] font-bold text-white shadow-md">
        <Sparkles className="h-3 w-3" />
        <span>Ô TRÚNG THƯỞNG</span>
      </div>

      {/* Viewport Frame with Gradient Edge Overlays */}
      <div className="relative h-[340px] w-full overflow-hidden">
        {/* Left & Right Shadow Vignettes */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-28 bg-gradient-to-r from-stone-100/95 dark:from-stone-900/95 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-28 bg-gradient-to-l from-stone-100/95 dark:from-stone-900/95 to-transparent" />

        {/* Center Target Box Highlight Frame */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-orange-500 bg-orange-500/5 shadow-[0_0_25px_rgba(234,88,12,0.25)]"
          style={{ width: `${cardWidth + 12}px` }}
        />

        {/* Scrolling Strip */}
        <motion.div
          className="flex items-center h-full absolute top-0 left-0"
          animate={{
            x: isSpinning
              ? [idleX, idleX + 300, targetX - 2500, targetX]
              : selectedDish
              ? targetX
              : idleX,
          }}
          transition={{
            duration: isSpinning ? 2.3 : 0.4,
            ease: [0.12, 0.9, 0.22, 1], // natural slot reel deceleration
          }}
          style={{ gap: `${cardGap}px` }}
        >
          {reelItems.map((dish, idx) => {
            const isTarget = selectedDish && idx === targetIndex;
            return (
              <div
                key={`${dish.id}-${idx}`}
                className={`relative flex h-[310px] flex-col overflow-hidden rounded-2xl border bg-white shadow-md transition-all shrink-0 select-none dark:bg-stone-900 ${
                  isTarget
                    ? "border-orange-500 ring-2 ring-orange-400/50 shadow-lg"
                    : "border-stone-200 dark:border-stone-800 opacity-90"
                }`}
                style={{ width: `${cardWidth}px` }}
              >
                {/* Card Image */}
                <div className="relative h-40 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  {dish.imageUrl ? (
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      sizes="250px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-400 dark:bg-stone-800">
                      <Utensils className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <RarityBadge rarity={dish.rarity} />
                  </div>
                </div>

                {/* Card Details */}
                <div className="flex flex-1 flex-col justify-between p-3.5 text-left">
                  <div>
                    <h4 className="truncate text-sm font-bold text-stone-900 dark:text-stone-100">
                      {dish.name}
                    </h4>
                    <p className="mt-0.5 truncate text-[11px] text-stone-500 dark:text-stone-400">
                      {dish.subtitle || "Món ngon trưa nay"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-100 pt-2 dark:border-stone-800">
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400">
                      {formatVND(dish.price)}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(
                        dish.name + " gần đây"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-stone-50 p-1.5 text-stone-500 hover:text-orange-600 dark:bg-stone-800"
                      title="Tìm quán"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <span className="mt-3 text-[11px] text-stone-500 dark:text-stone-400">
        Bấm nút quay để băng chuyền lướt và dừng chuẩn xác tại món trưa của bạn
      </span>
    </div>
  );
}
