import { getActiveDishes } from "@/lib/data";
import { DishCard } from "@/components/public/DishCard";
import { Sparkles, HeartHandshake } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duyên Vị — Khám phá cặp đôi hương vị hoàn hảo",
  description: "Cặp đôi món ăn kết hợp hoàn hảo cho bữa trưa thịnh soạn.",
};

export const revalidate = 60;

export default async function DuyenViPage() {
  const allDishes = await getActiveDishes();

  // Pick two complementary dishes (e.g. main + drink or main + snack)
  const mainDish = allDishes.find((d) => d.categoryId === "com-xoi") || allDishes[0];
  const drinkDish = allDishes.find((d) => d.categoryId === "do-uong") || allDishes[1];

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-xs font-semibold text-orange-700 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300">
        <HeartHandshake className="h-4 w-4" />
        <span>Hương vị hòa quyện</span>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
        Duyên Vị Trưa Nay
      </h1>
      <p className="mt-2 max-w-md text-xs text-stone-500 sm:text-sm dark:text-stone-400">
        Cặp đôi ẩm thực được tính toán chuẩn xác cho bữa trưa đủ chất và sảng khoái.
      </p>

      <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        {mainDish && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-orange-600">Món Chính No Bụng</span>
            <DishCard dish={mainDish} />
          </div>
        )}
        {drinkDish && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-orange-600">Thức Uống Giải Nhiệt</span>
            <DishCard dish={drinkDish} />
          </div>
        )}
      </div>
    </div>
  );
}
