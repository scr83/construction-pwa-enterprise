'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Construction/Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Status indicators, counts, and notifications optimized for construction management workflows.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info',
        'safety', 'quality', 'material', 'urgent', 'completed',
        'outline', 'outline-primary', 'outline-success', 'outline-warning', 'outline-danger'
      ],
      description: 'Badge visual variant',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'default', 'lg'],
      description: 'Badge size',
    },
    shape: {
      control: { type: 'select' },
      options: ['rounded', 'square', 'pill'],
      description: 'Badge shape',
    },
    interactive: {
      control: { type: 'select' },
      options: ['none', 'clickable', 'removable'],
      description: 'Interactive behavior',
    },
    priority: {
      control: { type: 'select' },
      options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      description: 'Construction priority level',
    },
    status: {
      control: { type: 'select' },
      options: ['ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'],
      description: 'Construction status',
    },
    role: {
      control: { type: 'select' },
      options: ['EXECUTIVE', 'SITE_MANAGER', 'SUPERVISOR', 'WORKER', 'QUALITY_INSPECTOR'],
      description: 'Construction role',
    },
    showDot: {
      control: { type: 'boolean' },
      description: 'Show status dot indicator',
    },
    pulse: {
      control: { type: 'boolean' },
      description: 'Pulse animation for urgency',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

// Basic variants
export const Default: Story = {
  args: {
    children: 'Default',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

// Construction-specific variants
export const ConstructionVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="safety" icon="hard-hat">Seguridad</Badge>
      <Badge variant="quality" icon="shield-check">Calidad</Badge>
      <Badge variant="material" icon="package">Materiales</Badge>
      <Badge variant="urgent" icon="alert-triangle">Urgente</Badge>
      <Badge variant="completed" icon="check-circle">Completado</Badge>
    </div>
  ),
}

// Priority badges
export const PriorityBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge priority="LOW">Baja</Badge>
      <Badge priority="MEDIUM">Media</Badge>
      <Badge priority="HIGH">Alta</Badge>
      <Badge priority="CRITICAL" pulse>Crítica</Badge>
    </div>
  ),
}

// Status badges
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="ACTIVE" icon="play">Activo</Badge>
      <Badge status="PENDING" icon="clock">Pendiente</Badge>
      <Badge status="COMPLETED" icon="check">Completado</Badge>
      <Badge status="CANCELLED" icon="x">Cancelado</Badge>
      <Badge status="INACTIVE" icon="pause">Inactivo</Badge>
    </div>
  ),
}

// Role badges
export const RoleBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge role="EXECUTIVE">Ejecutivo</Badge>
      <Badge role="SITE_MANAGER">Jefe de Terreno</Badge>
      <Badge role="SUPERVISOR">Supervisor</Badge>
      <Badge role="QUALITY_INSPECTOR">Inspector</Badge>
      <Badge role="WORKER">Operario</Badge>
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="xs">XS Badge</Badge>
      <Badge size="sm">Small Badge</Badge>
      <Badge size="default">Default Badge</Badge>
      <Badge size="lg">Large Badge</Badge>
    </div>
  ),
}

// Shapes
export const Shapes: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge shape="rounded">Rounded</Badge>
      <Badge shape="square">Square</Badge>
      <Badge shape="pill">Pill Shape</Badge>
    </div>
  ),
}

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" icon="check" iconPosition="left">Aprobado</Badge>
      <Badge variant="danger" icon="x" iconPosition="left">Rechazado</Badge>
      <Badge variant="warning" icon="alert-triangle" iconPosition="left">Alerta</Badge>
      <Badge variant="info" icon="info" iconPosition="right">Info</Badge>
      <Badge variant="primary" icon="user" iconPosition="right">Usuario</Badge>
    </div>
  ),
}

// With dots
export const WithDots: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge showDot dotColor="red">Crítico</Badge>
      <Badge showDot dotColor="orange">Advertencia</Badge>
      <Badge showDot dotColor="green">Correcto</Badge>
      <Badge showDot dotColor="blue">Información</Badge>
      <Badge showDot dotColor="purple">Inspección</Badge>
    </div>
  ),
}

