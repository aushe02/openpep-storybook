'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevDown, Search, X } from '../atoms/Icons';
import { Button } from '../atoms/Button';

export interface ComboboxOption {
  id: string;
  name: string;
  formula?: string;
  category?: string;
  color?: string;
}

export interface ComboboxProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: ComboboxOption[];
  placeholder?: string;
  clearable?: boolean;
}

export function Combobox({ value, onChange, options, placeholder = 'Select…', clearable = true }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
    else setQ(''); // eslint-disable-line react-hooks/set-state-in-effect
  }, [open]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(s) ||
        (o.formula && o.formula.toLowerCase().includes(s)) ||
        (o.category && o.category.toLowerCase().includes(s))
    );
  }, [q, options]);

  useEffect(() => { setHi(0); }, [q]); // eslint-disable-line react-hooks/set-state-in-effect

  const selected = options.find((o) => o.id === value);

  const pick = (o: ComboboxOption | null) => {
    onChange(o ? o.id : null);
    setOpen(false);
  };

  return (
    <div className="op-combobox" ref={ref}>
      <button
        type="button"
        className={`op-combobox-input ${!selected ? 'placeholder' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        {selected ? (
          <>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: selected.color || 'var(--op-fg-faint)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{selected.name}</span>
            <span className="chev"><ChevDown size={14} /></span>
          </>
        ) : (
          <>
            <span style={{ flex: 1 }}>{placeholder}</span>
            <span className="chev"><ChevDown size={14} /></span>
          </>
        )}
      </button>
      {open && (
        <div className="op-combobox-menu">
          <div className="op-combobox-search">
            <Search size={14} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ingredients…"
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(filtered.length - 1, h + 1)); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)); }
                else if (e.key === 'Enter') { e.preventDefault(); if (filtered[hi]) pick(filtered[hi]); }
                else if (e.key === 'Escape') setOpen(false);
              }}
            />
            {clearable && value && (
              <Button variant="ghost" size="sm" onClick={() => pick(null)} title="Clear">
                <X size={12} />
              </Button>
            )}
          </div>
          <div className="op-combobox-options">
            {filtered.length === 0 && (
              <div style={{ padding: '20px 12px', fontSize: 12, color: 'var(--op-fg-subtle)', textAlign: 'center' }}>
                No matches
              </div>
            )}
            {filtered.map((o, i) => (
              <div
                key={o.id}
                className={`op-combobox-option ${i === hi ? 'highlighted' : ''}`}
                onClick={() => pick(o)}
                onMouseEnter={() => setHi(i)}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: o.color || 'var(--op-fg-faint)', flexShrink: 0 }} />
                <span>{o.name}</span>
                {o.category && <span className="cat">{o.category}</span>}
                {o.formula && <span className="formula">{o.formula}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
