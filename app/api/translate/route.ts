import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

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
  { client: deepseekClient, model: "deepseek-chat" },
  { client: openrouterClient, model: "deepseek/deepseek-chat" },
  { client: openrouterClient, model: "google/gemini-2.0-flash-001" },
];

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi",
  as: "Assamese",
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text, targetLang } = await request.json();

    if (!text || !targetLang || targetLang === "en") {
      return NextResponse.json({ translated: text });
    }

    const langName = LANG_NAMES[targetLang] || targetLang;

    const prompt = `You are a professional agricultural translator specializing in tea farming in India.

Translate the following text to ${langName}. Follow these rules strictly:
1. Preserve ALL technical terms (pH, N, P, K, CTC, mg/kg, %, NPK) — show original after translation in parentheses where helpful
2. Keep all numbers, percentages, units, and bullet points exactly as-is
3. Translate naturally for a farmer's understanding, NOT word-by-word
4. If a local farming term exists in ${langName}, use it
5. Preserve markdown formatting (**, *, ##, bullet points)
6. For soil parameter status like "✅ Good" or "❌ Low", keep the emoji and translate only the label

Text to translate:
"""
${text}
"""

Return ONLY the translated text, no explanations, no preamble.`;

    let lastError: Error | null = null;
    for (const { client, model } of MODEL_CHAIN) {
      try {
        const completion = await client.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });
        const translated = completion.choices[0].message.content || text;
        return NextResponse.json({ translated });
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        continue;
      }
    }

    console.error("Translation failed:", lastError);
    return NextResponse.json({ translated: text }); // Fallback to original
  } catch (error) {
    console.error("Translate API error:", error);
    return NextResponse.json({ translated: "" }, { status: 500 });
  }
}
