import React from 'react';

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  items: TabItem[];
}

export function Tabs({ value, onChange, items }: TabsProps) {
  return (
    <div className="op-tabs">
      {items.map((item) => (
        <button
          key={item.value}
          className={`op-tab ${value === item.value ? 'active' : ''}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
          {item.count != null && (
            <span style={{ marginLeft: 6, fontFamily: 'var(--op-font-mono)', fontSize: 11, color: 'var(--op-fg-subtle)' }}>
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
