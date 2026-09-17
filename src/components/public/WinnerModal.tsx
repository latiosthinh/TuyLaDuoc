"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import type { Dish } from "@/db/schema";
import { RarityBadge } from "./RarityBadge";
import { formatVND } from "@/lib/utils";
import { MapPin, Utensils, X, Sparkles, RefreshCw, ExternalLink, Compass, Film, CheckCircle } from "lucide-react";

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onRespin?: () => void;
}

export function WinnerModal({
  isOpen,
  onClose,
  dish,
  onRespin,
}: WinnerModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard trap & Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !dish) return null;

  const isFood = !dish.domain || dish.domain === "food";
  const isEntertainment = dish.domain === "entertainment";
  const isActivity = dish.domain === "activity";

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    dish.name + " gần đây"
  )}`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    dish.name
  )}`;
  const grabFoodUrl = `https://food.grab.com/vn/vi/restaurants?${new URLSearchParams(
    { search: dish.name }
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-dish-name"
      aria-describedby="winner-dish-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 text-stone-100 shadow-2xl animate-in zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng hộp thoại kết quả"
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-stone-300 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Image Section */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-950">
          {dish.imageUrl ? (
            <Image
              src={dish.imageUrl}
              alt={dish.name}
              fill
              priority
              sizes="480px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-800 text-stone-500">
              <Compass className="h-16 w-16 opacity-30" />
            </div>
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />

          {/* Top Label */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>LỰA CHỌN TRÚNG ĐÍCH</span>
          </div>

          <div className="absolute top-4 right-14 z-10">
            <RarityBadge rarity={dish.rarity} />
          </div>

          {/* Title on image base */}
          <div className="absolute bottom-3 left-6 right-6 z-10 text-left">
            <span className="text-[11px] font-bold tracking-widest text-orange-400 uppercase">
              Quyết định hôm nay:
            </span>
            <h2 id="winner-dish-name" className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {dish.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-4 p-6 text-left">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <span className="text-xs text-stone-300">Chi phí dự kiến:</span>
            <span className="text-xl font-black text-amber-400">
              {dish.price > 0 ? formatVND(dish.price) : "Hoàn toàn miễn phí"}
            </span>
          </div>

          {dish.subtitle && (
            <p id="winner-dish-desc" className="text-xs sm:text-sm leading-relaxed text-stone-300">
              {dish.subtitle}
            </p>
          )}

          {/* Action CTAs */}
          <div className="mt-2 flex flex-col sm:flex-row gap-2.5">
            {isFood ? (
              <>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Tìm quán ${dish.name} gần đây trên Google Maps (mở tab mới)`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>Tìm quán gần đây</span>
                  <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
                </a>

                <a
                  href={grabFoodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Đặt món ${dish.name} qua GrabFood (mở tab mới)`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600/40 bg-emerald-950/40 px-4 py-3 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-900/40 focus-visible:outline-2 focus-visible:outline-emerald-500"
                >
                  <Utensils className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span>Đặt GrabFood</span>
                  <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
                </a>
              </>
            ) : isEntertainment ? (
              <>
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Tìm kiếm thông tin ${dish.name} trên Google (mở tab mới)`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  <Film className="h-4 w-4" aria-hidden="true" />
                  <span>Khám phá ngay</span>
                  <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
                </a>
              </>
            ) : (
              <>
                <a
                  href={isActivity ? mapsUrl : searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Khám phá địa điểm hoặc thông tin ${dish.name} (mở tab mới)`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  <span>Bắt đầu ngay</span>
                  <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
                </a>
              </>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            {onRespin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRespin();
                }}
                aria-label="Quay lại chọn ngẫu nhiên lựa chọn khác"
                className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-orange-500 rounded-lg p-1"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Quay lựa chọn khác</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded-xl bg-stone-800 px-5 py-2 text-xs font-bold text-stone-200 hover:bg-stone-700 transition-colors focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              Chốt lựa chọn này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
