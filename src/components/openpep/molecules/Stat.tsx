import React from 'react';
import { ArrowUp, ArrowDown, Minus } from '../atoms/Icons';

export type TrendDirection = 'up' | 'down' | 'flat';

export interface StatProps {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  trend?: TrendDirection;
  delta?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Stat({ label, value, unit, sub, trend = 'flat', delta, className = '', style }: StatProps) {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  return (
    <div className={`op-stat ${className}`} style={style}>
      <div className="op-stat-label">
        <span>{label}</span>
        {sub && (
          <span style={{ fontFamily: 'var(--op-font-mono)', color: 'var(--op-fg-faint)', textTransform: 'none', letterSpacing: 0 }}>
            · {sub}
          </span>
        )}
      </div>
      <div className="op-stat-value">
        {value}
        {unit && <span className="op-stat-unit">{unit}</span>}
      </div>
      {delta && (
        <div className={`op-stat-delta ${trend}`}>
          <TrendIcon size={11} sw={2.5} />
          {delta}
        </div>
      )}
    </div>
  );
}

export interface StatGridProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function StatGrid({ children, className = '', style }: StatGridProps) {
  return (
    <div className={`op-stat-grid ${className}`} style={style}>
      {children}
    </div>
  );
}
