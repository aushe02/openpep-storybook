'use client';
import React, { useState } from 'react';
import type { Formula, VersionEntry, VersionChange } from '../types';
import { VERSION_HISTORY } from '../data/data';
import { Panel, PanelHeader, PanelTitle, PanelSubtitle, PanelBody } from '../molecules/Panel';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Sparkline } from '../atoms/Sparkline';
import { Icons } from '../atoms/Icons';

export interface VersionsViewProps {
  formula: Formula;
}

function TrendTile({ label, data, value, unit }: { label: string; data: number[]; value?: string; unit: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--op-fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
        <span className="op-mono" style={{ fontSize: 16, fontWeight: 500 }}>{value}</span>
        <span style={{ fontSize: 11, color: 'var(--op-fg-subtle)' }}>{unit}</span>
      </div>
      <div style={{ marginTop: 4 }}>
        <Sparkline data={data} width={140} height={24} />
      </div>
    </div>
  );
}

function DiffStat({ label, from = 0, to = 0, unit, digits = 2 }: { label: string; from?: number; to?: number; unit: string; digits?: number }) {
  const delta = to - from;
  const sign = delta > 0 ? '+' : '';
  const cls = Math.abs(delta) < Math.pow(10, -digits - 1) ? 'flat' : delta > 0 ? 'up' : 'down';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 90px', alignItems: 'center', fontSize: 12.5 }}>
      <span style={{ color: 'var(--op-fg-muted)' }}>{label}</span>
      <span className="op-mono" style={{ color: 'var(--op-fg-subtle)' }}>{from?.toFixed(digits)}</span>
      <span className="op-mono">{to?.toFixed(digits)} <span style={{ color: 'var(--op-fg-subtle)', fontSize: 11 }}>{unit}</span></span>
      <span className={`op-stat-delta ${cls}`} style={{ marginTop: 0, textAlign: 'right' }}>{sign}{delta.toFixed(digits)}</span>
    </div>
  );
}

const DIFF_STYLES = {
  modify: { bg: 'var(--op-warning-soft)', color: 'oklch(0.40 0.10 70)', label: 'MOD' },
  add:    { bg: 'var(--op-success-soft)', color: 'oklch(0.38 0.10 150)', label: 'ADD' },
  remove: { bg: 'var(--op-danger-soft)', color: 'oklch(0.40 0.13 25)', label: 'DEL' },
  note:   { bg: 'var(--op-surface-3)', color: 'var(--op-fg-muted)', label: 'NOTE' },
  init:   { bg: 'var(--op-accent-soft)', color: 'oklch(0.35 0.10 200)', label: 'INIT' },
};

function DiffRow({ c }: { c: VersionChange }) {
  const s = DIFF_STYLES[c.type] || DIFF_STYLES.modify;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', background: s.bg, borderRadius: 6, fontSize: 12.5 }}>
      <span style={{ fontFamily: 'var(--op-font-mono)', fontSize: 10, fontWeight: 600, color: s.color, width: 32, flexShrink: 0 }}>{s.label}</span>
      <span style={{ flex: 1 }}>{c.field}</span>
      {c.from != null && c.to != null && (
        <span className="op-mono" style={{ fontSize: 12, color: s.color }}>{String(c.from)} → {String(c.to)}</span>
      )}
      {c.from == null && c.to != null && (
        <span className="op-mono" style={{ fontSize: 12, color: s.color }}>{String(c.to)}</span>
      )}
    </div>
  );
}

