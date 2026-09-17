import { db } from "@/db";
import { dishes, categories, counters, fortunes } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sql, eq } from "drizzle-orm";
import { Utensils, FolderTree, ScrollText, Flame, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) redirect("/admin/login");

  const totalDishes = await db.select({ count: sql<number>`count(*)` }).from(dishes);
  const totalCategories = await db.select({ count: sql<number>`count(*)` }).from(categories);
  const totalFortunes = await db.select({ count: sql<number>`count(*)` }).from(fortunes);
  const counterRecord = await db.select().from(counters).where(eq(counters.key, "global_spins")).limit(1);

  const stats = [
    {
      title: "Lượt quay toàn trạm",
      value: (counterRecord[0]?.value ?? 0).toLocaleString("vi-VN"),
      icon: Flame,
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
    },
    {
      title: "Tổng số món ăn",
      value: totalDishes[0]?.count ?? 0,
      icon: Utensils,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Danh mục ẩm thực",
      value: totalCategories[0]?.count ?? 0,
      icon: FolderTree,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Quẻ trưa may mắn",
      value: totalFortunes[0]?.count ?? 0,
      icon: ScrollText,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
          Bảng Điều Khiển Quản Trị
        </h1>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          Thống kê tổng quan và trạng thái hệ thống Trưa Nay Ăn Gì
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {s.title}
                </span>
                <span className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {s.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/dishes"
          className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all hover:border-orange-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Chỉnh sửa Món Ăn
              </span>
              <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-orange-600" />
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Cập nhật giá cả, tên gọi, hình ảnh và phân loại hiển thị.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-orange-600">Vào quản lý →</span>
        </Link>

        <Link
          href="/admin/fortunes"
          className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all hover:border-orange-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Nội Dung Quẻ Trưa
              </span>
              <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-orange-600" />
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Thêm lời khuyên may mắn và chỉ định món ăn mang lộc mỗi ngày.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-orange-600">Vào quản lý →</span>
        </Link>

        <Link
          href="/admin/settings"
          className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all hover:border-orange-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Cài Đặt Hệ Thống
              </span>
              <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-orange-600" />
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Chọn kiểu quay mặc định (Vòng quay, Lật bài, Slot) và tiêu đề SEO.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-orange-600">Vào cài đặt →</span>
        </Link>
      </div>
    </div>
  );
}
