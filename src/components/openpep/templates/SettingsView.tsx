'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelHeader, PanelTitle, PanelBody } from '../molecules/Panel';
import { Button } from '../atoms/Button';
import { Switch } from '../atoms/Switch';
import { Input } from '../atoms/Input';
import { Icons } from '../atoms/Icons';

const UNIT_GROUPS = [
  { id: 'pressure',    label: 'Pressure',           options: [{ value: 'psi', label: 'psi' }, { value: 'bar', label: 'bar' }, { value: 'atm', label: 'atm' }, { value: 'kPa', label: 'kPa' }, { value: 'MPa', label: 'MPa' }] },
  { id: 'temperature', label: 'Temperature',        options: [{ value: 'K', label: 'Kelvin (K)' }, { value: '°C', label: 'Celsius (°C)' }, { value: '°F', label: 'Fahrenheit (°F)' }, { value: '°R', label: 'Rankine (°R)' }] },
  { id: 'mass',        label: 'Mass / Weight',      options: [{ value: 'g', label: 'grams (g)' }, { value: 'kg', label: 'kilograms (kg)' }, { value: 'oz', label: 'ounces (oz)' }, { value: 'lb', label: 'pounds (lb)' }] },
  { id: 'density',     label: 'Density',            options: [{ value: 'lb/in³', label: 'lb/in³' }, { value: 'g/cm³', label: 'g/cm³' }, { value: 'kg/m³', label: 'kg/m³' }] },
  { id: 'velocity',    label: 'Velocity (c*, exhaust)', options: [{ value: 'ft/s', label: 'ft/s' }, { value: 'm/s', label: 'm/s' }] },
  { id: 'energy',      label: 'Heat of Formation', options: [{ value: 'cal/mol', label: 'cal/mol' }, { value: 'J/mol', label: 'J/mol' }, { value: 'kJ/mol', label: 'kJ/mol' }] },
];

const SAMPLE_LOGS = [
  { t: '14:42:08.213', level: 'info',  src: 'calc',     msg: "Calculation started — formula='Nassa Slow 1.2B' v1.2.3 chamber=1000psi" },
  { t: '14:42:08.216', level: 'debug', src: 'calc',     msg: 'Loaded 7 ingredients, total weight = 100.00g (balanced)' },
  { t: '14:42:08.221', level: 'debug', src: 'thermo',   msg: 'Resolved 28 candidate species from JANNAF table v2024' },
  { t: '14:42:08.234', level: 'debug', src: 'thermo',   msg: 'Iteration 1/12: Tc=2850.4 K, residual=4.21e-3' },
  { t: '14:42:08.255', level: 'debug', src: 'thermo',   msg: 'Equilibrium converged after 9 iterations' },
  { t: '14:42:08.262', level: 'info',  src: 'calc',     msg: 'Isp=193.17 s, c*=5009.55 ft/s, Tc=2922.89 K, ρ=0.0605 lb/in³' },
  { t: '14:42:08.264', level: 'warn',  src: 'nozzle',   msg: 'Exit pressure below ambient — overexpansion expected at sea level' },
  { t: '14:43:18.412', level: 'error', src: 'import',   msg: 'Failed to parse legacy .pep file: unexpected token at line 14 col 22' },
];

const SECTIONS = [
  { id: 'units',   label: 'Units',       icon: 'Settings' as const },
  { id: 'general', label: 'General',     icon: 'Settings' as const },
  { id: 'calc',    label: 'Calculation', icon: 'Sparkles' as const },
  { id: 'storage', label: 'Storage',     icon: 'Folder' as const },
  { id: 'logs',    label: 'Debug Logs',  icon: 'File' as const },
  { id: 'about',   label: 'About',       icon: 'Book' as const },
];

function SettingsHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em' }}>{title}</h2>
      <p style={{ margin: '4px 0 0', color: 'var(--op-fg-muted)', fontSize: 13 }}>{desc}</p>
    </div>
  );
}

