import { db } from "@/db";
import { fortunes, dishes, categories } from "@/db/schema";
import { FortuneSlip } from "@/components/public/FortuneSlip";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quẻ May Mắn — Xem vận may và món ngon hôm nay",
  description:
    "Lắc ống quẻ để nhận lời khuyên thú vị và tìm món ăn mang lại nhiều năng lượng may mắn nhất.",
};

export const revalidate = 60;

export default async function QueTruaPage() {
  const allFortunes = await db
    .select()
    .from(fortunes)
    .where(eq(fortunes.isActive, true));

  const allDishes = await db
    .select()
    .from(dishes)
    .where(eq(dishes.isActive, true));

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
        Quẻ May Mắn Hôm Nay
      </h1>
      <p className="mt-2 max-w-md text-xs text-stone-500 sm:text-sm dark:text-stone-400">
        Mỗi ngày một quẻ bói vui, tiếp thêm năng lượng tích cực và chỉ dẫn món ngon hợp mệnh.
      </p>

      <div className="mt-10 w-full flex justify-center">
        <FortuneSlip
          fortunes={allFortunes}
          dishes={allDishes}
          categories={allCategories}
        />
      </div>
    </div>
  );
}
