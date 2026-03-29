"use client";

import React from "react";

type Duration = "1m" | "2m" | "5m";

interface DurationSelectorProps {
  selected: Duration;
  onChange: (duration: Duration) => void;
}

export function DurationSelector({ selected, onChange }: DurationSelectorProps) {
  const durations: Duration[] = ["1m", "2m", "5m"];

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider pl-1">
        Trade Horizon
      </label>
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
        {durations.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              selected === d
                ? "bg-trading-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
