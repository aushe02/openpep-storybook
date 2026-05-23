import React from 'react';
import { Icons } from '../atoms/Icons';
import type { IconName } from '../atoms/Icons';
import type { Formula, NavView } from '../types';

interface NavItemDef {
  id: NavView;
  label: string;
  icon: IconName;
  count?: number;
}

export interface SidebarProps {
  view: NavView;
  onViewChange: (view: NavView) => void;
  formulas: Formula[];
  currentFormulaId: string;
  onFormulaSelect: (id: string) => void;
  onNewFormula: () => void;
  libraryCount?: number;
}

const NAV: NavItemDef[] = [
  { id: 'formula',   label: 'Editor',           icon: 'Beaker' },
  { id: 'results',   label: 'Results',          icon: 'Sparkles' },
  { id: 'versions',  label: 'Versions',         icon: 'GitBranch', count: 5 },
  { id: 'compare',   label: 'Compare',          icon: 'Compare' },
  { id: 'library',   label: 'Library',          icon: 'Book' },
  { id: 'io',        label: 'Import / Export',  icon: 'Import' },
  { id: 'settings',  label: 'Settings',         icon: 'Settings' },
];

export function Sidebar({ view, onViewChange, formulas, currentFormulaId, onFormulaSelect, onNewFormula, libraryCount }: SidebarProps) {
  const nav = NAV.map((n) => n.id === 'library' && libraryCount != null ? { ...n, count: libraryCount } : n);

  return (
    <aside className="op-sidebar">
      <div className="op-sidebar-brand">
        <div className="op-sidebar-logo">OP</div>
        <div className="op-sidebar-name">OpenPep</div>
        <span className="op-sidebar-version">α 0.4</span>
      </div>

      <div className="op-sidebar-section">
        <div className="op-sidebar-label">Workspace</div>
        {nav.map((n) => {
          const Ic = Icons[n.icon];
          return (
            <button
              key={n.id}
              className={`op-nav-item ${view === n.id ? 'active' : ''}`}
              onClick={() => onViewChange(n.id)}
            >
              <Ic size={15} className="op-nav-icon" />
              <span>{n.label}</span>
              {n.count != null && <span className="op-nav-count">{n.count}</span>}
            </button>
          );
        })}
      </div>

      <div className="op-sidebar-section" style={{ flex: 1, overflow: 'auto' }}>
        <div className="op-sidebar-label">
          <span>Formulas</span>
          <button onClick={onNewFormula} title="New formula"><Icons.Plus size={13} /></button>
        </div>
        {formulas.map((f) => (
          <div
            key={f.id}
            className={`op-formula-item ${currentFormulaId === f.id && view === 'formula' ? 'active' : ''}`}
            onClick={() => { onFormulaSelect(f.id); onViewChange('formula'); }}
          >
            <span className="op-formula-dot" style={{ background: f.color }} />
            <span className="op-formula-name">{f.name}</span>
            <span className="op-formula-ver">{f.currentVersion}</span>
          </div>
        ))}
      </div>

      <div className="op-sidebar-footer">
        <span className="op-dot-online" />
        <span>Local · saved</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--op-font-mono)', fontSize: 11, color: 'var(--op-fg-subtle)' }}>⌘K</span>
      </div>
    </aside>
  );
}
