"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const SAMPLE_DATA = [
  { day: "Sep 15", alerts: 14, highRisk: 3 },
  { day: "Sep 16", alerts: 19, highRisk: 5 },
  { day: "Sep 17", alerts: 16, highRisk: 4 },
  { day: "Sep 18", alerts: 27, highRisk: 9 },
  { day: "Sep 19", alerts: 22, highRisk: 7 },
  { day: "Sep 20", alerts: 31, highRisk: 12 },
  { day: "Sep 21", alerts: 26, highRisk: 8 },
];

/** Compact dark-surface area chart (Recharts). Used in the landing hero preview. */
export default function MiniAreaChart({ data = SAMPLE_DATA, height = 120 }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="fillAlerts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5C8DFF" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#5C8DFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
          />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.25)" }}
            contentStyle={{
              background: "#0B1B3A",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              fontSize: 12,
              color: "#fff",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.7)" }}
          />
          <Area type="monotone" dataKey="alerts" name="Alerts" stroke="#5C8DFF" strokeWidth={2} fill="url(#fillAlerts)" />
          <Area type="monotone" dataKey="highRisk" name="High risk" stroke="#EF4444" strokeWidth={2} fill="url(#fillHigh)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
