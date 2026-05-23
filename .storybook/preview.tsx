import type { Preview } from '@storybook/nextjs-vite';
import '../src/components/openpep/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <div className="op-root" style={{ minHeight: '100%', background: 'var(--op-bg)' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
