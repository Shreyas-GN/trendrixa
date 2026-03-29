"use client";

import React from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-trading-bg/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 p-8 glass-card">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-trading-accent/30 animate-[spin_3s_linear_infinite]"></div>
          {/* Inner pulsating dot */}
          <div className="w-8 h-8 bg-trading-accent rounded-full animate-pulse-slow shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-lg font-bold text-white tracking-wide">Processing Image</h2>
          <p className="text-sm text-trading-accent font-mono">Passing to Neural Engine...</p>
        </div>
      </div>
    </div>
  );
}
