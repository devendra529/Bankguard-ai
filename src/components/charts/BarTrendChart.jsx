"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

const DEFAULT_COLORS = ["#2F6BFF", "#EF4444", "#F59E0B", "#10B981"];
const TOOLTIP_STYLE = { background: "#0B1B3A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12 };

// Server Components can't pass functions to Client Components as props, so
// chart pages pass a format *name* ("currency" | "number") instead of a
// formatter function, and this map resolves it on the client.
const FORMATTERS = { currency: formatCurrency, number: formatNumber };

/** series: [{ key, name?, color? }]. valueFormat: "currency" | "number" (optional). */
export default function BarTrendChart({ data, xKey, series, stacked = false, valueFormat }) {
  const valueFormatter = valueFormat ? FORMATTERS[valueFormat] : undefined;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          cursor={{ fill: "rgba(148,163,184,0.12)" }}
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: "rgba(255,255,255,0.7)" }}
          itemStyle={{ color: "#fff" }}
          formatter={valueFormatter}
        />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name ?? s.key}
            fill={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? "stack" : undefined}
            maxBarSize={36}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
