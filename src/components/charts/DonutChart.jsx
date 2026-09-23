"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const TOOLTIP_STYLE = { background: "#0B1B3A", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 12 };

/** data: [{ name, value }]. Optional centerLabel/centerValue overlay the donut hole. */
export default function DonutChart({ data, colors, centerLabel, centerValue }) {
  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="85%" paddingAngle={3} stroke="none">
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: "#fff" }} />
          <Legend verticalAlign="bottom" height={28} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue !== undefined && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-7">
          <span className="text-2xl font-bold">{centerValue}</span>
          <span className="text-xs text-muted">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}
