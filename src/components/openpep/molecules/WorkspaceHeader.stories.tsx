import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WorkspaceHeader } from './WorkspaceHeader';
import { Button } from '../atoms/Button';
import { Save, Play, Tag, GitBranch } from '../atoms/Icons';

const meta: Meta<typeof WorkspaceHeader> = {
  title: 'OpenPep/Molecules/WorkspaceHeader',
  component: WorkspaceHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const FormulaView: Story = {
  args: {
    crumbs: ['Formulas', 'Nassa Slow 1.2B'],
    actions: (
      <>
        <Button size="sm"><Tag size={12} /> Tag version</Button>
        <Button size="sm"><GitBranch size={12} /> Branch</Button>
        <Button variant="primary" size="sm"><Save size={12} /> Snapshot</Button>
      </>
    ),
  },
};

export const ResultsView: Story = {
  args: {
    crumbs: ['Formulas', 'Nassa Slow 1.2B', 'Results'],
    actions: (
      <>
        <Button variant="primary" size="sm"><Play size={11} /> Recalculate</Button>
      </>
    ),
  },
};

export const DeepCrumb: Story = {
  args: { crumbs: ['Settings', 'Units'] },
};
