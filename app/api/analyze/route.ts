import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAgentContext } from "@/lib/agent-context";
import { agentRespond, generateSessionSummary } from "@/lib/gemini";
import { SoilParams } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      message,
      sessionId: incomingSessionId,
      soilParams,
    }: {
      message: string;
      sessionId?: string;
      soilParams?: SoilParams;
    } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // --- Step 1: Get or Create Session ---
    let sessionId = incomingSessionId;

    if (!sessionId) {
      const title = soilParams
        ? `Soil Analysis — pH ${soilParams.ph}`
        : "New Conversation";

      const { data: session, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          title,
          status: "active",
        })
        .select()
        .single();

      if (sessionError || !session) {
        console.error("Session creation error:", sessionError);
        return NextResponse.json(
          { error: "Failed to create session" },
          { status: 500 }
        );
      }

      sessionId = session.id;
    }

    // --- Step 2: If soil data provided, save snapshot ---
    if (soilParams) {
      const { error: snapError } = await supabase
        .from("soil_snapshots")
        .insert({
          session_id: sessionId,
          user_id: user.id,
          ph: soilParams.ph,
          moisture: soilParams.moisture,
          nitrogen: soilParams.nitrogen,
          phosphorus: soilParams.phosphorus,
          potassium: soilParams.potassium,
        });

      if (snapError) {
        console.error("Snapshot save error:", snapError);
      }

      // Also save to soil_records for backward compatibility
      await supabase.from("soil_records").insert({
        user_id: user.id,
        ph: soilParams.ph,
        moisture: soilParams.moisture,
        nitrogen: soilParams.nitrogen,
        phosphorus: soilParams.phosphorus,
        potassium: soilParams.potassium,
      });

      // Update session title with soil info
      await supabase
        .from("chat_sessions")
        .update({
          title: `Soil Analysis — pH ${soilParams.ph}, N ${soilParams.nitrogen}`,
        })
        .eq("id", sessionId);
    }

    // --- Step 3: Save user message ---
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      user_id: user.id,
      role: "user",
      content: message,
    });

    // --- Step 4: Build Agent Context (memory from DB) ---
    const context = await buildAgentContext(supabase, user.id, sessionId);

    // --- Step 5: Get AI Response (dual-provider with auto-fallback) ---
    let aiResponse: string;
    try {
      aiResponse = await agentRespond(message, context, soilParams);
    } catch (aiError: unknown) {
      const errorMessage = aiError instanceof Error ? aiError.message : String(aiError);

      if (errorMessage === "ALL_PROVIDERS_FAILED") {
        return NextResponse.json(
          { error: "AI providers are temporarily unavailable. Please try again in a minute." },
          { status: 503 }
        );
      }

      if (errorMessage.includes("429") || errorMessage.includes("quota")) {
        return NextResponse.json(
          { error: "AI is busy right now. Please wait 30 seconds and try again." },
          { status: 429 }
        );
      }

      if (errorMessage.includes("402") || errorMessage.includes("Insufficient")) {
        return NextResponse.json(
          { error: "AI credit limit reached. Trying fallback provider..." },
          { status: 402 }
        );
      }

      console.error("AI Error:", errorMessage);
      return NextResponse.json(
        { error: "AI could not respond. Please try again." },
        { status: 500 }
      );
    }

    // --- Step 6: Save AI response ---
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      user_id: user.id,
      role: "ai",
      content: aiResponse,
    });

    // --- Step 7: Update session summary (async, non-blocking) ---
    const messageCount = context.sessionMessages.length;
    if (messageCount > 0 && messageCount % 4 === 0) {
      generateSessionSummary([
        ...context.sessionMessages,
        { role: "user", content: message },
        { role: "ai", content: aiResponse },
      ]).then((summary) => {
        supabase
          .from("chat_sessions")
          .update({ summary })
          .eq("id", sessionId!)
          .then(() => {});
      });
    }

    return NextResponse.json({
      response: aiResponse,
      sessionId,
    });
  } catch (error: unknown) {
    console.error("Agent API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: errorMessage.includes("Unauthorized") ? "Please log in again." : "Something went wrong. Please try again." },
      { status: errorMessage.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
