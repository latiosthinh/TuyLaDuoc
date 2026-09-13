"use client";

import React, { useState, useMemo, useTransition } from "react";
import type { Dish, Category } from "@/db/schema";
import { DishCard } from "./DishCard";
import { PickerContainer } from "@/components/pickers/PickerContainer";
import { CustomListModal } from "./CustomListModal";
import { useCustomList } from "@/hooks/use-custom-list";
import { recordSpinAction } from "@/app/actions/spin";
import { Dices, Sparkles, AlertCircle, RefreshCw, Box } from "lucide-react";
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
  const [usePersonalPool, setUsePersonalPool] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [budgetIndex, setBudgetIndex] = useState<number>(0);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(initialSpinCount);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const { customDishes, addDish, removeDish } = useCustomList();

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

  const candidatePool = usePersonalPool ? customDishes : dishes;

  const candidates = useMemo(() => {
    return candidatePool.filter((dish) => {
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
  }, [candidatePool, categories, selectedTab, budgetIndex]);

  const handleSpin = () => {
    if (candidates.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedDish(null);

    startTransition(async () => {
      const updated = await recordSpinAction();
      if (updated > 0) setSpinCount(updated);
    });

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setSelectedDish(candidates[randomIndex]);
      setIsSpinning(false);
    }, 2200);
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* Top action bar: Counter & Custom list button */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-4 py-1.5 text-xs font-bold text-orange-800 shadow-2xs dark:border-orange-900/60 dark:bg-orange-950/50 dark:text-orange-300">
          <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span>Lượt quay toàn trạm:</span>
          <span className="font-mono text-sm font-extrabold text-orange-600 dark:text-orange-400">
            {spinCount.toLocaleString("vi-VN")}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-bold text-stone-700 shadow-2xs transition-all hover:border-orange-300 hover:text-orange-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-orange-900"
        >
          <Box className="h-4 w-4 text-orange-500" />
          <span>Hòm của tôi ({customDishes.length})</span>
        </button>
      </div>

      {/* Pool Toggle: Global vs Personal */}
      {customDishes.length > 0 && (
        <div className="mb-6 inline-flex rounded-xl border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-900">
          <button
            type="button"
            onClick={() => setUsePersonalPool(false)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
              !usePersonalPool
                ? "bg-white text-orange-600 shadow-2xs dark:bg-stone-800 dark:text-orange-400"
                : "text-stone-500 hover:text-stone-800 dark:text-stone-400"
            )}
          >
            Món toàn hệ thống
          </button>
          <button
            type="button"
            onClick={() => setUsePersonalPool(true)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all",
              usePersonalPool
                ? "bg-white text-orange-600 shadow-2xs dark:bg-stone-800 dark:text-orange-400"
                : "text-stone-500 hover:text-stone-800 dark:text-stone-400"
            )}
          >
            Hòm riêng ({customDishes.length})
          </button>
        </div>
      )}

      {/* Spacious Picker Modes Stage (Expanded for desktop dance space) */}
      <div className="mb-10 w-full max-w-5xl">
        <PickerContainer
          candidates={candidates}
          selectedDish={selectedDish}
          isSpinning={isSpinning}
          onSelectDish={(dish) => setSelectedDish(dish)}
          onRespin={handleSpin}
        />
      </div>

      {/* Filter Control Box (Widened to max-w-3xl) */}
      <div className="w-full max-w-3xl rounded-3xl border border-stone-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs dark:border-stone-800/80 dark:bg-stone-900/95 sm:p-8">
        {/* Category Tabs */}
        <div className="flex flex-col gap-2.5">
          <label className="text-left text-xs font-bold text-stone-700 dark:text-stone-300">
            1. Bạn muốn ăn gì trưa nay?
          </label>
          <div className="flex flex-wrap gap-2">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedTab(tab.id);
                  setSelectedDish(null);
                }}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold transition-all",
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
        <div className="mt-6 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-left text-xs font-bold text-stone-700 dark:text-stone-300">
              2. Ngân sách dự kiến
            </label>
            <span className="text-xs font-medium text-stone-400">
              {candidates.length} món phù hợp
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {BUDGET_TIERS.map((tier, idx) => (
              <button
                key={tier.label}
                type="button"
                onClick={() => {
                  setBudgetIndex(idx);
                  setSelectedDish(null);
                }}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold transition-all",
                  budgetIndex === idx
                    ? "border border-orange-500 bg-orange-50 text-orange-700 shadow-2xs dark:bg-orange-950/60 dark:text-orange-300"
                    : "border border-stone-200/80 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800/80 dark:text-stone-300"
                )}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          {candidates.length > 0 ? (
            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpin}
              className={cn(
                "group relative flex w-full items-center justify-center gap-2.5 rounded-2xl bg-orange-600 py-4 text-base font-extrabold text-white shadow-lg transition-all hover:bg-orange-700 hover:shadow-xl active:scale-98",
                isSpinning && "cursor-not-allowed opacity-80"
              )}
            >
              {isSpinning ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Đang quay chọn món ngon trưa nay...</span>
                </>
              ) : (
                <>
                  <Dices className="h-5 w-5 transition-transform group-hover:rotate-180" />
                  <span>QUAY CHỌN MÓN NGAY</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 p-6 text-center dark:border-stone-700">
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
            <div className="mb-2.5 text-center text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">
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

      {/* Modal Custom List */}
      <CustomListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customDishes={customDishes}
        categories={categories}
        onAddDish={addDish}
        onRemoveDish={removeDish}
      />
    </div>
  );
}
