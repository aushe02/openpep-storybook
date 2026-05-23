import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { FormulaView } from './FormulaView';
import { FORMULAS } from '../data/data';
import type { Formula } from '../types';

const meta: Meta<typeof FormulaView> = {
  title: 'OpenPep/Templates/FormulaView',
  component: FormulaView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const NassaSlow: Story = {
  render: () => {
    const [formula, setFormula] = useState<Formula>(FORMULAS[0]);
    return <FormulaView formula={formula} onChange={setFormula} onCalculate={() => alert('Calculate!')} />;
  },
};

export const KNSugar: Story = {
  render: () => {
    const [formula, setFormula] = useState<Formula>(FORMULAS[1]);
    return <FormulaView formula={formula} onChange={setFormula} />;
  },
};

export const EmptyFormula: Story = {
  render: () => {
    const [formula, setFormula] = useState<Formula>({
      id: 'new', name: 'Untitled formula', starred: false, color: '#0ea5e9',
      description: 'New propellant — start adding ingredients.', tags: ['draft'],
      updatedAt: 'just now', currentVersion: 'v0.1.0',
      components: [{ ingredientId: null, weight: 0 }, { ingredientId: null, weight: 0 }, { ingredientId: null, weight: 0 }],
      conditions: { tempK: 298, chamberPsi: 1000, exhaustPsi: 14.7, boostVelocity: false, deleteLowSpecies: true, includeIonic: false, pressureAtmospheric: false, moreSpecies: false, combustionConsidered: true, fixChamberTemp: false },
      results: { isp: 0, cstar: 0, density: 0, molecularWt: 0, cpcv: 0, chamberTemp: 0, exhaustTemp: 0, expansionRatio: 1 },
    });
    return <FormulaView formula={formula} onChange={setFormula} />;
  },
};
