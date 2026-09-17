import assert from "node:assert";
import { SEED_CATEGORIES, SEED_DISHES } from "../src/db/seed-data";

// 1. Verify all seed categories have valid domains
const expectedDomains = new Set(["food", "entertainment", "activity", "task"]);
for (const cat of SEED_CATEGORIES) {
  assert(cat.domain, `Category ${cat.id} must have a domain`);
  assert(expectedDomains.has(cat.domain), `Category ${cat.id} has invalid domain ${cat.domain}`);
}

// 2. Verify all categories have corresponding items
const categoryIds = new Set(SEED_CATEGORIES.map((c) => c.id));
for (const dish of SEED_DISHES) {
  assert(categoryIds.has(dish.categoryId), `Item ${dish.id} references non-existent category ${dish.categoryId}`);
  assert(dish.name.length > 0, `Item ${dish.id} has empty name`);
  assert(dish.price >= 0, `Item ${dish.id} has negative price`);
}

// 3. Verify multiple domains are represented
const domainsCovered = new Set(SEED_DISHES.map((d) => d.domain ?? "food"));
assert(domainsCovered.has("food"), "Food domain must be covered");
assert(domainsCovered.has("entertainment"), "Entertainment domain must be covered");
assert(domainsCovered.has("activity"), "Activity domain must be covered");
assert(domainsCovered.has("task"), "Task domain must be covered");

console.log(`✅ Verified ${SEED_CATEGORIES.length} categories across ${domainsCovered.size} domains and ${SEED_DISHES.length} items successfully.`);
