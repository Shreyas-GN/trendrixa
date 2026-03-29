import type { PredictionResponse, LoggedPrediction, PredictionAnalytics, Duration } from "@/types";

const STORAGE_KEY = "trendrixa_v2_logs";
const MAX_LOGS = 100;

export const predictionLogger = {
  /**
   * Reads all logs from localStorage
   */
  getAllLogs(): LoggedPrediction[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to read logs:", e);
      return [];
    }
  },

  /**
   * Logs a new prediction and returns its generated unique ID
   */
  logPrediction(prediction: PredictionResponse, duration: Duration): string {
    const logs = this.getAllLogs();
    
    const newLog: LoggedPrediction = {
      ...prediction,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      duration,
    };

    logs.unshift(newLog);

    // Keep only the most recent MAX_LOGS
    const trimmedLogs = logs.slice(0, MAX_LOGS);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
    } catch (e) {
      console.error("Failed to save log:", e);
    }

    return newLog.id;
  },

  /**
   * Updates an existing log with its real-world outcome
   */
  markOutcome(id: string, outcome: "WIN" | "LOSS"): void {
    const logs = this.getAllLogs();
    const index = logs.findIndex(log => log.id === id);
    if (index !== -1) {
      logs[index].outcome = outcome;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      } catch (e) {
        console.error("Failed to update log outcome:", e);
      }
    }
  },

  /**
   * Clears all predictions from localStorage
   */
  clearLogs(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  /**
   * Computes the PredictionAnalytics statistics from all logs
   */
  getAnalytics(): PredictionAnalytics {
    const logs = this.getAllLogs();

    const stats: PredictionAnalytics = {
      totalPredictions: logs.length,
      totalTrades: 0,
      markedOutcomes: 0,
      winRate: 0,
      winRateByConfidence: {},
      winRateByCondition: {},
    };

    if (logs.length === 0) return stats;

    let wins = 0;
    
    // Track wins/totals for buckets
    const confBuckets: Record<string, { wins: number; total: number }> = {};
    const condBuckets: Record<string, { wins: number; total: number }> = {};

    logs.forEach(log => {
      if (log.direction === "NO_TRADE") return;
      
      stats.totalTrades++;
      
      if (log.outcome) {
        stats.markedOutcomes++;
        const isWin = log.outcome === "WIN";
        if (isWin) wins++;

        // Confidence bucket math (e.g. "60-69", "70-79", etc.)
        const confGrounded = Math.floor(log.confidence / 10) * 10;
        const confKey = `${confGrounded}-${confGrounded + 9}%`;
        
        if (!confBuckets[confKey]) confBuckets[confKey] = { wins: 0, total: 0 };
        confBuckets[confKey].total++;
        if (isWin) confBuckets[confKey].wins++;

        // Market Condition bucket math
        const condKey = log.marketCondition || "Unknown";
        if (!condBuckets[condKey]) condBuckets[condKey] = { wins: 0, total: 0 };
        condBuckets[condKey].total++;
        if (isWin) condBuckets[condKey].wins++;
      }
    });

    stats.winRate = stats.markedOutcomes > 0 
      ? Math.round((wins / stats.markedOutcomes) * 100) 
      : 0;

    // Resolve buckets into percentages
    Object.keys(confBuckets).forEach(key => {
      stats.winRateByConfidence[key] = Math.round((confBuckets[key].wins / confBuckets[key].total) * 100);
    });

    Object.keys(condBuckets).forEach(key => {
      stats.winRateByCondition[key] = Math.round((condBuckets[key].wins / condBuckets[key].total) * 100);
    });

    return stats;
  }
};
