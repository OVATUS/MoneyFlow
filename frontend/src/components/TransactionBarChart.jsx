import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatMonthLabel } from "../utils/formatDate"; 

const TransactionBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-xs py-16 text-center">ยังไม่มีข้อมูล</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        {/* แกน X แสดงชื่อเดือน โดยใช้ formatMonthLabel แปลง YYYY-MM เป็นภาษาไทย */}
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickFormatter={formatMonthLabel}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        {/* แกน Y แสดงตัวเลข ซ่อนเส้นแกนเพื่อความสะอาดตา */}
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        {/* Tooltip แสดงรายละเอียดเมื่อนำเมาส์ไปชี้ */}
        <Tooltip
          formatter={(value) => `${value.toLocaleString()} ฿`}
          labelFormatter={formatMonthLabel}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />

        <Bar dataKey="income" name="รายรับ" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={40} />
        <Bar dataKey="expense" name="รายจ่าย" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TransactionBarChart;