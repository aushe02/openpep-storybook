'use client';
import React, { useState, useMemo } from 'react';
import { INGREDIENT_LIBRARY, FORMULAS } from '../data/data';
import { Panel, PanelHeader, PanelTitle, PanelSubtitle, PanelBody } from '../molecules/Panel';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Input } from '../atoms/Input';
import { Stat } from '../molecules/Stat';
import { Icons } from '../atoms/Icons';

export function LibraryView() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(INGREDIENT_LIBRARY[0].id);

  const categories = useMemo(() => {
    const set = new Set(INGREDIENT_LIBRARY.map((i) => i.category));
    return ['all', ...set];
  }, []);

  const filtered = useMemo(() => {
    return INGREDIENT_LIBRARY.filter((i) => {
      if (category !== 'all' && i.category !== category) return false;
      if (q) {
        const s = q.toLowerCase();
        return i.name.toLowerCase().includes(s) || i.formula.toLowerCase().includes(s);
      }
      return true;
    });
  }, [q, category]);

  const sel = INGREDIENT_LIBRARY.find((i) => i.id === selectedId);

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 20, maxWidth: 1400 }}>
      <Panel style={{ overflow: 'visible' }}>
        <PanelHeader>
          <Icons.Book size={15} />
          <div>
            <PanelTitle>Ingredient Library</PanelTitle>
            <PanelSubtitle>{INGREDIENT_LIBRARY.length} ingredients · standard JANNAF references</PanelSubtitle>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <Button size="sm"><Icons.Upload size={12} /> Import</Button>
            <Button variant="primary" size="sm"><Icons.Plus size={12} /> New ingredient</Button>
          </div>
        </PanelHeader>

        <div style={{ padding: 14, borderBottom: '1px solid var(--op-divider)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input
            leadingIcon={<Icons.Search size={14} />}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or formula…"
            wrapperStyle={{ flex: 1, maxWidth: 340 }}
          />
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? 'primary' : 'ghost'}
                onClick={() => setCategory(c)}
                style={{ textTransform: 'capitalize' }}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <PanelBody flush>
          <table className="op-data">
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Formula</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>ρ (g/cm³)</th>
                <th style={{ textAlign: 'right' }}>ΔHf (cal/mol)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => setSelectedId(i.id)}
                  style={{ background: selectedId === i.id ? 'var(--op-surface-2)' : undefined, cursor: 'pointer' }}
                >
                  <td style={{ width: 24 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: i.color, display: 'block' }} />
                  </td>
                  <td style={{ fontWeight: 500 }}>{i.name}</td>
                  <td className="op-mono" style={{ fontSize: 12, color: 'var(--op-fg-muted)' }}>{i.formula}</td>
                  <td><Badge variant="neutral">{i.category}</Badge></td>
                  <td className="op-num">{i.density.toFixed(2)}</td>
                  <td className="op-num">{i.hof === 0 ? '0' : i.hof.toLocaleString()}</td>
                  <td style={{ width: 30 }}><Icons.ChevRight size={14} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="op-empty">
              <div className="op-empty-title">No ingredients match</div>
              <div className="op-empty-desc">Try clearing your filter or search.</div>
            </div>
          )}
        </PanelBody>
      </Panel>

      <Panel style={{ position: 'sticky', top: 0, alignSelf: 'start' }}>
        {sel && (
          <>
            <PanelHeader style={{ paddingBottom: 16 }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: sel.color }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <PanelTitle>{sel.name}</PanelTitle>
                <div className="op-mono op-panel-subtitle">{sel.formula}</div>
              </div>
              <Button variant="ghost" size="icon"><Icons.Settings size={14} /></Button>
            </PanelHeader>
            <PanelBody style={{ display: 'grid', gap: 14 }}>
              <Badge variant="accent" style={{ width: 'fit-content' }}>{sel.category}</Badge>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Stat label="Density" value={sel.density.toFixed(2)} unit="g/cm³" style={{ padding: 12 }} />
                <Stat label="ΔH formation" value={sel.hof === 0 ? '0' : sel.hof.toLocaleString()} unit="cal/mol" style={{ padding: 12 }} />
              </div>
              <div>
                <div className="op-field-label">Notes</div>
                <div style={{ fontSize: 12.5, color: 'var(--op-fg-muted)', padding: 10, background: 'var(--op-surface-2)', borderRadius: 8 }}>
                  Reference values from JANNAF tables. Edit to override locally — only your overrides are saved.
                </div>
              </div>
              <div>
                <div className="op-field-label">Used in</div>
                <div style={{ display: 'grid', gap: 4, marginTop: 4 }}>
                  {FORMULAS
                    .filter((f) => f.components.some((c) => c.ingredientId === sel.id))
                    .map((f) => (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--op-surface-2)', borderRadius: 6, fontSize: 12.5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.color }} />
                        <span style={{ flex: 1 }}>{f.name}</span>
                        <span className="op-mono" style={{ fontSize: 11, color: 'var(--op-fg-subtle)' }}>{f.currentVersion}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" style={{ flex: 1 }}>Edit</Button>
                <Button size="sm" style={{ flex: 1 }}>Duplicate</Button>
              </div>
            </PanelBody>
          </>
        )}
      </Panel>
    </div>
  );
}
