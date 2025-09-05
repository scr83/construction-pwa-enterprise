import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de tarjeta básica flexible para mostrar contenido agrupado. Optimizado para construcción.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'filled', 'elevated'],
      description: 'Estilo visual de la tarjeta',
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del padding interno',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Historia básica
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'Contenido de la tarjeta básica',
  },
}

// Tarjeta con contenido completo
export const Complete: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Proyecto Villa Los Andes</CardTitle>
        <CardDescription>
          Casa EA-12 - Estado: En Construcción
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Progreso general: 65% completado</p>
        <p>Próxima actividad: Instalaciones eléctricas</p>
      </CardContent>
      <CardFooter>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Ver Detalles
        </button>
      </CardFooter>
    </Card>
  ),
}

// Variantes de estilo
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Card variant="default" className="p-4">
        <p>Tarjeta Default</p>
      </Card>
      <Card variant="outline" className="p-4">
        <p>Tarjeta Outline</p>
      </Card>
      <Card variant="filled" className="p-4">
        <p>Tarjeta Filled</p>
      </Card>
      <Card variant="elevated" className="p-4">
        <p>Tarjeta Elevated</p>
      </Card>
    </div>
  ),
}

// Tamaños
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Card size="sm">
        <p>Tarjeta Small</p>
      </Card>
      <Card size="md">
        <p>Tarjeta Medium</p>
      </Card>
      <Card size="lg">
        <p>Tarjeta Large</p>
      </Card>
    </div>
  ),
}
