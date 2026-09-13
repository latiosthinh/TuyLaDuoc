"use client";

import React, { useState, useEffect } from "react";
import type { PickerMode, PickerModeProps } from "./types";
import { RouletteWheel } from "./RouletteWheel";
import { CardShuffle } from "./CardShuffle";
import { SlotReel } from "./SlotReel";
import { Disc, Layers, Flame, Dices } from "lucide-react";
import { cn } from "@/lib/utils";

interface PickerContainerProps extends PickerModeProps {
  initialMode?: PickerMode;
}

const STORAGE_KEY = "truanayangi_picker_mode";

export function PickerContainer(props: PickerContainerProps) {
  const [activeMode, setActiveMode] = useState<PickerMode>(
    props.initialMode || "roulette"
  );
  const [resolvedRandomMode, setResolvedRandomMode] = useState<PickerMode>("roulette");

  // Load user preference on client mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as PickerMode | null;
    if (saved && ["roulette", "cards", "slot", "random"].includes(saved)) {
      setActiveMode(saved);
    }
  }, []);

  const handleModeSelect = (mode: PickerMode) => {
    setActiveMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  // If in random/ngẫu hứng mode, pick one presentation mode when spin starts
  useEffect(() => {
    if (props.isSpinning && activeMode === "random") {
      const modes: PickerMode[] = ["roulette", "cards", "slot"];
      const picked = modes[Math.floor(Math.random() * modes.length)];
      setResolvedRandomMode(picked);
    }
  }, [props.isSpinning, activeMode]);

  const effectiveMode = activeMode === "random" ? resolvedRandomMode : activeMode;

  const modeTabs = [
    { id: "roulette" as PickerMode, label: "Vòng quay", icon: Disc },
    { id: "cards" as PickerMode, label: "Lật bài", icon: Layers },
    { id: "slot" as PickerMode, label: "Quả chuông", icon: Flame },
    { id: "random" as PickerMode, label: "Ngẫu hứng", icon: Dices },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Mode Selector Tabs */}
      <div className="inline-flex rounded-xl border border-stone-200/80 bg-stone-100/80 p-1 backdrop-blur-xs dark:border-stone-800 dark:bg-stone-900/80">
        {modeTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleModeSelect(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3",
                isActive
                  ? "bg-white text-orange-600 shadow-2xs dark:bg-stone-800 dark:text-orange-400"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Animation Stage */}
      <div className="flex w-full items-center justify-center py-2">
        {effectiveMode === "roulette" && <RouletteWheel {...props} />}
        {effectiveMode === "cards" && <CardShuffle {...props} />}
        {effectiveMode === "slot" && <SlotReel {...props} />}
      </div>
    </div>
  );
}
