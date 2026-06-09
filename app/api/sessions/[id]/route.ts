import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sessions/[id] — load full session with messages + soil snapshot
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Fetch messages
    const { data: messages } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    // Fetch soil snapshot
    const { data: snapshot } = await supabase
      .from("soil_snapshots")
      .select("ph, moisture, nitrogen, phosphorus, potassium, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const soilSnapshot = snapshot
      ? {
          ph: Number(snapshot.ph) || 0,
          moisture: Number(snapshot.moisture) || 0,
          nitrogen: Number(snapshot.nitrogen) || 0,
          phosphorus: Number(snapshot.phosphorus) || 0,
          potassium: Number(snapshot.potassium) || 0,
        }
      : null;

    return NextResponse.json({
      session,
      messages: messages || [],
      soilSnapshot,
    });
  } catch (error) {
    console.error("Session detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
