"use server";

import { db } from "@/db";
import { counters } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function recordSpinAction(): Promise<number> {
  try {
    const updated = await db
      .update(counters)
      .set({
        value: sql`${counters.value} + 1`,
      })
      .where(eq(counters.key, "global_spins"))
      .returning({ count: counters.value });

    revalidatePath("/");
    return updated[0]?.count ?? 0;
  } catch (err) {
    console.error("Failed to record spin event:", err);
    return 0;
  }
}

export async function getGlobalSpinCount(): Promise<number> {
  try {
    const record = await db
      .select()
      .from(counters)
      .where(eq(counters.key, "global_spins"))
      .limit(1);

    return record[0]?.value ?? 0;
  } catch {
    return 0;
  }
}
