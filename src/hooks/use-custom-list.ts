"use client";

import { useState, useEffect } from "react";
import type { Dish } from "@/db/schema";

const STORAGE_KEY = "truanayangi_custom_dishes";

export function useCustomList() {
  const [customDishes, setCustomDishes] = useState<Dish[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setCustomDishes(JSON.parse(data));
      }
    } catch {
      // fallback on error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveDishes = (newDishes: Dish[]) => {
    setCustomDishes(newDishes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDishes));
    } catch {
      // ignore quota
    }
  };

  const addDish = (dish: Omit<Dish, "id" | "createdAt" | "isActive" | "dietTags">) => {
    const newEntry: Dish = {
      ...dish,
      id: `custom-${Date.now()}`,
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
