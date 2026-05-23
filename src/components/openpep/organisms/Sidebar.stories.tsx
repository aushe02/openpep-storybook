import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { FORMULAS, INGREDIENT_LIBRARY } from '../data/data';
import type { NavView } from '../types';

const meta: Meta<typeof Sidebar> = {
  title: 'OpenPep/Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [view, setView] = useState<NavView>('formula');
    const [currentId, setCurrentId] = useState(FORMULAS[0].id);
    return (
      <Sidebar
        view={view}
        onViewChange={setView}
        formulas={FORMULAS}
        currentFormulaId={currentId}
        onFormulaSelect={setCurrentId}
        onNewFormula={() => {}}
        libraryCount={INGREDIENT_LIBRARY.length}
      />
    );
  },
};
