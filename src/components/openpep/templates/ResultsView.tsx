import React from 'react';
import type { Formula } from '../types';
import { Panel, PanelHeader, PanelTitle, PanelSubtitle, PanelBody } from '../molecules/Panel';
import { Stat, StatGrid } from '../molecules/Stat';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { LineChart, ChartLegend } from '../molecules/LineChart';
import { Icons } from '../atoms/Icons';

export interface ResultsViewProps {
  formula: Formula;
}

function NozzleSchematic({ expansion }: { expansion: number }) {
  const ratio = Math.min(Math.sqrt(expansion), 5);
  const w = 280, h = 130;
  const cx = w / 2;
  const throatY = h / 2;
  const throatR = 12;
  const exitR = throatR * ratio;
  const chamR = throatR * 3;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--op-border)" strokeWidth="1" />
        </pattern>
      </defs>
      <path
        d={`M 10 ${throatY - chamR} L 90 ${throatY - chamR} L ${cx} ${throatY - throatR} L ${w - 20} ${throatY - exitR} L ${w - 20} ${throatY - exitR - 8} L ${cx} ${throatY - throatR - 8} L 90 ${throatY - chamR - 8} L 10 ${throatY - chamR - 8} Z`}
        fill="url(#hatch)" stroke="var(--op-fg-muted)" strokeWidth="1"
      />
      <path
        d={`M 10 ${throatY + chamR} L 90 ${throatY + chamR} L ${cx} ${throatY + throatR} L ${w - 20} ${throatY + exitR} L ${w - 20} ${throatY + exitR + 8} L ${cx} ${throatY + throatR + 8} L 90 ${throatY + chamR + 8} L 10 ${throatY + chamR + 8} Z`}
        fill="url(#hatch)" stroke="var(--op-fg-muted)" strokeWidth="1"
      />
      <path
        d={`M 90 ${throatY - chamR + 1} L ${cx} ${throatY - throatR + 1} L ${w - 20} ${throatY - exitR + 1} L ${w - 20} ${throatY + exitR - 1} L ${cx} ${throatY + throatR - 1} L 90 ${throatY + chamR - 1} Z`}
        fill="oklch(0.93 0.05 200 / 0.5)"
      />
      <line x1="5" y1={throatY} x2={w - 5} y2={throatY} stroke="var(--op-fg-faint)" strokeDasharray="3 3" />
      <text x={cx - 8} y={throatY - throatR - 14} fontSize="9" fill="var(--op-fg-muted)" fontFamily="var(--op-font-mono)">throat</text>
      <text x={w - 24} y={throatY - exitR - 4} fontSize="9" fill="var(--op-fg-muted)" fontFamily="var(--op-font-mono)" textAnchor="end">exit</text>
    </svg>
  );
}

function SpeciesBar({ name, pct, color }: { name: string; pct: number; color: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 60px', gap: 12, alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--op-font-mono)', fontSize: 12.5 }}>{name}</span>
      <div style={{ height: 8, borderRadius: 999, background: 'var(--op-surface-3)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct * 2}%`, background: color, borderRadius: 999 }} />
      </div>
      <span className="op-mono" style={{ textAlign: 'right', fontSize: 12, color: 'var(--op-fg-muted)' }}>{pct.toFixed(2)}%</span>
    </div>
  );
}

function NozzleRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--op-fg-muted)' }}>{label}</span>
      <span className="op-mono">{value}</span>
    </div>
  );
}

