import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Panel, PanelHeader, PanelTitle, PanelSubtitle, PanelBody } from './Panel';
import { Beaker } from '../atoms/Icons';

const meta: Meta<typeof Panel> = {
  title: 'OpenPep/Molecules/Panel',
  component: Panel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Panel style={{ maxWidth: 420 }}>
      <PanelHeader>
        <Beaker size={15} />
        <div>
          <PanelTitle>Ingredients</PanelTitle>
          <PanelSubtitle>Weights as percentages — must total 100.00g</PanelSubtitle>
        </div>
      </PanelHeader>
      <PanelBody>
        <p style={{ margin: 0, color: 'var(--op-fg-muted)', fontSize: 13 }}>Panel body content goes here.</p>
      </PanelBody>
    </Panel>
  ),
};
