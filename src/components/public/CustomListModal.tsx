"use client";

import React, { useState } from "react";
import type { Dish, Category } from "@/db/schema";
import { formatVND } from "@/lib/utils";
import { Plus, Trash2, X, Box } from "lucide-react";

interface CustomListModalProps {
  isOpen: boolean;
  onClose: () => void;
  customDishes: Dish[];
  categories: Category[];
  onAddDish: (dish: Omit<Dish, "id" | "createdAt" | "isActive" | "dietTags">) => void;
  onRemoveDish: (id: string) => void;
}

export function CustomListModal({
  isOpen,
  onClose,
  customDishes,
  categories,
  onAddDish,
  onRemoveDish,
}: CustomListModalProps) {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("50000");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "bun-pho-mi");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddDish({
      name: name.trim(),
      subtitle: subtitle.trim() || "Món ăn yêu thích",
      price: parseInt(price, 10) || 50000,
      categoryId,
      rarity: "QUOC_DAN",
      imageUrl: null,
    });

    setName("");
    setSubtitle("");
    setPrice("50000");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-orange-600" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Hòm Của Tôi ({customDishes.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-stone-200/80 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/40">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Thêm món vào danh sách riêng
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="text"
                required
                placeholder="Tên món (ví dụ: Bún chả Hàng Than)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900"
              />
              <input
                type="text"
                placeholder="Ghi chú (ví dụ: Quán quen gần cty)"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900"
              />
              <input
                type="number"
                step="5000"
                min="0"
                placeholder="Giá (VND)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900"
              />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Lưu món mới</span>
            </button>
          </form>

          {/* List of custom items */}
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-xs font-semibold text-stone-500">
              Danh sách món đã lưu (lưu trên máy của bạn, không cần đăng nhập):
            </span>
            {customDishes.length > 0 ? (
              <div className="flex flex-col divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
                {customDishes.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {d.name}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {d.subtitle} · {formatVND(d.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveDish(d.id)}
                      className="rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-400 dark:border-stone-700">
                Chưa có món nào trong hòm. Hãy thêm các quán quen của bạn ở trên!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 text-right dark:border-stone-800 dark:bg-stone-950">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
