"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { DurationSelector } from "@/components/DurationSelector";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { PredictionResult } from "@/components/PredictionResult";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { compressImage } from "@/lib/imageProcessor";
import { predictionLogger } from "@/lib/predictionLogger";
import type { Duration, AnalyzeRequest, AnalyzeAPIResponse, PredictionResponse } from "@/types";

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [duration, setDuration] = useState<Duration>("1m");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const handleImageSelected = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const compressedBase64 = await compressImage(file, 768, 0.8);
      setImagePreview(compressedBase64);
    } catch (e) {
      console.error("Compression failed:", e);
      setImagePreview(URL.createObjectURL(file));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImage = () => {
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

      const newId = predictionLogger.logPrediction(data.data, duration);
      setCurrentLogId(newId);

    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkOutcome = (outcome: "WIN" | "LOSS") => {
    if (currentLogId) {
      predictionLogger.markOutcome(currentLogId, outcome);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setCurrentLogId(null);
    handleClearImage();
  };

  return (
    <div className="flex flex-col min-h-screen relative max-w-lg mx-auto w-full p-4 sm:p-8 sm:py-12 flex-1 justify-center z-10">
      
      {/* Background decorations for that dreamy glass look */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d3def5] rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e3def5] rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50 pointer-events-none"></div>

      <div className="glass-main flex flex-col w-full relative sm:min-h-[800px] overflow-hidden flex-1 shadow-2xl">
        <Header onToggleAnalytics={() => setIsAnalyticsOpen(true)} />

        {isAnalyticsOpen && (
          <AnalyticsDashboard onClose={() => setIsAnalyticsOpen(false)} />
        )}

        <main className="flex-1 flex flex-col p-5 gap-6 overflow-y-auto pb-8 z-10">
          {!prediction ? (
            <div className="flex flex-col flex-1">
              <div className="flex flex-col gap-6">
                {!imagePreview ? (
                  <ImageUploader onImageSelected={handleImageSelected} />
                ) : (
                  <div className="glass-inner p-2 h-[260px] flex items-center justify-center relative overlow-hidden">
                    <div className="w-full h-full rounded-2xl overflow-hidden bg-[#e2e8f0] flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Chart Preview"
                        className="max-h-full max-w-full object-cover"
                      />
                    </div>
                    <button
                      onClick={handleClearImage}
                      className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 backdrop-blur-md shadow-sm transition-all border border-white"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <DurationSelector selected={duration} onChange={setDuration} />
                
                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-slide-up flex gap-3 items-start shadow-sm">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-8">
                <AnalyzeButton
                  onClick={handleAnalyze}
                  disabled={!imagePreview}
                  isLoading={isLoading}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-center">
              <PredictionResult 
                prediction={prediction} 
                onReset={handleReset}
                onMarkOutcome={handleMarkOutcome}
              />
            </div>
          )}
        </main>

        <LoadingOverlay isVisible={isLoading} />
      </div>
    </div>
  );
}
