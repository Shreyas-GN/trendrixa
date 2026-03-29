import React from "react";

export function Header() {
  return (
    <header className="flex w-full items-center justify-between p-4 bg-trading-bg/90 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-tight">
            Trendrixa
          </h1>
          <p className="text-[10px] uppercase tracking-wider text-white/50 m-0">
            Intelligent Charts
          </p>
        </div>
      </div>
    </header>
  );
}
