import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mono?: boolean;
  leadingIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  wrapperStyle?: React.CSSProperties;
  wrapperClassName?: string;
}

export function Input({ mono, leadingIcon, suffix, wrapperStyle, wrapperClassName = '', className = '', ...props }: InputProps) {
  const wrapperClass = [
    'op-input',
    mono ? 'op-input-mono' : '',
    wrapperClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {leadingIcon}
      <input
        style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, padding: 0, fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}
        className={className}
        {...props}
      />
      {suffix}
    </div>
  );
}

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  width?: number | string;
  style?: React.CSSProperties;
}

export function NumberInput({ value, onChange, step = 0.01, min, max, suffix, width, style }: NumberInputProps) {
  return (
    <div className="op-input" style={{ padding: 0, width, ...style }}>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          padding: '6px 10px',
          textAlign: 'right',
          fontFamily: 'var(--op-font-mono)',
          fontSize: 'inherit',
          color: 'inherit',
        }}
      />
      {suffix && (
        <span style={{ paddingRight: 10, fontSize: 11, color: 'var(--op-fg-subtle)', fontFamily: 'var(--op-font-mono)', flexShrink: 0 }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

export interface FieldLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export function FieldLabel({ children, htmlFor }: FieldLabelProps) {
  return <label className="op-field-label" htmlFor={htmlFor}>{children}</label>;
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <div className="op-field-hint">{children}</div>;
}
