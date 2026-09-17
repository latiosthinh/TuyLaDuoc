"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [price, setPrice] = useState("0");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "bun-pho-mi");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    setTimeout(() => closeButtonRef.current?.focus(), 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedCat = categories.find((c) => c.id === categoryId);
    const domain = selectedCat?.domain || "food";

    onAddDish({
      name: name.trim(),
      subtitle: subtitle.trim() || "Lựa chọn cá nhân",
      price: parseInt(price, 10) || 0,
      categoryId,
      domain,
      rarity: "QUOC_DAN",
      imageUrl: null,
    });

    setName("");
    setSubtitle("");
    setPrice("0");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-orange-600" aria-hidden="true" />
            <h2 id="custom-modal-title" className="text-base font-bold text-stone-900 dark:text-stone-100">
              Hòm Lựa Chọn Của Tôi ({customDishes.length})
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại danh sách riêng"
            className="rounded-lg p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-2 focus-visible:outline-orange-500 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-stone-200/80 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/40">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Thêm lựa chọn mới vào danh sách
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="custom-item-name" className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  Tên lựa chọn *
                </label>
                <input
                  id="custom-item-name"
                  type="text"
                  required
                  placeholder="Xem phim, Phở bò, Đạp xe..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="custom-item-sub" className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  Ghi chú
                </label>
                <input
                  id="custom-item-sub"
                  type="text"
                  placeholder="Kèm bắp rang, Quán gần nhà..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="custom-item-price" className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  Chi phí (0 nếu miễn phí)
                </label>
                <input
                  id="custom-item-price"
                  type="number"
                  step="5000"
                  min="0"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="custom-item-cat" className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  Danh mục
                </label>
                <select
                  id="custom-item-cat"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Lưu vào hòm riêng</span>
            </button>
          </form>

          {/* List of custom items */}
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Lựa chọn đã lưu (lưu an toàn trên trình duyệt, không cần đăng nhập):
            </span>
            {customDishes.length > 0 ? (
              <div className="flex flex-col divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
                {customDishes.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {d.name}
                      </span>
                      <span className="text-[11px] text-stone-600 dark:text-stone-400">
                        {d.subtitle} · {d.price > 0 ? formatVND(d.price) : "Miễn phí"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveDish(d.id)}
                      aria-label={`Xoá ${d.name} khỏi danh sách riêng`}
                      className="rounded-md p-1.5 text-stone-500 hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-red-500 dark:text-stone-400 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-500 dark:border-stone-700 dark:text-stone-400">
                Chưa có mục nào trong hòm. Hãy thêm những điều bạn hay phân vân ở trên!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 text-right dark:border-stone-800 dark:bg-stone-950">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-orange-500 dark:bg-stone-100 dark:text-stone-900"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
