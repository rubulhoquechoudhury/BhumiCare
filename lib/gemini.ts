import OpenAI from "openai";
import { AgentContext, SoilParams } from "@/types/database";
import { TEA_SOIL_STANDARDS } from "@/lib/tea-standards";

// ═══ API CLIENTS SETUP ═══
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

// Fallback chain of providers and models
const MODEL_CHAIN = [
  { client: deepseekClient, model: "deepseek-chat", name: "DeepSeek Official" },
  { client: openrouterClient, model: "deepseek/deepseek-chat", name: "OpenRouter DeepSeek" },
  { client: openrouterClient, model: "google/gemini-2.0-flash-001", name: "OpenRouter Gemini 2.0" },
  { client: openrouterClient, model: "google/gemini-2.0-flash-lite-preview-02-05:free", name: "OpenRouter Gemini Free" },
];

/**
 * Build the full system prompt with all injected context.
 */
function buildSystemPrompt(context: AgentContext, newSoilData?: SoilParams): string {
  let prompt = `You are BhumiCare AI — an intelligent, friendly soil advisor specializing in tea (Camellia sinensis) cultivation.
You have MEMORY. You remember all previous conversations and soil analyses for this user.

## Your Personality
- Warm, encouraging, professional
- Use emojis sparingly (✅ ❌ 🌿 📊)
- Format responses in clean markdown
- Be specific with numbers and suggestions
- Reference past data naturally, like a human advisor would

## Tea Soil Standards
| Parameter | Min | Max | Ideal | Unit |
|-----------|-----|-----|-------|------|
| pH | ${TEA_SOIL_STANDARDS.ph.min} | ${TEA_SOIL_STANDARDS.ph.max} | ${TEA_SOIL_STANDARDS.ph.ideal} | — |
| Moisture | ${TEA_SOIL_STANDARDS.moisture.min} | ${TEA_SOIL_STANDARDS.moisture.max} | ${TEA_SOIL_STANDARDS.moisture.ideal} | % |
| Nitrogen | ${TEA_SOIL_STANDARDS.nitrogen.min} | ${TEA_SOIL_STANDARDS.nitrogen.max} | ${TEA_SOIL_STANDARDS.nitrogen.ideal} | mg/kg |
| Phosphorus | ${TEA_SOIL_STANDARDS.phosphorus.min} | ${TEA_SOIL_STANDARDS.phosphorus.max} | ${TEA_SOIL_STANDARDS.phosphorus.ideal} | mg/kg |
| Potassium | ${TEA_SOIL_STANDARDS.potassium.min} | ${TEA_SOIL_STANDARDS.potassium.max} | ${TEA_SOIL_STANDARDS.potassium.ideal} | mg/kg |

## Intelligence Rules
1. NEVER ask for soil values you already have in context.
2. Reference previous analyses naturally: "Last time your pH was 3.8, now it's 4.5 — great improvement!"
3. Detect changes between old and new soil readings. Highlight improvements ✅ and degradations ❌.
4. Generate progressive recommendations — build on what was said before.
5. Remember user corrections during the session.
6. Continue the discussion naturally — NEVER restart as if it's a new conversation.
7. If user mentions improvement without new data, reference the last known values.
8. When analyzing soil, ALWAYS format the parameter analysis as a professional Markdown Table with columns: Parameter, Current, Ideal Range, Status (use ✅/❌/⚠️ emojis), and AI Note.
9. Keep the response highly professional, structured, and visually appealing. Use H3 (###) for sections and bold text where appropriate.

## User: ${context.userName}`;

  if (newSoilData) {
    prompt += `

## 🆕 NEW Soil Data Just Submitted:
- pH: ${newSoilData.ph}
- Moisture: ${newSoilData.moisture}%
- Nitrogen (N): ${newSoilData.nitrogen} mg/kg
- Phosphorus (P): ${newSoilData.phosphorus} mg/kg
- Potassium (K): ${newSoilData.potassium} mg/kg

Analyze this data. Compare with any previous readings below.`;
  }

  if (context.currentSoil && !newSoilData) {
    prompt += `

## Current Session's Soil Data:
- pH: ${context.currentSoil.ph}
- Moisture: ${context.currentSoil.moisture}%
- Nitrogen: ${context.currentSoil.nitrogen} mg/kg
- Phosphorus: ${context.currentSoil.phosphorus} mg/kg
- Potassium: ${context.currentSoil.potassium} mg/kg`;
  }

  if (context.previousSoils.length > 0) {
    prompt += `

## Previous Soil Readings (most recent first):`;
    context.previousSoils.forEach((s, i) => {
      const date = new Date(s.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      prompt += `
${i + 1}. [${date}] pH=${s.params.ph}, M=${s.params.moisture}%, N=${s.params.nitrogen}, P=${s.params.phosphorus}, K=${s.params.potassium}`;
    });
  }

  if (context.previousSessions.length > 0) {
    prompt += `

## Previous Session Summaries:`;
    context.previousSessions.forEach((s) => {
      const date = new Date(s.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      prompt += `
- [${date}] "${s.title}"${s.summary ? ` — ${s.summary}` : ""}`;
    });
  }

  return prompt;
}

// ═══ MAIN AGENT FUNCTION ═══

/**
 * Unified agent response.
 * Uses a robust fallback chain starting with DeepSeek Official, then falling back to OpenRouter.
 */
export async function agentRespond(
  userMessage: string,
  context: AgentContext,
  newSoilData?: SoilParams
): Promise<string> {
  const systemPrompt = buildSystemPrompt(context, newSoilData);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [
    { role: "system", content: systemPrompt },
    { role: "assistant", content: `I understand. I'm BhumiCare AI with full memory access. I know ${context.userName}'s soil history and will reference past data naturally. Ready to help.` }
  ];

  for (const msg of context.sessionMessages) {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  messages.push({ role: "user", content: userMessage });

  let lastError: Error | null = null;

  // Try each model in the fallback chain
  for (const { client, model, name } of MODEL_CHAIN) {
    try {
      console.log(`[AI Chain] Trying model: ${name} (${model})`);
      const completion = await client.chat.completions.create({
        messages,
        model: model,
      });
      console.log(`[AI Chain] ✓ Success with: ${name}`);
      return completion.choices[0].message.content || "Sorry, I could not generate a response.";
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Chain] ✗ ${name} failed: ${lastError.message}`);
      // Continue to the next model for ANY error (404, 401, 429, etc)
      continue;
    }
  }

  throw lastError || new Error("ALL_PROVIDERS_FAILED");
}

/**
 * Generate a short summary of a session for cross-session memory.
 */
export async function generateSessionSummary(
  messages: { role: string; content: string }[]
): Promise<string> {
  const conversationText = messages
    .slice(0, 10)
    .map((m) => `${m.role}: ${m.content.slice(0, 200)}`)
    .join("\n");

  for (const { client, model, name } of MODEL_CHAIN) {
    try {
      const completion = await client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Summarize this soil analysis conversation in 1-2 short sentences. Focus on key findings and recommendations:\n\n${conversationText}`,
          }
        ],
        model: model,
      });
      return completion.choices[0].message.content || "Session summary";
    } catch {
      continue;
    }
  }

  return "Soil analysis session";
}
