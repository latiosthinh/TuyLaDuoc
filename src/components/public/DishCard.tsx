import Image from "next/image";
import { formatVND } from "@/lib/utils";
import { RarityBadge } from "./RarityBadge";
import type { Dish } from "@/db/schema";
import { MapPin, RefreshCw } from "lucide-react";

interface DishCardProps {
  dish: Dish;
  categoryName?: string;
  onRespin?: () => void;
  isResult?: boolean;
}

export function DishCard({
  dish,
  categoryName,
  onRespin,
  isResult = false,
}: DishCardProps) {
  const mapsSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    dish.name + " gần đây"
  )}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xs transition-all hover:border-orange-200 hover:shadow-md dark:border-stone-800/90 dark:bg-stone-900 dark:hover:border-orange-900/60">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={isResult}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-stone-100 text-stone-400 dark:from-stone-800 dark:to-stone-900">
            <span className="text-xs font-medium">Chưa có ảnh</span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <RarityBadge rarity={dish.rarity} />
        </div>

        {categoryName && (
          <div className="absolute bottom-3 left-3 rounded-md bg-stone-900/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
            {categoryName}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            {dish.name}
          </h3>
          <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400">
            {formatVND(dish.price)}
          </span>
        </div>

        {dish.subtitle && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
            {dish.subtitle}
          </p>
        )}

        {isResult && (
          <div className="mt-6 flex items-center gap-2 pt-2">
            {onRespin && (
              <button
                type="button"
                onClick={onRespin}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-orange-700 hover:shadow-md active:scale-98"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Quay món khác</span>
              </button>
            )}
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-medium text-stone-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-orange-800 dark:hover:text-orange-400"
            >
              <MapPin className="h-3.5 w-3.5 text-orange-500" />
              <span>Tìm quán</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
