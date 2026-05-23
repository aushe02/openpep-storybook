import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sparkline } from './Sparkline';

const meta: Meta<typeof Sparkline> = {
  title: 'OpenPep/Atoms/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: [188.4, 189.5, 191.2, 192.85, 193.17], width: 140, height: 24 },
};

export const Danger: Story = {
  args: { data: [100, 95, 88, 72, 65], stroke: 'var(--op-danger)', width: 140, height: 24 },
};
