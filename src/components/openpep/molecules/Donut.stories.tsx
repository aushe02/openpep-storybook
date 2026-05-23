import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Donut } from './Donut';

const meta: Meta<typeof Donut> = {
  title: 'OpenPep/Molecules/Donut',
  component: Donut,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const NassaSlow: Story = {
  args: {
    size: 140,
    thickness: 22,
    data: [
      { value: 67.07, color: '#7dd3fc', name: 'Ammonium Perchlorate' },
      { value: 14.06, color: '#94a3b8', name: 'Aluminum' },
      { value: 11.16, color: '#fbbf24', name: 'HTPB (R-45M)' },
      { value: 4.64,  color: '#a78bfa', name: 'Dioctyl Adipate' },
      { value: 2.07,  color: '#c084fc', name: 'MDI (PAPI 94)' },
      { value: 1.00,  color: '#f472b6', name: 'Other' },
    ],
  },
};

export const Simple: Story = {
  args: {
    size: 140,
    data: [
      { value: 65, color: '#7dd3fc', name: 'Potassium Nitrate' },
      { value: 34, color: '#fb923c', name: 'Dextrose' },
      { value: 1,  color: '#ef4444', name: 'Iron Oxide' },
    ],
  },
};
