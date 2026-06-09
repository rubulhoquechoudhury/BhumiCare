import { SupabaseClient } from "@supabase/supabase-js";
import { AgentContext, SoilParams, Database } from "@/types/database";

/**
 * Context Engine — The brain of the agentic system.
 * Fetches all relevant memory from DB before every Gemini call.
 */
export async function buildAgentContext(
  supabase: SupabaseClient<Database>,
  userId: string,
  sessionId: string | null
): Promise<AgentContext> {
  const [
    userResult,
    currentSoilResult,
    previousSoilsResult,
    sessionMessagesResult,
    previousSessionsResult,
  ] = await Promise.all([
    // 1. User name
    supabase.from("users").select("name").eq("id", userId).single(),

    // 2. Current session's soil snapshot
    sessionId
      ? supabase
          .from("soil_snapshots")
          .select("ph, moisture, nitrogen, phosphorus, potassium")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()
      : Promise.resolve({ data: null, error: null }),

    // 3. User's last 5 soil snapshots (historical)
    supabase
      .from("soil_snapshots")
      .select("ph, moisture, nitrogen, phosphorus, potassium, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),

    // 4. Current session's message history
    sessionId
      ? supabase
          .from("chat_messages")
          .select("role, content")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true })
          .limit(50)
      : Promise.resolve({ data: null, error: null }),

    // 5. Last 3 other sessions (cross-session memory)
    supabase
      .from("chat_sessions")
      .select("title, summary, created_at")
      .eq("user_id", userId)
      .neq("id", sessionId || "")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  // Build current soil
  let currentSoil: SoilParams | null = null;
  if (currentSoilResult.data) {
    const s = currentSoilResult.data;
    currentSoil = {
      ph: Number(s.ph) || 0,
      moisture: Number(s.moisture) || 0,
      nitrogen: Number(s.nitrogen) || 0,
      phosphorus: Number(s.phosphorus) || 0,
      potassium: Number(s.potassium) || 0,
    };
  }

  // Build previous soils
  const previousSoils = (previousSoilsResult.data || []).map((s) => ({
    params: {
      ph: Number(s.ph) || 0,
      moisture: Number(s.moisture) || 0,
      nitrogen: Number(s.nitrogen) || 0,
      phosphorus: Number(s.phosphorus) || 0,
      potassium: Number(s.potassium) || 0,
    },
    date: s.created_at || "",
  }));

  // Build session messages
  const sessionMessages = (sessionMessagesResult.data || []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Build previous sessions
  const previousSessions = (previousSessionsResult.data || []).map((s) => ({
    title: s.title,
    summary: s.summary,
    date: s.created_at || "",
  }));

  return {
    currentSoil,
    previousSoils,
    sessionMessages,
    previousSessions,
    userName: userResult.data?.name || "User",
  };
}
