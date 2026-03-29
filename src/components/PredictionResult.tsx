"use client";

import React from "react";

export interface PredictionData {
  direction: "HIGH" | "LOW";
  confidence: number;
  reasoning: string;
}

interface PredictionResultProps {
  prediction: PredictionData | null;
  onReset: () => void;
}

export function PredictionResult({ prediction, onReset }: PredictionResultProps) {
  if (!prediction) return null;

  const isHigh = prediction.direction === "HIGH";

  return (
    <div className="w-full flex flex-col gap-6 animate-slide-up">
      {/* Direction Card */}
      <div 
        className={`glass-card p-8 flex flex-col items-center justify-center gap-4 relative overflow-hidden ${
          isHigh 
            ? "border-trading-high/50 bg-trading-high/10" 
            : "border-trading-low/50 bg-trading-low/10"
        }`}
      >
        <div className={`text-6xl font-black tracking-tighter ${isHigh ? "text-trading-high text-glow-high" : "text-trading-low text-glow-low"}`}>
          {prediction.direction} {isHigh ? "↑" : "↓"}
        </div>
        
        <div className="flex flex-col items-center gap-2 w-full mt-4">
          <div className="text-sm font-semibold uppercase tracking-widest text-white/50">Confidence</div>
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${isHigh ? "bg-trading-high" : "bg-trading-low"} transition-all duration-1000 ease-out`}
                style={{ width: `${prediction.confidence}%` }}
              ></div>
            </div>
            <div className={`font-mono font-bold text-xl ${isHigh ? "text-trading-high" : "text-trading-low"}`}>
              {prediction.confidence}%
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning Card */}
      <div className="glass-card p-5 border-white/10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          AI Reasoning
        </h3>
        <p className="text-white/90 text-sm leading-relaxed font-medium">
          {prediction.reasoning}
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-4 w-full py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95"
      >
        Analyze Another Chart
      </button>
    </div>
  );
}
