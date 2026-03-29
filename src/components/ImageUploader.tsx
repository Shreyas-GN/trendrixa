import React, { useRef } from "react";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div className="glass-inner p-8 py-10 flex flex-col items-center justify-center text-center">
      <div className="w-[60px] h-[60px] rounded-full bg-white shadow-sm flex items-center justify-center mb-5 border border-white/50">
        <svg className="w-[28px] h-[28px] text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      <h2 className="text-[20px] font-bold text-[#1e293b] tracking-tight mb-1">Upload Chart</h2>
      <p className="text-[14px] text-[#8492a6] font-medium leading-relaxed">Take a photo or upload from galliery</p>

      <div className="flex w-full gap-3 mt-8">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 py-3.5 rounded-xl btn-white font-semibold text-[14px] flex justify-center items-center gap-2 transition-all active:scale-95"
        >
          <svg className="w-[18px] h-[18px] text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-3z" />
          </svg>
          Gallery
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 py-3.5 rounded-xl btn-gradient font-semibold text-[14px] flex justify-center items-center gap-2 transition-all active:scale-95"
        >
          <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          Camera
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
