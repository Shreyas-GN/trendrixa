import React from "react";
import type { Duration } from "@/types";

interface DurationSelectorProps {
  selected: Duration;
  onChange: (duration: Duration) => void;
}

export function DurationSelector({ selected, onChange }: DurationSelectorProps) {
  const options: Duration[] = ["1m", "2m", "5m"];

  return (
    <div className="flex flex-col gap-2 mt-4 px-1">
      <span className="text-[11px] font-bold text-[#8492a6] tracking-wider uppercase">Trade Horizon</span>
      
      <div className="bg-white/50 backdrop-blur-md rounded-[16px] p-1 flex relative shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-white/70">
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`flex-1 py-3 rounded-[12px] text-[15px] font-semibold z-10 transition-all duration-300 ${
                isSelected ? "text-white drop-shadow-sm" : "text-[#718096] hover:text-[#334155]"
              }`}
            >
              {opt}
            </button>
          );
        })}
        {/* Floating thumb indicator */}
        <div 
          className="absolute top-1 bottom-1 w-[calc(33.333%-2px)] rounded-xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] btn-gradient"
          style={{ 
            transform: `translateX(${
              selected === '1m' ? '0' : 
              selected === '2m' ? '100%' : 'calc(200% + 2px)'
            })` 
          }}
        />
      </div>
    </div>
  );
}
