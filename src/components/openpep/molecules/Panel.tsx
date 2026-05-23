import React from 'react';

export interface PanelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface PanelHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface PanelBodyProps {
  children: React.ReactNode;
  flush?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Panel({ children, className = '', style }: PanelProps) {
  return (
    <div className={`op-panel ${className}`} style={style}>
      {children}
    </div>
  );
}

export function PanelHeader({ children, className = '', style }: PanelHeaderProps) {
  return (
    <div className={`op-panel-header ${className}`} style={style}>
      {children}
    </div>
  );
}

export function PanelTitle({ children }: { children: React.ReactNode }) {
  return <div className="op-panel-title">{children}</div>;
}

export function PanelSubtitle({ children }: { children: React.ReactNode }) {
  return <div className="op-panel-subtitle">{children}</div>;
}

export function PanelBody({ children, flush = false, className = '', style }: PanelBodyProps) {
  return (
    <div className={`${flush ? 'op-panel-body-flush' : 'op-panel-body'} ${className}`} style={style}>
      {children}
    </div>
  );
}
