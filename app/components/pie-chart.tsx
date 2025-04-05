// components/CustomPieChart.tsx
"use client";

import React from "react";

type DataItem = {
  label: string;
  value: number;
  color: string;
};

interface PieChartProps {
  data: DataItem[];
  size?: number; // width and height of the chart
  strokeWidth?: number;
}

export default function PieChart({
  data,
  size = 200,
  strokeWidth = 40,
}: PieChartProps) {
  const radius = size / 2;
  const total = data.reduce((acc, item) => acc + item.value, 0);

  let cumulativeAngle = 0;

  const paths = data.map((item, index) => {
    const valueAngle = (item.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + valueAngle;
    cumulativeAngle += valueAngle;

    const largeArc = valueAngle > 180 ? 1 : 0;

    const startRadians = (Math.PI / 180) * startAngle;
    const endRadians = (Math.PI / 180) * endAngle;

    const x1 = radius + radius * Math.cos(startRadians);
    const y1 = radius + radius * Math.sin(startRadians);

    const x2 = radius + radius * Math.cos(endRadians);
    const y2 = radius + radius * Math.sin(endRadians);

    const d = `
      M ${radius} ${radius}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    return (
      <path key={index} d={d} fill={item.color} strokeWidth={strokeWidth} />
    );
  });

  return (
    <div className="w-full flex justify-center items-center ">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shadow-md rounded-full">
        {paths}
      </svg>
      <div>
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
