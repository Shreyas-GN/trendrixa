import React from "react";

interface HeaderProps {
  onToggleAnalytics?: () => void;
}

export function Header({ onToggleAnalytics }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 pb-2 border-b border-black/5 bg-transparent">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4dbfc6] to-[#60d6cc] flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 className="text-[19px] font-bold tracking-tight text-[#1e293b]">
          Trendrixa <span className="text-[#4dbfc6] font-semibold text-[13px] ml-0.5">V2</span>
        </h1>
      </div>
      
      {onToggleAnalytics && (
        <button 
          onClick={onToggleAnalytics}
          className="w-10 h-10 bg-white/70 rounded-[14px] flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white/80 transition-all active:scale-95 text-[#8ca2f8] hover:text-[#7890e8]"
          title="View Analytics"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      )}
    </header>
  );
}
