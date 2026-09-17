import { db } from "@/db";
import { dishes, categories } from "@/db/schema";
import { DishesCatalog } from "@/components/public/DishesCatalog";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kho Lựa Chọn — Tùy Là Được",
  description:
    "Khám phá thư viện lựa chọn đa dạng từ Ăn uống, Giải trí, Hoạt động dã ngoại đến Việc cần làm mỗi ngày.",
};

export const revalidate = 60;

export default async function DishesPage() {
  const allDishes = await db
    .select()
    .from(dishes)
    .where(eq(dishes.isActive, true));

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
          Kho Lựa Chọn Đa Năng
        </h1>
        <p className="text-xs text-stone-600 sm:text-sm dark:text-stone-300">
          Toàn bộ danh mục ăn uống, vui chơi và việc cần làm giúp bạn vượt qua mọi cơn phân vân.
        </p>
      </div>

      <DishesCatalog dishes={allDishes} categories={allCategories} />
    </div>
  );
}
