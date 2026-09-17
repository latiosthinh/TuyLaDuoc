"use client";

import React, { useState, useMemo } from "react";
import type { Fortune, Dish, Category } from "@/db/schema";
import { ScrollText, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { DishCard } from "./DishCard";
import { sounds } from "@/lib/audio";

interface FortuneSlipProps {
  fortunes: Fortune[];
  dishes?: Dish[];
  categories?: Category[];
}

export function FortuneSlip({ fortunes, dishes = [], categories = [] }: FortuneSlipProps) {
  const [selectedFortune, setSelectedFortune] = useState<Fortune | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = () => {
    if (fortunes.length === 0 || isDrawing) return;
    setIsDrawing(true);
    setSelectedFortune(null);
    sounds.playShuffle();

    setTimeout(() => {
      const random = fortunes[Math.floor(Math.random() * fortunes.length)];
      setSelectedFortune(random);
      setIsDrawing(false);
      sounds.playWin();
    }, 1200);
  };

  // Find corresponding Dish object for the lucky dish named in fortune
  const matchedDish = useMemo<Dish | null>(() => {
    if (!selectedFortune || dishes.length === 0) return null;

    if (selectedFortune.luckyDish) {
      const query = selectedFortune.luckyDish.trim().toLowerCase();
      const direct = dishes.find(
        (d) =>
          d.name.toLowerCase() === query ||
          d.name.toLowerCase().includes(query) ||
          query.includes(d.name.toLowerCase())
      );
      if (direct) return direct;
    }

    // Fallback: pick a dish deterministically from the fortune id hash
    const hash = selectedFortune.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return dishes[hash % dishes.length];
  }, [selectedFortune, dishes]);

  const categoryName = useMemo(() => {
    if (!matchedDish || categories.length === 0) return undefined;
    return categories.find((c) => c.id === matchedDish.categoryId)?.name;
  }, [matchedDish, categories]);

  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center text-center">
      {/* Bamboo/Gold Cylinder Drawing Box */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={isDrawing ? { y: [0, -22, 12, -12, 0], rotate: [0, -3, 3, -2, 0] } : {}}
          transition={{ duration: 0.6, repeat: isDrawing ? 2 : 0 }}
          className="relative flex h-56 w-36 flex-col items-center justify-end rounded-t-3xl border-4 border-amber-800 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-950 p-4 shadow-2xl"
          aria-hidden="true"
        >
          <div className="absolute top-4 flex items-center gap-1 text-center">
            <ScrollText className="h-3.5 w-3.5 text-amber-200" />
            <span className="text-[11px] font-black tracking-widest text-amber-200 uppercase">
              Ống Quẻ
            </span>
          </div>

          {/* Bamboo sticks peeking */}
          <div className="flex gap-1.5 pb-6">
            <div className="h-20 w-3 rounded-t-md bg-amber-200 shadow-inner" />
            <div className="h-26 w-3 rounded-t-md bg-amber-100 shadow-md" />
            <div className="h-22 w-3 rounded-t-md bg-amber-200 shadow-inner" />
          </div>

          <div className="w-full border-t border-amber-500/60 pt-2 text-center text-[10px] font-extrabold tracking-wider text-amber-300 uppercase">
            QUẺ MAY MẮN
          </div>
        </motion.div>

        {/* Draw Trigger Button */}
        <button
          type="button"
          disabled={isDrawing}
          aria-busy={isDrawing}
          onClick={handleDraw}
          aria-label="Rút quẻ may mắn hôm nay"
          className="mt-6 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 hover:from-amber-700 hover:to-orange-700 hover:shadow-xl active:scale-98 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          {isDrawing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Đang lắc ống quẻ...</span>
            </>
          ) : (
            <>
              <ScrollText className="h-4 w-4 text-amber-200" aria-hidden="true" />
              <span>LẮC ỐNG RÚT QUẺ NGAY</span>
            </>
          )}
        </button>
      </div>

      {/* Revealed Fortune Slip & Product Card */}
      {selectedFortune && !isDrawing && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-8 flex w-full flex-col items-center gap-6"
        >
          {/* Fortune Text Slip Header */}
          <div className="w-full rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-orange-50/60 p-6 text-stone-900 shadow-xl dark:border-amber-700/80 dark:from-stone-900 dark:to-stone-850 dark:text-stone-100">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black tracking-wider text-amber-700 uppercase dark:text-amber-400">
              <ScrollText className="h-4 w-4" />
              <span>QUẺ ĐẠI CÁT HÔM NAY</span>
            </div>

            <h3 className="mt-4 text-xl font-black text-stone-900 sm:text-2xl dark:text-stone-100 leading-snug">
              &ldquo;{selectedFortune.text}&rdquo;
            </h3>

            {selectedFortune.advice && (
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                {selectedFortune.advice}
              </p>
            )}

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-white/90 px-3.5 py-1 text-xs font-bold text-amber-800 shadow-2xs dark:border-amber-800 dark:bg-stone-800 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Món mang lại năng lượng: {matchedDish ? matchedDish.name : selectedFortune.luckyDish}</span>
            </div>
          </div>

          {/* Detailed Product Card of the lucky dish */}
          {matchedDish && (
            <div className="w-full max-w-sm text-left">
              <div className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Gợi ý thưởng thức hôm nay
              </div>
              <DishCard
                dish={matchedDish}
                categoryName={categoryName}
                isResult={true}
                onRespin={handleDraw}
              />
            </div>
          )}

          {/* Action links */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={handleDraw}
              className="text-orange-600 underline hover:text-orange-700 dark:text-orange-400 focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              Lắc quẻ khác
            </button>
            <span className="text-stone-400">·</span>
            <Link
              href="/"
              className="text-stone-600 hover:text-stone-900 underline dark:text-stone-300 dark:hover:text-stone-100 focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              Về bàn quay lựa chọn
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
