import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'OpenPep/Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  { value: 'formula', label: 'Formula' },
  { value: 'results', label: 'Results' },
  { value: 'versions', label: 'Versions', count: 5 },
];

export const Default: Story = {
  render: () => {
    const [v, setV] = useState('formula');
    return <Tabs value={v} onChange={setV} items={ITEMS} />;
  },
};
