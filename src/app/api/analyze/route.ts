import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemInstruction, getUserPrompt } from "@/lib/prompt";
import type {
  AnalyzeRequest,
  AnalyzeAPIResponse,
  PredictionResponse,
  Duration,
} from "@/types";

const VALID_DURATIONS: Duration[] = ["1m", "2m", "5m"];
const MAX_RETRIES = 1;

/**
 * Validate and parse the raw AI text into a PredictionResponse.
 * Throws if the response doesn't match the expected schema.
 * Includes graceful degradation for missing structured fields.
 */
function parseAIResponse(raw: string): PredictionResponse {
  // Strip markdown code fences if the model wraps them
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }

  const parsed = JSON.parse(cleaned);

  // Validate direction
  if (parsed.direction !== "HIGH" && parsed.direction !== "LOW" && parsed.direction !== "NO_TRADE") {
    throw new Error(`Invalid direction: ${parsed.direction}`);
  }

  // Validate confidence
  const confidence = Number(parsed.confidence);
  if (isNaN(confidence) || confidence < 0 || confidence > 100) {
    throw new Error(`Invalid confidence: ${parsed.confidence}`);
  }

  // Validate reasoning
  if (typeof parsed.reasoning !== "string" || parsed.reasoning.length === 0) {
    throw new Error("Missing or empty reasoning");
  }

  // Parse structured fields with fallback defaults in case AI misses a field
  const trend = typeof parsed.trend === "string" ? parsed.trend : "Unclear";
  const pattern = typeof parsed.pattern === "string" ? parsed.pattern : "None";
  const momentum = typeof parsed.momentum === "string" ? parsed.momentum : "Unknown";
  const marketCondition = typeof parsed.marketCondition === "string" ? parsed.marketCondition : "Unclear";
  const riskLevel = typeof parsed.riskLevel === "string" ? parsed.riskLevel : "Unknown";

  const prediction: PredictionResponse = {
    direction: parsed.direction as "HIGH" | "LOW" | "NO_TRADE",
    confidence: Math.round(confidence),
    reasoning: parsed.reasoning,
    trend,
    pattern,
    momentum,
    marketCondition,
    riskLevel,
  };

  // V2 Enhance: Server-side Confidence Trade Filter
  // If the AI somehow recommends a trade but is not confident, forcibly override to NO_TRADE.
  if (prediction.confidence < 65 && prediction.direction !== "NO_TRADE") {
    prediction.direction = "NO_TRADE";
    prediction.riskLevel = "High";
    prediction.reasoning = `Confidence too low (${prediction.confidence}%) for a high-probability trade. System filtered as NO_TRADE. ${prediction.reasoning}`;
  }

  return prediction;
}

/**
 * Call Gemini Vision API with the chart image and duration.
 * Retries once on parse failure before giving up.
 */
async function callGemini(
  imageBase64: string,
  duration: Duration
): Promise<PredictionResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: getSystemInstruction(),
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  // Strip the data URL prefix to get raw base64
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: "image/jpeg",
    },
  };

  const userPrompt = getUserPrompt(duration);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent([userPrompt, imagePart]);
      const response = result.response;
      const text = response.text();

      return parseAIResponse(text);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Only retry on parse errors, not on API errors
      if (attempt < MAX_RETRIES && lastError.message.includes("Invalid")) {
        console.warn(
          `Gemini response parse failed (attempt ${attempt + 1}), retrying...`
        );
        continue;
      }
    }
  }

  throw lastError || new Error("Failed to get valid response from Gemini");
}

// ─── Route Handler ─────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    const body: AnalyzeRequest = await request.json();

    // ─── Input Validation ──────────────────────────────────────────
    if (!body.image || typeof body.image !== "string") {
      return Response.json(
        { success: false, error: "Missing or invalid image data" } satisfies AnalyzeAPIResponse,
        { status: 400 }
      );
    }

    if (!body.duration || !VALID_DURATIONS.includes(body.duration)) {
      return Response.json(
        { success: false, error: "Invalid duration. Use 1m, 2m, or 5m." } satisfies AnalyzeAPIResponse,
        { status: 400 }
      );
    }

    // ─── Call Gemini ───────────────────────────────────────────────
    const prediction = await callGemini(body.image, body.duration);

    return Response.json(
      { success: true, data: prediction } satisfies AnalyzeAPIResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Analyze API error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return Response.json(
      { success: false, error: message } satisfies AnalyzeAPIResponse,
      { status: 502 }
    );
  }
}
