import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';
import { Save, Play, Plus } from './Icons';

const meta: Meta<typeof Button> = {
  title: 'OpenPep/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['default', 'sm', 'icon'] },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Button' } };
export const Primary: Story = { args: { variant: 'primary', children: 'Snapshot' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Cancel' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };
export const Small: Story = { args: { size: 'sm', children: 'Tag version' } };
export const PrimarySmall: Story = { args: { variant: 'primary', size: 'sm', children: <><Play size={11} /> Calculate</> } };
export const WithIcon: Story = { args: { size: 'sm', children: <><Save size={12} /> Save snapshot</> } };
export const IconOnly: Story = { args: { size: 'icon', children: <Plus size={14} />, title: 'Add' } };
export const Disabled: Story = { args: { variant: 'primary', children: 'Calculate', disabled: true } };