function PrefRow({ label, desc, defaultOn = false }: { label: string; desc?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <Switch value={on} onChange={setOn} label={label} description={desc} />;
}

function NumberPref({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <label className="op-field-label">{label}</label>
      <Input mono defaultValue={value} />
      {hint && <div className="op-field-hint">{hint}</div>}
    </div>
  );
}

function FolderPref({ label, path }: { label: string; path: string }) {
  return (
    <div>
      <label className="op-field-label">{label}</label>
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="op-input op-input-mono" style={{ flex: 1, fontSize: 12 }}>
          <Icons.Folder size={13} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path}</span>
        </div>
        <Button size="sm">Change…</Button>
      </div>
    </div>
  );
}

function UsageBar({ label, bytes, max }: { label: string; bytes: number; max: number }) {
  const fmt = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${(b / 1024).toFixed(1)} KB`;
  const pct = Math.min(100, (bytes / max) * 100);
  return (
    <div>
      <div style={{ display: 'flex', fontSize: 12.5, marginBottom: 4 }}>
        <span>{label}</span>
        <span className="op-mono" style={{ marginLeft: 'auto', color: 'var(--op-fg-muted)' }}>{fmt(bytes)}</span>
      </div>
      <div style={{ height: 6, background: 'var(--op-surface-3)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--op-accent)', borderRadius: 999 }} />
      </div>
    </div>
  );
}

function LogLine({ l, wrap }: { l: typeof SAMPLE_LOGS[0]; wrap: boolean }) {
  const colors = { debug: 'var(--op-fg-subtle)', info: 'var(--op-accent)', warn: 'oklch(0.50 0.13 70)', error: 'var(--op-danger)' } as Record<string, string>;
  const bg = l.level === 'error' ? 'var(--op-danger-soft)' : l.level === 'warn' ? 'var(--op-warning-soft)' : 'transparent';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '100px 50px 70px 1fr', gap: 10, padding: '2px 14px', whiteSpace: wrap ? 'normal' : 'nowrap', background: bg, borderLeft: l.level === 'error' ? '2px solid var(--op-danger)' : l.level === 'warn' ? '2px solid var(--op-warning)' : '2px solid transparent' }}>
      <span style={{ color: 'var(--op-fg-faint)' }}>{l.t}</span>
      <span style={{ color: colors[l.level], textTransform: 'uppercase', fontSize: 10.5, fontWeight: 600, alignSelf: 'center' }}>{l.level}</span>
      <span style={{ color: 'var(--op-fg-muted)' }}>{l.src}</span>
      <span style={{ color: l.level === 'error' ? 'var(--op-danger)' : 'var(--op-fg)', overflow: wrap ? 'visible' : 'hidden', textOverflow: 'ellipsis' }}>{l.msg}</span>
    </div>
  );
}

function DebugLogs() {
  const [level, setLevel] = useState('debug');
  const [wrap, setWrap] = useState(false);
  const [follow, setFollow] = useState(true);
  const [paused, setPaused] = useState(false);
  const [logs, setLogs] = useState(SAMPLE_LOGS);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const levels = ['debug', 'info', 'warn', 'error'];
  const levelRank: Record<string, number> = { debug: 0, info: 1, warn: 2, error: 3 };
  const filtered = logs.filter((l) => levelRank[l.level] >= levelRank[level]);
  const counts = logs.reduce((acc, l) => ({ ...acc, [l.level]: (acc[l.level] || 0) + 1 }), {} as Record<string, number>);

  useEffect(() => {
    if (paused) return;
    const msgs = [
      { level: 'debug', src: 'ui',    msg: 'Repaint: workspace → settings/logs' },
      { level: 'info',  src: 'store', msg: 'Autosave debounce flushed (no changes)' },
      { level: 'warn',  src: 'calc',  msg: 'Skipped species N2O4 (mole frac < cutoff)' },
    ];
    const i = setInterval(() => {
      const m = msgs[Math.floor(Math.random() * msgs.length)];
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      setLogs((prev) => [...prev.slice(-200), { t, ...m }]);
    }, 2400);
    return () => clearInterval(i);
  }, [paused]);

  useEffect(() => {
    if (follow && scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [logs, follow]);

  const colorMap: Record<string, string> = { debug: 'var(--op-fg-muted)', info: 'var(--op-accent)', warn: 'oklch(0.55 0.13 70)', error: 'var(--op-danger)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SettingsHeader title="Debug Logs" desc="Live application output. Useful when filing bug reports or diagnosing solver issues." />
      <Panel>
        <div style={{ padding: 12, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 2, background: 'var(--op-surface-2)', padding: 3, borderRadius: 6, border: '1px solid var(--op-border)' }}>
            {levels.map((lv) => (
              <button key={lv} onClick={() => setLevel(lv)} style={{ padding: '3px 9px', fontSize: 11.5, borderRadius: 4, fontFamily: 'var(--op-font-mono)', textTransform: 'uppercase', letterSpacing: 0.04, color: level === lv ? colorMap[lv] : 'var(--op-fg-subtle)', background: level === lv ? 'var(--op-surface)' : 'transparent', boxShadow: level === lv ? 'var(--op-shadow-xs)' : 'none', border: 'none', cursor: 'pointer' }}>
                {lv} <span style={{ color: 'var(--op-fg-faint)', fontSize: 10 }}>{counts[lv] || 0}</span>
              </button>
            ))}
          </div>
          <label className="op-checkbox" style={{ fontSize: 12 }}>
            <input type="checkbox" checked={wrap} onChange={(e) => setWrap(e.target.checked)} />
            <span className="box" />
            <span>Wrap</span>
          </label>
          <label className="op-checkbox" style={{ fontSize: 12 }}>
            <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} />
            <span className="box" />
            <span>Follow tail</span>
          </label>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <Button size="sm" onClick={() => setPaused((p) => !p)}>
              {paused ? <><Icons.Play size={11} /> Resume</> : <><Icons.Minus size={12} /> Pause</>}
            </Button>
            <Button size="sm" onClick={() => setLogs([])}><Icons.Trash size={12} /> Clear</Button>
            <Button size="sm"><Icons.Download size={12} /> Export</Button>
          </div>
        </div>
      </Panel>
      <Panel style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: 480 }}>
        <div ref={scrollerRef} style={{ flex: 1, overflow: 'auto', background: 'var(--op-surface-2)', fontFamily: 'var(--op-font-mono)', fontSize: 12, padding: '8px 0' }}>
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--op-fg-subtle)', fontFamily: 'var(--op-font-sans)' }}>No log entries match the filter.</div>}
          {filtered.map((l, i) => <LogLine key={i} l={l} wrap={wrap} />)}
        </div>
        <div style={{ padding: '6px 14px', borderTop: '1px solid var(--op-divider)', background: 'var(--op-surface)', display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5, color: 'var(--op-fg-subtle)', fontFamily: 'var(--op-font-mono)' }}>
          <span>{filtered.length} / {logs.length} entries</span>
          <span>·</span>
          <span style={{ color: paused ? 'var(--op-warning)' : 'var(--op-success)' }}>● {paused ? 'paused' : 'streaming'}</span>
          <span style={{ marginLeft: 'auto' }}>~/Library/Logs/OpenPep/main.log</span>
        </div>
      </Panel>
    </div>
  );
}

export function SettingsView() {
  const [section, setSection] = useState('units');
  const defaults = { pressure: 'psi', temperature: 'K', mass: 'g', density: 'lb/in³', velocity: 'ft/s', energy: 'cal/mol' };
  const [units, setUnits] = useState(defaults);
  const [preset, setPreset] = useState('legacy');

  const applyPreset = (id: string) => {
    setPreset(id);
    if (id === 'imperial') setUnits({ pressure: 'psi', temperature: '°F', mass: 'lb',  density: 'lb/in³', velocity: 'ft/s', energy: 'cal/mol' });
    if (id === 'metric')   setUnits({ pressure: 'bar', temperature: 'K',  mass: 'g',   density: 'g/cm³',  velocity: 'm/s',  energy: 'kJ/mol' });
    if (id === 'si')       setUnits({ pressure: 'MPa', temperature: 'K',  mass: 'kg',  density: 'kg/m³',  velocity: 'm/s',  energy: 'J/mol' });
    if (id === 'legacy')   setUnits(defaults);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: '100%', minHeight: 0 }}>
      <nav style={{ borderRight: '1px solid var(--op-border)', padding: 16, background: 'var(--op-surface-2)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="op-sidebar-label" style={{ paddingLeft: 6, marginBottom: 4 }}>Settings</div>
        {SECTIONS.map((s) => {
          const Ic = Icons[s.icon];
          return (
            <button key={s.id} className={`op-nav-item ${section === s.id ? 'active' : ''}`} onClick={() => setSection(s.id)}>
              <Ic size={14} className="op-nav-icon" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ overflow: 'auto', padding: 24 }}>
        {section === 'units' && (
          <div style={{ display: 'grid', gap: 20, maxWidth: 880 }}>
            <SettingsHeader title="Units" desc="Choose how quantities are displayed and entered. Conversions are applied at the UI layer — stored data stays canonical." />
            <Panel>
              <PanelHeader><PanelTitle>Preset</PanelTitle></PanelHeader>
              <PanelBody style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[{ id: 'imperial', title: 'Imperial', desc: 'psi, °F, lb, ft/s' }, { id: 'metric', title: 'Metric', desc: 'bar, K, g, m/s' }, { id: 'si', title: 'SI', desc: 'MPa, K, kg, m/s' }, { id: 'legacy', title: 'Legacy ProPep3', desc: 'psi, K, g, ft/s' }].map((p) => (
                  <button key={p.id} onClick={() => applyPreset(p.id)} style={{ textAlign: 'left', padding: 14, borderRadius: 8, border: `1px solid ${preset === p.id ? 'var(--op-accent)' : 'var(--op-border)'}`, background: preset === p.id ? 'var(--op-accent-soft)' : 'var(--op-surface-2)', cursor: 'pointer', fontFamily: 'var(--op-font-sans)', color: 'var(--op-fg)' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                    <div className="op-mono" style={{ fontSize: 11, color: 'var(--op-fg-subtle)', marginTop: 4 }}>{p.desc}</div>
                  </button>
                ))}
              </PanelBody>
            </Panel>
            <Panel>
              <PanelHeader><PanelTitle>Per-dimension override</PanelTitle></PanelHeader>
              <PanelBody style={{ display: 'grid', gap: 4 }}>
                {UNIT_GROUPS.map((g) => (
                  <div key={g.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 80px', alignItems: 'center', padding: '12px 6px', borderBottom: '1px solid var(--op-divider)' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{g.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--op-fg-subtle)' }}>{g.id}</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {g.options.map((o) => (
                        <button key={o.value} onClick={() => { setUnits({ ...units, [g.id]: o.value }); setPreset('custom'); }} className="op-btn op-btn-sm" style={{ background: units[g.id as keyof typeof units] === o.value ? 'var(--op-accent-soft)' : 'var(--op-surface)', borderColor: units[g.id as keyof typeof units] === o.value ? 'var(--op-accent)' : 'var(--op-border)', color: units[g.id as keyof typeof units] === o.value ? 'oklch(0.32 0.10 200)' : 'var(--op-fg)' }}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                    <div className="op-mono" style={{ textAlign: 'right', fontSize: 12, color: 'var(--op-fg-muted)' }}>{units[g.id as keyof typeof units]}</div>
                  </div>
                ))}
              </PanelBody>
            </Panel>
          </div>
        )}

        {section === 'general' && (
          <div style={{ display: 'grid', gap: 20, maxWidth: 720 }}>
            <SettingsHeader title="General" desc="Application-wide preferences." />
            <Panel>
              <PanelBody style={{ display: 'grid', gap: 14 }}>
                <PrefRow label="Open last formula on launch" desc="Restore the previously open formula and view." defaultOn />
                <PrefRow label="Auto-snapshot on calculate" desc="Create a version snapshot every time you press Calculate." />
                <PrefRow label="Confirm before deleting a snapshot" defaultOn />
                <PrefRow label="Check for updates automatically" defaultOn />
                <PrefRow label="Send anonymous usage data" desc="Helps improve OpenPep. Never includes formula content." />
              </PanelBody>
            </Panel>
          </div>
        )}

        {section === 'calc' && (
          <div style={{ display: 'grid', gap: 20, maxWidth: 720 }}>
            <SettingsHeader title="Calculation" desc="Defaults for new formulas and the equilibrium solver." />
            <Panel>
              <PanelHeader><PanelTitle>Solver</PanelTitle></PanelHeader>
              <PanelBody style={{ display: 'grid', gap: 14 }}>
                <NumberPref label="Max iterations" value="50" />
                <NumberPref label="Convergence tolerance" value="1e-6" />
                <NumberPref label="Species cutoff (mole frac)" value="1e-5" />
              </PanelBody>
            </Panel>
          </div>
        )}

        {section === 'storage' && (
          <div style={{ display: 'grid', gap: 20, maxWidth: 720 }}>
            <SettingsHeader title="Storage" desc="Where your formulas and ingredient library live on disk." />
            <Panel>
              <PanelBody style={{ display: 'grid', gap: 14 }}>
                <FolderPref label="Data directory" path="~/Library/Application Support/OpenPep" />
                <FolderPref label="Imports / exports" path="~/Documents/OpenPep" />
                <FolderPref label="Logs" path="~/Library/Logs/OpenPep" />
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <Button size="sm"><Icons.Folder size={12} /> Reveal in Finder</Button>
                  <Button size="sm"><Icons.Download size={12} /> Export everything</Button>
                  <Button variant="danger" size="sm" style={{ marginLeft: 'auto' }}><Icons.Trash size={12} /> Reset to factory</Button>
                </div>
              </PanelBody>
            </Panel>
            <Panel>
              <PanelHeader><PanelTitle>Usage</PanelTitle></PanelHeader>
              <PanelBody style={{ display: 'grid', gap: 10 }}>
                <UsageBar label="Formulas (4)"               bytes={42_840}   max={5_000_000} />
                <UsageBar label="Ingredient library (28)"    bytes={18_220}   max={5_000_000} />
                <UsageBar label="Version snapshots (24)"     bytes={134_500}  max={5_000_000} />
                <UsageBar label="Logs"                       bytes={812_400}  max={5_000_000} />
              </PanelBody>
            </Panel>
          </div>
        )}

        {section === 'logs' && <DebugLogs />}

        {section === 'about' && (
          <div style={{ display: 'grid', gap: 20, maxWidth: 640 }}>
            <SettingsHeader title="About" desc="Build info and credits." />
            <Panel>
              <PanelBody style={{ display: 'grid', gap: 12 }}>
                {[
                  { label: 'OpenPep',  value: '0.4.0-alpha' },
                  { label: 'Built',    value: 'May 22, 2026 · 14:08 UTC' },
                  { label: 'Engine',   value: 'thermo-equil 0.3.2 (CEA-derived)' },
                  { label: 'License',  value: 'MIT — based on the public ProPep3 algorithm' },
                ].map((r) => (
                  <div key={r.label} style={{ display: 'flex', borderBottom: '1px solid var(--op-divider)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--op-fg-muted)', fontSize: 13, width: 120 }}>{r.label}</span>
                    <span className="op-mono" style={{ fontSize: 12.5 }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button size="sm"><Icons.Copy size={12} /> Copy diagnostics</Button>
                  <Button size="sm">Open changelog</Button>
                </div>
              </PanelBody>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
