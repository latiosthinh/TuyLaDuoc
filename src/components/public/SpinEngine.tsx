"use client";

import React, { useState, useMemo, useTransition } from "react";
import type { Dish, Category } from "@/db/schema";
import { DishCard } from "./DishCard";
import { PickerContainer } from "@/components/pickers/PickerContainer";
import { recordSpinAction } from "@/app/actions/spin";
import { Dices, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinEngineProps {
  dishes: Dish[];
  categories: Category[];
  initialSpinCount: number;
}

const BUDGET_TIERS = [
  { label: "Tất cả", max: Infinity },
  { label: "≤ 35k", max: 35000 },
  { label: "≤ 50k", max: 50000 },
  { label: "≤ 75k", max: 75000 },
  { label: "≤ 100k", max: 100000 },
  { label: "> 100k", max: -1 },
];

export function SpinEngine({
  dishes,
  categories,
  initialSpinCount,
}: SpinEngineProps) {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [budgetIndex, setBudgetIndex] = useState<number>(0);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(initialSpinCount);
  const [, startTransition] = useTransition();

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const tabOptions = [
    { id: "all", label: "Tất cả món" },
    { id: "mon_chinh", label: "Món chính" },
    { id: "do_uong", label: "Đồ uống" },
    { id: "an_vat", label: "Ăn vặt" },
    { id: "mon_nhau", label: "Món nhậu" },
  ];

  const candidates = useMemo(() => {
    return dishes.filter((dish) => {
      if (selectedTab !== "all") {
        const cat = categories.find((c) => c.id === dish.categoryId);
        if (!cat || cat.tab !== selectedTab) return false;
      }

      const currentTier = BUDGET_TIERS[budgetIndex];
      if (currentTier.max === -1) {
        if (dish.price <= 100000) return false;
      } else if (currentTier.max !== Infinity) {
        if (dish.price > currentTier.max) return false;
      }

      return true;
    });
  }, [dishes, categories, selectedTab, budgetIndex]);

  const handleSpin = () => {
    if (candidates.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedDish(null);

    startTransition(async () => {
      const updated = await recordSpinAction();
      if (updated > 0) setSpinCount(updated);
    });

    // 2.2s animation duration matching deceleration physics
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setSelectedDish(candidates[randomIndex]);
      setIsSpinning(false);
    }, 2200);
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* Global Spin Counter Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-3.5 py-1 text-xs font-semibold text-orange-800 shadow-2xs dark:border-orange-900/60 dark:bg-orange-950/50 dark:text-orange-300">
        <Sparkles className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
        <span>Lượt quay toàn trạm:</span>
        <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
          {spinCount.toLocaleString("vi-VN")}
        </span>
      </div>

      {/* 4 Switchable Picker Modes Stage */}
      <div className="mb-8 w-full max-w-xl">
        <PickerContainer
          candidates={candidates}
          selectedDish={selectedDish}
          isSpinning={isSpinning}
        />
      </div>

      {/* Filter Control Box */}
      <div className="w-full max-w-xl rounded-2xl border border-stone-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-xs dark:border-stone-800/80 dark:bg-stone-900/90 sm:p-6">
        {/* Category Tabs */}
        <div className="flex flex-col gap-2">
          <label className="text-left text-xs font-bold text-stone-700 dark:text-stone-300">
            1. Bạn muốn ăn gì trưa nay?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedTab(tab.id);
                  setSelectedDish(null);
                }}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                  selectedTab === tab.id
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Chips */}
        <div className="mt-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-left text-xs font-bold text-stone-700 dark:text-stone-300">
              2. Ngân sách dự kiến
            </label>
            <span className="text-[11px] text-stone-400">
              {candidates.length} món phù hợp
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_TIERS.map((tier, idx) => (
              <button
                key={tier.label}
                type="button"
                onClick={() => {
                  setBudgetIndex(idx);
                  setSelectedDish(null);
                }}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                  budgetIndex === idx
                    ? "border border-orange-500 bg-orange-50 text-orange-700 font-semibold dark:bg-orange-950/60 dark:text-orange-300"
                    : "border border-stone-200/80 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800/80 dark:text-stone-300"
                )}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {candidates.length > 0 ? (
            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpin}
              className={cn(
                "group relative flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-700 hover:shadow-lg active:scale-98",
                isSpinning && "cursor-not-allowed opacity-80"
              )}
            >
              {isSpinning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Đang quay chọn món...</span>
                </>
              ) : (
                <>
                  <Dices className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  <span>QUAY CHỌN MÓN NGAY</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 p-4 text-center dark:border-stone-700">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Không có món nào phù hợp với bộ lọc hiện tại.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedTab("all");
                  setBudgetIndex(0);
                }}
                className="mt-2 text-xs font-bold text-orange-600 underline hover:text-orange-700 dark:text-orange-400"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Result Card Presentation */}
      <div className="mt-8 w-full max-w-md">
        {selectedDish && !isSpinning && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              🎉 Trưa nay ăn món này nhé!
            </div>
            <DishCard
              dish={selectedDish}
              categoryName={categoryMap.get(selectedDish.categoryId)}
              onRespin={handleSpin}
              isResult={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
