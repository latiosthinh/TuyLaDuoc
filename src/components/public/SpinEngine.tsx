"use client";

import React, { useState, useMemo, useTransition, useCallback, useEffect } from "react";
import type { Dish, Category } from "@/db/schema";
import type { PickerMode } from "@/components/pickers/types";
import { PickerContainer } from "@/components/pickers/PickerContainer";
import { CustomListModal } from "./CustomListModal";
import { WinnerModal } from "./WinnerModal";
import { useCustomList } from "@/hooks/use-custom-list";
import { recordSpinAction } from "@/app/actions/spin";
import { Dices, Sparkles, AlertCircle, RefreshCw, Box, Compass, Utensils, Film, Activity, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinEngineProps {
  dishes: Dish[];
  categories: Category[];
  initialSpinCount: number;
}

const DOMAIN_OPTIONS = [
  { id: "all", label: "Tất cả chủ đề", icon: Compass },
  { id: "food", label: "Ăn uống & Cà phê", icon: Utensils },
  { id: "entertainment", label: "Giải trí & Phim", icon: Film },
  { id: "activity", label: "Hoạt động & Đi chơi", icon: Activity },
  { id: "task", label: "Việc cần làm", icon: CheckSquare },
];

const BUDGET_TIERS = [
  { label: "Mọi mức giá", max: Infinity },
  { label: "Miễn phí (0đ)", max: 0 },
  { label: "≤ 50k", max: 50000 },
  { label: "≤ 100k", max: 100000 },
  { label: "> 100k", max: -1 },
];

const STORAGE_MODE_KEY = "tuyladuoc_picker_mode";

export function SpinEngine({
  dishes,
  categories,
  initialSpinCount,
}: SpinEngineProps) {
  const [activeMode, setActiveMode] = useState<PickerMode>("cards");
  const [usePersonalPool, setUsePersonalPool] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [budgetIndex, setBudgetIndex] = useState<number>(0);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(initialSpinCount);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const { customDishes, addDish, removeDish } = useCustomList();

  // Load saved picker mode from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY) as PickerMode | null;
      if (saved && ["cards", "slot", "random"].includes(saved)) {
        setActiveMode(saved);
      }
    } catch {}
  }, []);

  const handleModeChange = (mode: PickerMode) => {
    setActiveMode(mode);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, mode);
    } catch {}
  };

  const candidatePool = usePersonalPool ? customDishes : dishes;

  // Filter available sub-categories matching chosen domain
  const availableCategories = useMemo(() => {
    if (selectedDomain === "all") return categories;
    return categories.filter((c) => c.domain === selectedDomain);
  }, [categories, selectedDomain]);

  const candidates = useMemo(() => {
    return candidatePool.filter((dish) => {
      // 1. Domain filter
      if (selectedDomain !== "all") {
        const dishDomain = dish.domain || "food";
        if (dishDomain !== selectedDomain) return false;
      }

      // 2. Sub-category filter
      if (selectedCategory !== "all") {
        if (dish.categoryId !== selectedCategory) return false;
      }

      // 3. Budget / Cost filter
      const currentTier = BUDGET_TIERS[budgetIndex];
      if (currentTier.max === 0) {
        if (dish.price !== 0) return false;
      } else if (currentTier.max === -1) {
        if (dish.price <= 100000) return false;
      } else if (currentTier.max !== Infinity) {
        if (dish.price > currentTier.max) return false;
      }

      return true;
    });
  }, [candidatePool, selectedDomain, selectedCategory, budgetIndex]);

  // Master spin handler
  const handleSpin = useCallback(() => {
    if (candidates.length === 0 || isSpinning) return;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const chosenWinner = candidates[randomIndex];

    setIsSpinning(true);
    setSelectedDish(chosenWinner);
    setIsWinnerModalOpen(false);

    startTransition(async () => {
      const updated = await recordSpinAction();
      if (updated > 0) setSpinCount(updated);
    });

    const duration = activeMode === "slot" ? 5300 : 3300;

    setTimeout(() => {
      setIsSpinning(false);
      setIsWinnerModalOpen(true);
    }, duration);
  }, [candidates, isSpinning, activeMode]);

  const handleManualSelect = (dish: Dish) => {
    setSelectedDish(dish);
    setIsWinnerModalOpen(true);
  };

  return (
    <div className="flex w-full max-w-6xl flex-col items-center mx-auto px-2 sm:px-4">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isSpinning
          ? "Đang quay chọn ngẫu nhiên..."
          : selectedDish
          ? `Lựa chọn đã trúng: ${selectedDish.name}. ${selectedDish.subtitle || ""}`
          : ""}
      </div>

      {/* Top action bar: Counter & Custom list button */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-4 py-1.5 text-xs font-bold text-orange-800 shadow-2xs dark:border-orange-900/60 dark:bg-orange-950/50 dark:text-orange-300">
          <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
          <span>Lượt quay toàn trạm:</span>
          <span className="font-mono text-sm font-extrabold text-orange-600 dark:text-orange-400">
            {spinCount.toLocaleString("vi-VN")}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label={`Mở hòm lựa chọn của tôi, hiện có ${customDishes.length} mục`}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-bold text-stone-700 shadow-2xs transition-all hover:border-orange-300 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-orange-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-orange-900"
        >
          <Box className="h-4 w-4 text-orange-500" aria-hidden="true" />
          <span>Hòm của tôi ({customDishes.length})</span>
        </button>
      </div>

      {/* Pool Toggle: Global vs Personal */}
      {customDishes.length > 0 && (
        <div
          role="radiogroup"
          aria-label="Nguồn dữ liệu lựa chọn"
          className="mb-6 inline-flex rounded-xl border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-900"
        >
          <button
            type="button"
            role="radio"
            aria-checked={!usePersonalPool}
            onClick={() => setUsePersonalPool(false)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
              !usePersonalPool
                ? "bg-white text-orange-600 shadow-2xs dark:bg-stone-800 dark:text-orange-400"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            )}
          >
            Tất cả lựa chọn mẫu
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={usePersonalPool}
            onClick={() => setUsePersonalPool(true)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
              usePersonalPool
                ? "bg-white text-orange-600 shadow-2xs dark:bg-stone-800 dark:text-orange-400"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            )}
          >
            Hòm riêng ({customDishes.length})
          </button>
        </div>
      )}

      {/* Active Interactive Stage */}
      <div className="mb-10 w-full">
        <PickerContainer
          activeMode={activeMode}
          onModeChange={handleModeChange}
          candidates={candidates}
          selectedDish={selectedDish}
          isSpinning={isSpinning}
          onSelectDish={handleManualSelect}
          onRespin={handleSpin}
        />
      </div>

      {/* Filter Control Box */}
      <div className="w-full max-w-4xl rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm dark:border-stone-800/80 dark:bg-stone-900 sm:p-8">
        {/* 1. Domain Selector */}
        <fieldset className="flex flex-col gap-2.5">
          <legend id="domain-heading" className="text-left text-xs font-bold text-stone-800 dark:text-stone-200">
            1. Bạn đang phân vân điều gì?
          </legend>
          <div
            role="radiogroup"
            aria-labelledby="domain-heading"
            className="flex flex-wrap gap-2"
          >
            {DOMAIN_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedDomain === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setSelectedDomain(opt.id);
                    setSelectedCategory("all");
                    setSelectedDish(null);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
                    isSelected
                      ? "bg-orange-600 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 2. Sub-categories (if available) */}
        {availableCategories.length > 0 && selectedDomain !== "all" && (
          <fieldset className="mt-5 flex flex-col gap-2.5">
            <legend id="category-heading" className="text-left text-xs font-bold text-stone-800 dark:text-stone-200">
              Phân loại chi tiết
            </legend>
            <div
              role="radiogroup"
              aria-labelledby="category-heading"
              className="flex flex-wrap gap-2"
            >
              <button
                type="button"
                role="radio"
                aria-checked={selectedCategory === "all"}
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedDish(null);
                }}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
                  selectedCategory === "all"
                    ? "border border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300"
                )}
              >
                Tất cả {availableCategories.length} mục
              </button>
              {availableCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedCategory === c.id}
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setSelectedDish(null);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
                    selectedCategory === c.id
                      ? "border border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* 3. Budget / Cost Chips */}
        <fieldset className="mt-6 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <legend id="budget-heading" className="text-left text-xs font-bold text-stone-800 dark:text-stone-200">
              2. Chi phí / Ngân sách dự kiến
            </legend>
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
              {candidates.length} lựa chọn phù hợp
            </span>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="budget-heading"
            className="flex flex-wrap gap-2"
          >
            {BUDGET_TIERS.map((tier, idx) => (
              <button
                key={tier.label}
                type="button"
                role="radio"
                aria-checked={budgetIndex === idx}
                onClick={() => {
                  setBudgetIndex(idx);
                  setSelectedDish(null);
                }}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
                  budgetIndex === idx
                    ? "border border-orange-500 bg-orange-50 text-orange-700 shadow-2xs dark:bg-orange-950/60 dark:text-orange-300"
                    : "border border-stone-200/80 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800/80 dark:text-stone-300"
                )}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Big Action CTA Button */}
        <div className="mt-8">
          {candidates.length > 0 ? (
            <button
              type="button"
              disabled={isSpinning}
              aria-busy={isSpinning}
              onClick={handleSpin}
              className={cn(
                "group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 py-4 text-base font-extrabold text-white shadow-lg transition-all hover:from-orange-700 hover:to-amber-700 hover:shadow-xl active:scale-98 focus-visible:outline-2 focus-visible:outline-orange-500",
                isSpinning && "cursor-not-allowed opacity-80"
              )}
            >
              {isSpinning ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" aria-hidden="true" />
                  <span>
                    {activeMode === "cards"
                      ? "Đang xào bài tìm kết quả..."
                      : activeMode === "slot"
                      ? "Đang quay băng chuyền..."
                      : "Đang chọn ngẫu nhiên..."}
                  </span>
                </>
              ) : (
                <>
                  <Dices className="h-5 w-5 transition-transform group-hover:rotate-180" aria-hidden="true" />
                  <span>
                    {activeMode === "cards"
                      ? "XÀO BÀI CHỌN NGAY"
                      : activeMode === "slot"
                      ? "QUAY VÒNG QUYẾT ĐỊNH"
                      : "CHỌN NGẪU NHIÊN NGAY"}
                  </span>
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 p-6 text-center dark:border-stone-700">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
                <AlertCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <span>Không có lựa chọn nào phù hợp với bộ lọc hiện tại.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDomain("all");
                  setSelectedCategory("all");
                  setBudgetIndex(0);
                }}
                className="mt-2 text-xs font-bold text-orange-600 underline hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-orange-500 rounded-xs dark:text-orange-400"
              >
                Đặt lại toàn bộ bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Winner Modal celebrating chosen decision */}
      <WinnerModal
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        dish={selectedDish}
        onRespin={handleSpin}
      />

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
