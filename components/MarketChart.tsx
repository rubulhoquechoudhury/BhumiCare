"use client";

import { useMemo } from "react";

interface DataPoint {
  month: string;
  price: number;
  trend: string;
}

interface MarketChartProps {
  data: DataPoint[];
  height?: number;
}

export default function MarketChart({ data, height = 100 }: MarketChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length < 2) return null;

    const prices = data.map((d) => d.price);
    const minPrice = Math.min(...prices) * 0.97;
    const maxPrice = Math.max(...prices) * 1.03;
    const range = maxPrice - minPrice;
    const width = 400;
    const padX = 16;
    const padY = 12;
    const innerW = width - padX * 2;
    const innerH = height - padY * 2;

    const points = data.map((d, i) => ({
      x: padX + (i / (data.length - 1)) * innerW,
      y: padY + (1 - (d.price - minPrice) / range) * innerH,
      price: d.price,
      month: d.month,
      trend: d.trend,
    }));

    // SVG path
    const linePath = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");

    // Filled area path
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

    // Last trend color
    const lastTrend = data[data.length - 1]?.trend;
    const color = lastTrend === "rising" ? "#3CBF6A" : lastTrend === "falling" ? "#E53935" : "#F59E0B";

    return { points, linePath, areaPath, minPrice, maxPrice, color };
  }, [data, height]);

  if (!chartData || data.length < 2) {
    return (
      <div className="h-24 flex items-center justify-center text-text-muted text-sm">
        Not enough data to display chart
      </div>
    );
  }

  const { points, linePath, areaPath, minPrice, maxPrice, color } = chartData;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 400 ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill="url(#chartGrad)" />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1="16"
            x2="384"
            y1={12 + frac * (height - 24)}
            y2={12 + frac * (height - 24)}
            stroke="#E5E8E4"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 5 : 3}
            fill={i === points.length - 1 ? color : "white"}
            stroke={color}
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* Month labels */}
      <div className="flex justify-between px-2 mt-1">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] text-text-muted font-medium" style={{ width: `${100 / data.length}%`, textAlign: "center" }}>
            {new Date(d.month + "-01").toLocaleDateString("en-IN", { month: "short" })}
          </span>
        ))}
      </div>

      {/* Price range labels */}
      <div className="flex justify-between mt-1 px-2">
        <span className="text-[9px] text-text-muted">₹{minPrice.toFixed(0)}</span>
        <span className="text-[9px] text-text-muted">₹{maxPrice.toFixed(0)}</span>
      </div>
    </div>
  );
}
