'use client';
import React, { useState } from 'react';
import type { Formula } from '../types';
import { Panel, PanelHeader, PanelTitle, PanelSubtitle, PanelBody } from '../molecules/Panel';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { LineChart, ChartLegend } from '../molecules/LineChart';
import { INGREDIENT_LIBRARY } from '../data/data';
import { Icons } from '../atoms/Icons';

export interface CompareViewProps {
  formulas: Formula[];
  currentFormulaId: string;
}

const METRICS = [
  { key: 'isp',           label: 'Specific Impulse',         unit: 's',      digits: 2, sub: 'Isp*',  better: 'high' as const },
  { key: 'cstar',         label: 'Characteristic Velocity',  unit: 'ft/s',   digits: 1, sub: 'c*',    better: 'high' as const },
  { key: 'chamberTemp',   label: 'Chamber Temperature',      unit: 'K',      digits: 0, sub: 'Tc',    better: 'n/a' as const },
  { key: 'density',       label: 'Density',                  unit: 'lb/in³', digits: 4, sub: 'ρ',     better: 'high' as const },
  { key: 'molecularWt',   label: 'Molecular Weight',         unit: 'g/mol',  digits: 3, sub: 'M̄',    better: 'low' as const },
  { key: 'cpcv',          label: 'Cp/Cv',                    unit: 'γ',      digits: 4, sub: 'γc',    better: 'n/a' as const },
  { key: 'exhaustTemp',   label: 'Exhaust Temperature',      unit: 'K',      digits: 0, sub: 'Te',    better: 'n/a' as const },
  { key: 'expansionRatio',label: 'Expansion Ratio',          unit: 'ε',      digits: 2, sub: 'Ae/At', better: 'n/a' as const },
];

