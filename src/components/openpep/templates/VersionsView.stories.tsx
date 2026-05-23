import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { VersionsView } from './VersionsView';
import { FORMULAS } from '../data/data';

const meta: Meta<typeof VersionsView> = {
  title: 'OpenPep/Templates/VersionsView',
  component: VersionsView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const NassaSlow: Story = { args: { formula: FORMULAS[0] } };
export const NoHistory: Story = { args: { formula: FORMULAS[1] } };
