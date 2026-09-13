import { db } from "../src/db";
import { categories, dishes, fortunes, siteSettings, counters } from "../src/db/schema";
import { sql } from "drizzle-orm";

async function verify() {
  console.log("🔍 Kiểm tra trạng thái cơ sở dữ liệu...");

  const catCount = await db.select({ count: sql<number>`count(*)` }).from(categories);
  const dishCount = await db.select({ count: sql<number>`count(*)` }).from(dishes);
  const fortuneCount = await db.select({ count: sql<number>`count(*)` }).from(fortunes);
  const settingsCount = await db.select({ count: sql<number>`count(*)` }).from(siteSettings);
  const spinCounter = await db.select().from(counters);

  console.log(`- Danh mục: ${catCount[0]?.count} bản ghi`);
  console.log(`- Món ăn: ${dishCount[0]?.count} bản ghi`);
  console.log(`- Quẻ trưa: ${fortuneCount[0]?.count} bản ghi`);
  console.log(`- Cài đặt hệ thống: ${settingsCount[0]?.count} bản ghi`);
  console.log(`- Lượt quay toàn trạm: ${spinCounter[0]?.value}`);

  if (
    (catCount[0]?.count ?? 0) > 0 &&
    (dishCount[0]?.count ?? 0) > 0 &&
    (fortuneCount[0]?.count ?? 0) > 0
  ) {
    console.log("✅ Tất cả các bảng đã được nạp dữ liệu chuẩn xác!");
    process.exit(0);
  } else {
    console.error("❌ Dữ liệu chưa đầy đủ.");
    process.exit(1);
  }
}

verify().catch((err) => {
  console.error("❌ Lỗi kiểm tra:", err);
  process.exit(1);
});