function CompositionMatrix({ formulas }: { formulas: Formula[] }) {
  const allIds = new Set<string>();
  formulas.forEach((f) => f.components.forEach((c) => c.ingredientId && allIds.add(c.ingredientId)));
  const ingredients = [...allIds].map((id) => INGREDIENT_LIBRARY.find((x) => x.id === id)).filter(Boolean) as typeof INGREDIENT_LIBRARY;

  return (
    <div style={{ overflow: 'auto' }}>
      <table className="op-data" style={{ minWidth: 700 }}>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th style={{ width: 100 }}>Category</th>
            {formulas.map((f) => (
              <th key={f.id} style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.color }} />
                  {f.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ing) => {
            const values = formulas.map((f) => {
              const c = f.components.find((c) => c.ingredientId === ing.id);
              return c?.weight || 0;
            });
            const max = Math.max(...values, 1);
            return (
              <tr key={ing.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: ing.color }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{ing.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--op-fg-subtle)', fontFamily: 'var(--op-font-mono)' }}>{ing.formula}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 11.5, color: 'var(--op-fg-muted)' }}>{ing.category}</td>
                {values.map((v, i) => (
                  <td key={i} className="op-num" style={{ position: 'relative', minWidth: 110 }}>
                    {v > 0 ? (
                      <>
                        <div style={{ position: 'absolute', inset: '4px 8px 4px auto', width: `${(v / max) * 60}px`, background: formulas[i].color, opacity: 0.25, borderRadius: 4 }} />
                        <span style={{ position: 'relative' }}>{v.toFixed(2)}</span>
                      </>
                    ) : (
                      <span style={{ color: 'var(--op-fg-faint)' }}>—</span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CompareView({ formulas, currentFormulaId }: CompareViewProps) {
  const [selectedIds, setSelectedIds] = useState(() => formulas.slice(0, 3).map((f) => f.id));
  const selected = selectedIds.map((id) => formulas.find((f) => f.id === id)).filter(Boolean) as Formula[];

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length < 4) setSelectedIds([...selectedIds, id]);
    }
  };

  const findLeader = (key: string, better: 'high' | 'low' | 'n/a') => {
    if (better === 'n/a' || selected.length < 2) return null;
    return [...selected].sort((a, b) =>
      better === 'high'
        ? (b.results as unknown as Record<string, number>)[key] - (a.results as unknown as Record<string, number>)[key]
        : (a.results as unknown as Record<string, number>)[key] - (b.results as unknown as Record<string, number>)[key]
    )[0].id;
  };

  const pressures = Array.from({ length: 14 }, (_, i) => 200 + i * 100);
  const ispSeries = selected.map((f) => ({
    color: f.color,
    data: pressures.map((p) => ({
      x: p,
      y: f.results.isp * (0.7 + 0.3 * Math.log10(p / 14.7) / Math.log10(f.conditions.chamberPsi / 14.7)),
    })),
  }));

  return (
    <div style={{ padding: 24, display: 'grid', gap: 20, maxWidth: 1400 }}>
      <Panel>
        <PanelHeader>
          <Icons.Compare size={15} />
          <div>
            <PanelTitle>Comparison Set</PanelTitle>
            <PanelSubtitle>Choose up to 4 formulas</PanelSubtitle>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--op-fg-muted)' }}>
            {selected.length} of 4 selected
          </div>
        </PanelHeader>
        <PanelBody style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {formulas.map((f) => {
            const on = selectedIds.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggle(f.id)}
                className="op-btn op-btn-sm"
                style={{ borderColor: on ? f.color : 'var(--op-border)', background: on ? 'var(--op-surface-2)' : 'var(--op-surface)', paddingLeft: 8 }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, marginRight: 2 }} />
                {f.name}
                <span className="op-mono" style={{ fontSize: 11, color: 'var(--op-fg-subtle)', marginLeft: 4 }}>{f.currentVersion}</span>
                {on && <Icons.Check size={11} />}
              </button>
            );
          })}
        </PanelBody>
      </Panel>

      <Panel style={{ overflow: 'auto' }}>
        <PanelHeader>
          <Icons.Sparkles size={15} />
          <PanelTitle>Performance Comparison</PanelTitle>
          <div style={{ marginLeft: 'auto' }}>
            <Button size="sm"><Icons.Download size={12} /> Export CSV</Button>
          </div>
        </PanelHeader>
        <table className="op-data" style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th style={{ width: 220 }}>Metric</th>
              {selected.map((f) => (
                <th key={f.id} style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.color }} />
                    <span>{f.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map((m) => {
              const leader = findLeader(m.key, m.better);
              return (
                <tr key={m.key}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--op-fg-subtle)', fontFamily: 'var(--op-font-mono)' }}>{m.sub} ({m.unit})</div>
                  </td>
                  {selected.map((f) => {
                    const isLead = leader === f.id;
                    const val = (f.results as unknown as Record<string, number>)[m.key] as number;
                    return (
                      <td key={f.id} className="op-num">
                        <span style={{ fontWeight: isLead ? 600 : 400, color: isLead ? 'var(--op-success)' : 'var(--op-fg)' }}>
                          {val.toFixed(m.digits)}
                        </span>
                        {isLead && m.better !== 'n/a' && (
                          <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--op-success)' }}>★</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <Panel>
        <PanelHeader>
          <Icons.Flame size={15} />
          <div>
            <PanelTitle>Isp vs. Chamber Pressure</PanelTitle>
            <PanelSubtitle>Overlay across selected formulas</PanelSubtitle>
          </div>
        </PanelHeader>
        <PanelBody style={{ overflow: 'auto' }}>
          <LineChart width={1200} height={300} xLabel="Chamber Pressure (psi)" yLabel="Isp (s)" series={ispSeries} />
          <div style={{ marginTop: 10 }}>
            <ChartLegend items={selected.map((f) => ({ color: f.color, label: f.name }))} />
          </div>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader>
          <Icons.Beaker size={15} />
          <div>
            <PanelTitle>Composition Side-by-Side</PanelTitle>
            <PanelSubtitle>Weight % of each ingredient across selected formulas</PanelSubtitle>
          </div>
        </PanelHeader>
        <CompositionMatrix formulas={selected} />
      </Panel>
    </div>
  );
}
