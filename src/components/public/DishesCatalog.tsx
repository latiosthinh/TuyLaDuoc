"use client";

import React, { useState, useMemo } from "react";
import type { Dish, Category } from "@/db/schema";
import { DishCard } from "./DishCard";
import { Search, SlidersHorizontal, Compass, Utensils, Film, Activity, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface DishesCatalogProps {
  dishes: Dish[];
  categories: Category[];
}

const DOMAIN_FILTERS = [
  { id: "all", label: "Tất cả", icon: Compass },
  { id: "food", label: "Ăn uống", icon: Utensils },
  { id: "entertainment", label: "Giải trí", icon: Film },
  { id: "activity", label: "Hoạt động", icon: Activity },
  { id: "task", label: "Việc cần làm", icon: CheckSquare },
];

export function DishesCatalog({ dishes, categories }: DishesCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const availableCategories = useMemo(() => {
    if (selectedDomain === "all") return categories;
    return categories.filter((c) => c.domain === selectedDomain);
  }, [categories, selectedDomain]);

  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => {
        // Search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = dish.name.toLowerCase().includes(term);
          const matchSub = dish.subtitle?.toLowerCase().includes(term);
          if (!matchName && !matchSub) return false;
        }

        // Domain filter
        if (selectedDomain !== "all") {
          const d = dish.domain || "food";
          if (d !== selectedDomain) return false;
        }

        // Category filter
        if (selectedCategory !== "all" && dish.categoryId !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return a.name.localeCompare(b.name, "vi");
      });
  }, [dishes, searchTerm, selectedDomain, selectedCategory, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <label htmlFor="catalog-search" className="sr-only">
            Tìm kiếm lựa chọn
          </label>
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            placeholder="Tìm tên lựa chọn, sở thích, hoạt động..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pr-4 pl-10 text-xs text-stone-900 placeholder:text-stone-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:placeholder:text-stone-400"
          />
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
            <label htmlFor="catalog-sort" className="sr-only">
              Sắp xếp danh sách
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-medium focus:outline-none"
            >
              <option value="name">Tên A-Z</option>
              <option value="price-asc">Chi phí tăng dần</option>
              <option value="price-desc">Chi phí giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Domain Pills */}
      <fieldset className="flex flex-col gap-1.5">
        <legend className="sr-only">Lọc theo chủ đề</legend>
        <div
          role="radiogroup"
          aria-label="Lọc theo chủ đề"
          className="flex flex-wrap items-center gap-1.5"
        >
          {DOMAIN_FILTERS.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedDomain === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setSelectedDomain(f.id);
                  setSelectedCategory("all");
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
                  isSelected
                    ? "bg-orange-600 text-white shadow-2xs"
                    : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Category Pills */}
      {availableCategories.length > 0 && (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="sr-only">Lọc theo danh mục</legend>
          <div
            role="radiogroup"
            aria-label="Lọc theo phân loại"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
                selectedCategory === "all"
                  ? "border border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
              )}
            >
              Tất cả phân loại
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="radio"
                aria-checked={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-orange-500",
                  selectedCategory === cat.id
                    ? "border border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Grid of Choices */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              categoryName={categoryMap.get(dish.categoryId)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            Không tìm thấy lựa chọn nào phù hợp với từ khóa & bộ lọc.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedDomain("all");
              setSelectedCategory("all");
            }}
            className="mt-3 text-xs font-bold text-orange-600 underline hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-orange-500 rounded-xs dark:text-orange-400"
          >
            Xóa tìm kiếm & Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}