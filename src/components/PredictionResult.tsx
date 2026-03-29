"use client";

import React, { useState } from "react";
import type { PredictionResponse } from "@/types";

interface PredictionResultProps {
  prediction: PredictionResponse | null;
  onReset: () => void;
  onMarkOutcome?: (outcome: "WIN" | "LOSS") => void;
}

export function PredictionResult({ prediction, onReset, onMarkOutcome }: PredictionResultProps) {
  const [outcome, setOutcome] = useState<"WIN" | "LOSS" | null>(null);

  if (!prediction) return null;

  const isHigh = prediction.direction === "HIGH";
  const isNoTrade = prediction.direction === "NO_TRADE";

  // Light mode specific theme vars
  const getThemeVars = () => {
    if (isNoTrade) return {
      border: "border-amber-400/50",
      bg: "bg-amber-50",
      text: "text-amber-500 drop-shadow-sm",
      indicator: "⚠️",
      barColor: "bg-amber-500",
      label: "NO TRADE"
    };
    if (isHigh) return {
      border: "border-emerald-400/50",
      bg: "bg-emerald-50",
      text: "text-emerald-500 drop-shadow-sm",
      indicator: "↑",
      barColor: "bg-gradient-to-r from-emerald-400 to-emerald-500",
      label: "HIGH"
    };
    return {
      border: "border-rose-400/50",
      bg: "bg-rose-50",
      text: "text-rose-500 drop-shadow-sm",
      indicator: "↓",
      barColor: "bg-gradient-to-r from-rose-400 to-rose-500",
      label: "LOW"
    };
  };

  const theme = getThemeVars();

  const handleOutcomeClick = (result: "WIN" | "LOSS") => {
    if (outcome) return; // Prevent double-clicking
    setOutcome(result);
    onMarkOutcome?.(result);
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-slide-up">
      {/* 1. Main Direction Card */}
      <div className={`glass-inner p-8 flex flex-col items-center justify-center gap-5 relative overflow-hidden transition-all duration-500 border ${theme.border} ${theme.bg}`}>
        <div className={`text-5xl md:text-6xl font-black tracking-tighter flex items-center gap-3 drop-shadow-sm ${theme.text}`}>
          {theme.label} {theme.indicator}
        </div>
        
        {/* Confidence Progress Bar */}
        <div className="flex flex-col items-center gap-2.5 w-full mt-3">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#64748b]">Confidence Level</div>
          <div className="flex items-center gap-4 w-full px-4">
            <div className="flex-1 h-3.5 bg-white/60 border border-white/80 rounded-full overflow-hidden shadow-inner flex">
              <div 
                className={`h-full rounded-full shadow-md transition-all duration-1000 ease-out ${theme.barColor}`}
                style={{ width: `${prediction.confidence}%` }}
              ></div>
            </div>
            <div className={`font-mono font-bold text-xl drop-shadow-sm ${theme.text}`}>
              {prediction.confidence}%
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Analysis Grid */}
      <div className="glass-inner p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Market Snapshot
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 border border-white/80 rounded-[14px] p-3.5 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Trend</span>
            <span className="text-[14px] font-bold text-[#1e293b]">{prediction.trend}</span>
          </div>
          <div className="bg-white/70 border border-white/80 rounded-[14px] p-3.5 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Momentum</span>
            <span className="text-[14px] font-bold text-[#1e293b]">{prediction.momentum}</span>
          </div>
          <div className="bg-white/70 border border-white/80 rounded-[14px] p-3.5 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Pattern</span>
            <span className="text-[14px] font-bold text-[#1e293b] truncate" title={prediction.pattern}>{prediction.pattern}</span>
          </div>
          <div className="bg-white/70 border border-white/80 rounded-[14px] p-3.5 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Condition</span>
            <span className="text-[14px] font-bold text-[#1e293b]">{prediction.marketCondition}</span>
          </div>
          <div className="bg-white/70 border border-white/80 rounded-[14px] p-3.5 flex flex-col gap-1 shadow-sm col-span-2 items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Risk Level</span>
            <span className={`text-[14px] font-bold ${
              prediction.riskLevel.toLowerCase() === 'high' ? 'text-trading-low' : 
              prediction.riskLevel.toLowerCase() === 'medium' ? 'text-trading-warn' : 'text-trading-high'
            }`}>
              {prediction.riskLevel} Risk
            </span>
          </div>
        </div>
      </div>

      {/* 3. Reasoning Text */}
      <div className="glass-inner p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          AI Reasoning
        </h3>
        <p className="text-[#334155] text-[14.5px] leading-relaxed font-medium">
          {prediction.reasoning}
        </p>
      </div>

      {/* 4. Outcome Buttons (Only for valid trades) */}
      {!isNoTrade && (
        <div className="flex gap-3 mt-1">
          <button
            onClick={() => handleOutcomeClick("WIN")}
            disabled={outcome !== null}
            className={`flex-1 py-3.5 rounded-[14px] font-bold transition-all text-[14px] shadow-sm flex items-center justify-center gap-2 ${
              outcome === "WIN" 
                ? "bg-[#d1fae5] border-[#10b981] text-[#10b981] border" 
                : outcome === "LOSS"
                  ? "opacity-40 grayscale cursor-not-allowed bg-white border border-white text-gray-400 shadow-none"
                  : "bg-white border border-white text-[#64748b] hover:bg-[#f0fdf4] hover:border-[#10b981]/40 hover:text-[#10b981] active:scale-95"
            }`}
          >
            {outcome === "WIN" ? "✓ Logged Win" : "Log Trade Win"}
          </button>
          <button
            onClick={() => handleOutcomeClick("LOSS")}
            disabled={outcome !== null}
            className={`flex-1 py-3.5 rounded-[14px] font-bold transition-all text-[14px] shadow-sm flex items-center justify-center gap-2 ${
              outcome === "LOSS" 
                ? "bg-[#ffe4e6] border-[#f43f5e] text-[#f43f5e] border" 
                : outcome === "WIN"
                  ? "opacity-40 grayscale cursor-not-allowed bg-white border border-white text-gray-400 shadow-none"
                  : "bg-white border border-white text-[#64748b] hover:bg-[#fff1f2] hover:border-[#f43f5e]/40 hover:text-[#f43f5e] active:scale-95"
            }`}
          >
            {outcome === "LOSS" ? "✓ Logged Loss" : "Log Trade Loss"}
          </button>
        </div>
      )}

      {/* 5. Reset Button */}
      <button
        onClick={onReset}
        className="mt-1 w-full py-4 rounded-[16px] font-bold text-[#475569] bg-white border border-white/80 hover:bg-gray-50 transition-colors shadow-sm active:scale-[0.98]"
      >
        Analyze New Chart
      </button>
    </div>
  );
}
