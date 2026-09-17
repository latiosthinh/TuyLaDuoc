"use client";

import { useState, useEffect } from "react";
import type { Dish } from "@/db/schema";

const STORAGE_KEY = "tuyladuoc_custom_items";
const LEGACY_STORAGE_KEY = "truanayangi_custom_dishes";

export function useCustomList() {
  const [customDishes, setCustomDishes] = useState<Dish[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const syncFromStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (data) {
        setCustomDishes(JSON.parse(data));
      } else {
        setCustomDishes([]);
      }
    } catch {
      // fallback on error
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    syncFromStorage();

    const handleCustomChange = () => syncFromStorage();
    window.addEventListener("custom-dishes-changed", handleCustomChange);
    window.addEventListener("storage", handleCustomChange);

    return () => {
      window.removeEventListener("custom-dishes-changed", handleCustomChange);
      window.removeEventListener("storage", handleCustomChange);
    };
  }, []);

  const saveDishes = (newDishes: Dish[]) => {
    setCustomDishes(newDishes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDishes));
      window.dispatchEvent(new Event("custom-dishes-changed"));
    } catch {
      // ignore quota
    }
  };

  const addDish = (dish: Omit<Dish, "id" | "createdAt" | "isActive" | "dietTags">) => {
    const newEntry: Dish = {
      ...dish,
      id: `custom-${Date.now()}`,
      domain: (dish as any).domain || "food",
      isActive: true,
      dietTags: "[]",
      createdAt: new Date(),
    };
    saveDishes([...customDishes, newEntry]);
  };

  const removeDish = (id: string) => {
    saveDishes(customDishes.filter((d) => d.id !== id));
  };

  return {
    customDishes,
    isLoaded,
    addDish,
    removeDish,
  };
}
