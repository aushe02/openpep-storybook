'use client';
import React, { useState } from 'react';
import type { Formula } from '../types';
import { INGREDIENT_LIBRARY } from '../data/data';
import { Panel, PanelHeader, PanelTitle, PanelSubtitle, PanelBody } from '../molecules/Panel';
import { Button } from '../atoms/Button';
import { Checkbox } from '../atoms/Checkbox';
import { Icons } from '../atoms/Icons';

const FORMATS = [
  { id: 'openpep',  label: 'OpenPep JSON',          ext: '.oppep.json', desc: 'Native format. Lossless — keeps versions, notes, conditions, options.' },
  { id: 'propep3',  label: 'Legacy PROPEP3 .pep',   ext: '.pep',        desc: 'Compatible with ProPep3 fixed-width text format.' },
  { id: 'csv',      label: 'CSV (ingredients only)',ext: '.csv',        desc: 'Spreadsheet-friendly ingredient list. Loses metadata.' },
  { id: 'pdf',      label: 'PDF report',            ext: '.pdf',        desc: 'Printable summary with results, charts, and version history.' },
  { id: 'burnsim',  label: 'BurnSim',               ext: '.bsx',        desc: 'For motor design / chamber simulation handoff.' },
];

function buildPreview(formula: Formula, format: string): string {
  if (format === 'openpep') {
    return JSON.stringify({ formatVersion: 1, formula: { name: formula.name, version: formula.currentVersion, description: formula.description, tags: formula.tags, conditions: formula.conditions, components: formula.components, results: formula.results } }, null, 2);
  }
  if (format === 'propep3') {
    return `; PROPEP3 input — exported by OpenPep\n&propellant\n  name = "${formula.name}"\n  temp = ${formula.conditions.tempK}\n  p_chamber = ${formula.conditions.chamberPsi}\n  p_exhaust = ${formula.conditions.exhaustPsi}\n${formula.components.filter((c) => c.ingredientId).map((c) => { const ing = INGREDIENT_LIBRARY.find((i) => i.id === c.ingredientId); return `  ingredient "${(ing?.name || '').padEnd(28)}" wt=${c.weight.toFixed(2).padStart(7)}`; }).join('\n')}\n&end`;
  }
  if (format === 'csv') {
    return `name,formula,category,weight_grams,weight_pct\n${formula.components.filter((c) => c.ingredientId).map((c) => { const ing = INGREDIENT_LIBRARY.find((i) => i.id === c.ingredientId); return `"${ing?.name}","${ing?.formula}","${ing?.category}",${c.weight.toFixed(2)},${c.weight.toFixed(2)}`; }).join('\n')}`;
  }
  if (format === 'burnsim') {
    return `<BurnSimData Version="1.6">\n  <Propellant Name="${formula.name}">\n    <Isp>${formula.results.isp}</Isp>\n    <Cstar>${formula.results.cstar}</Cstar>\n    <Density>${formula.results.density}</Density>\n  </Propellant>\n</BurnSimData>`;
  }
  return '[PDF preview not shown — click Export to render]';
}

export interface IoViewProps {
  formula: Formula;
}

