import { db } from "@/db";
import { categories } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOrUpdateCategory } from "@/app/actions/admin-dishes";
import { Plus } from "lucide-react";

export default async function AdminCategoriesPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) redirect("/admin/login");

  const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Danh Mục Món Ăn ({allCategories.length})
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Quản lý các nhóm món ăn và phân loại tab hiển thị trên thanh tìm kiếm
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Category List */}
        <div className="lg:col-span-2 flex flex-col divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
          {allCategories.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {c.name}
                </span>
                <span className="text-[11px] text-stone-400">
                  ID: <code>{c.id}</code> · Tab: <code>{c.tab}</code> · Thứ tự: {c.sortOrder}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Category Form */}
        <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
            Thêm / Cập nhật Danh mục
          </span>
          <form action={createOrUpdateCategory} className="flex flex-col gap-3">
            <input
              type="text"
              name="id"
              required
              placeholder="ID mã danh mục (ví dụ: mon-lau)"
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            />
            <input
              type="text"
              name="name"
              required
              placeholder="Tên danh mục (ví dụ: Lẩu & Nồi đất)"
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            />
            <select
              name="tab"
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            >
              <option value="mon_chinh">Tab: Món chính</option>
              <option value="do_uong">Tab: Đồ uống</option>
              <option value="an_vat">Tab: Ăn vặt</option>
              <option value="mon_nhau">Tab: Món nhậu</option>
            </select>
            <input
              type="number"
              name="sortOrder"
              defaultValue="0"
              placeholder="Thứ tự hiển thị"
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            />
            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span>Lưu danh mục</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
