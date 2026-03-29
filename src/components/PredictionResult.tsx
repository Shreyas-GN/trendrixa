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

  // Compute theme colors dynamically based on the direction
  const getThemeVars = () => {
    if (isNoTrade) return {
      border: "border-trading-warn/50",
      bg: "bg-trading-warn/10",
      text: "text-trading-warn",
      glow: "text-glow-warn",
      indicator: "⚠️",
      barColor: "bg-trading-warn",
      label: "NO TRADE"
    };
    if (isHigh) return {
      border: "border-trading-high/50",
      bg: "bg-trading-high/10",
      text: "text-trading-high",
      glow: "text-glow-high",
      indicator: "↑",
      barColor: "bg-trading-high",
      label: "HIGH"
    };
    return {
      border: "border-trading-low/50",
      bg: "bg-trading-low/10",
      text: "text-trading-low",
      glow: "text-glow-low",
      indicator: "↓",
      barColor: "bg-trading-low",
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
      <div 
        className={`glass-card p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden transition-all duration-500 ${theme.border} ${theme.bg}`}
      >
        <div className={`text-5xl md:text-6xl font-black tracking-tighter flex items-center gap-3 ${theme.text} ${theme.glow}`}>
          {theme.label} {theme.indicator}
        </div>
        
        {/* Confidence Progress Bar */}
        <div className="flex flex-col items-center gap-2 w-full mt-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/50">Confidence Level</div>
          <div className="flex items-center gap-4 w-full px-2">
            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${theme.barColor} transition-all duration-1000 ease-out`}
                style={{ width: `${prediction.confidence}%` }}
              ></div>
            </div>
            <div className={`font-mono font-bold text-lg ${theme.text}`}>
              {prediction.confidence}%
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Analysis Grid (V2 Feature) */}
      <div className="glass-card p-4 border-white/10">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Market Snapshot
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Trend</span>
            <span className="text-sm font-semibold text-white/90">{prediction.trend}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Momentum</span>
            <span className="text-sm font-semibold text-white/90">{prediction.momentum}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Pattern</span>
            <span className="text-sm font-semibold text-white/90 truncate" title={prediction.pattern}>{prediction.pattern}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Condition</span>
            <span className="text-sm font-semibold text-white/90">{prediction.marketCondition}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 flex flex-col gap-1 col-span-2 items-center text-center">
            <span className="text-[10px] uppercase tracking-wider text-white/40">Risk Level</span>
            <span className={`text-sm font-semibold ${
              prediction.riskLevel.toLowerCase() === 'high' ? 'text-trading-low' : 
              prediction.riskLevel.toLowerCase() === 'medium' ? 'text-trading-warn' : 'text-trading-high'
            }`}>
              {prediction.riskLevel} Risk
            </span>
          </div>
        </div>
      </div>

      {/* 3. Reasoning Text */}
      <div className="glass-card p-5 border-white/10">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          AI Reasoning
        </h3>
        <p className="text-white/80 text-sm leading-relaxed font-medium">
          {prediction.reasoning}
        </p>
      </div>

      {/* 4. Outcome Buttons (Only for valid trades) */}
      {!isNoTrade && (
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => handleOutcomeClick("WIN")}
            disabled={outcome !== null}
            className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
              outcome === "WIN" 
                ? "bg-trading-high/20 border-trading-high text-trading-high border" 
                : outcome === "LOSS"
                  ? "opacity-30 grayscale cursor-not-allowed bg-white/5 border border-white/10 text-white/50"
                  : "bg-white/5 border border-white/10 text-white/80 hover:bg-trading-high/10 hover:border-trading-high/30 hover:text-trading-high active:scale-95"
            }`}
          >
            {outcome === "WIN" ? "✓ Logged Win" : "Log Trade Win"}
          </button>
          <button
            onClick={() => handleOutcomeClick("LOSS")}
            disabled={outcome !== null}
            className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
              outcome === "LOSS" 
                ? "bg-trading-low/20 border-trading-low text-trading-low border" 
                : outcome === "WIN"
                  ? "opacity-30 grayscale cursor-not-allowed bg-white/5 border border-white/10 text-white/50"
                  : "bg-white/5 border border-white/10 text-white/80 hover:bg-trading-low/10 hover:border-trading-low/30 hover:text-trading-low active:scale-95"
            }`}
          >
            {outcome === "LOSS" ? "✓ Logged Loss" : "Log Trade Loss"}
          </button>
        </div>
      )}

      {/* 5. Reset Button */}
      <button
        onClick={onReset}
        className="mt-2 w-full py-4 rounded-xl font-bold text-white bg-white/10 border border-white/10 hover:bg-white/15 transition-colors active:scale-95"
      >
        Analyze New Chart
      </button>
    </div>
  );
}
