import React from "react";

interface HeaderProps {
  onToggleAnalytics?: () => void;
}

export function Header({ onToggleAnalytics }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/5 bg-trading-card/50 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Trendrixa <span className="text-emerald-500 text-sm align-top">V2</span>
        </h1>
      </div>
      
      {onToggleAnalytics && (
        <button 
          onClick={onToggleAnalytics}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 text-white/60 hover:text-white"
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
