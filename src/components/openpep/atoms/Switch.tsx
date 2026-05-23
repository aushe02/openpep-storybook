import React from 'react';

export interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
}

export function Switch({ value, onChange, label, description }: SwitchProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '4px 0' }}>
      {(label || description) && (
        <div style={{ flex: 1 }}>
          {label && <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>}
          {description && <div style={{ fontSize: 12, color: 'var(--op-fg-muted)', marginTop: 2 }}>{description}</div>}
        </div>
      )}
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className="op-switch"
        data-on={String(value)}
      >
        <span className="op-switch-thumb" />
      </button>
    </div>
  );
}
