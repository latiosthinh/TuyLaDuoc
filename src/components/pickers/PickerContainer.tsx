"use client";

import React, { useState, useEffect } from "react";
import type { PickerMode, PickerModeProps } from "./types";
import { CardShuffle } from "./CardShuffle";
import { SlotReel } from "./SlotReel";
import { Layers, Flame, Dices } from "lucide-react";
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
  const [resolvedRandomMode, setResolvedRandomMode] = useState<"cards" | "slot">("cards");

  // If in random/ngẫu hứng mode, pick between cards and slot when spin starts
  useEffect(() => {
    if (props.isSpinning && activeMode === "random") {
      const modes: Array<"cards" | "slot"> = ["cards", "slot"];
      const picked = modes[Math.floor(Math.random() * modes.length)];
      setResolvedRandomMode(picked);
    }
  }, [props.isSpinning, activeMode]);

  const effectiveMode = activeMode === "random" ? resolvedRandomMode : activeMode;

  const modeTabs = [
    { id: "cards" as PickerMode, label: "Thẻ bài & Vuốt", icon: Layers },
    { id: "slot" as PickerMode, label: "Băng chuyền lựa chọn", icon: Flame },
    { id: "random" as PickerMode, label: "Ngẫu hứng", icon: Dices },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Mode Selector Tabs */}
      <div
        role="tablist"
        aria-label="Chế độ hiển thị vòng quay"
        className="inline-flex rounded-2xl border border-stone-200/80 bg-stone-100/90 p-1.5 backdrop-blur-xs dark:border-stone-800 dark:bg-stone-900/90 shadow-2xs"
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
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-orange-500 sm:px-4",
                isActive
                  ? "bg-white text-orange-600 shadow-xs dark:bg-stone-800 dark:text-orange-400"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Animation Stage */}
      <div className="flex w-full items-center justify-center py-2">
        {effectiveMode === "cards" && <CardShuffle {...props} />}
        {effectiveMode === "slot" && <SlotReel {...props} />}
      </div>
    </div>
  );
}