export function IoView({ formula }: IoViewProps) {
  const [tab, setTab] = useState<'export' | 'import'>('export');
  const [format, setFormat] = useState('openpep');
  const [dragOver, setDragOver] = useState(false);

  const fmt = FORMATS.find((f) => f.id === format)!;
  const previewText = buildPreview(formula, format);

  return (
    <div style={{ padding: 24, display: 'grid', gap: 20, maxWidth: 1100 }}>
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--op-surface-2)', borderRadius: 10, border: '1px solid var(--op-border)', width: 'fit-content' }}>
        {(['export', 'import'] as const).map((t) => (
          <button
            key={t}
            className="op-btn op-btn-sm"
            onClick={() => setTab(t)}
            style={{ background: tab === t ? 'var(--op-surface)' : 'transparent', borderColor: 'transparent', boxShadow: tab === t ? 'var(--op-shadow-xs)' : 'none' }}
          >
            {t === 'export' ? <><Icons.Export size={13} /> Export</> : <><Icons.Import size={13} /> Import</>}
          </button>
        ))}
      </div>

      {tab === 'export' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: 20 }}>
          <Panel>
            <PanelHeader><PanelTitle>Choose format</PanelTitle></PanelHeader>
            <PanelBody style={{ display: 'grid', gap: 8 }}>
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  style={{ textAlign: 'left', padding: 14, background: format === f.id ? 'var(--op-accent-soft)' : 'var(--op-surface-2)', border: `1px solid ${format === f.id ? 'var(--op-accent)' : 'var(--op-border)'}`, borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--op-font-sans)', color: 'var(--op-fg)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 500 }}>{f.label}</span>
                    <span className="op-mono" style={{ fontSize: 11, color: 'var(--op-fg-subtle)' }}>{f.ext}</span>
                    {format === f.id && <Icons.Check size={14} style={{ marginLeft: 'auto', color: 'var(--op-accent)' }} />}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--op-fg-muted)', marginTop: 4 }}>{f.desc}</div>
                </button>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              <Icons.File size={14} />
              <div>
                <PanelTitle>Preview</PanelTitle>
                <div className="op-panel-subtitle op-mono">
                  {formula.name.replace(/\s+/g, '_').toLowerCase()}_{formula.currentVersion}{fmt.ext}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <Button size="sm"><Icons.Copy size={12} /> Copy</Button>
                <Button variant="primary" size="sm"><Icons.Download size={12} /> Export</Button>
              </div>
            </PanelHeader>
            <pre style={{ margin: 0, padding: '16px 18px', fontFamily: 'var(--op-font-mono)', fontSize: 12, color: 'var(--op-fg)', background: 'var(--op-surface-2)', overflow: 'auto', maxHeight: 480, whiteSpace: 'pre' }}>
              {previewText}
            </pre>
            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--op-divider)', display: 'flex', gap: 14, fontSize: 11.5, color: 'var(--op-fg-subtle)' }}>
              <span><Icons.Lock size={11} /> Local only — nothing leaves your device</span>
              <span style={{ marginLeft: 'auto' }}>{previewText.length.toLocaleString()} bytes</span>
            </div>
          </Panel>
        </div>
      )}

      {tab === 'import' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 20 }}>
          <Panel>
            <PanelHeader>
              <Icons.Upload size={15} />
              <div>
                <PanelTitle>Import a propellant</PanelTitle>
                <PanelSubtitle>Accepts .oppep.json, .pep, .csv</PanelSubtitle>
              </div>
            </PanelHeader>
            <PanelBody>
              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                style={{ display: 'block', border: `1.5px dashed ${dragOver ? 'var(--op-accent)' : 'var(--op-border-strong)'}`, borderRadius: 12, padding: 40, textAlign: 'center', background: dragOver ? 'var(--op-accent-soft)' : 'var(--op-surface-2)', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <div style={{ margin: '0 auto 12px', width: 48, height: 48, borderRadius: 12, background: 'var(--op-surface)', display: 'grid', placeItems: 'center', border: '1px solid var(--op-border)' }}>
                  <Icons.Upload size={22} />
                </div>
                <div style={{ fontWeight: 500 }}>Drop a file here, or click to browse</div>
                <div style={{ fontSize: 12, color: 'var(--op-fg-muted)', marginTop: 4 }}>.oppep.json · .pep · .csv · .bsx</div>
                <input type="file" style={{ display: 'none' }} />
              </label>

              <div style={{ marginTop: 18 }}>
                <div className="op-field-label">Recent imports</div>
                <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                  {[
                    { name: 'rs-25_alh_v2.oppep.json', when: 'today', size: '2.4 KB' },
                    { name: 'knsu_classic.pep', when: '2 days ago', size: '0.8 KB' },
                    { name: 'blue_streak_v1.oppep.json', when: 'last week', size: '1.7 KB' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid var(--op-divider)', borderRadius: 8 }}>
                      <Icons.File size={14} />
                      <span className="op-mono" style={{ fontSize: 12 }}>{r.name}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--op-fg-subtle)' }}>· {r.when}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--op-fg-subtle)' }} className="op-mono">{r.size}</span>
                      <Button variant="ghost" size="sm">Open</Button>
                    </div>
                  ))}
                </div>
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader><PanelTitle>On import</PanelTitle></PanelHeader>
            <PanelBody style={{ display: 'grid', gap: 12 }}>
              <Checkbox checked={true} onChange={() => {}} label="Match ingredients to local library" />
              <Checkbox checked={true} onChange={() => {}} label="Create version snapshot for imported state" />
              <Checkbox checked={false} onChange={() => {}} label="Overwrite if a formula with same name exists" />
              <Checkbox checked={true} onChange={() => {}} label="Recalculate after import" />
              <div style={{ marginTop: 4, padding: 10, background: 'var(--op-surface-2)', borderRadius: 8, fontSize: 12, color: 'var(--op-fg-muted)' }}>
                Unknown ingredients are flagged before the formula is created — you will be asked to map or add them to your library.
              </div>
            </PanelBody>
          </Panel>
        </div>
      )}
    </div>
  );
}
