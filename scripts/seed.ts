import { db } from "../src/db";
import {
  categories,
  dishes,
  fortunes,
  siteSettings,
  counters,
} from "../src/db/schema";
import {
  SEED_CATEGORIES,
  SEED_DISHES,
  SEED_FORTUNES,
} from "../src/db/seed-data";

async function seed() {
  console.log("🌱 Bắt đầu nạp dữ liệu (Seeding database)...");

  // 1. Seed categories
  console.log(`- Nạp ${SEED_CATEGORIES.length} danh mục...`);
  for (const cat of SEED_CATEGORIES) {
    await db
      .insert(categories)
      .values({
        id: cat.id,
        name: cat.name,
        tab: cat.tab,
        domain: cat.domain ?? "food",
        sortOrder: cat.sortOrder,
      })
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          name: cat.name,
          tab: cat.tab,
          domain: cat.domain ?? "food",
          sortOrder: cat.sortOrder,
        },
      });
  }

  // 2. Seed dishes/items
  console.log(`- Nạp ${SEED_DISHES.length} mục lựa chọn...`);
  for (const dish of SEED_DISHES) {
    await db
      .insert(dishes)
      .values({
        id: dish.id,
        name: dish.name,
        subtitle: dish.subtitle,
        price: dish.price,
        categoryId: dish.categoryId,
        domain: dish.domain ?? "food",
        rarity: dish.rarity,
        imageUrl: dish.imageUrl,
        dietTags: JSON.stringify(dish.dietTags),
        isActive: true,
      })
      .onConflictDoUpdate({
        target: dishes.id,
        set: {
          name: dish.name,
          subtitle: dish.subtitle,
          price: dish.price,
          categoryId: dish.categoryId,
          domain: dish.domain ?? "food",
          rarity: dish.rarity,
          imageUrl: dish.imageUrl,
          dietTags: JSON.stringify(dish.dietTags),
        },
      });
  }

  // 3. Seed fortunes
  console.log(`- Nạp ${SEED_FORTUNES.length} quẻ trưa...`);
  for (const f of SEED_FORTUNES) {
    await db
      .insert(fortunes)
      .values({
        id: f.id,
        text: f.text,
        advice: f.advice,
        luckyDish: f.luckyDish,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: fortunes.id,
        set: {
          text: f.text,
          advice: f.advice,
          luckyDish: f.luckyDish,
        },
      });
  }

  // 4. Seed site settings
  console.log("- Cấu hình cài đặt mặc định...");
  const defaultSettings = [
    { key: "default_picker_mode", value: "cards" },
    {
      key: "homepage_tagline",
      value:
        "Vòng quay quyết định mọi thứ — Ăn uống, Giải trí, Hoạt động hay bất cứ điều gì bạn chưa chọn được!",
    },
    { key: "site_name", value: "Tùy Là Được" },
  ];

  for (const setting of defaultSettings) {
    await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: setting.value },
      });
  }

  // 5. Seed initial spin counter
  await db
    .insert(counters)
    .values({
      key: "global_spins",
      value: 12480, // initial lively seed count matching community usage
    })
    .onConflictDoNothing();

  console.log("✅ Nạp dữ liệu hoàn tất thành công!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Lỗi khi nạp dữ liệu:", err);
    process.exit(1);
  });
