import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CompareView } from './CompareView';
import { FORMULAS } from '../data/data';

const meta: Meta<typeof CompareView> = {
  title: 'OpenPep/Templates/CompareView',
  component: CompareView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const AllFormulas: Story = {
  args: { formulas: FORMULAS, currentFormulaId: FORMULAS[0].id },
};