export function ResultsView({ formula }: ResultsViewProps) {
  const r = formula.results;

  const pressures = Array.from({ length: 16 }, (_, i) => 100 + i * 100);
  const ispCurve = pressures.map((p) => ({
    x: p,
    y: r.isp * (0.65 + 0.35 * Math.log10(p / 14.7) / Math.log10(formula.conditions.chamberPsi / 14.7)),
  }));
  const cstarCurve = pressures.map((p) => ({ x: p, y: r.cstar * (0.9 + 0.10 * (p / formula.conditions.chamberPsi)) }));
  const tempCurve = pressures.map((p) => ({ x: p, y: r.chamberTemp * (0.92 + 0.08 * Math.tanh((p - 200) / 600)) }));
  const areaRatios = Array.from({ length: 22 }, (_, i) => 1 + i * 0.5);
  const machCurve = areaRatios.map((e) => ({ x: e, y: 1 + Math.log10(e) * 1.5 + Math.sqrt(e - 1) * 0.4 }));

  const species = [
    { name: 'H2O', pct: 28.4, color: 'var(--op-c1)' },
    { name: 'CO2', pct: 14.7, color: 'var(--op-c2)' },
    { name: 'HCl', pct: 12.1, color: 'var(--op-c3)' },
    { name: 'N2',  pct: 9.5,  color: 'var(--op-c4)' },
    { name: 'CO',  pct: 8.3,  color: 'var(--op-c5)' },
    { name: 'Al2O3 (s,l)', pct: 24.8, color: 'var(--op-c6)' },
    { name: 'H2',  pct: 2.2,  color: 'var(--op-fg-faint)' },
  ];

  return (
    <div style={{ padding: 24, display: 'grid', gap: 20, maxWidth: 1400 }}>
      <StatGrid>
        <Stat label="Specific Impulse"       value={r.isp.toFixed(2)}        unit="s"       trend="up"   delta="+1.97" sub="Isp*" />
        <Stat label="Characteristic Velocity" value={r.cstar.toFixed(1)}      unit="ft/s"    trend="up"   delta="+7.45" sub="c*" />
        <Stat label="Chamber Temperature"    value={r.chamberTemp.toFixed(0)} unit="K"       trend="up"   delta="+4.49" sub="Tc" />
        <Stat label="Density"                value={r.density.toFixed(4)}     unit="lb/in³"  trend="up"   delta="+0.0001" sub="ρ" />
        <Stat label="Molecular Weight"       value={r.molecularWt.toFixed(3)} unit="g/mol"   trend="flat" delta="±0.000" sub="M̄" />
        <Stat label="Chamber Cp/Cv"          value={r.cpcv.toFixed(4)}        unit="γ"       trend="flat" delta="±0.000" sub="γc" />
        <Stat label="Exhaust Temperature"    value={r.exhaustTemp.toFixed(1)} unit="K"       trend="up"   delta="+12.4" sub="Te" />
        <Stat label="Expansion Ratio"        value={r.expansionRatio.toFixed(2)} unit="ε"   trend="flat" delta="±0.00" sub="Ae/At" />
      </StatGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Panel>
          <PanelHeader>
            <Icons.Sparkles size={15} />
            <div>
              <PanelTitle>Isp vs. Chamber Pressure</PanelTitle>
              <PanelSubtitle>Theoretical, optimum expansion to {formula.conditions.exhaustPsi} psi</PanelSubtitle>
            </div>
            <div style={{ marginLeft: 'auto' }}><Badge variant="accent">Isp*</Badge></div>
          </PanelHeader>
          <PanelBody style={{ overflow: 'auto' }}>
            <LineChart
              width={580} height={240}
              xLabel="Chamber Pressure (psi)" yLabel="Isp (s)"
              series={[{ color: 'var(--op-accent)', data: ispCurve }]}
            />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <Icons.Flame size={15} />
            <div>
              <PanelTitle>C* and Chamber T</PanelTitle>
              <PanelSubtitle>Both vs. chamber pressure</PanelSubtitle>
            </div>
          </PanelHeader>
          <PanelBody style={{ overflow: 'auto' }}>
            <LineChart
              width={580} height={240}
              xLabel="Chamber Pressure (psi)" yLabel=""
              series={[
                { color: 'var(--op-c2)', data: cstarCurve.map((p) => ({ x: p.x, y: p.y / 100 })) },
                { color: 'var(--op-c4)', data: tempCurve.map((p) => ({ x: p.x, y: p.y / 10 })) },
              ]}
            />
            <div style={{ marginTop: 8 }}>
              <ChartLegend items={[{ color: 'var(--op-c2)', label: 'C* (×100 ft/s)' }, { color: 'var(--op-c4)', label: 'Tc (×10 K)' }]} />
            </div>
          </PanelBody>
        </Panel>
      </div>

      <Panel>
        <PanelHeader>
          <Icons.ArrowRight size={15} />
          <div>
            <PanelTitle>Nozzle Design</PanelTitle>
            <PanelSubtitle>Geometric output for converging–diverging nozzle, Mach number vs. area ratio</PanelSubtitle>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, fontSize: 12, color: 'var(--op-fg-muted)' }}>
            <span>Throat ε = 1.00</span>
            <span style={{ color: 'var(--op-fg-faint)' }}>·</span>
            <span>Exit ε = {r.expansionRatio.toFixed(2)}</span>
          </div>
        </PanelHeader>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', borderTop: '1px solid var(--op-divider)' }}>
          <PanelBody style={{ overflow: 'auto' }}>
            <LineChart
              width={680} height={240}
              xLabel="Area Ratio (Ae/At)" yLabel="Mach Number"
              series={[{ color: 'var(--op-c3)', data: machCurve }]}
            />
          </PanelBody>
          <div style={{ borderLeft: '1px solid var(--op-divider)', padding: 18 }}>
            <NozzleSchematic expansion={r.expansionRatio} />
            <div style={{ marginTop: 16, display: 'grid', gap: 8, fontSize: 12 }}>
              <NozzleRow label="Throat radius" value="0.218 in" />
              <NozzleRow label="Exit radius" value={`${(0.218 * Math.sqrt(r.expansionRatio)).toFixed(3)} in`} />
              <NozzleRow label="Divergence half-angle" value="15°" />
              <NozzleRow label="Exit Mach" value={machCurve[machCurve.length - 1].y.toFixed(2)} />
              <NozzleRow label="Mass flow rate" value="0.184 lb/s" />
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHeader>
          <Icons.Beaker size={15} />
          <div>
            <PanelTitle>Combustion Products</PanelTitle>
            <PanelSubtitle>Mole fractions in chamber, top 7 species</PanelSubtitle>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, fontSize: 12, color: 'var(--op-fg-muted)' }}>
            <span className="op-kbd">26 total</span>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
        </PanelHeader>
        <PanelBody style={{ display: 'grid', gap: 10 }}>
          {species.map((s) => <SpeciesBar key={s.name} {...s} />)}
        </PanelBody>
      </Panel>
    </div>
  );
}
