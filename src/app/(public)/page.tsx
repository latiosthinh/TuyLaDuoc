import { getActiveDishes, getActiveCategories } from "@/lib/data";
import { getGlobalSpinCount } from "@/app/actions/spin";
import { SpinEngine } from "@/components/public/SpinEngine";

export const revalidate = 60; // cached for visitors

export default async function HomePage() {
  const [allDishes, allCategories, initialSpinCount] = await Promise.all([
    getActiveDishes(),
    getActiveCategories(),
    getGlobalSpinCount(),
  ]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="sr-only">Tùy Là Được — Vòng quay quyết định mọi thứ</h1>
      <div className="w-full flex justify-center">
        <SpinEngine
          dishes={allDishes}
          categories={allCategories}
          initialSpinCount={initialSpinCount}
        />
      </div>
    </div>
  );
}
