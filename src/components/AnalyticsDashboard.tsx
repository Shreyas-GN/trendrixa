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
    // eslint-disable-next-line
    setStats(predictionLogger.getAnalytics());
  }, []);

  if (!stats) return null;

  const hasData = stats.markedOutcomes > 0;

  return (
    <div className="absolute inset-0 z-50 bg-[#eef2f9]/90 backdrop-blur-2xl flex flex-col animate-slide-up rounded-[2.5rem] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/60 bg-white/40">
        <h2 className="text-[20px] font-bold tracking-tight text-[#1e293b]">Performance Analytics</h2>
        <button 
          onClick={onClose}
          className="p-2.5 bg-white/70 hover:bg-white rounded-[14px] transition-colors shadow-sm text-[#64748b] hover:text-[#334155]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
        
        {/* Top Level KPIs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-inner p-5 flex flex-col gap-1.5 items-center justify-center text-center">
            <span className="text-4xl font-black text-[#1e293b]">{stats.markedOutcomes}</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748b]">Logged Trades</span>
          </div>
          <div className="glass-inner p-5 flex flex-col gap-1.5 items-center justify-center text-center">
             <span className={`text-4xl font-black ${
               stats.winRate >= 60 ? 'text-[#10b981] drop-shadow-sm' : 
               stats.winRate < 45 && hasData ? 'text-[#f43f5e] drop-shadow-sm' : 
               'text-[#1e293b]'
             }`}>
              {hasData ? `${stats.winRate}%` : '--'}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748b]">Global Win Rate</span>
          </div>
        </div>

        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-[#94a3b8] p-8">
            <svg className="w-16 h-16 mb-4 opacity-50 text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="font-medium text-[#64748b] text-[15px]">Not enough data.</p>
            <p className="text-[13px] mt-1">Log some trade outcomes (WIN/LOSS) to unlock analytics.</p>
          </div>
        ) : (
          <>
            {/* Win Rate by Confidence */}
            <div className="glass-inner p-6">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-5">Win Rate by Confidence Level</h3>
              <div className="flex flex-col gap-5">
                {Object.entries(stats.winRateByConfidence).sort().map(([range, rate]) => {
                  if (rate === null) return null;
                  return (
                    <div key={range} className="flex flex-col gap-2">
                      <div className="flex justify-between text-[14px]">
                        <span className="font-mono font-medium text-[#475569]">{range}</span>
                        <span className="font-bold text-[#1e293b]">{rate}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#e2e8f0] rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-[#8ca2f8] to-[#9cb2f9] rounded-full transition-all"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Win Rate by Market Condition */}
            <div className="glass-inner p-6">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-4">Win Rate by Market Condition</h3>
              <div className="flex flex-col gap-3">
                {Object.entries(stats.winRateByCondition).map(([condition, rate]) => {
                  if (rate === null) return null;
                  return (
                    <div key={condition} className="flex items-center justify-between p-3.5 rounded-xl bg-white/60 border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                       <span className="text-[14px] font-semibold text-[#334155]">{condition}</span>
                       <span className={`text-[13px] font-bold px-3 py-1.5 rounded-lg bg-white ${
                         rate >= 60 ? 'text-[#10b981] shadow-sm' : rate < 45 ? 'text-[#f43f5e] shadow-sm' : 'text-[#475569]'
                       }`}>
                         {rate}%
                       </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="text-center mt-2 mb-4">
              <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wider">
                Predictions: {stats.totalPredictions} | Placed Trades: {stats.totalTrades}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