export function VersionsView({ formula }: VersionsViewProps) {
  const history = VERSION_HISTORY[formula.id] || [];
  const [selected, setSelected] = useState(history[0]?.version);
  const [compareTo, setCompareTo] = useState(history[1]?.version);

  const sel = history.find((h) => h.version === selected);
  const cmp = history.find((h) => h.version === compareTo);

  const ispSeries = [...history].reverse().map((h) => h.results.isp);
  const tempSeries = [...history].reverse().map((h) => h.results.chamberTemp);
  const densSeries = [...history].reverse().map((h) => h.results.density);

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(420px, 520px)', gap: 20, maxWidth: 1400 }}>
      <Panel style={{ overflow: 'visible' }}>
        <PanelHeader>
          <Icons.GitBranch size={15} />
          <div>
            <PanelTitle>Version Timeline</PanelTitle>
            <PanelSubtitle>{history.length} snapshots · linear history</PanelSubtitle>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <Button size="sm"><Icons.Tag size={12} /> Tag</Button>
            <Button variant="primary" size="sm"><Icons.Save size={12} /> New snapshot</Button>
          </div>
        </PanelHeader>

        <div style={{ padding: '12px 18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, borderBottom: '1px solid var(--op-divider)', background: 'var(--op-surface-2)' }}>
          <TrendTile label="Isp" data={ispSeries} value={sel?.results.isp.toFixed(2)} unit="s" />
          <TrendTile label="Chamber T" data={tempSeries} value={sel?.results.chamberTemp.toFixed(0)} unit="K" />
          <TrendTile label="Density" data={densSeries} value={sel?.results.density.toFixed(4)} unit="lb/in³" />
        </div>

        <div style={{ padding: '10px 12px 16px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 36, top: 18, bottom: 18, width: 1, background: 'var(--op-border)' }} />
          {history.map((h) => {
            const isSel = h.version === selected;
            const isCmp = h.version === compareTo;
            return (
              <div
                key={h.version}
                onClick={() => setSelected(h.version)}
                style={{
                  position: 'relative',
                  padding: '10px 12px 10px 56px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: isSel ? 'var(--op-surface-2)' : 'transparent',
                  border: isSel ? '1px solid var(--op-border)' : '1px solid transparent',
                  marginBottom: 4,
                }}
              >
                <div style={{
                  position: 'absolute', left: 30, top: 18,
                  width: 14, height: 14, borderRadius: '50%',
                  background: isSel ? 'var(--op-accent)' : 'var(--op-surface)',
                  border: `2px solid ${isSel ? 'var(--op-accent)' : 'var(--op-border-strong)'}`,
                  boxShadow: '0 0 0 3px var(--op-bg)',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="op-mono" style={{ fontSize: 12, color: 'var(--op-fg-muted)', fontWeight: 500 }}>{h.version}</span>
                  <span style={{ fontWeight: 500 }}>{h.label}</span>
                  {h.tag === 'milestone' && <Badge variant="accent"><Icons.Tag size={10} /> milestone</Badge>}
                  {h.tag === 'lab-test' && <Badge variant="success"><Icons.Flame size={10} /> lab-test</Badge>}
                  {h.tag === 'wip' && <Badge variant="warning">wip</Badge>}
                  <div style={{ marginLeft: 'auto' }}>
                    {!isCmp ? (
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setCompareTo(h.version); }} title="Compare against this">
                        <Icons.Compare size={12} />
                      </Button>
                    ) : (
                      <Badge variant="neutral">comparing</Badge>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--op-fg-muted)', marginTop: 4 }}>{h.note}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: 11.5, color: 'var(--op-fg-subtle)' }}>
                  <span><Icons.Clock size={10} /> {h.when_full}</span>
                  <span>by {h.author}</span>
                  <span className="op-mono">Isp {h.results.isp.toFixed(2)}s</span>
                  <span className="op-mono">Tc {h.results.chamberTemp.toFixed(0)}K</span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel style={{ position: 'sticky', top: 0, alignSelf: 'start' }}>
        <PanelHeader>
          <Icons.Eye size={15} />
          <div>
            <PanelTitle>Diff</PanelTitle>
            <PanelSubtitle>{cmp?.version} → {sel?.version}</PanelSubtitle>
          </div>
        </PanelHeader>
        <PanelBody>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: 10, background: 'var(--op-surface-2)', borderRadius: 8, border: '1px solid var(--op-border)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--op-fg-faint)' }} />
            <span className="op-mono" style={{ fontSize: 12 }}>{cmp?.version}</span>
            <Icons.ArrowRight size={12} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--op-accent)' }} />
            <span className="op-mono" style={{ fontSize: 12, color: 'var(--op-fg)' }}>{sel?.version}</span>
            <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--op-fg-subtle)' }}>
              {sel?.changes.length} change{sel?.changes.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div className="op-field-label">Result delta</div>
            <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
              <DiffStat label="Isp" from={cmp?.results.isp} to={sel?.results.isp} unit="s" digits={2} />
              <DiffStat label="C*" from={cmp?.results.cstar} to={sel?.results.cstar} unit="ft/s" digits={2} />
              <DiffStat label="Chamber T" from={cmp?.results.chamberTemp} to={sel?.results.chamberTemp} unit="K" digits={1} />
              <DiffStat label="Density" from={cmp?.results.density} to={sel?.results.density} unit="lb/in³" digits={4} />
            </div>
          </div>

          <div>
            <div className="op-field-label">Formula changes</div>
            <div style={{ display: 'grid', gap: 4, marginTop: 6 }}>
              {sel?.changes.map((c, i) => <DiffRow key={i} c={c} />)}
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
            <Button size="sm" style={{ flex: 1 }}><Icons.Copy size={12} /> Duplicate as draft</Button>
            <Button size="sm" style={{ flex: 1 }}><Icons.ArrowUp size={12} /> Restore</Button>
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}
