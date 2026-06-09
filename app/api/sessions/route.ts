import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sessions — list user's sessions for sidebar
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch sessions with their latest soil snapshot
    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("id, title, summary, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Sessions fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }

    // Fetch soil snapshots for each session
    const sessionIds = (sessions || []).map((s) => s.id);
    const { data: snapshots } = await supabase
      .from("soil_snapshots")
      .select("session_id, ph, moisture, nitrogen, phosphorus, potassium")
      .in("session_id", sessionIds.length > 0 ? sessionIds : ["none"]);

    // Build snapshot map
    const snapshotMap: Record<string, { ph: number; moisture: number; nitrogen: number; phosphorus: number; potassium: number }> = {};
    (snapshots || []).forEach((s) => {
      if (s.session_id) {
        snapshotMap[s.session_id] = {
          ph: Number(s.ph) || 0,
          moisture: Number(s.moisture) || 0,
          nitrogen: Number(s.nitrogen) || 0,
          phosphorus: Number(s.phosphorus) || 0,
          potassium: Number(s.potassium) || 0,
        };
      }
    });

    const result = (sessions || []).map((s) => ({
      ...s,
      soil_snapshot: snapshotMap[s.id] || null,
    }));

    return NextResponse.json({ sessions: result });
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
