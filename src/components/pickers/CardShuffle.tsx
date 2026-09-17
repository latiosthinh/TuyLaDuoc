"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { PickerModeProps } from "./types";
import type { Dish } from "@/db/schema";
import { RarityBadge } from "@/components/public/RarityBadge";
import { formatVND } from "@/lib/utils";
import { sounds } from "@/lib/audio";
import {
  X,
  Heart,
  RotateCcw,
  Sparkles,
  MapPin,
  Utensils,
  Dices,
  Info,
  ExternalLink,
} from "lucide-react";

interface TinderCardItemProps {
  dish: Dish;
  isTop: boolean;
  isSecond: boolean;
  isThird: boolean;
  onSwipeRight: (dish: Dish) => void;
  onSwipeLeft: () => void;
}

function TinderCardItem({
  dish,
  isTop,
  isSecond,
  isThird,
  onSwipeRight,
  onSwipeLeft,
}: TinderCardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-16, 0, 16]);

  // Visual stamps opacity driven by drag
  const likeOpacity = useTransform(x, [25, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-25, -110], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 400) {
      sounds.playSwipe("right");
      sounds.playWin();
      onSwipeRight(dish);
    } else if (offset < -100 || velocity < -400) {
      sounds.playSwipe("left");
      onSwipeLeft();
    }
  };

  const handleManualFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playFlip();
    setIsFlipped(!isFlipped);
  };

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    dish.name + " gần đây"
  )}`;
  const grabFoodUrl = `https://food.grab.com/vn/vi/restaurants?${new URLSearchParams(
    { search: dish.name }
  )}`;

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : isSecond ? 3 : isThird ? -3 : 0,
        zIndex: isTop ? 10 : isSecond ? 5 : 1,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={
        isTop
          ? { scale: 0.95, opacity: 0, y: 15 }
          : { scale: 0.9, opacity: 0.5, y: 24 }
      }
      animate={{
        scale: isTop ? 1 : isSecond ? 0.95 : 0.9,
        y: isTop ? 0 : isSecond ? 14 : 26,
        opacity: isTop ? 1 : isSecond ? 0.88 : 0.5,
        rotate: isTop ? 0 : isSecond ? 3 : -3,
      }}
      exit={{
        x: x.get() >= 0 ? 650 : -650,
        rotate: x.get() >= 0 ? 30 : -30,
        opacity: 0,
        scale: 0.85,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      transition={{ duration: 0.28 }}
      className={`absolute inset-0 select-none ${
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      {/* 3D Card Container (Manual Flip via Info button) */}
      <div className="relative h-full w-full [perspective:1200px]">
        <motion.div
          className="relative h-full w-full rounded-3xl [transform-style:preserve-3d] shadow-2xl transition-all"
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.175, 0.885, 0.32, 1.15],
          }}
        >
          {/* ================= CARD FRONT (Face A) ================= */}
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white [backface-visibility:hidden] dark:border-stone-800 dark:bg-stone-900">
            {/* Stamp LIKE (CHỐT ĐƠN) */}
            {isTop && (
              <motion.div
                style={{ opacity: likeOpacity }}
                className="pointer-events-none absolute top-8 left-6 z-30 -rotate-15 rounded-2xl border-4 border-emerald-500 bg-emerald-500/20 px-4 py-1.5 shadow-lg backdrop-blur-xs"
              >
                <span className="text-xl font-black tracking-widest text-emerald-500 uppercase">
                  CHỐT ĐƠN!
                </span>
              </motion.div>
            )}

            {/* Stamp NOPE (BỎ QUA) */}
            {isTop && (
              <motion.div
                style={{ opacity: nopeOpacity }}
                className="pointer-events-none absolute top-8 right-6 z-30 rotate-15 rounded-2xl border-4 border-rose-500 bg-rose-500/20 px-4 py-1.5 shadow-lg backdrop-blur-xs"
              >
                <span className="text-xl font-black tracking-widest text-rose-500 uppercase">
                  BỎ QUA
                </span>
              </motion.div>
            )}

            {/* Dish Image Section */}
            <div className="relative h-[65%] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
              {dish.imageUrl ? (
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  priority={isTop}
                  sizes="(max-width: 768px) 340px, 420px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 text-orange-400 dark:from-stone-800 dark:to-stone-900">
                  <Utensils className="h-16 w-16 opacity-30" />
                </div>
              )}

              {/* Gradient Vignette for readable overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between">
                <span className="rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                  Gợi ý hôm nay
                </span>
                <RarityBadge rarity={dish.rarity} />
              </div>

              {/* Price & Name on Image */}
              <div className="absolute bottom-4 left-4 z-10 flex flex-col text-left">
                <span className="text-[10px] font-bold text-orange-200 uppercase tracking-wider drop-shadow-sm">
                  Chi Phí Dự Kiến
                </span>
                <span className="text-2xl font-black text-white drop-shadow-md">
                  {dish.price > 0 ? formatVND(dish.price) : "Miễn phí"}
                </span>
              </div>

              {/* Info flip toggle button */}
              <button
                type="button"
                onClick={handleManualFlip}
                aria-label="Lật thẻ xem chi tiết lựa chọn"
                className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-white"
                title="Lật thẻ xem chi tiết"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Bottom Card Copy */}
            <div className="flex flex-1 flex-col justify-between p-5 text-left bg-white dark:bg-stone-900">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Món ngon hấp dẫn</span>
                </div>

                <h3 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-stone-900 line-clamp-1 dark:text-stone-100">
                  {dish.name}
                </h3>

                {dish.subtitle && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                    {dish.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500 dark:text-stone-400 dark:border-stone-800">
                <span>← Vuốt trái: Bỏ qua</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Vuốt phải: Chốt đơn →
                </span>
              </div>
            </div>
          </div>

          {/* ================= CARD BACK (Face B - Details Flipped) ================= */}
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-orange-300 bg-gradient-to-b from-stone-900 via-stone-900 to-black p-6 text-left text-white shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-extrabold text-orange-400 uppercase tracking-widest">
                  Chi Tiết Món Ăn
                </span>
                <RarityBadge rarity={dish.rarity} />
              </div>

              <h3 className="mt-4 text-2xl font-black text-white">
                {dish.name}
              </h3>
              <p className="mt-1 text-xs text-orange-300 font-semibold">
                Giá: {formatVND(dish.price)}
              </p>

              <div className="mt-4 rounded-xl bg-stone-800/80 p-3.5 border border-stone-700/60">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Hương vị & Gợi ý
                </span>
                <p className="text-xs leading-relaxed text-stone-200">
                  {dish.subtitle || "Món ăn tuyệt vời mang đậm hương vị Việt Nam, cung cấp đầy đủ năng lượng cho buổi chiều làm việc."}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-stone-800 py-3 text-xs font-bold text-stone-100 hover:bg-stone-700 transition-colors focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span>Tìm quán gần bạn trên Google Maps</span>
                  <ExternalLink className="h-3 w-3 text-stone-400" />
                </a>

                <a
                  href={grabFoodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600/90 py-3 text-xs font-bold text-white hover:bg-emerald-600 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Tìm món này trên GrabFood</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="border-t border-stone-800 pt-3 text-center">
              <button
                type="button"
                onClick={handleManualFlip}
                className="text-xs font-bold text-orange-400 underline hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-orange-400"
              >
                ← Lật lại mặt trước
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Authentic Casino Riffle Card Shuffle Stage
 * - Stage 1 (0-400ms): Clean Deck Split — deck divides into left & right packets
 * - Stage 2 (400-2100ms): Fast Riffle Cascade — cards rapidly alternate sliding into center stack
 * - Stage 3 (2100-2500ms): Square Up — left & right packets snap together with crisp tap bounce
 * - Stage 4 (2500-3200ms): Deal / Present — winning card smoothly rises up with golden highlight
 */
function CardShuffleStage({
  candidates,
  selectedDish,
}: {
  candidates: Dish[];
  selectedDish: Dish | null;
}) {
  const [phase, setPhase] = useState<"split" | "riffle" | "square" | "deal">("split");
  const [activeDish, setActiveDish] = useState<Dish | null>(
    selectedDish || candidates[0] || null
  );

  useEffect(() => {
    // 0ms: Split deck
    setPhase("split");
    sounds.playSwipe("left");

    // 400ms: Riffle cascade
    const timerRiffle = setTimeout(() => {
      setPhase("riffle");
      sounds.playShuffle();
    }, 400);

    // Dynamic dish preview cycling during riffle
    let previewIndex = 0;
    const cycleInterval = setInterval(() => {
      if (candidates.length > 0) {
        previewIndex = (previewIndex + 1) % candidates.length;
        setActiveDish(candidates[previewIndex]);
      }
    }, 110);

    // 2100ms: Square up & tap alignment
    const timerSquare = setTimeout(() => {
      clearInterval(cycleInterval);
      setPhase("square");
      sounds.playCardSnap(1.2);
      if (selectedDish) setActiveDish(selectedDish);
    }, 2100);

    // 2500ms: Deal & elevate winning card
    const timerDeal = setTimeout(() => {
      setPhase("deal");
      sounds.playWin();
      if (selectedDish) setActiveDish(selectedDish);
    }, 2500);

    return () => {
      clearTimeout(timerRiffle);
      clearInterval(cycleInterval);
      clearTimeout(timerSquare);
      clearTimeout(timerDeal);
    };
  }, [candidates, selectedDish]);

  const displayDish = selectedDish && (phase === "square" || phase === "deal")
    ? selectedDish
    : activeDish || selectedDish;

  return (
    <div className="relative h-[500px] w-[320px] sm:h-[540px] sm:w-[370px] md:w-[380px] [perspective:1400px]">
      {/* Ambient warm glow behind deck */}
      <div className="absolute inset-4 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

      {/* ================= LEFT SPLIT PACKET ================= */}
      <motion.div
        initial={{ x: 0, rotate: 0, scale: 0.94 }}
        animate={
          phase === "split"
            ? { x: -95, rotate: -12, scale: 0.92, opacity: 1 }
            : phase === "riffle"
            ? {
                x: [-95, -108, -90, -100],
                rotate: [-12, -14, -10, -12],
                scale: 0.92,
                opacity: 0.9,
              }
            : { x: 0, rotate: 0, scale: 0.95, opacity: 0 }
        }
        transition={{
          duration: phase === "riffle" ? 0.32 : 0.38,
          repeat: phase === "riffle" ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-3xl border-2 border-stone-300/80 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300 shadow-2xl dark:border-stone-700 dark:from-stone-800 dark:via-stone-850 dark:to-stone-900 pointer-events-none z-10 overflow-hidden"
      >
        <div className="absolute inset-4 rounded-2xl border border-dashed border-stone-300/80 dark:border-stone-700 flex flex-col items-center justify-center gap-2 opacity-50">
          <div className="h-16 w-16 rounded-full border-2 border-orange-400/50 flex items-center justify-center bg-white/40 dark:bg-stone-800/40 shadow-inner">
            <Utensils className="h-8 w-8 text-orange-500" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-300">
            Trộn bộ thẻ
          </span>
        </div>
      </motion.div>

      {/* ================= RIGHT SPLIT PACKET ================= */}
      <motion.div
        initial={{ x: 0, rotate: 0, scale: 0.94 }}
        animate={
          phase === "split"
            ? { x: 95, rotate: 12, scale: 0.92, opacity: 1 }
            : phase === "riffle"
            ? {
                x: [95, 108, 90, 100],
                rotate: [12, 14, 10, 12],
                scale: 0.92,
                opacity: 0.9,
              }
            : { x: 0, rotate: 0, scale: 0.95, opacity: 0 }
        }
        transition={{
          duration: phase === "riffle" ? 0.32 : 0.38,
          repeat: phase === "riffle" ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-3xl border-2 border-orange-200/80 bg-gradient-to-bl from-orange-50 via-amber-100/50 to-stone-200 shadow-2xl dark:border-orange-950/60 dark:from-stone-800 dark:via-stone-850 dark:to-stone-900 pointer-events-none z-10 overflow-hidden"
      >
        <div className="absolute inset-4 rounded-2xl border border-dashed border-orange-300/70 dark:border-stone-700 flex flex-col items-center justify-center gap-2 opacity-50">
          <div className="h-16 w-16 rounded-full border-2 border-orange-400/50 flex items-center justify-center bg-white/40 dark:bg-stone-800/40 shadow-inner">
            <Sparkles className="h-8 w-8 text-orange-500" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-300">
            Xào thẻ món
          </span>
        </div>
      </motion.div>

      {/* ================= FLYING RIFFLE CARD (LEFT TO CENTER) ================= */}
      {phase === "riffle" && (
        <motion.div
          animate={{
            x: [-95, 0],
            y: [-16, 0],
            rotate: [-12, -2],
            scale: [0.92, 1],
            opacity: [0.7, 1],
          }}
          transition={{
            duration: 0.18,
            repeat: Infinity,
            repeatDelay: 0.12,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-3xl border border-orange-300 bg-white/95 shadow-xl dark:bg-stone-800 pointer-events-none z-20"
        />
      )}

      {/* ================= FLYING RIFFLE CARD (RIGHT TO CENTER) ================= */}
      {phase === "riffle" && (
        <motion.div
          animate={{
            x: [95, 0],
            y: [-16, 0],
            rotate: [12, 2],
            scale: [0.92, 1],
            opacity: [0.7, 1],
          }}
          transition={{
            duration: 0.18,
            repeat: Infinity,
            repeatDelay: 0.12,
            delay: 0.08,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-3xl border border-amber-300 bg-white/95 shadow-xl dark:bg-stone-800 pointer-events-none z-20"
        />
      )}

      {/* ================= ACTIVE CENTER CARD (PREVIEW & DEAL) ================= */}
      <motion.div
        animate={
          phase === "split"
            ? { scale: 0.88, y: 0, opacity: 0 }
            : phase === "riffle"
            ? {
                scale: [0.96, 1.01, 0.96],
                y: [0, -5, 0],
                rotate: [0, -1.2, 1.2, 0],
                opacity: 1,
              }
            : phase === "square"
            ? {
                scale: [0.96, 1],
                y: [0, -16, 0],
                rotate: 0,
                opacity: 1,
              }
            : {
                // DEAL: Winning card smoothly elevates and shines
                scale: 1.05,
                y: -24,
                rotate: 0,
                opacity: 1,
              }
        }
        transition={{
          duration:
            phase === "riffle"
              ? 0.22
              : phase === "square"
              ? 0.35
              : phase === "deal"
              ? 0.55
              : 0.3,
          repeat: phase === "riffle" ? Infinity : 0,
          ease: phase === "deal" ? [0.175, 0.885, 0.32, 1.15] : "easeInOut",
        }}
        className={`absolute inset-0 z-30 flex flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl dark:bg-stone-900 transition-shadow ${
          phase === "deal"
            ? "border-2 border-orange-500 shadow-[0_25px_65px_rgba(249,115,22,0.45)] ring-4 ring-orange-400/50"
            : "border-stone-200/90 dark:border-stone-800 shadow-xl"
        }`}
      >
        {displayDish && (
          <>
            {/* Dish Image Section */}
            <div className="relative h-[65%] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
              {displayDish.imageUrl ? (
                <Image
                  src={displayDish.imageUrl}
                  alt={displayDish.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 340px, 420px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 text-orange-400 dark:from-stone-800 dark:to-stone-900">
                  <Utensils className="h-16 w-16 opacity-30" />
                </div>
              )}

              {/* Gradient Vignette for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md transition-colors ${
                    phase === "deal"
                      ? "bg-orange-600/90 shadow-md animate-pulse"
                      : "bg-black/55"
                  }`}
                >
                  {phase === "deal" ? "✨ MÓN ĐƯỢC CHỌN" : "Đang xào bài..."}
                </span>
                <RarityBadge rarity={displayDish.rarity} />
              </div>

              {/* Price on Image */}
              <div className="absolute bottom-4 left-4 z-10 flex flex-col text-left">
                <span className="text-[10px] font-bold text-orange-200 uppercase tracking-wider drop-shadow-sm">
                  Giá Dự Kiến
                </span>
                <span className="text-2xl font-black text-white drop-shadow-md">
                  {formatVND(displayDish.price)}
                </span>
              </div>
            </div>

            {/* Bottom Card Copy */}
            <div className="flex flex-1 flex-col justify-between p-5 text-left bg-white dark:bg-stone-900">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{phase === "deal" ? "Gợi ý chuẩn gu hôm nay" : "Đang trộn thẻ..."}</span>
                </div>

                <h3 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-stone-900 line-clamp-1 dark:text-stone-100">
                  {displayDish.name}
                </h3>

                {displayDish.subtitle && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                    {displayDish.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-600 dark:text-stone-300 dark:border-stone-800">
                <span>Bộ bài lựa chọn</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {phase === "deal" ? "Đã sẵn sàng! 🎉" : "Đang xào ngẫu nhiên..."}
                </span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export function CardShuffle({
  candidates,
  selectedDish,
  isSpinning,
  onSelectDish,
  onRespin,
  className,
}: PickerModeProps) {
  const [deck, setDeck] = useState<Dish[]>(candidates);
  const [history, setHistory] = useState<Dish[]>([]);

  // Keep deck in sync when candidates change (e.g. user changes filters)
  useEffect(() => {
    setDeck(candidates);
  }, [candidates]);

  // When spin finishes, make sure the winner is on top of the deck
  useEffect(() => {
    if (!isSpinning && selectedDish) {
      setDeck((prev) => {
        const pool = prev.length > 0 ? prev : candidates;
        const without = pool.filter((d) => d.id !== selectedDish.id);
        return [selectedDish, ...without];
      });
    }
  }, [isSpinning, selectedDish, candidates]);

  const activeDeck = deck.length > 0 ? deck : candidates;
  const topDish = activeDeck[0];
  const secondDish = activeDeck[1];
  const thirdDish = activeDeck[2];

  const handleSwipeLeft = useCallback(() => {
    if (activeDeck.length === 0 || isSpinning) return;
    const current = activeDeck[0];
    setHistory((prev) => [...prev, current]);
    setDeck(() => {
      const next = activeDeck.slice(1);
      return [...next, current];
    });
  }, [activeDeck, isSpinning]);

  const handleSwipeRight = useCallback(
    (chosen: Dish) => {
      if (isSpinning) return;
      if (onSelectDish) {
        onSelectDish(chosen);
      }
    },
    [isSpinning, onSelectDish]
  );

  const handleRewind = () => {
    if (history.length === 0 || isSpinning) return;
    sounds.playSwipe("right");
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setDeck((prev) => {
      const pool = prev.length > 0 ? prev : candidates;
      return [last, ...pool.filter((d) => d.id !== last.id)];
    });
  };

  if (!topDish && !selectedDish) {
    return (
      <div className="flex h-96 w-80 items-center justify-center rounded-3xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-400 dark:border-stone-700">
        Không có món ăn nào phù hợp với bộ lọc hiện tại.
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center select-none ${
        className || ""
      }`}
    >
      {/* Active Stage: Card Shuffle Animation during spin, or Interactive Tinder Stack */}
      {isSpinning ? (
        <CardShuffleStage candidates={candidates} selectedDish={selectedDish} />
      ) : (
        <div className="relative h-[500px] w-[320px] sm:h-[540px] sm:w-[370px] md:w-[380px]">
          {thirdDish && (
            <TinderCardItem
              key={`third-${thirdDish.id}`}
              dish={thirdDish}
              isTop={false}
              isSecond={false}
              isThird={true}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
            />
          )}

          {secondDish && (
            <TinderCardItem
              key={`second-${secondDish.id}`}
              dish={secondDish}
              isTop={false}
              isSecond={true}
              isThird={false}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
            />
          )}

          <AnimatePresence mode="popLayout">
            {topDish && (
              <TinderCardItem
                key={`top-${topDish.id}`}
                dish={topDish}
                isTop={true}
                isSecond={false}
                isThird={false}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Tinder Action Buttons Bar */}
      <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
        {/* Rewind Button */}
        <button
          type="button"
          onClick={handleRewind}
          disabled={history.length === 0 || isSpinning}
          aria-label="Xem lại lựa chọn trước"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-md transition-all hover:scale-110 hover:border-amber-300 hover:text-amber-600 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
          title="Quay lại lựa chọn trước"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Dislike / Swipe Left (X) */}
        <button
          type="button"
          onClick={handleSwipeLeft}
          disabled={isSpinning}
          aria-label="Bỏ qua (Đổi lựa chọn)"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-200 bg-white text-rose-500 shadow-lg transition-all hover:scale-110 hover:bg-rose-50 hover:border-rose-400 active:scale-95 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-rose-500"
          title="Bỏ qua (Vuốt trái)"
        >
          <X className="h-7 w-7 stroke-[2.5]" aria-hidden="true" />
        </button>

        {/* Super Spin / Random Shuffle Button */}
        <button
          type="button"
          onClick={onRespin}
          disabled={isSpinning}
          aria-label="Xào bài ngẫu nhiên"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/50 active:scale-95 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-orange-500"
          title="Xào bài ngẫu nhiên"
        >
          <Dices className={`h-8 w-8 ${isSpinning ? "animate-spin" : ""}`} aria-hidden="true" />
        </button>

        {/* Like / Swipe Right (Heart / Pick) */}
        <button
          type="button"
          onClick={() => topDish && handleSwipeRight(topDish)}
          disabled={isSpinning || !topDish}
          aria-label="Chốt lựa chọn này"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-200 bg-white text-emerald-600 shadow-lg transition-all hover:scale-110 hover:bg-emerald-50 hover:border-emerald-400 active:scale-95 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-emerald-500"
          title="Chốt lựa chọn này (Vuốt phải)"
        >
          <Heart className="h-7 w-7 stroke-[2.5] fill-emerald-500/20" aria-hidden="true" />
        </button>

        {/* Search */}
        {topDish && (
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(topDish.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Tìm kiếm thông tin về ${topDish.name} (mở tab mới)`}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-md transition-all hover:scale-110 hover:border-orange-300 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-orange-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
            title="Khám phá chi tiết"
          >
            <MapPin className="h-4 w-4 text-orange-500" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
