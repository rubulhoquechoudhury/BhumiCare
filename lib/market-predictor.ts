import OpenAI from "openai";

// ═══ Market Prediction Types ═══

export interface MarketSnapshot {
  recorded_date: string;
  price_per_kg: number;
  trend: "rising" | "stable" | "falling";
  region: string;
}

export interface MarketPrediction {
  signal: "SELL_NOW" | "HOLD_STOCK" | "WAIT";
  trend: "RISING" | "STABLE" | "FALLING";
  confidence: number;           // 0–100
  priceMovement: string;        // e.g. "+12–18% over 3 weeks"
  timeframe: string;            // e.g. "Next 2–3 weeks"
  reasoning: string;            // Plain-language explanation
  factors: string[];            // Key market drivers (3–5 items)
  regionalNote: string;         // Region-specific insight
  currentPriceEstimate: string; // e.g. "₹190–200/kg"
  generatedAt: string;
}

// ═══ Flush Season Detection ═══

function getFlushSeason(month: number): string {
  if (month >= 3 && month <= 5) return "First Flush (Spring) — Premium quality, high demand";
  if (month >= 6 && month <= 7) return "Second Flush (Summer) — Peak production, muscatel flavors";
  if (month >= 7 && month <= 9) return "Rain Flush (Monsoon) — Lower quality, surplus supply";
  if (month >= 10 && month <= 11) return "Autumn Flush — Niche demand, moderate prices";
  return "Off-season — Low production, prices may be higher for stored stock";
}

// ═══ AI Clients (same fallback chain as gemini.ts) ═══

const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "dummy_key",
  baseURL: "https://api.deepseek.com",
});

const openrouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "dummy_key",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-OpenRouter-Title": "BhumiCare AI",
  },
});

const MODEL_CHAIN = [
  { client: deepseekClient, model: "deepseek-chat", name: "DeepSeek" },
  { client: openrouterClient, model: "deepseek/deepseek-chat", name: "OR-DeepSeek" },
  { client: openrouterClient, model: "google/gemini-2.0-flash-001", name: "OR-Gemini" },
];

// ═══ Main Prediction Function ═══

export async function generateMarketPrediction(
  region: string = "assam",
  historicalSnapshots: MarketSnapshot[],
  soilQualityScore?: number
): Promise<MarketPrediction> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const flushSeason = getFlushSeason(month);

  // Build trend summary from historical data
  const recentPrices = historicalSnapshots.slice(-6).map((s) => ({
    month: new Date(s.recorded_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    price: s.price_per_kg,
    trend: s.trend,
  }));

  const latestPrice = recentPrices[recentPrices.length - 1]?.price ?? 185;
  const sixMonthsAgoPrice = recentPrices[0]?.price ?? 170;
  const priceChangePct = (((latestPrice - sixMonthsAgoPrice) / sixMonthsAgoPrice) * 100).toFixed(1);

  const prompt = `You are a senior tea market analyst specializing in Indian tea markets (Assam, Darjeeling, Nilgiri).

Current Context:
- Date: ${now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
- Season: ${flushSeason}
- Region: ${region.charAt(0).toUpperCase() + region.slice(1)}
- Current avg price: ₹${latestPrice}/kg
- 6-month price change: ${priceChangePct}%
- Recent price trend: ${recentPrices.map((p) => `${p.month}: ₹${p.price} (${p.trend})`).join(", ")}
${soilQualityScore !== undefined ? `- Farmer's soil quality score: ${soilQualityScore}/100 (affects leaf quality and price fetched)` : ""}

Based on this data, provide a JSON market prediction. Return ONLY valid JSON, no markdown, no extra text:

{
  "signal": "SELL_NOW" | "HOLD_STOCK" | "WAIT",
  "trend": "RISING" | "STABLE" | "FALLING",
  "confidence": <integer 55-92>,
  "priceMovement": "<concise estimate like '+8–15% over next 3 weeks'>",
  "timeframe": "<e.g. 'Next 2–3 weeks'>",
  "reasoning": "<2-3 sentences in simple language a farmer understands. Start with current situation, explain what to expect, and why.>",
  "factors": ["<factor 1>", "<factor 2>", "<factor 3>", "<factor 4>"],
  "regionalNote": "<1 sentence specific to ${region} region>",
  "currentPriceEstimate": "₹<low>–<high>/kg"
}

Rules:
- Be realistic and data-driven
- If it's First/Second Flush, prices tend to be higher
- If it's Rain Flush, advise caution (oversupply)
- reasoning must be warm, clear, and farmer-friendly (not technical jargon)
- confidence should never exceed 92 (this is AI, not real market data)`;

  let lastError: Error | null = null;

  for (const { client, model, name } of MODEL_CHAIN) {
    try {
      console.log(`[Market AI] Trying ${name}...`);
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4, // Lower temp for more consistent JSON
      });

      const raw = completion.choices[0].message.content || "";
      // Extract JSON (handle cases where model adds extra text)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");

      const parsed = JSON.parse(jsonMatch[0]) as Omit<MarketPrediction, "generatedAt">;
      console.log(`[Market AI] ✓ Success with ${name}`);

      return {
        ...parsed,
        generatedAt: now.toISOString(),
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[Market AI] ✗ ${name}: ${lastError.message}`);
      continue;
    }
  }

  // Fallback prediction if all AI models fail
  console.warn("[Market AI] All models failed, using fallback prediction");
  return {
    signal: "HOLD_STOCK",
    trend: "STABLE",
    confidence: 55,
    priceMovement: "±5% over next 2 weeks",
    timeframe: "Next 2 weeks",
    reasoning: "Market data is currently unavailable. Based on seasonal patterns, prices appear stable. Consider holding your stock and checking again tomorrow for a fresh prediction.",
    factors: [
      "Seasonal patterns suggest stable demand",
      "No major disruptions reported",
      "Export demand steady",
      "Check again for updated AI prediction",
    ],
    regionalNote: `${region.charAt(0).toUpperCase() + region.slice(1)} region markets are typically active during this period.`,
    currentPriceEstimate: `₹${(latestPrice - 5).toFixed(0)}–${(latestPrice + 5).toFixed(0)}/kg`,
    generatedAt: now.toISOString(),
  };
}
