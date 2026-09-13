import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  tab: text("tab").notNull(), // mon_chinh | do_uong | an_vat | mon_nhau
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const dishes = sqliteTable("dishes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subtitle: text("subtitle"),
  price: integer("price").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  rarity: text("rarity").notNull().default("QUOC_DAN"), // QUOC_DAN | HIEM | CUC_PHAM | TOI_MAT | DAC_BIET
  imageUrl: text("image_url"),
  dietTags: text("diet_tags").default("[]").notNull(), // JSON string array e.g. ["chay", "healthy"]
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const fortunes = sqliteTable("fortunes", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  advice: text("advice"),
  luckyDish: text("lucky_dish"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const counters = sqliteTable("counters", {
  key: text("key").primaryKey(),
  value: integer("value").default(0).notNull(),
});

export type Dish = typeof dishes.$inferSelect;
export type NewDish = typeof dishes.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Fortune = typeof fortunes.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Counter = typeof counters.$inferSelect;
