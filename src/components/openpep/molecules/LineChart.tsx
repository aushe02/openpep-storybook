import React from 'react';

export interface DataPoint {
  x: number;
  y: number;
}

export interface Series {
  data: DataPoint[];
  color: string;
  label?: string;
}

export interface LineChartProps {
  series: Series[];
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  padding?: { l: number; r: number; t: number; b: number };
}

export function LineChart({
  series,
  width = 600,
  height = 220,
  xLabel,
  yLabel,
  padding = { l: 48, r: 12, t: 12, b: 30 },
}: LineChartProps) {
  if (!series || series.length === 0) return null;

  const allY = series.flatMap((s) => s.data.map((d) => d.y));
  const allX = series.flatMap((s) => s.data.map((d) => d.x));
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const xMin = Math.min(...allX);
  const xMax = Math.max(...allX);
  const yPad = (yMax - yMin) * 0.1 || 1;
  const yLo = yMin - yPad;
  const yHi = yMax + yPad;
  const W = width - padding.l - padding.r;
  const H = height - padding.t - padding.b;

  const sx = (x: number) => padding.l + ((x - xMin) / (xMax - xMin || 1)) * W;
  const sy = (y: number) => padding.t + (1 - (y - yLo) / (yHi - yLo)) * H;

  const yTicks = 4;
  const xTicks = 5;
  const yT = Array.from({ length: yTicks + 1 }, (_, i) => yLo + ((yHi - yLo) * i) / yTicks);
  const xT = Array.from({ length: xTicks + 1 }, (_, i) => xMin + ((xMax - xMin) * i) / xTicks);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {yT.map((t, i) => (
        <g key={i}>
          <line x1={padding.l} y1={sy(t)} x2={padding.l + W} y2={sy(t)} stroke="var(--op-divider)" strokeDasharray="2 3" />
          <text
            x={padding.l - 8}
            y={sy(t) + 3}
            fontSize="10"
            fill="var(--op-fg-subtle)"
            fontFamily="var(--op-font-mono)"
            textAnchor="end"
          >
            {t.toFixed(t > 100 ? 0 : 2)}
          </text>
        </g>
      ))}
      {xT.map((t, i) => (
        <text
          key={i}
          x={sx(t)}
          y={padding.t + H + 16}
          fontSize="10"
          fill="var(--op-fg-subtle)"
          fontFamily="var(--op-font-mono)"
          textAnchor="middle"
        >
          {t.toFixed(xMax > 100 ? 0 : 2)}
        </text>
      ))}
      <line x1={padding.l} y1={padding.t + H} x2={padding.l + W} y2={padding.t + H} stroke="var(--op-border-strong)" />
      <line x1={padding.l} y1={padding.t} x2={padding.l} y2={padding.t + H} stroke="var(--op-border-strong)" />
      {series.map((s, i) => {
        const path = s.data
          .map((d, j) => `${j === 0 ? 'M' : 'L'}${sx(d.x).toFixed(2)},${sy(d.y).toFixed(2)}`)
          .join(' ');
        return (
          <g key={i}>
            <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {s.data.length < 30 &&
              s.data.map((d, j) => (
                <circle key={j} cx={sx(d.x)} cy={sy(d.y)} r="2.5" fill={s.color} />
              ))}
          </g>
        );
      })}
      {xLabel && (
        <text x={padding.l + W / 2} y={height - 4} fontSize="11" fill="var(--op-fg-muted)" textAnchor="middle">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          x={12}
          y={padding.t + H / 2}
          fontSize="11"
          fill="var(--op-fg-muted)"
          textAnchor="middle"
          transform={`rotate(-90 12 ${padding.t + H / 2})`}
        >
          {yLabel}
        </text>
      )}
    </svg>
  );
}

export interface LegendItemProps {
  color: string;
  label: string;
}

export function ChartLegend({ items }: { items: LegendItemProps[] }) {
  return (
    <div style={{ display: 'flex', gap: 16, fontSize: 12, flexWrap: 'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--op-fg-muted)' }}>
          <span style={{ width: 10, height: 2, background: item.color, borderRadius: 1 }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
