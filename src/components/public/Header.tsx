"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollText, BookOpen, Sparkles, Box } from "lucide-react";
import { LogoIcon } from "./Logo";
import { useCustomList } from "@/hooks/use-custom-list";
import { CustomListModal } from "./CustomListModal";
import { SEED_CATEGORIES } from "@/db/seed-data";
import type { Category } from "@/db/schema";

interface HeaderProps {
  initialSpinCount?: number;
  categories?: Category[];
}

const DEFAULT_CATEGORIES: Category[] = SEED_CATEGORIES.map((c) => ({
  id: c.id,
  name: c.name,
  tab: c.tab,
  domain: c.domain ?? "food",
  sortOrder: c.sortOrder,
}));

export function Header({
  initialSpinCount = 0,
  categories = DEFAULT_CATEGORIES,
}: HeaderProps) {
  const [spinCount, setSpinCount] = useState(initialSpinCount);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const { customDishes, addDish, removeDish } = useCustomList();

  useEffect(() => {
    const handleSpinIncrement = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") {
        setSpinCount(detail);
      } else {
        setSpinCount((prev) => prev + 1);
      }
    };

    window.addEventListener("spin-count-increment", handleSpinIncrement);
    return () => {
      window.removeEventListener("spin-count-increment", handleSpinIncrement);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 lg:px-8 sm:py-2.5">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-orange-500"
            aria-label="Trang chủ Tùy Là Được"
          >
            <div className="transition-transform duration-200 group-hover:scale-105 shadow-sm rounded-xl">
              <LogoIcon className="h-8 w-8 sm:h-9 sm:w-9" size={36} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-stone-900 sm:text-base dark:text-stone-100">
                  Tùy Là Được
                </span>
                <span className="rounded-full bg-orange-100 px-1.5 py-0.2 text-[9px] font-semibold text-orange-700 dark:bg-orange-950/80 dark:text-orange-400">
                  v2.0
                </span>
              </div>
              <span className="hidden text-[10px] text-stone-500 sm:block dark:text-stone-400">
                Vòng quay quyết định mọi thứ
              </span>
            </div>
          </Link>

          {/* Center / Right stats and actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Lượt quay toàn trạm */}
            <div className="hidden xs:inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50/90 px-2.5 py-1 text-[11px] font-bold text-orange-800 shadow-2xs sm:px-3 sm:text-xs dark:border-orange-900/60 dark:bg-orange-950/50 dark:text-orange-300">
              <Sparkles className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
              <span className="hidden md:inline">Lượt quay toàn trạm:</span>
              <span className="md:hidden">Quay:</span>
              <span className="font-mono font-extrabold text-orange-600 dark:text-orange-400">
                {spinCount.toLocaleString("vi-VN")}
              </span>
            </div>

            {/* Hòm của tôi */}
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              aria-label={`Mở hòm lựa chọn của tôi, hiện có ${customDishes.length} mục`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-bold text-stone-700 shadow-2xs transition-all hover:border-orange-300 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-orange-500 sm:px-3 sm:py-1.5 sm:text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-orange-900"
            >
              <Box className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
              <span>Hòm của tôi ({customDishes.length})</span>
            </button>

            {/* Navigation links */}
            <nav className="flex items-center gap-1 sm:gap-2" aria-label="Điều hướng chính">
              <Link
                href="/dishes"
                className="inline-flex items-center gap-1 rounded-xl border border-stone-200/80 bg-white/80 px-2 py-1 text-[11px] font-semibold text-stone-700 shadow-2xs transition-colors hover:border-orange-200 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-orange-500 sm:px-2.5 sm:py-1.5 sm:text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-orange-900 dark:hover:text-orange-400"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Kho lựa chọn</span>
              </Link>
              <Link
                href="/que-trua"
                className="inline-flex items-center gap-1 rounded-xl border border-stone-200/60 bg-white/70 px-2 py-1 text-[11px] font-semibold text-stone-700 transition-colors hover:border-amber-300 hover:text-amber-600 focus-visible:outline-2 focus-visible:outline-amber-500 sm:px-2.5 sm:py-1.5 sm:text-xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-amber-900 dark:hover:text-amber-400"
              >
                <ScrollText className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Quẻ may mắn</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Global Custom List Modal */}
      <CustomListModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        customDishes={customDishes}
        categories={categories}
        onAddDish={addDish}
        onRemoveDish={removeDish}
      />
    </>
  );
}
