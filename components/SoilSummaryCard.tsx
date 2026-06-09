"use client";

import { SoilParams } from "@/types/database";
import { TEA_SOIL_STANDARDS, SoilParamKey } from "@/lib/tea-standards";
import { FlaskConical } from "lucide-react";

interface SoilSummaryCardProps {
  soil: SoilParams | null;
  lastUpdated?: string | null;
  onEdit: () => void;
}

export default function SoilSummaryCard({ soil, lastUpdated, onEdit }: SoilSummaryCardProps) {
  if (!soil || (soil.ph === 0 && soil.moisture === 0)) return null;

  const getStatus = (key: SoilParamKey, value: number) => {
    if (value === 0) return "neutral";
    const std = TEA_SOIL_STANDARDS[key];
    if (value >= std.min && value <= std.max) return "good";
    return "bad";
  };

  const params: { key: SoilParamKey; label: string; unit: string }[] = [
    { key: "ph", label: "pH", unit: "" },
    { key: "moisture", label: "Moisture", unit: "%" },
    { key: "nitrogen", label: "N", unit: "" },
    { key: "phosphorus", label: "P", unit: "" },
    { key: "potassium", label: "K", unit: "" },
  ];

  return (
    <div className="soil-summary-card mx-auto max-w-3xl mb-3 animate-fade-in">
      <div className="flex items-center justify-between px-5 py-3 rounded-[20px] bg-white/95 backdrop-blur-xl border border-border-light shadow-sm shadow-accent/5">
        {/* Left: Icon + Values */}
        <div className="flex items-center gap-4 overflow-hidden">
          <FlaskConical className="w-5 h-5 text-accent shrink-0" />

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            {params.map(({ key, label, unit }) => {
              const value = soil[key];
              if (value === 0) return null;
              const status = getStatus(key, value);
              return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-[12px] whitespace-nowrap border ${
                    status === "good"
                      ? "bg-accent-wash text-primary border-accent/20"
                      : status === "bad"
                      ? "bg-danger/5 text-danger border-danger/20"
                      : "bg-surface text-text-muted border-border-light"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    status === "good" ? "bg-accent" : status === "bad" ? "bg-danger" : "bg-text-muted"
                  }`} />
                  {label} {value}{unit}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right: Timestamp + Edit */}
        <div className="flex items-center gap-3 shrink-0 ml-4 border-l border-border-light pl-4">
          {lastUpdated && (
            <span className="text-[11px] font-medium text-text-muted hidden sm:block">
              {new Date(lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={onEdit}
            className="p-2 rounded-xl hover:bg-surface-hover transition-colors group bg-surface border border-transparent hover:border-border-light"
            title="Edit soil parameters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className="text-text-muted group-hover:text-primary transition-colors">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
