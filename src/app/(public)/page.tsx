import { db } from "@/db";
import { dishes, categories } from "@/db/schema";
import { getGlobalSpinCount } from "@/app/actions/spin";
import { SpinEngine } from "@/components/public/SpinEngine";
import { eq } from "drizzle-orm";

export const revalidate = 60; // cached for visitors

export default async function HomePage() {
  const allDishes = await db
    .select()
    .from(dishes)
    .where(eq(dishes.isActive, true));

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder);

  const initialSpinCount = await getGlobalSpinCount();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-stone-100">
        Trưa Nay Ăn Gì?
      </h1>
      <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-300">
        Lọc theo sở thích, ngân sách và khám phá món trưa tuyệt hảo chỉ sau 1 lượt quay.
      </p>

      <div className="mt-8 w-full flex justify-center">
        <SpinEngine
          dishes={allDishes}
          categories={allCategories}
          initialSpinCount={initialSpinCount}
        />
      </div>
    </div>
  );
}
