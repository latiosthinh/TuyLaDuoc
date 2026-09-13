import { db } from "@/db";
import { fortunes } from "@/db/schema";
import { FortuneSlip } from "@/components/public/FortuneSlip";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quẻ Trưa — Xem vận may và món ăn may mắn hôm nay",
  description:
    "Lắc ống quẻ trưa để nhận lời khuyên thú vị và tìm món ăn mang lại nhiều năng lượng may mắn nhất.",
};

export const revalidate = 60;

export default async function QueTruaPage() {
  const allFortunes = await db
    .select()
    .from(fortunes)
    .where(eq(fortunes.isActive, true));

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
        Quẻ Trưa May Mắn
      </h1>
      <p className="mt-2 max-w-md text-xs text-stone-500 sm:text-sm dark:text-stone-400">
        Mỗi ngày một quẻ bói vui, tiếp thêm năng lượng tích cực cho buổi làm việc chiều.
      </p>

      <div className="mt-10 w-full flex justify-center">
        <FortuneSlip fortunes={allFortunes} />
      </div>
    </div>
  );
}
