"use server";

import { db } from "@/db";
import { dishes, categories } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createOrUpdateDish(formData: FormData) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error("Unauthorized");

  const id = (formData.get("id") as string) || `dish-${Date.now()}`;
  const name = formData.get("name") as string;
  const subtitle = formData.get("subtitle") as string;
  const price = parseInt(formData.get("price") as string, 10) || 50000;
  const categoryId = formData.get("categoryId") as string;
  const rarity = (formData.get("rarity") as any) || "QUOC_DAN";
  const domain = (formData.get("domain") as string) || "food";
  const imageUrl = formData.get("imageUrl") as string;
  const isActive = formData.get("isActive") === "on";

  await db
    .insert(dishes)
    .values({
      id,
      name,
      subtitle,
      price,
      categoryId,
      domain,
      rarity,
      imageUrl: imageUrl || null,
      isActive,
      dietTags: "[]",
    })
    .onConflictDoUpdate({
      target: dishes.id,
      set: {
        name,
        subtitle,
        price,
        categoryId,
        domain,
        rarity,
        imageUrl: imageUrl || null,
        isActive,
      },
    });

  revalidatePath("/");
  revalidatePath("/dishes");
  revalidatePath("/admin/dishes");
}

export async function deleteDish(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(dishes).where(eq(dishes.id, id));
  revalidatePath("/");
  revalidatePath("/dishes");
  revalidatePath("/admin/dishes");
}

export async function toggleDishActive(id: string, currentStatus: boolean) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error("Unauthorized");

  await db
    .update(dishes)
    .set({ isActive: !currentStatus })
    .where(eq(dishes.id, id));

  revalidatePath("/");
  revalidatePath("/dishes");
  revalidatePath("/admin/dishes");
}

export async function createOrUpdateCategory(formData: FormData) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const tab = (formData.get("tab") as any) || "mon_chinh";
  const domain = (formData.get("domain") as string) || "food";
  const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;

  await db
    .insert(categories)
    .values({
      id,
      name,
      tab,
      domain,
      sortOrder,
    })
    .onConflictDoUpdate({
      target: categories.id,
      set: { name, tab, domain, sortOrder },
    });

  revalidatePath("/");
  revalidatePath("/dishes");
  revalidatePath("/admin/categories");
}
