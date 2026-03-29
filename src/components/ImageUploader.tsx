"use client";

import React, { useCallback, useState } from "react";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onImageSelected(file);
      }
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelected(file);
      }
    },
    [onImageSelected]
  );

  return (
    <div
      className={`glass-card p-6 w-full flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
        isDragOver ? "border-trading-accent bg-trading-accent/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-glow-low" : "border-white/10"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center -mb-2">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white/60">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg max-w-[200px] mx-auto text-white">Upload Chart</h3>
        <p className="text-sm text-white/50">Take a photo or upload from gallery</p>
      </div>

      <div className="flex gap-3 w-full mt-2">
        <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-sm">Gallery</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        
        <label className="flex-1 cursor-pointer bg-trading-accent/20 hover:bg-trading-accent/30 text-trading-accent active:scale-95 transition-all border border-trading-accent/30 rounded-xl py-3 flex items-center justify-center gap-2">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          <span className="font-medium text-sm">Camera</span>
          <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
    </div>
  );
}
