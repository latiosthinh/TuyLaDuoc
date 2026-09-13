"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { PickerModeProps } from "./types";
import type { Dish } from "@/db/schema";
import { RarityBadge } from "@/components/public/RarityBadge";
import { formatVND } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Utensils,
  RefreshCw,
} from "lucide-react";

export function CardShuffle({
  candidates,
  selectedDish,
  isSpinning,
  onSelectDish,
  onRespin,
  className,
}: PickerModeProps) {
  // Current active index in candidates pool
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  // Sync with selectedDish if provided externally
  useEffect(() => {
    if (selectedDish && candidates.length > 0) {
      const idx = candidates.findIndex((d) => d.id === selectedDish.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [selectedDish, candidates]);

  // Safe fallback dish
  const activeDish: Dish | undefined =
    selectedDish || candidates[currentIndex] || candidates[0];

  const handleNext = () => {
    if (candidates.length <= 1 || isSpinning) return;
    setSlideDirection(1);
    const nextIdx = (currentIndex + 1) % candidates.length;
    setCurrentIndex(nextIdx);
    if (onSelectDish) {
      onSelectDish(candidates[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (candidates.length <= 1 || isSpinning) return;
    setSlideDirection(-1);
    const prevIdx = (currentIndex - 1 + candidates.length) % candidates.length;
    setCurrentIndex(prevIdx);
    if (onSelectDish) {
      onSelectDish(candidates[prevIdx]);
    }
  };

  const mapsUrl = activeDish
    ? `https://www.google.com/maps/search/${encodeURIComponent(
        activeDish.name + " gần đây"
      )}`
    : "#";

  if (!activeDish) {
    return (
      <div className="flex h-96 w-80 items-center justify-center rounded-3xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-400 dark:border-stone-700">
        Không có món ăn nào phù hợp với bộ lọc.
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center select-none ${
        className || ""
      }`}
    >
      {/* Navigation hints & counter */}
      <div className="mb-3 flex items-center justify-between w-full max-w-[340px] sm:max-w-[400px] px-2 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
        <span>← Vuốt hoặc bấm mũi tên để duyệt</span>
        <span className="rounded-full bg-stone-200/80 px-2.5 py-0.5 text-[10px] font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
          {currentIndex + 1} / {candidates.length}
        </span>
      </div>

      {/* Main Card Stage with Floating Left/Right Controls */}
      <div className="relative flex items-center justify-center">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isSpinning || candidates.length <= 1}
          aria-label="Món trước đó"
          className="absolute -left-4 sm:-left-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-stone-200/80 bg-white/95 text-stone-700 shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:border-orange-300 hover:text-orange-600 disabled:opacity-30 disabled:pointer-events-none dark:border-stone-700 dark:bg-stone-800/95 dark:text-stone-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Card Deck Wrapper */}
        <div className="relative h-[480px] w-[320px] sm:h-[520px] sm:w-[380px] md:w-[400px] [perspective:1200px]">
          {/* Deck Background Card 1 (Tilted Left) */}
          <motion.div
            animate={
              isSpinning
                ? {
                    x: [-35, 40, -25, 0],
                    rotate: [-12, 14, -8, -5],
                    scale: [0.93, 1.05, 0.94, 0.95],
                  }
                : { rotate: -5, x: -8, y: 6 }
            }
            transition={{
              repeat: isSpinning ? Infinity : 0,
              duration: 0.45,
            }}
            className="pointer-events-none absolute inset-0 rounded-3xl border border-stone-200/80 bg-stone-200/60 shadow-md dark:border-stone-800 dark:bg-stone-800/60"
          />

          {/* Deck Background Card 2 (Tilted Right) */}
          <motion.div
            animate={
              isSpinning
                ? {
                    x: [35, -40, 25, 0],
                    rotate: [12, -14, 8, 5],
                    scale: [1.05, 0.93, 1.04, 0.97],
                  }
                : { rotate: 5, x: 8, y: 6 }
            }
            transition={{
              repeat: isSpinning ? Infinity : 0,
              duration: 0.48,
            }}
            className="pointer-events-none absolute inset-0 rounded-3xl border border-orange-200 bg-orange-100/70 shadow-md dark:border-orange-900/50 dark:bg-orange-950/40"
          />

          {/* Active Card Container with Swipe Gestures */}
          <div className="relative h-full w-full">
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={isSpinning ? "spinning-card" : activeDish.id}
                custom={slideDirection}
                drag={!isSpinning ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -45) handleNext();
                  else if (info.offset.x > 45) handlePrev();
                }}
                initial={
                  isSpinning
                    ? { rotateY: 0 }
                    : {
                        x: slideDirection * 120,
                        opacity: 0,
                        scale: 0.92,
                      }
                }
                animate={
                  isSpinning
                    ? {
                        rotateY: [0, 180, 360, 540, 720],
                        scale: [1, 1.03, 0.98, 1],
                      }
                    : {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                      }
                }
                exit={{
                  x: -slideDirection * 120,
                  opacity: 0,
                  scale: 0.92,
                }}
                transition={{
                  duration: isSpinning ? 0.75 : 0.35,
                  repeat: isSpinning ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className="group absolute inset-0 flex flex-col overflow-hidden rounded-3xl border-2 border-stone-200/90 bg-white shadow-xl cursor-grab active:cursor-grabbing dark:border-stone-800 dark:bg-stone-900"
              >
                {/* Top Image Section */}
                <div className="relative h-[62%] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  {activeDish.imageUrl ? (
                    <Image
                      src={activeDish.imageUrl}
                      alt={activeDish.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 340px, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 text-orange-400 dark:from-stone-800 dark:to-stone-900">
                      <Utensils className="h-16 w-16 opacity-40" />
                    </div>
                  )}

                  {/* Gradient Overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 right-4 z-10">
                    <RarityBadge rarity={activeDish.rarity} />
                  </div>

                  {/* Price overlay on image */}
                  <div className="absolute bottom-4 left-4 z-10 flex flex-col text-left">
                    <span className="text-[11px] font-bold text-orange-200 drop-shadow-sm uppercase tracking-wider">
                      Giá Tham Khảo
                    </span>
                    <span className="text-2xl font-black text-white drop-shadow-md">
                      {formatVND(activeDish.price)}
                    </span>
                  </div>
                </div>

                {/* Bottom Details Section */}
                <div className="flex flex-1 flex-col justify-between p-5 text-left">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Gợi ý cho bạn</span>
                    </div>

                    <h3 className="mt-1 text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl dark:text-stone-100">
                      {activeDish.name}
                    </h3>

                    {activeDish.subtitle && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500 sm:text-sm dark:text-stone-400">
                        {activeDish.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-4 flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-xs font-bold text-stone-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                    >
                      <MapPin className="h-3.5 w-3.5 text-orange-500" />
                      <span>Tìm quán quanh đây</span>
                    </a>

                    {onRespin && (
                      <button
                        type="button"
                        onClick={onRespin}
                        className="flex items-center justify-center gap-1 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-orange-700"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Quay lại</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isSpinning || candidates.length <= 1}
          aria-label="Món tiếp theo"
          className="absolute -right-4 sm:-right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-stone-200/80 bg-white/95 text-stone-700 shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:border-orange-300 hover:text-orange-600 disabled:opacity-30 disabled:pointer-events-none dark:border-stone-700 dark:bg-stone-800/95 dark:text-stone-200"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