// Count badges
export const CountBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge count={5} variant="danger">Alertas</Badge>
      <Badge count={12} variant="warning">Pendientes</Badge>
      <Badge count={156} variant="success" maxCount={99}>Completados</Badge>
      <Badge count={0} variant="info" showZero>Sin elementos</Badge>
      <Badge count={3} variant="primary" shape="pill">Notificaciones</Badge>
    </div>
  ),
}

// Interactive badges
export const InteractiveBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge 
        interactive="clickable" 
        variant="primary"
        onClick={() => alert('Badge clicked!')}
      >
        Clickeable
      </Badge>
      
      <Badge 
        variant="secondary"
        onRemove={() => alert('Badge removed!')}
        removeLabel="Eliminar etiqueta"
      >
        Removible
      </Badge>
      
      <Badge 
        variant="warning"
        onRemove={() => alert('Filter removed!')}
        icon="filter"
        iconPosition="left"
      >
        Filtro Activo
      </Badge>
    </div>
  ),
}

// Outline variants
export const OutlineVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">Outline</Badge>
      <Badge variant="outline-primary">Primary</Badge>
      <Badge variant="outline-success">Success</Badge>
      <Badge variant="outline-warning">Warning</Badge>
      <Badge variant="outline-danger">Danger</Badge>
    </div>
  ),
}

// Construction workflow example
export const ConstructionWorkflow: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Estado del Proyecto</h3>
        <div className="flex flex-wrap gap-2">
          <Badge status="ACTIVE" icon="play">En Progreso</Badge>
          <Badge priority="HIGH" pulse>Alta Prioridad</Badge>
          <Badge variant="safety" icon="hard-hat">Seguridad OK</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Notificaciones</h3>
        <div className="flex flex-wrap gap-2">
          <Badge count={3} variant="danger" showDot dotColor="red">Alertas Críticas</Badge>
          <Badge count={12} variant="warning">Inspecciones Pendientes</Badge>
          <Badge count={45} variant="info">Tareas Completadas</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Equipo de Trabajo</h3>
        <div className="flex flex-wrap gap-2">
          <Badge role="SITE_MANAGER" icon="user-check">Carlos Mendoza</Badge>
          <Badge role="SUPERVISOR" icon="users">Ana Rodriguez</Badge>
          <Badge role="QUALITY_INSPECTOR" icon="shield-check">Laura Silva</Badge>
          <Badge count={8} variant="secondary">Operarios</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Filtros Activos</h3>
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="outline-primary"
            onRemove={() => console.log('Remove project filter')}
            icon="building"
          >
            Torres del Mar
          </Badge>
          <Badge 
            variant="outline-warning"
            onRemove={() => console.log('Remove date filter')}
            icon="calendar"
          >
            Esta Semana
          </Badge>
          <Badge 
            variant="outline-success"
            onRemove={() => console.log('Remove status filter')}
            icon="check-circle"
          >
            Completadas
          </Badge>
        </div>
      </div>
    </div>
  ),
}

// Pulsing urgent badges
export const UrgentAnimations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="urgent" pulse icon="alert-triangle">Emergencia</Badge>
      <Badge priority="CRITICAL" pulse>Crítico</Badge>
      <Badge variant="danger" pulse count={5}>Alertas</Badge>
      <Badge variant="warning" pulse showDot dotColor="red">Requiere Atención</Badge>
    </div>
  ),
}

// Mobile optimized
export const MobileOptimized: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap gap-1">
        <Badge size="sm" variant="success">✓</Badge>
        <Badge size="sm" variant="danger">✗</Badge>
        <Badge size="sm" variant="warning">!</Badge>
        <Badge size="sm" variant="info">i</Badge>
      </div>
      
      <div className="flex flex-col gap-2">
        <Badge variant="primary" shape="pill" size="default">Proyecto Activo</Badge>
        <Badge count={12} variant="warning" size="default">Tareas Pendientes</Badge>
        <Badge variant="safety" icon="hard-hat" size="default">Seguridad</Badge>
      </div>
    </div>
  ),
}