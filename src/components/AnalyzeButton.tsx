"use client";

import React from "react";

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function AnalyzeButton({ onClick, disabled, isLoading }: AnalyzeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg overflow-hidden transition-all duration-300 active:scale-95 flex flex-col items-center justify-center ${
        disabled
          ? "bg-white/5 text-white/30 cursor-not-allowed shadow-none"
          : "bg-gradient-to-r from-trading-accent to-indigo-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] cursor-pointer"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 relative z-10">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Analyzing Patterns...</span>
        </div>
      ) : (
        <div className="relative z-10 flex items-center gap-2">
          <span>Predict Direction</span>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      )}

      {/* Shimmer effect when loading */}
      {isLoading && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
      )}
    </button>
  );
}
