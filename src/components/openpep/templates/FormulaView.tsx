'use client';
import React from 'react';
import type { Formula } from '../types';
import { INGREDIENT_LIBRARY } from '../data/data';
import { Panel, PanelHeader, PanelTitle, PanelSubtitle, PanelBody } from '../molecules/Panel';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { NumberInput, FieldLabel, FieldHint } from '../atoms/Input';
import { Checkbox } from '../atoms/Checkbox';
import { Combobox } from '../molecules/Combobox';
import { Donut } from '../molecules/Donut';
import { Icons } from '../atoms/Icons';

export interface FormulaViewProps {
  formula: Formula;
  onChange: (formula: Formula) => void;
  onCalculate?: () => void;
}

export function FormulaView({ formula, onChange, onCalculate }: FormulaViewProps) {
  const totalWt = formula.components.reduce((s, c) => s + (c.weight || 0), 0);
  const isValid = Math.abs(totalWt - 100) < 0.01;

  const setComp = (idx: number, patch: Partial<typeof formula.components[0]>) => {
    const next = [...formula.components];
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...formula, components: next });
  };

  const addComp = () => onChange({ ...formula, components: [...formula.components, { ingredientId: null, weight: 0 }] });

  const removeComp = (idx: number) =>
    onChange({ ...formula, components: formula.components.filter((_, i) => i !== idx) });

  const normalize = () => {
    if (totalWt === 0) return;
    const f = 100 / totalWt;
    onChange({ ...formula, components: formula.components.map((c) => ({ ...c, weight: +(c.weight * f).toFixed(2) })) });
  };

  const setCond = (patch: Partial<typeof formula.conditions>) =>
    onChange({ ...formula, conditions: { ...formula.conditions, ...patch } });

  const donutData = formula.components
    .filter((c) => c.ingredientId && c.weight > 0)
    .map((c) => {
      const ing = INGREDIENT_LIBRARY.find((i) => i.id === c.ingredientId);
      return { value: c.weight, color: ing?.color || 'var(--op-fg-faint)', name: ing?.name };
    });

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 20, maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: formula.color, flexShrink: 0 }} />
          <input
            value={formula.name}
            onChange={(e) => onChange({ ...formula, name: e.target.value })}
            style={{
              fontSize: 24, fontWeight: 600, letterSpacing: '-0.015em',
              border: 'none', outline: 'none', background: 'transparent',
              padding: '2px 4px', borderRadius: 6, flex: 1, minWidth: 0,
              fontFamily: 'var(--op-font-sans)', color: 'var(--op-fg)',
            }}
          />
          <Badge variant="neutral">{formula.currentVersion}</Badge>
          {formula.tags.map((t) => <Badge key={t} variant="accent">{t}</Badge>)}
        </div>
        <div style={{ marginTop: 6, color: 'var(--op-fg-muted)', fontSize: 13, marginLeft: 28 }}>
          {formula.description}
        </div>
      </div>

      {/* LEFT — Ingredients */}
      <Panel>
        <PanelHeader>
          <Icons.Beaker size={15} />
          <div>
            <PanelTitle>Ingredients</PanelTitle>
            <PanelSubtitle>Weights as percentages — must total 100.00g</PanelSubtitle>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <Button size="sm" onClick={normalize} title="Scale weights to sum to 100">Normalize</Button>
            <Button size="sm" onClick={addComp}><Icons.Plus size={12} /> Row</Button>
          </div>
        </PanelHeader>
        <PanelBody flush>
          <table className="op-data">
            <thead>
              <tr>
                <th style={{ width: 28 }} />
                <th>Ingredient</th>
                <th style={{ width: 110, textAlign: 'right' }}>Weight (g)</th>
                <th style={{ width: 64, textAlign: 'right' }}>%</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {formula.components.map((c, i) => {
                const pct = totalWt > 0 ? (c.weight / totalWt) * 100 : 0;
                return (
                  <tr key={i}>
                    <td style={{ color: 'var(--op-fg-faint)', fontFamily: 'var(--op-font-mono)', fontSize: 11 }}>
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <Combobox
                        value={c.ingredientId}
                        onChange={(v) => setComp(i, { ingredientId: v })}
                        options={INGREDIENT_LIBRARY}
                        placeholder="Search & add ingredient…"
                      />
                    </td>
                    <td>
                      <NumberInput value={c.weight} onChange={(v) => setComp(i, { weight: v })} step={0.01} />
                    </td>
                    <td className="op-num" style={{ color: 'var(--op-fg-muted)', fontSize: 12 }}>
                      {pct.toFixed(2)}
                    </td>
                    <td>
                      <Button variant="ghost" size="icon" onClick={() => removeComp(i)} title="Remove">
                        <Icons.Trash size={13} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </PanelBody>
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--op-divider)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--op-surface-2)' }}>
          <span style={{ fontSize: 12, color: 'var(--op-fg-muted)' }}>Total weight</span>
          <span className="op-mono" style={{ fontSize: 15, fontWeight: 500, color: isValid ? 'var(--op-fg)' : 'var(--op-danger)' }}>
            {totalWt.toFixed(2)} g
          </span>
          {isValid ? (
            <Badge variant="success"><Icons.Check size={11} /> balanced</Badge>
          ) : (
            <Badge variant="danger">
              {totalWt > 100 ? `+${(totalWt - 100).toFixed(2)}` : `${(totalWt - 100).toFixed(2)}`} off
            </Badge>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Button size="sm"><Icons.Save size={12} /> Snapshot</Button>
            <Button variant="primary" size="sm" onClick={onCalculate} disabled={!isValid}>
              <Icons.Play size={11} /> Calculate
            </Button>
          </div>
        </div>
      </Panel>

      {/* RIGHT — Composition + Conditions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel>
          <PanelHeader>
            <Icons.Flame size={15} />
            <PanelTitle>Composition</PanelTitle>
          </PanelHeader>
          <PanelBody style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Donut data={donutData} size={130} thickness={20} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              {donutData.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--op-fg-subtle)' }}>Add ingredients to see breakdown.</div>
              )}
              {donutData.slice(0, 7).map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                  <span className="op-mono" style={{ marginLeft: 'auto', color: 'var(--op-fg-muted)' }}>{d.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <Icons.Settings size={15} />
            <PanelTitle>Operating Conditions</PanelTitle>
          </PanelHeader>
          <PanelBody style={{ display: 'grid', gap: 12 }}>
            <div>
              <FieldLabel>Temperature of Ingredients</FieldLabel>
              <NumberInput value={formula.conditions.tempK} onChange={(v) => setCond({ tempK: v })} step={1} suffix="K" />
            </div>
            <div>
              <FieldLabel>Chamber Pressure</FieldLabel>
              <NumberInput value={formula.conditions.chamberPsi} onChange={(v) => setCond({ chamberPsi: v })} step={10} suffix="psi" />
            </div>
            <div>
              <FieldLabel>Exhaust Pressure</FieldLabel>
              <NumberInput value={formula.conditions.exhaustPsi} onChange={(v) => setCond({ exhaustPsi: v })} step={0.1} suffix="psi" />
              <FieldHint>1 atm = 14.696 psi (sea level)</FieldHint>
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <Icons.Filter size={15} />
            <PanelTitle>Calculation Options</PanelTitle>
          </PanelHeader>
          <PanelBody style={{ display: 'grid', gap: 10 }}>
            <Checkbox checked={formula.conditions.deleteLowSpecies} onChange={(v) => setCond({ deleteLowSpecies: v })} label="Delete low-fraction species" />
            <Checkbox checked={formula.conditions.includeIonic} onChange={(v) => setCond({ includeIonic: v })} label="Include ionic species in solution" />
            <Checkbox checked={formula.conditions.boostVelocity} onChange={(v) => setCond({ boostVelocity: v })} label="Boost velocity and nozzle design" />
            <Checkbox checked={formula.conditions.pressureAtmospheric} onChange={(v) => setCond({ pressureAtmospheric: v })} label="Pressure at atmospheric" />
            <Checkbox checked={formula.conditions.moreSpecies} onChange={(v) => setCond({ moreSpecies: v })} label="Use extended species library" />
            <Checkbox checked={formula.conditions.combustionConsidered} onChange={(v) => setCond({ combustionConsidered: v })} label="Combustion conditions considered" />
            <Checkbox checked={formula.conditions.fixChamberTemp} onChange={(v) => setCond({ fixChamberTemp: v })} label="Fix chamber temperature" />
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}
