import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMarketPrediction, MarketSnapshot } from "@/lib/market-predictor";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    // Get user's region preference
    const { data: userData } = await supabase
      .from("users")
      .select("region")
      .eq("id", user.id)
      .single();
    const region = userData?.region || "assam";

    // Check for cached prediction (valid for 6 hours)
    if (!forceRefresh) {
      const { data: cached } = await supabase
        .from("market_predictions")
        .select("prediction, valid_until")
        .eq("user_id", user.id)
        .eq("region", region)
        .gt("valid_until", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (cached) {
        return NextResponse.json({
          prediction: cached.prediction,
          fromCache: true,
          validUntil: cached.valid_until,
        });
      }
    }

    // Fetch historical snapshots
    const { data: snapshots } = await supabase
      .from("market_snapshots")
      .select("recorded_date, price_per_kg, trend, region")
      .eq("region", region)
      .order("recorded_date", { ascending: true })
      .limit(12);

    // Get user's latest soil quality (for context)
    const { data: latestSoil } = await supabase
      .from("soil_snapshots")
      .select("ph, moisture, nitrogen, phosphorus, potassium")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Rough soil quality score
    let soilScore: number | undefined;
    if (latestSoil) {
      const ph = latestSoil.ph ?? 0;
      const moisture = latestSoil.moisture ?? 0;
      const nitrogen = latestSoil.nitrogen ?? 0;
      const phosphorus = latestSoil.phosphorus ?? 0;
      const potassium = latestSoil.potassium ?? 0;
      const phOk = ph >= 4.5 && ph <= 5.5 ? 20 : 5;
      const moistOk = moisture >= 60 && moisture <= 80 ? 20 : 5;
      const nOk = nitrogen >= 280 && nitrogen <= 560 ? 20 : 5;
      const pOk = phosphorus >= 30 && phosphorus <= 60 ? 20 : 5;
      const kOk = potassium >= 100 && potassium <= 200 ? 20 : 5;
      soilScore = phOk + moistOk + nOk + pOk + kOk;
    }

    // Generate fresh AI prediction
    const prediction = await generateMarketPrediction(
      region,
      (snapshots || []) as MarketSnapshot[],
      soilScore
    );

    // Cache the prediction for 6 hours — serialize as plain JSON object
    const validUntil = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    const predictionJson = JSON.parse(JSON.stringify(prediction)) as Record<string, unknown>;
    await supabase.from("market_predictions").delete().eq("user_id", user.id).eq("region", region);
    await supabase.from("market_predictions").insert({
      user_id: user.id,
      region,
      prediction: predictionJson,
      valid_until: validUntil,
    });

    // Also add today's estimated price to snapshots (best-effort)
    const today = new Date().toISOString().split("T")[0];
    const priceMatch = prediction.currentPriceEstimate.match(/₹(\d+)/);
    if (priceMatch) {
      try {
        await supabase.from("market_snapshots").upsert({
          region,
          price_per_kg: parseFloat(priceMatch[1]),
          trend: prediction.trend.toLowerCase() as "rising" | "stable" | "falling",
          recorded_date: today,
          source: "ai_generated",
        }, { onConflict: "region,recorded_date" });
      } catch { /* best-effort, ignore */ }
    }

    return NextResponse.json({ prediction, fromCache: false, validUntil, snapshots: snapshots || [] });
  } catch (error) {
    console.error("Market predict error:", error);
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 });
  }
}
