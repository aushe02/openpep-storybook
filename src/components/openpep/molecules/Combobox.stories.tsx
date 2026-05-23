import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Combobox } from './Combobox';
import { INGREDIENT_LIBRARY } from '../data/data';

const meta: Meta<typeof Combobox> = {
  title: 'OpenPep/Molecules/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<string | null>(null);
    return (
      <div style={{ width: 340 }}>
        <Combobox value={v} onChange={setV} options={INGREDIENT_LIBRARY} placeholder="Search & add ingredient…" />
      </div>
    );
  },
};

export const WithValue: Story = {
  render: () => {
    const [v, setV] = useState<string | null>('htpb');
    return (
      <div style={{ width: 340 }}>
        <Combobox value={v} onChange={setV} options={INGREDIENT_LIBRARY} />
      </div>
    );
  },
};
