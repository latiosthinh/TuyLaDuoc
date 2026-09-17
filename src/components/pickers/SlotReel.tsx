"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import type { PickerModeProps } from "./types";
import type { Dish } from "@/db/schema";
import { formatVND } from "@/lib/utils";
import { sounds } from "@/lib/audio";
import { Volume2, VolumeX, Sparkles, Utensils } from "lucide-react";

const RARITY_COLORS: Record<string, string> = {
  QUOC_DAN: "#10b981", // Green
  HIEM: "#3b82f6",     // Blue
  CUC_PHAM: "#a855f7", // Purple
  TOI_MAT: "#ec4899",  // Pink
  DAC_BIET: "#f59e0b", // Gold
};

export function SlotReel({
  candidates,
  selectedDish,
  isSpinning,
  onSelectDish,
  className,
}: PickerModeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const positionRef = useRef<number>(-300);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reelItems, setReelItems] = useState<Dish[]>([]);
  const [winnerIndex, setWinnerIndex] = useState<number>(-1);
  const [winningDish, setWinningDish] = useState<Dish | null>(null);

  const cardWidth = 210;
  const cardGap = 12;
  const step = cardWidth + cardGap; // 222px

  // Build reel strip when candidates change
  useEffect(() => {
    if (candidates.length === 0) return;
    // Pre-populate ~40 items repeating candidates
    const initial: Dish[] = [];
    while (initial.length < 45) {
      initial.push(...candidates);
    }
    setReelItems(initial.slice(0, 45));
  }, [candidates]);

  // Handle spin animation with CS:GO Panorama physics
  const runSpin = useCallback(
    (targetDish: Dish) => {
      if (!containerRef.current || !trackRef.current || reelItems.length === 0) return;

      const viewportWidth = containerRef.current.clientWidth;
      const targetSlot = 32; // Land on 32nd item in track

      // Construct strip with targetDish at targetSlot
      const newItems: Dish[] = [];
      while (newItems.length < 45) {
        newItems.push(...candidates);
      }
      newItems[targetSlot] = targetDish;
      setReelItems(newItems);
      setWinnerIndex(targetSlot);
      setWinningDish(null);

      // Random jitter ±18px so it doesn't land at the exact same millimeter every spin
      const jitter = (Math.random() - 0.5) * 36;
      const startX = positionRef.current;
      const endX = viewportWidth / 2 - (targetSlot * step + cardWidth / 2) + jitter;

      const duration = 5200; // 5.2s authentic CS:GO duration
      const startTime = performance.now();
      let lastCellIndex = Math.floor((-startX + viewportWidth / 2) / step);

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);

        // CS:GO exponential friction curve: 1 - (1 - p)^3.2
        const ease = 1 - Math.pow(1 - progress, 3.2);
        const currentX = startX + (endX - startX) * ease;
        positionRef.current = currentX;

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${currentX}px, 0, 0)`;
        }

        // Play tick sound when card crosses the center laser line
        const currentCell = Math.floor((-currentX + viewportWidth / 2) / step);
        if (currentCell !== lastCellIndex) {
          if (soundEnabled) {
            sounds.playTick();
          }
          lastCellIndex = currentCell;
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Finished spin
          setWinningDish(targetDish);
          if (soundEnabled) {
            sounds.playWin();
          }
          if (onSelectDish) {
            onSelectDish(targetDish);
          }
        }
      };

      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    },
    [candidates, reelItems.length, step, cardWidth, soundEnabled, onSelectDish]
  );

  // Trigger spin when isSpinning flips to true
  useEffect(() => {
    if (isSpinning && selectedDish) {
      runSpin(selectedDish);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isSpinning, selectedDish, runSpin]);

  // Initial positioning to center first cards
  useEffect(() => {
    if (!isSpinning && containerRef.current && trackRef.current && positionRef.current === -300) {
      const w = containerRef.current.clientWidth;
      const centerPos = w / 2 - (2 * step + cardWidth / 2);
      positionRef.current = centerPos;
      trackRef.current.style.transform = `translate3d(${centerPos}px, 0, 0)`;
    }
  }, [isSpinning, step, cardWidth]);

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto select-none ${
        className || ""
      }`}
    >
      {/* Sleek Single CS:GO Style Case Panel — NO DUPLICATE BORDERS */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-[#16181d] shadow-2xl">
        {/* Header bar of Case */}
        <div className="flex items-center justify-between border-b border-stone-800/90 bg-[#121317] px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wider text-stone-200 uppercase">
              Băng Chuyền Lựa Chọn — Tùy Là Được
            </span>
            <span className="hidden sm:inline-block rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
              CS:GO Reel
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng"}
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900/80 px-2.5 py-1 text-[11px] font-medium text-stone-400 hover:text-stone-200 transition-colors focus-visible:outline-2 focus-visible:outline-amber-500"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Âm thanh</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>Tắt tiếng</span>
              </>
            )}
          </button>
        </div>

        {/* Viewport Strip */}
        <div ref={containerRef} className="relative h-[255px] w-full overflow-hidden bg-[#16181d]">
          {/* Laser Pointer Center Needle with top and bottom arrows */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-[2px] -translate-x-1/2 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]">
            {/* Top Pointer Arrow */}
            <div
              className="absolute -left-[6px] top-0 h-3 w-[14px] bg-amber-400"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
            {/* Bottom Pointer Arrow */}
            <div
              className="absolute -left-[6px] bottom-0 h-3 w-[14px] bg-amber-400"
              style={{ clipPath: "polygon(50% 0, 0 100%, 100% 100%)" }}
            />
          </div>

          {/* Left Dark Vignette Fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 sm:w-40 bg-gradient-to-r from-[#16181d] via-[#16181d]/85 to-transparent" />

          {/* Right Dark Vignette Fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 sm:w-40 bg-gradient-to-l from-[#16181d] via-[#16181d]/85 to-transparent" />

          {/* Running Track */}
          <div
            ref={trackRef}
            className="flex items-center h-full absolute top-0 left-0 will-change-transform py-3"
            style={{ gap: `${cardGap}px` }}
          >
            {reelItems.map((dish, idx) => {
              const isWinnerLanded =
                !isSpinning && winningDish && idx === winnerIndex;
              const rarityColor = RARITY_COLORS[dish.rarity] || "#10b981";

              return (
                <div
                  key={`${dish.id}-${idx}`}
                  className={`group relative flex h-[218px] flex-col overflow-hidden rounded-xl bg-[#20232a] transition-all duration-300 shrink-0 select-none ${
                    isWinnerLanded
                      ? "ring-2 ring-amber-400 scale-[1.03] shadow-[0_0_24px_rgba(251,191,36,0.4)] z-10"
                      : "opacity-95 hover:opacity-100"
                  }`}
                  style={{
                    width: `${cardWidth}px`,
                    borderBottom: `4px solid ${rarityColor}`,
                  }}
                >
                  {/* Dish Image */}
                  <div className="relative h-[142px] w-full overflow-hidden bg-[#15171c]">
                    {dish.imageUrl ? (
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        sizes="210px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1e2127] text-stone-600">
                        <Utensils className="h-8 w-8 opacity-30" />
                      </div>
                    )}

                    {/* Subtle Rarity Gradient glow from bottom of image */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to top, ${rarityColor}22, transparent)`,
                      }}
                    />

                    {/* Top Rarity Label */}
                    <div className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase backdrop-blur-xs"
                      style={{ color: rarityColor }}
                    >
                      {dish.rarity.replace("_", " ")}
                    </div>
                  </div>

                  {/* Dish Copy */}
                  <div className="flex flex-1 flex-col justify-between p-3 text-left bg-gradient-to-b from-[#20232a] to-[#191b21]">
                    <div className="flex flex-col">
                      <span className="truncate text-xs font-bold text-stone-100">
                        {dish.name}
                      </span>
                      <span className="truncate text-[10px] text-stone-400">
                        {dish.subtitle || "Món ngon trưa nay"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
                      <span
                        className="text-xs font-extrabold"
                        style={{ color: rarityColor }}
                      >
                        {dish.price > 0 ? formatVND(dish.price) : "Miễn phí"}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        Quyết định
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
