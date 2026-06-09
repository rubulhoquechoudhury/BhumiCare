"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle, Loader2, ShoppingBag, Clock, Layers, MapPin, Lightbulb } from "lucide-react";
import { MarketPrediction } from "@/lib/market-predictor";
import { useLanguage } from "@/lib/language-context";
import MarketChart from "@/components/MarketChart";

interface Snapshot {
  recorded_date: string;
  price_per_kg: number;
  trend: string;
}

interface MarketPanelProps {
  userId: string;
}

// Signal config
const SIGNAL_CONFIG = {
  SELL_NOW: {
    label: "Sell Now",
    labelKey: "market.signal.sell",
    color: "#E53935",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    icon: ShoppingBag,
    badge: "bg-red-100 text-red-700 border border-red-200",
  },
  HOLD_STOCK: {
    label: "Hold Stock",
    labelKey: "market.signal.hold",
    color: "#3CBF6A",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    icon: Layers,
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  WAIT: {
    label: "Wait for Better Price",
    labelKey: "market.signal.wait",
    color: "#F59E0B",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    icon: Clock,
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
  },
};

const TREND_ICONS = {
  RISING: TrendingUp,
  STABLE: Minus,
  FALLING: TrendingDown,
};

const TREND_COLORS = {
  RISING: "text-emerald-600",
  STABLE: "text-amber-600",
  FALLING: "text-red-600",
};

export default function MarketPanel({ userId }: MarketPanelProps) {
  const { t } = useLanguage();
  const [prediction, setPrediction] = useState<MarketPrediction | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [validUntil, setValidUntil] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrediction = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const url = `/api/market-predict${forceRefresh ? "?refresh=true" : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to load market prediction");
        return;
      }

      setPrediction(data.prediction);
      setSnapshots(data.snapshots || []);
      setFromCache(data.fromCache || false);
      setValidUntil(data.validUntil || null);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-[24px] bg-accent-wash flex items-center justify-center animate-pulse-soft border border-accent/20">
          <TrendingUp className="text-accent" size={28} />
        </div>
        <p className="text-text-secondary font-medium">{t("market.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 px-6">
        <div className="w-16 h-16 rounded-[24px] bg-red-50 flex items-center justify-center border border-red-200">
          <AlertCircle className="text-red-500" size={28} />
        </div>
        <p className="text-text-primary font-semibold text-center">Unable to load market data</p>
        <p className="text-text-secondary text-sm text-center">{error}</p>
        <button
          onClick={() => fetchPrediction()}
          className="px-6 py-3 rounded-[20px] bg-accent text-white font-semibold text-sm hover:opacity-90 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!prediction) return null;

  const signal = SIGNAL_CONFIG[prediction.signal];
  const SignalIcon = signal.icon;
  const TrendIcon = TREND_ICONS[prediction.trend];
  const trendColor = TREND_COLORS[prediction.trend];

  const chartData = snapshots.map((s) => ({
    month: s.recorded_date.slice(0, 7),
    price: Number(s.price_per_kg),
    trend: s.trend,
  }));

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">{t("market.title")}</h2>
          <p className="text-sm text-text-muted mt-0.5">{t("market.subtitle")}</p>
        </div>
        <button
          onClick={() => fetchPrediction(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-[16px] bg-white border border-border-light text-text-secondary text-sm font-medium hover:bg-surface hover:text-text-primary transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Updating..." : "Refresh"}
        </button>
      </div>

      {/* ── Signal + Confidence ── */}
      <div className={`rounded-[24px] p-5 border ${signal.border} ${signal.bg} flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shadow-sm`}
            style={{ backgroundColor: signal.color + "22", border: `1.5px solid ${signal.color}44` }}>
            <SignalIcon size={24} style={{ color: signal.color }} />
          </div>
          <div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${signal.badge}`}>
              {t(signal.labelKey)}
            </span>
            <p className="text-lg font-bold text-text-primary mt-1.5 leading-tight">
              {prediction.priceMovement}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{prediction.timeframe}</p>
          </div>
        </div>

        {/* Confidence gauge */}
        <div className="text-center shrink-0">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E8E4" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={signal.color} strokeWidth="3"
                strokeDasharray={`${prediction.confidence} ${100 - prediction.confidence}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary rotate-0">
              {prediction.confidence}%
            </span>
          </div>
          <p className="text-[10px] text-text-muted mt-1">{t("market.confidence")}</p>
        </div>
      </div>

      {/* ── Trend + Price ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[20px] p-4 border border-border-light">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Trend</p>
          <div className={`flex items-center gap-2 ${trendColor}`}>
            <TrendIcon size={20} />
            <span className="font-bold text-base">{t(`market.trend.${prediction.trend.toLowerCase()}`)}</span>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-4 border border-border-light">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Est. Price</p>
          <p className="font-bold text-base text-text-primary">{prediction.currentPriceEstimate}</p>
          <p className="text-xs text-text-muted">per kg</p>
        </div>
      </div>

      {/* ── Price Chart ── */}
      {chartData.length > 1 && (
        <div className="bg-white rounded-[24px] p-5 border border-border-light">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-4">
            {t("market.history")}
          </p>
          <MarketChart data={chartData} height={110} />
        </div>
      )}

      {/* ── AI Explanation ── */}
      <div className="bg-white rounded-[24px] p-5 border border-border-light">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-amber-500" />
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">{t("market.ai_explanation")}</p>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">{prediction.reasoning}</p>
      </div>

      {/* ── Key Factors ── */}
      <div className="bg-white rounded-[24px] p-5 border border-border-light">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">{t("market.factors")}</p>
        <ul className="space-y-2">
          {prediction.factors.map((factor, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary">
              <span className="w-5 h-5 rounded-full bg-accent-wash text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Regional Note ── */}
      {prediction.regionalNote && (
        <div className="bg-accent-wash rounded-[20px] p-4 border border-accent/20 flex items-start gap-3">
          <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-text-primary">{prediction.regionalNote}</p>
        </div>
      )}

      {/* ── Disclaimer + Cache info ── */}
      <div className="flex items-center justify-between text-[10px] text-text-muted pb-4">
        <span className="flex items-center gap-1">
          <AlertCircle size={10} />
          {t("market.disclaimer")}
        </span>
        {fromCache && validUntil && (
          <span>
            Refreshes at {new Date(validUntil).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}
