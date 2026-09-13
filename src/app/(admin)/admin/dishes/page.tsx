import { db } from "@/db";
import { dishes, categories } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DishesManager } from "@/components/admin/DishesManager";
import { desc } from "drizzle-orm";

export default async function AdminDishesPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) redirect("/admin/login");

  const allDishes = await db.select().from(dishes).orderBy(desc(dishes.createdAt));
  const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Quản Lý Món Ăn ({allDishes.length})
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Thêm mới, sửa đổi thông tin món ăn, hình ảnh và phân hạng độ hiếm
        </p>
      </div>

      <DishesManager dishes={allDishes} categories={allCategories} />
    </div>
  );
}
