import React from 'react';

export type BadgeVariant = 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ variant = 'neutral', children, className = '', style }: BadgeProps) {
  const classes = [
    'op-badge',
    `op-badge-${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}
