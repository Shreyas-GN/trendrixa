"use client";

import React, { useEffect, useState } from "react";
import { predictionLogger } from "@/lib/predictionLogger";
import type { PredictionAnalytics } from "@/types";

interface AnalyticsDashboardProps {
  onClose: () => void;
}

export function AnalyticsDashboard({ onClose }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<PredictionAnalytics | null>(null);

  useEffect(() => {
    // Load stats when dashboard mounts (bypassing strict mode lint)
    // eslint-disable-next-line
    setStats(predictionLogger.getAnalytics());
  }, []);

  if (!stats) return null;

  const hasData = stats.markedOutcomes > 0;

  return (
    <div className="absolute inset-0 z-50 bg-trading-bg flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-trading-card/50">
        <h2 className="text-xl font-bold tracking-tight">Performance Analytics</h2>
        <button 
          onClick={onClose}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* Top Level KPIs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 flex flex-col gap-1 items-center justify-center text-center">
            <span className="text-3xl font-black text-white">{stats.markedOutcomes}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/50">Logged Trades</span>
          </div>
          <div className="glass-card p-4 flex flex-col gap-1 items-center justify-center text-center">
             <span className={`text-3xl font-black ${
               stats.winRate >= 60 ? 'text-trading-high glow-text-high' : 
               stats.winRate < 45 && hasData ? 'text-trading-low glow-text-low' : 
               'text-white'
             }`}>
              {hasData ? `${stats.winRate}%` : '--'}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/50">Global Win Rate</span>
          </div>
        </div>

        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-white/40 p-8">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>Not enough data.</p>
            <p className="text-sm">Log some trade outcomes (WIN/LOSS) to unlock analytics.</p>
          </div>
        ) : (
          <>
            {/* Win Rate by Confidence */}
            <div className="glass-card p-5 border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Win Rate by Confidence Level</h3>
              <div className="flex flex-col gap-4">
                {Object.entries(stats.winRateByConfidence).sort().map(([range, rate]) => {
                  if (rate === null) return null;
                  return (
                    <div key={range} className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-mono text-white/70">{range}</span>
                        <span className="font-bold">{rate}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-trading-accent rounded-full transition-all"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Win Rate by Market Condition */}
            <div className="glass-card p-5 border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Win Rate by Market Condition</h3>
              <div className="flex flex-col gap-3">
                {Object.entries(stats.winRateByCondition).map(([condition, rate]) => {
                  if (rate === null) return null;
                  return (
                    <div key={condition} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                       <span className="text-sm font-medium text-white/80">{condition}</span>
                       <span className={`text-sm font-bold px-2 py-1 rounded bg-white/10 ${
                         rate >= 60 ? 'text-trading-high' : rate < 45 ? 'text-trading-low' : 'text-white'
                       }`}>
                         {rate}%
                       </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-xs text-white/30">Total Predictions Evaluated: {stats.totalPredictions} | Filtered Trades: {stats.totalTrades}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
