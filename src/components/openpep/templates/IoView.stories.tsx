import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IoView } from './IoView';
import { FORMULAS } from '../data/data';

const meta: Meta<typeof IoView> = {
  title: 'OpenPep/Templates/IoView',
  component: IoView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Export: Story = { args: { formula: FORMULAS[0] } };
