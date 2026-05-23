import React from 'react';

export interface DonutSegment {
  value: number;
  color: string;
  name?: string;
}

export interface DonutProps {
  data: DonutSegment[];
  size?: number;
  thickness?: number;
}

export function Donut({ data, size = 140, thickness = 22 }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - thickness / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;

  const segments = data.map((d, i) => {
    const frac = d.value / total;
    const off = data.slice(0, i).reduce((sum, prev) => sum + prev.value / total, 0) * circumference;
    return { ...d, len: frac * circumference, off };
  });

  return (
    <svg width={size} height={size}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--op-surface-3)" strokeWidth={thickness} />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={thickness}
          strokeDasharray={`${seg.len} ${circumference}`}
          strokeDashoffset={-seg.off}
          transform={`rotate(-90 ${c} ${c})`}
        />
      ))}
      <text x={c} y={c - 2} fontSize="11" fill="var(--op-fg-subtle)" textAnchor="middle" fontFamily="var(--op-font-sans)">
        Total
      </text>
      <text x={c} y={c + 14} fontSize="16" fontFamily="var(--op-font-mono)" fontWeight="500" fill="var(--op-fg)" textAnchor="middle">
        {total.toFixed(2)}g
      </text>
    </svg>
  );
}
