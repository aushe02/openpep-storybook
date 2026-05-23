import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stat, StatGrid } from './Stat';

const meta: Meta<typeof Stat> = {
  title: 'OpenPep/Molecules/Stat',
  component: Stat,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Up: Story = {
  args: { label: 'Specific Impulse', value: '193.17', unit: 's', sub: 'Isp*', trend: 'up', delta: '+1.97 from v1.2.2' },
};

export const Flat: Story = {
  args: { label: 'Molecular Weight', value: '23.527', unit: 'g/mol', sub: 'M̄', trend: 'flat', delta: '±0.000' },
};

export const Grid: Story = {
  render: () => (
    <StatGrid>
      <Stat label="Specific Impulse"       value="193.17" unit="s"       sub="Isp*" trend="up"   delta="+1.97" />
      <Stat label="Characteristic Velocity" value="5009.6" unit="ft/s"   sub="c*"   trend="up"   delta="+7.45" />
      <Stat label="Chamber Temperature"    value="2923"    unit="K"       sub="Tc"   trend="up"   delta="+4.49" />
      <Stat label="Density"                value="0.0605"  unit="lb/in³"  sub="ρ"    trend="up"   delta="+0.0001" />
      <Stat label="Molecular Weight"       value="23.527"  unit="g/mol"   sub="M̄"   trend="flat" delta="±0.000" />
      <Stat label="Cp/Cv"                  value="1.1960"  unit="γ"       sub="γc"   trend="flat" delta="±0.000" />
    </StatGrid>
  ),
};
