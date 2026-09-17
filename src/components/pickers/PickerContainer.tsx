"use client";

import React from "react";
import type { PickerMode, PickerModeProps } from "./types";
import { CardShuffle } from "./CardShuffle";
import { SlotReel } from "./SlotReel";
import { Layers, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface PickerContainerProps extends PickerModeProps {
  activeMode: PickerMode;
  onModeChange: (mode: PickerMode) => void;
}

export function PickerContainer({
  activeMode,
  onModeChange,
  ...props
}: PickerContainerProps) {
  const modeTabs = [
    { id: "cards" as PickerMode, label: "Thẻ bài & Vuốt", icon: Layers },
    { id: "slot" as PickerMode, label: "Băng chuyền lựa chọn", icon: Flame },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-3 sm:gap-4 overflow-x-clip">
      {/* Mode Selector Tabs */}
      <div
        role="tablist"
        aria-label="Chế độ hiển thị vòng quay"
        className="inline-flex rounded-xl border border-stone-200/80 bg-stone-100/90 p-1 backdrop-blur-xs dark:border-stone-800 dark:bg-stone-900/90 shadow-2xs"
      >
        {modeTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onModeChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-orange-500 sm:px-3.5",
                isActive
                  ? "bg-white text-orange-600 shadow-2xs dark:bg-stone-800 dark:text-orange-400 font-bold"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Animation Stage */}
      <div className="flex w-full items-center justify-center py-1">
        {activeMode === "slot" ? (
          <SlotReel {...props} />
        ) : (
          <CardShuffle {...props} />
        )}
      </div>
    </div>
  );
}
