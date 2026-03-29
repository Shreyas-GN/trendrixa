/** Duration options for trade prediction horizon */
export type Duration = "1m" | "2m" | "5m";

/** The structured prediction response from the AI */
export interface PredictionResponse {
  direction: "HIGH" | "LOW";
  confidence: number; // 0–100
  reasoning: string;
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
