import { db } from "@/db";
import {
  dishes,
  categories,
  fortunes,
  type Dish,
  type Category,
  type Fortune,
} from "@/db/schema";
import {
  SEED_CATEGORIES,
  SEED_DISHES,
  SEED_FORTUNES,
} from "@/db/seed-data";
import { eq } from "drizzle-orm";

const FALLBACK_CATEGORIES: Category[] = SEED_CATEGORIES.map((c) => ({
  id: c.id,
  name: c.name,
  tab: c.tab,
  domain: c.domain ?? "food",
  sortOrder: c.sortOrder,
}));

const FALLBACK_DISHES: Dish[] = SEED_DISHES.map((d) => ({
  id: d.id,
  name: d.name,
  subtitle: d.subtitle,
  price: d.price,
  categoryId: d.categoryId,
  domain: d.domain ?? "food",
  rarity: d.rarity,
  imageUrl: d.imageUrl ?? null,
  dietTags: JSON.stringify(d.dietTags ?? []),
  isActive: true,
  createdAt: new Date(),
}));

const FALLBACK_FORTUNES: Fortune[] = SEED_FORTUNES.map((f) => ({
  id: f.id,
  text: f.text,
  advice: f.advice,
  luckyDish: f.luckyDish,
  isActive: true,
}));

export async function getActiveDishes(): Promise<Dish[]> {
  try {
    const rows = await db
      .select()
      .from(dishes)
      .where(eq(dishes.isActive, true));
    return rows.length > 0 ? rows : FALLBACK_DISHES;
  } catch {
    return FALLBACK_DISHES;
  }
}

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(categories.sortOrder);
    return rows.length > 0 ? rows : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getActiveFortunes(): Promise<Fortune[]> {
  try {
    const rows = await db
      .select()
      .from(fortunes)
      .where(eq(fortunes.isActive, true));
    return rows.length > 0 ? rows : FALLBACK_FORTUNES;
  } catch {
    return FALLBACK_FORTUNES;
  }
}
