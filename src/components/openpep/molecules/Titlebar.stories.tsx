import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Titlebar } from './Titlebar';

const meta: Meta<typeof Titlebar> = {
  title: 'OpenPep/Molecules/Titlebar',
  component: Titlebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'OpenPep — Nassa Slow 1.2B',
    savedAt: new Date(),
  },
};

export const NoSave: Story = {
  args: {
    title: 'OpenPep — Untitled formula',
  },
};
