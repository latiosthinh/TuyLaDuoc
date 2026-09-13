import { db } from "@/db";
import { dishes, categories } from "@/db/schema";
import { DishesCatalog } from "@/components/public/DishesCatalog";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kho Tiếp Tế — Thư viện món ăn Việt Nam",
  description:
    "Khám phá danh mục hơn 60+ món ăn trưa đặc sắc, từ bún phở cơm tấm đến salad thanh đạm.",
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
          Kho Tiếp Tế Món Trưa
        </h1>
        <p className="text-xs text-stone-500 sm:text-sm dark:text-stone-400">
          Toàn bộ danh sách món ăn được chuẩn bị sẵn sàng cho bữa trưa của bạn.
        </p>
      </div>

      <DishesCatalog dishes={allDishes} categories={allCategories} />
    </div>
  );
}
