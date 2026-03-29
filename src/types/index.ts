/** Duration options for trade prediction horizon */
export type Duration = "1m" | "2m" | "5m";

/** The structured prediction response from the AI */
export interface PredictionResponse {
  direction: "HIGH" | "LOW" | "NO_TRADE";
  confidence: number; // 0–100
  reasoning: string;
  trend: string;          // e.g., "Uptrend" | "Downtrend" | "Sideways"
  pattern: string;        // e.g., "Bullish Engulfing" | "Doji" | "None"
  momentum: string;       // e.g., "Strong" | "Moderate" | "Weak"
  marketCondition: string; // e.g., "Trending" | "Ranging" | "Volatile"
  riskLevel: string;      // e.g., "Low" | "Medium" | "High"
}

/** Request body sent from the client to /api/analyze */
export interface AnalyzeRequest {
  image: string; // base64-encoded JPEG (data:image/jpeg;base64,...)
  duration: Duration;
}

/** Successful API response from /api/analyze */
export interface AnalyzeSuccessResponse {
  success: true;
  data: PredictionResponse;
}

/** Failed API response from /api/analyze */
export interface AnalyzeErrorResponse {
  success: false;
  error: string;
}

/** Union type of all possible /api/analyze responses */
export type AnalyzeAPIResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;

/** A logged prediction with outcome tracking for analytics */
export interface LoggedPrediction extends PredictionResponse {
  id: string;             // Unique identifier for the log entry
  timestamp: string;      // ISO string
  duration: Duration;
  outcome?: "WIN" | "LOSS"; // User manually marks this after the trade
}

/** Computed analytics statistics */
export interface PredictionAnalytics {
  totalPredictions: number;
  totalTrades: number;       // Excludes NO_TRADE
  markedOutcomes: number;    // Trades with WIN/LOSS recorded
  winRate: number;           // Global win rate percentage (0-100)
  winRateByConfidence: Record<string, number | null>; // e.g., "65-74": 60. null if no outcomes
  winRateByCondition: Record<string, number | null>;  // e.g., "Trending": 72. null if no outcomes
}
