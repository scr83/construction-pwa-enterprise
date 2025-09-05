import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { Check, X, AlertTriangle, Hammer, Truck } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mobile-optimized button component designed for construction site conditions with high visibility variants and touch-friendly sizing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'destructive',
        'success',
        'warning',
        'outline',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onClick: () => {},
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Primary button for main construction actions
export const Primary: Story = {
  args: {
    children: 'Registrar Faena',
    variant: 'primary',
  },
}

// Secondary button for supporting actions
export const Secondary: Story = {
  args: {
    children: 'Ver Detalles',
    variant: 'secondary',
  },
}

// Destructive button for dangerous actions
export const Destructive: Story = {
  args: {
    children: 'Eliminar Registro',
    variant: 'destructive',
    leftIcon: <X className="h-4 w-4" />,
  },
}

// Success button for approvals
export const Success: Story = {
  args: {
    children: 'Aprobar Calidad',
    variant: 'success',
    leftIcon: <Check className="h-4 w-4" />,
  },
}

// Warning button for pending actions
export const Warning: Story = {
  args: {
    children: 'Revisar Pendiente',
    variant: 'warning',
    leftIcon: <AlertTriangle className="h-4 w-4" />,
  },
}

// Loading state for async operations
export const Loading: Story = {
  args: {
    children: 'Guardando...',
    variant: 'primary',
    loading: true,
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    children: 'Acción No Disponible',
    variant: 'primary',
    disabled: true,
  },
}

// Full width for mobile forms
export const FullWidth: Story = {
  args: {
    children: 'Continuar con Registro',
    variant: 'primary',
    fullWidth: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Icon only button
export const IconOnly: Story = {
  args: {
    variant: 'primary',
    size: 'icon',
    children: <Hammer className="h-5 w-5" />,
  },
}

// Construction workflow buttons
export const ConstructionWorkflow: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-lg font-medium">Flujo de Trabajo - Construcción</h3>
      <div className="flex flex-col gap-2">
        <Button variant="primary" leftIcon={<Hammer className="h-4 w-4" />}>
          Iniciar Faena
        </Button>
        <Button variant="warning" leftIcon={<Truck className="h-4 w-4" />}>
          Solicitar Material
        </Button>
        <Button variant="success" leftIcon={<Check className="h-4 w-4" />}>
          Entregar a Calidad
        </Button>
        <Button variant="outline">Ver Historial</Button>
        <Button variant="ghost">Cancelar</Button>
      </div>
    </div>
  ),
}

// Mobile size demonstration
export const MobileSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4 w-80">
      <h3 className="text-lg font-medium">Tamaños Móviles</h3>
      <Button size="xs" variant="secondary">
        Extra Pequeño
      </Button>
      <Button size="sm" variant="outline">
        Pequeño
      </Button>
      <Button size="default" variant="primary">
        Por Defecto (Optimizado Móvil)
      </Button>
      <Button size="lg" variant="primary">
        Grande
      </Button>
      <Button size="xl" variant="success">
        Extra Grande (Campo)
      </Button>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// High contrast for outdoor visibility
export const HighContrast: Story = {
  render: () => (
    <div className="bg-neutral-100 p-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium mb-4">
          Alta Visibilidad - Condiciones Exteriores
        </h3>
        <Button variant="primary" size="lg">
          Acción Principal
        </Button>
        <Button variant="success" size="lg">
          Aprobar
        </Button>
        <Button variant="warning" size="lg">
          Atención
        </Button>
        <Button variant="destructive" size="lg">
          Rechazar
        </Button>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
}