import type { Duration } from "@/types";

/**
 * Builds the system instruction for the Gemini model.
 * This sets the AI's persona and enforces strict output formatting.
 */
export function getSystemInstruction(): string {
  return `You are an expert financial chart analyst specializing in short-term price action and candlestick pattern recognition. You analyze trading chart screenshots and provide directional predictions based solely on visible technical patterns.

RULES:
- You MUST respond with ONLY a valid JSON object. No markdown, no code fences, no extra text.
- The JSON object must contain exactly three fields:
  1. "direction": either "HIGH" or "LOW" (string, uppercase)
  2. "confidence": a number from 0 to 100 (integer, no decimals)
  3. "reasoning": a brief 1-2 sentence explanation citing specific visible patterns (string)

EXAMPLE OUTPUT:
{"direction":"HIGH","confidence":75,"reasoning":"Bullish engulfing pattern visible at key support with upward-sloping moving average."}`;
}

/**
 * Builds the user prompt for chart analysis, incorporating the trade duration.
 */
export function getUserPrompt(duration: Duration): string {
  const durationLabel: Record<Duration, string> = {
    "1m": "1 minute",
    "2m": "2 minutes",
    "5m": "5 minutes",
  };

  return `Analyze this trading chart image. Based on the visible candlestick patterns, trend direction, support/resistance levels, and short-term momentum, predict the most probable price direction for the next ${durationLabel[duration]}.

Focus on:
- Current trend direction and strength
- Recent candlestick patterns (engulfing, doji, hammer, shooting star, etc.)
- Key support/resistance zones visible on the chart
- Volume and momentum indicators if visible
- Any divergence signals

Provide your prediction as a JSON object with "direction", "confidence", and "reasoning" fields.`;
}
