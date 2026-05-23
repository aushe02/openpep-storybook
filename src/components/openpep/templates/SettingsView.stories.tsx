import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SettingsView } from './SettingsView';

const meta: Meta<typeof SettingsView> = {
  title: 'OpenPep/Templates/SettingsView',
  component: SettingsView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
