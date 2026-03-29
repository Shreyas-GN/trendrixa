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
      className={`w-full py-4 rounded-[18px] font-semibold text-[17px] flex justify-center items-center gap-2 transition-all duration-300 relative overflow-hidden group ${
        disabled 
          ? "bg-white/30 text-[#94a3b8] cursor-not-allowed border border-white/40" 
          : "bg-gradient-to-r from-[#eef2fb] to-[#dde5f7] text-[#5c73d9] border border-white/80 shadow-[0_6px_24px_rgba(139,161,245,0.18)] hover:shadow-[0_8px_32px_rgba(139,161,245,0.25)] hover:from-[#e8edfb] hover:to-[#d5dff6] active:scale-[0.98]"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="opacity-90">Analyzing Visuals...</span>
        </div>
      ) : (
        <>
          Predict Direction
          <svg className={`w-[22px] h-[22px] transition-transform duration-300 opacity-80 ${disabled ? "" : "group-hover:translate-x-1"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </>
      )}
    </button>
  );
}
