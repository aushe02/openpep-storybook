import React from 'react';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}

export function Sparkline({ data, width = 80, height = 24, stroke = 'var(--op-accent)' }: SparklineProps) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data
    .map((v, i) => `${(i * stepX).toFixed(2)},${(height - ((v - min) / range) * (height - 4) - 2).toFixed(2)}`)
    .join(' ');
  const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;

  return (
    <svg width={width} height={height}>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={lastY} r="2" fill={stroke} />
    </svg>
  );
}
