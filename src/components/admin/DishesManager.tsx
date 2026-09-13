"use client";

import React, { useState } from "react";
import type { Dish, Category } from "@/db/schema";
import { formatVND } from "@/lib/utils";
import { RarityBadge } from "@/components/public/RarityBadge";
import { createOrUpdateDish, deleteDish, toggleDishActive } from "@/app/actions/admin-dishes";
import { Plus, Trash2, Edit, CheckCircle2, XCircle, Search } from "lucide-react";

interface DishesManagerProps {
  dishes: Dish[];
  categories: Category[];
}

export function DishesManager({ dishes, categories }: DishesManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = dishes.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingDish(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dish: Dish) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action and Search bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm theo tên món..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2 pr-4 pl-9 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-800 dark:bg-stone-900"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm món mới</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-500 dark:border-stone-800 dark:bg-stone-800/60">
            <tr>
              <th className="px-4 py-3">Tên Món</th>
              <th className="px-4 py-3">Danh Mục</th>
              <th className="px-4 py-3">Giá Tiền</th>
              <th className="px-4 py-3">Độ Hiếm</th>
              <th className="px-4 py-3">Trạng Thái</th>
              <th className="px-4 py-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {d.name}
                    </span>
                    <span className="text-[10px] text-stone-400">{d.subtitle}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                    {categories.find((c) => c.id === d.categoryId)?.name || d.categoryId}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-orange-600">
                  {formatVND(d.price)}
                </td>
                <td className="px-4 py-3">
                  <RarityBadge rarity={d.rarity} />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleDishActive(d.id, d.isActive)}
                    className="flex items-center gap-1 text-[11px] font-medium"
                  >
                    {d.isActive ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Hiện</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-stone-400">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Ẩn</span>
                      </span>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(d)}
                      className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn xóa "${d.name}"?`)) {
                          deleteDish(d.id);
                        }
                      }}
                      className="rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {editingDish ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
            </h3>

            <form
              action={async (formData) => {
                await createOrUpdateDish(formData);
                setIsModalOpen(false);
              }}
              className="mt-4 flex flex-col gap-3"
            >
              <input type="hidden" name="id" defaultValue={editingDish?.id || ""} />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    Tên món ăn
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingDish?.name || ""}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    Mô tả / Phụ đề
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    defaultValue={editingDish?.subtitle || ""}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    Giá tiền (VND)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    name="price"
                    required
                    defaultValue={editingDish?.price || 50000}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    Danh mục
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={editingDish?.categoryId || categories[0]?.id}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    Độ hiếm
                  </label>
                  <select
                    name="rarity"
                    defaultValue={editingDish?.rarity || "QUOC_DAN"}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  >
                    <option value="QUOC_DAN">Quốc Dân</option>
                    <option value="HIEM">Hiếm</option>
                    <option value="CUC_PHAM">Cực Phẩm</option>
                    <option value="TOI_MAT">Tối Mật</option>
                    <option value="DAC_BIET">★ Đặc Biệt</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-stone-600">
                    URL Ảnh (Unsplash / Vercel Blob)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={editingDish?.imageUrl || ""}
                    placeholder="https://..."
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  defaultChecked={editingDish ? editingDish.isActive : true}
                  className="rounded border-stone-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-stone-700">
                  Hiển thị món ăn này cho người dùng
                </label>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
