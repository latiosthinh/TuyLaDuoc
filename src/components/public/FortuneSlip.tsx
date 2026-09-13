"use client";

import React, { useState } from "react";
import type { Fortune } from "@/db/schema";
import { Sparkles, RefreshCw, Utensils } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface FortuneSlipProps {
  fortunes: Fortune[];
}

export function FortuneSlip({ fortunes }: FortuneSlipProps) {
  const [selectedFortune, setSelectedFortune] = useState<Fortune | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = () => {
    if (fortunes.length === 0 || isDrawing) return;
    setIsDrawing(true);
    setSelectedFortune(null);

    setTimeout(() => {
      const random = fortunes[Math.floor(Math.random() * fortunes.length)];
      setSelectedFortune(random);
      setIsDrawing(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Bamboo/Gold Cylinder Drawing Box */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={isDrawing ? { y: [0, -20, 10, -10, 0] } : {}}
          transition={{ duration: 0.6, repeat: isDrawing ? 2 : 0 }}
          className="relative flex h-56 w-36 flex-col items-center justify-end rounded-t-3xl border-4 border-amber-700 bg-gradient-to-b from-amber-600 to-amber-900 p-4 shadow-xl"
        >
          <div className="absolute top-4 text-center">
            <span className="text-[11px] font-black tracking-widest text-amber-200 uppercase">
              Ống Quẻ
            </span>
          </div>

          {/* Bamboo sticks peeking */}
          <div className="flex gap-1.5 pb-6">
            <div className="h-20 w-3 rounded-t-md bg-amber-200" />
            <div className="h-24 w-3 rounded-t-md bg-amber-100" />
            <div className="h-22 w-3 rounded-t-md bg-amber-200" />
          </div>

          <div className="w-full border-t border-amber-500/60 pt-2 text-center text-[10px] font-bold text-amber-300">
            QUẺ TRƯA
          </div>
        </motion.div>

        {/* Draw Trigger Button */}
        <button
          type="button"
          disabled={isDrawing}
          onClick={handleDraw}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-700 hover:shadow-lg active:scale-98"
        >
          {isDrawing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Đang lắc quẻ...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>RÚT QUẺ TRƯA NAY</span>
            </>
          )}
        </button>
      </div>

      {/* Revealed Fortune Card */}
      {selectedFortune && !isDrawing && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-8 w-full max-w-md rounded-2xl border-2 border-amber-400 bg-amber-50/90 p-6 text-stone-900 shadow-xl dark:border-amber-700 dark:bg-stone-900 dark:text-stone-100"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>QUẺ ĐẠI CÁT</span>
          </div>

          <h3 className="mt-4 text-base font-extrabold text-stone-900 sm:text-lg dark:text-stone-100">
            {selectedFortune.text}
          </h3>

          {selectedFortune.advice && (
            <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
              {selectedFortune.advice}
            </p>
          )}

          {selectedFortune.luckyDish && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-white/80 p-2.5 text-xs font-semibold text-orange-700 dark:border-amber-900/60 dark:bg-stone-800 dark:text-orange-400">
              <Utensils className="h-3.5 w-3.5" />
              <span>Món mang lại may mắn: <strong>{selectedFortune.luckyDish}</strong></span>
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDraw}
              className="text-xs font-bold text-orange-600 underline hover:text-orange-700"
            >
              Rút quẻ khác
            </button>
            <span>·</span>
            <Link
              href="/"
              className="text-xs font-bold text-stone-600 hover:text-stone-900 dark:text-stone-300"
            >
              Về trang quay món
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
