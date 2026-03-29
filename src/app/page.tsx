"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { DurationSelector } from "@/components/DurationSelector";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { PredictionResult, type PredictionData } from "@/components/PredictionResult";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { compressImage } from "@/lib/imageProcessor";
import type { Duration, AnalyzeRequest, AnalyzeAPIResponse } from "@/types";

interface LoggedPrediction extends PredictionData {
  timestamp: string;
  duration: Duration;
}

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [duration, setDuration] = useState<Duration>("1m");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load any previously logged predictions (just to verify we can access them, no UI for history yet)
  useEffect(() => {
    try {
      const logs = localStorage.getItem("trendrixa_logs");
      if (logs) {
        console.log("Loaded historical predictions:", JSON.parse(logs));
      }
    } catch (e) {
      console.error("Failed to load logs from local storage");
    }
  }, []);

  const handleImageSelected = async (file: File) => {
    setImageFile(file);
    setIsLoading(true);
    setError(null);
    try {
      // Compress the image before showing the preview/using it for API payload later
      const compressedBase64 = await compressImage(file, 768, 0.8);
      setImagePreview(compressedBase64);
    } catch (e) {
      console.error("Compression failed:", e);
      // Fallback to uncompressed preview if compression fails
      setImagePreview(URL.createObjectURL(file));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const payload: AnalyzeRequest = {
        image: imagePreview,
        duration,
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: AnalyzeAPIResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(!data.success ? data.error : "Failed to analyze chart");
      }

      setPrediction(data.data);

      // Log to local storage
      try {
        const existingLogs = localStorage.getItem("trendrixa_logs");
        const logs: LoggedPrediction[] = existingLogs ? JSON.parse(existingLogs) : [];
        logs.unshift({
          ...data.data,
          timestamp: new Date().toISOString(),
          duration
        });
        // Keep only last 50 predictions to avoid local storage limits
        localStorage.setItem("trendrixa_logs", JSON.stringify(logs.slice(0, 50)));
      } catch (e) {
        console.error("Failed to save prediction to local storage", e);
      }

    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    handleClearImage();
  };

  return (
    <div className="flex flex-col min-h-screen relative max-w-lg mx-auto border-x border-white/5 sm:my-4 sm:rounded-3xl sm:border sm:shadow-2xl sm:min-h-[850px] overflow-hidden bg-trading-bg">
      <Header />

      <main className="flex-1 flex flex-col p-4 gap-6 overflow-y-auto pb-8">
        {!prediction ? (
          <>
            {/* Input Section */}
            <div className="flex flex-col gap-4">
              {!imagePreview ? (
                <ImageUploader onImageSelected={handleImageSelected} />
              ) : (
                <div className="w-full relative rounded-2xl overflow-hidden glass-card p-2 border border-blue-500/30">
                  <div className="relative aspect-auto max-h-[40vh] w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Chart Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={handleClearImage}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-sm transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <DurationSelector selected={duration} onChange={setDuration} />
              
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-trading-low/10 border border-trading-low/20 text-trading-low/90 text-sm font-medium animate-slide-up flex gap-3 items-start">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6">
              <AnalyzeButton
                onClick={handleAnalyze}
                disabled={!imagePreview}
                isLoading={isLoading}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full justify-center pb-12">
            <PredictionResult prediction={prediction} onReset={handleReset} />
          </div>
        )}
      </main>

      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}
