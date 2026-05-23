import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LibraryView } from './LibraryView';

const meta: Meta<typeof LibraryView> = {
  title: 'OpenPep/Templates/LibraryView',
  component: LibraryView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
