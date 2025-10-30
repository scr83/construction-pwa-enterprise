import type { Meta, StoryObj } from '@storybook/react'
import { PartidasDropdown } from './PartidasDropdown'

const meta: Meta<typeof PartidasDropdown> = {
  title: 'Molecules/PartidasDropdown',
  component: PartidasDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PartidasDropdown>

export const Default: Story = {
  args: {
    label: 'Seleccionar Partida',
    placeholder: 'Elige una actividad de construcción...',
    required: true,
  },
}

export const WithoutCategories: Story = {
  args: {
    label: 'Partida',
    groupByCategory: false,
  },
}

export const WithoutSearch: Story = {
  args: {
    label: 'Partida',
    allowSearch: false,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Partida',
    disabled: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Partida',
    error: 'Debe seleccionar una partida',
  },
}

export const Compact: Story = {
  args: {
    size: 'sm',
    showCategory: false,
    showUnit: false,
  },
}