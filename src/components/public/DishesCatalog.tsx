"use client";

import React, { useState, useMemo } from "react";
import type { Dish, Category } from "@/db/schema";
import { DishCard } from "./DishCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface DishesCatalogProps {
  dishes: Dish[];
  categories: Category[];
}

export function DishesCatalog({ dishes, categories }: DishesCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

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

        // Category
        if (selectedCategory !== "all" && dish.categoryId !== selectedCategory) {
          return false;
        }

        // Rarity
        if (selectedRarity !== "all" && dish.rarity !== selectedRarity) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return a.name.localeCompare(b.name, "vi");
      });
  }, [dishes, searchTerm, selectedCategory, selectedRarity, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm tên món ăn, hương vị, nguyên liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-stone-200/80 bg-white py-2.5 pr-4 pl-10 text-xs text-stone-800 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:placeholder:text-stone-500"
          />
        </div>

        {/* Sort and Options */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sắp xếp món ăn"
              className="bg-transparent text-xs font-medium focus:outline-none"
            >
              <option value="name">Tên A-Z</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
            selectedCategory === "all"
              ? "bg-orange-600 text-white shadow-2xs"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300"
          )}
        >
          Tất cả ({dishes.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
              selectedCategory === cat.id
                ? "bg-orange-600 text-white shadow-2xs"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of Dishes */}
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
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
            Không tìm thấy món nào phù hợp với từ khóa & bộ lọc.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedRarity("all");
            }}
            className="mt-3 text-xs font-bold text-orange-600 underline hover:text-orange-700"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
