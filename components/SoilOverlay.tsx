"use client";

import { useState, useEffect } from "react";
import { TEA_SOIL_STANDARDS, DEMO_SOIL_DATA, SoilParamKey } from "@/lib/tea-standards";
import { SoilParams } from "@/types/database";
import { FlaskConical, Check, X, ClipboardList, RotateCcw, Microscope } from "lucide-react";

interface SoilOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (params: SoilParams) => void;
  initialValues?: SoilParams | null;
  analyzing: boolean;
  lastUpdated?: string | null;
}

export default function SoilOverlay({
  isOpen,
  onClose,
  onAnalyze,
  initialValues,
  analyzing,
  lastUpdated,
}: SoilOverlayProps) {
  const [soilParams, setSoilParams] = useState<SoilParams>(
    initialValues || { ph: 0, moisture: 0, nitrogen: 0, phosphorus: 0, potassium: 0 }
  );

  // Sync with initial values when overlay opens
  useEffect(() => {
    if (isOpen && initialValues) {
      setSoilParams(initialValues);
    }
  }, [isOpen, initialValues]);

  const handleInputChange = (key: SoilParamKey, value: string) => {
    setSoilParams((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const loadDemo = () => {
    // Generate randomized realistic soil data for testing different scenarios
    setSoilParams({
      ph: Number((4.0 + Math.random() * 2.5).toFixed(1)), // 4.0 to 6.5
      moisture: Math.floor(45 + Math.random() * 40), // 45 to 85%
      nitrogen: Math.floor(200 + Math.random() * 300), // 200 to 500
      phosphorus: Math.floor(20 + Math.random() * 40), // 20 to 60
      potassium: Math.floor(90 + Math.random() * 120), // 90 to 210
    });
  };

  const resetForm = () => {
    setSoilParams({ ph: 0, moisture: 0, nitrogen: 0, phosphorus: 0, potassium: 0 });
  };

  const getParamStatus = (key: SoilParamKey, value: number) => {
    if (value === 0) return "neutral";
    const std = TEA_SOIL_STANDARDS[key];
    if (value >= std.min && value <= std.max) return "good";
    return "bad";
  };

  const handleAnalyze = () => {
    if (soilParams.ph === 0 && soilParams.moisture === 0) return;
    onAnalyze(soilParams);
  };

  const hasValues = initialValues && (initialValues.ph > 0 || initialValues.moisture > 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Full-screen Editor */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in">
        <div className="bg-white rounded-[28px] shadow-2xl border border-border-light
          w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-[20px] bg-accent-wash flex items-center justify-center border border-accent-pale text-accent">
                <FlaskConical size={24} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Soil Parameters</h2>
                {lastUpdated ? (
                  <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Last updated: {new Date(lastUpdated).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                ) : (
                  <p className="text-xs text-text-muted mt-0.5">Enter values to analyze</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl hover:bg-surface-hover transition-colors text-text-muted hover:text-text-primary"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Input Fields */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
            {(Object.keys(TEA_SOIL_STANDARDS) as SoilParamKey[]).map((key) => {
              const std = TEA_SOIL_STANDARDS[key];
              const value = soilParams[key];
              const status = getParamStatus(key, value);

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor={`overlay-soil-${key}`}
                      className="text-sm font-semibold text-text-secondary"
                    >
                      {std.label}
                      {std.unit && (
                        <span className="text-text-muted font-normal ml-1">
                          ({std.unit})
                        </span>
                      )}
                    </label>
                    {value > 0 && (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                          status === "good"
                            ? "bg-accent-wash text-success border border-accent/20"
                            : "bg-danger/10 text-danger border border-danger/20"
                        }`}
                      >
                        {status === "good" ? (
                          <><Check size={14} /> In Range</>
                        ) : (
                          <><X size={14} /> Out of Range</>
                        )}
                      </span>
                    )}
                  </div>
                  <input
                    id={`overlay-soil-${key}`}
                    type="number"
                    step="0.1"
                    value={value || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={`${std.min} – ${std.max}`}
                    className={`w-full px-5 py-3 rounded-[20px] bg-surface/50 border text-base input-focus-ring transition-all ${
                      status === "good"
                        ? "border-accent/40"
                        : status === "bad"
                        ? "border-danger/40"
                        : "border-border-light"
                    }`}
                  />
                  <p className="text-xs text-text-muted mt-1.5 ml-1">
                    Ideal: {std.min}–{std.max} {std.unit}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-border-light bg-surface/30 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={loadDemo}
                className="flex-1 py-3.5 rounded-[20px] bg-accent-wash text-success font-semibold text-sm
                  hover:bg-accent-pale transition-all active:scale-[0.98] border border-accent/20 flex items-center justify-center gap-2"
              >
                <ClipboardList size={18} /> Load Demo
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3.5 rounded-[20px] bg-white border border-border-light text-text-muted font-semibold text-sm
                  hover:bg-surface hover:text-text-primary transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> Reset
              </button>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || (soilParams.ph === 0 && soilParams.moisture === 0)}
              className="w-full py-4 rounded-[20px] gradient-button text-white font-bold text-base
                hover:opacity-90 active:scale-[0.98] transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Analyzing...
                </>
              ) : hasValues ? (
                <><Microscope size={20} /> Re-Analyze Soil</>
              ) : (
                <><Microscope size={20} /> Analyze Soil</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
