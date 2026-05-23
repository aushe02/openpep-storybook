import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ResultsView } from './ResultsView';
import { FORMULAS } from '../data/data';

const meta: Meta<typeof ResultsView> = {
  title: 'OpenPep/Templates/ResultsView',
  component: ResultsView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const NassaSlow: Story = { args: { formula: FORMULAS[0] } };
export const BlueStreak: Story = { args: { formula: FORMULAS[2] } };
export const KNSugar: Story = { args: { formula: FORMULAS[1] } };
