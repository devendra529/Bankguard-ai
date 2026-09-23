"use client";

import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

const DEFAULT_COLORS = ["#2F6BFF", "#EF4444", "#F59E0B", "#10B981"];
const TOOLTIP_STYLE = { background: "#0B1B3A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12 };
const FORMATTERS = { currency: formatCurrency, number: formatNumber };

/** series: [{ key, name?, color? }]. `area` fills under the line(s). valueFormat: "currency" | "number". */
export default function LineTrendChart({ data, xKey, series, area = true, valueFormat }) {
  const valueFormatter = valueFormat ? FORMATTERS[valueFormat] : undefined;
  const Chart = area ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
            return (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "rgba(255,255,255,0.7)" }} itemStyle={{ color: "#fff" }} formatter={valueFormatter} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => {
          const color = s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          return area ? (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.name ?? s.key} stroke={color} strokeWidth={2} fill={`url(#fill-${s.key})`} />
          ) : (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name ?? s.key} stroke={color} strokeWidth={2} dot={false} />
          );
        })}
      </Chart>
    </ResponsiveContainer>
  );
}
