import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'OpenPep/Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  render: () => {
    const [v, setV] = useState(false);
    return <Checkbox checked={v} onChange={setV} label="Delete low-fraction species" />;
  },
};

export const Checked: Story = {
  render: () => {
    const [v, setV] = useState(true);
    return <Checkbox checked={v} onChange={setV} label="Combustion conditions considered" />;
  },
};

export const Group: Story = {
  render: () => {
    const [v1, setV1] = useState(true);
    const [v2, setV2] = useState(false);
    const [v3, setV3] = useState(true);
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <Checkbox checked={v1} onChange={setV1} label="Delete low-fraction species" />
        <Checkbox checked={v2} onChange={setV2} label="Include ionic species in solution" />
        <Checkbox checked={v3} onChange={setV3} label="Combustion conditions considered" />
      </div>
    );
  },
};
