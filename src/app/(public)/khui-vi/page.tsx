import { db } from "@/db";
import { dishes } from "@/db/schema";
import { DishCard } from "@/components/public/DishCard";
import { Sparkles, Gift } from "lucide-react";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khui Vị — Mở hộp bí mật món ăn hôm nay",
  description: "Bất ngờ với món ăn độc đáo được khui vị ngẫu nhiên dành riêng cho bạn.",
};

export const revalidate = 60;

export default async function KhuiViPage() {
  const allDishes = await db
    .select()
    .from(dishes)
    .where(eq(dishes.isActive, true));

  // Select a rare or secret dish
  const mysteryDish =
    allDishes.find((d) => d.rarity === "DAC_BIET" || d.rarity === "TOI_MAT") ||
    allDishes[0];

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-xs font-semibold text-orange-700 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300">
        <Gift className="h-4 w-4" />
        <span>Hộp quà ẩm thực</span>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
        Khui Vị Bất Ngờ
      </h1>
      <p className="mt-2 max-w-md text-xs text-stone-500 sm:text-sm dark:text-stone-400">
        Dành riêng cho những ngày bạn muốn nuông chiều bản thân bằng một món cực phẩm.
      </p>

      <div className="mt-10 w-full max-w-md">
        {mysteryDish && (
          <div className="flex flex-col items-center">
            <DishCard dish={mysteryDish} />
          </div>
        )}
      </div>
    </div>
  );
}
