import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const renderPercentLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const DonutChart = ({ data, total, centerLabel }) => (
  <div className="relative">
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={2}
          labelLine={false}
          label={renderPercentLabel}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toLocaleString()} ฿`} />
      </PieChart>
    </ResponsiveContainer>

    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-xs text-gray-400">{centerLabel}</span>
      <span className="text-lg font-bold text-gray-800">
        {total.toLocaleString()} ฿
      </span>
    </div>
  </div>
);

export default DonutChart;