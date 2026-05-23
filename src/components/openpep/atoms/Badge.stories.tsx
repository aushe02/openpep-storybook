import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'OpenPep/Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['accent', 'success', 'warning', 'danger', 'neutral'] },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = { args: { variant: 'accent', children: 'composite' } };
export const Success: Story = { args: { variant: 'success', children: 'balanced' } };
export const Warning: Story = { args: { variant: 'warning', children: 'wip' } };
export const Danger: Story = { args: { variant: 'danger', children: '-0.42 off' } };
export const Neutral: Story = { args: { variant: 'neutral', children: 'v1.2.3' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge variant="accent">composite</Badge>
      <Badge variant="success">balanced</Badge>
      <Badge variant="warning">wip</Badge>
      <Badge variant="danger">−0.42 off</Badge>
      <Badge variant="neutral">v1.2.3</Badge>
    </div>
  ),
};
