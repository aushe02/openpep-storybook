import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LineChart } from './LineChart';

const meta: Meta<typeof LineChart> = {
  title: 'OpenPep/Molecules/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

const pressures = Array.from({ length: 16 }, (_, i) => 100 + i * 100);

export const IspCurve: Story = {
  args: {
    width: 580,
    height: 240,
    xLabel: 'Chamber Pressure (psi)',
    yLabel: 'Isp (s)',
    series: [{ color: 'var(--op-accent)', data: pressures.map((p) => ({ x: p, y: 193 * (0.65 + 0.35 * Math.log10(p / 14.7) / Math.log10(1000 / 14.7)) })) }],
  },
};

export const MultiSeries: Story = {
  args: {
    width: 580,
    height: 240,
    xLabel: 'Chamber Pressure (psi)',
    yLabel: 'Isp (s)',
    series: [
      { color: 'var(--op-accent)', data: pressures.map((p) => ({ x: p, y: 193 * (0.65 + 0.35 * Math.log10(p / 14.7) / Math.log10(1000 / 14.7)) })) },
      { color: 'var(--op-c3)', data: pressures.map((p) => ({ x: p, y: 138 * (0.65 + 0.35 * Math.log10(p / 14.7) / Math.log10(1000 / 14.7)) })) },
    ],
  },
};
