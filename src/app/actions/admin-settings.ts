"use server";

import { db } from "@/db";
import { siteSettings, fortunes } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(formData: FormData) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error("Unauthorized");

  const defaultPickerMode = formData.get("defaultPickerMode") as string;
  const homepageTagline = formData.get("homepageTagline") as string;
  const siteName = formData.get("siteName") as string;

  const updates = [
    { key: "default_picker_mode", value: defaultPickerMode },
    { key: "homepage_tagline", value: homepageTagline },
    { key: "site_name", value: siteName },
  ];

  for (const s of updates) {
    await db
      .insert(siteSettings)
      .values(s)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: s.value, updatedAt: new Date() },
      });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function createOrUpdateFortune(formData: FormData) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error("Unauthorized");

  const id = (formData.get("id") as string) || `que-${Date.now()}`;
  const text = formData.get("text") as string;
  const advice = formData.get("advice") as string;
  const luckyDish = formData.get("luckyDish") as string;

  await db
    .insert(fortunes)
    .values({
      id,
      text,
      advice,
      luckyDish,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: fortunes.id,
      set: { text, advice, luckyDish },
    });

  revalidatePath("/que-trua");
  revalidatePath("/admin/fortunes");
}

export async function deleteFortune(id: string) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) throw new Error("Unauthorized");

  await db.delete(fortunes).where(eq(fortunes.id, id));
  revalidatePath("/que-trua");
  revalidatePath("/admin/fortunes");
}
