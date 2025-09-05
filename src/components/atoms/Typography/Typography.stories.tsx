import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Typography component optimized for construction environments with high-contrast variants for outdoor visibility and mobile readability.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'body-large',
        'body-default',
        'body-small',
        'high-contrast-large',
        'high-contrast',
        'high-contrast-small',
        'status-success',
        'status-warning',
        'status-danger',
        'status-info',
        'label-large',
        'label-default',
        'label-small',
        'caption',
        'help-text',
        'code',
        'lead',
        'muted',
        'link',
      ],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'code', 'pre', 'a'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    color: {
      control: 'select',
      options: [
        'default',
        'muted',
        'primary',
        'success',
        'warning',
        'danger',
        'white',
        'black',
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Heading hierarchy
export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">H1 - Gestión de Proyectos de Construcción</Typography>
      <Typography variant="h2">H2 - Edificio Residencial Las Torres</Typography>
      <Typography variant="h3">H3 - Fase de Construcción</Typography>
      <Typography variant="h4">H4 - Unidad EA-1</Typography>
      <Typography variant="h5">H5 - Partida: Hormigón Radier</Typography>
      <Typography variant="h6">H6 - Estado del Trabajo</Typography>
    </div>
  ),
}

// Body text variants
export const BodyText: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="body-large">
        <strong>Texto Principal:</strong> Este es el texto principal utilizado para descripciones importantes y contenido destacado en la aplicación de gestión de construcción.
      </Typography>
      <Typography variant="body-default">
        <strong>Texto Por Defecto:</strong> Este es el texto estándar utilizado para la mayoría del contenido en la aplicación, optimizado para legibilidad en dispositivos móviles.
      </Typography>
      <Typography variant="body-small">
        <strong>Texto Pequeño:</strong> Este texto se utiliza para información secundaria, notas adicionales y detalles que complementan el contenido principal.
      </Typography>
    </div>
  ),
}

// High contrast for outdoor conditions
export const HighContrast: Story = {
  render: () => (
    <div className="bg-neutral-50 p-6 rounded-lg">
      <Typography variant="h3" className="mb-4">
        Alta Visibilidad - Condiciones Exteriores
      </Typography>
      <div className="space-y-4">
        <Typography variant="high-contrast-large">
          Texto Grande: Estado crítico de la faena - Requiere atención inmediata
        </Typography>
        <Typography variant="high-contrast">
          Texto Estándar: Material disponible para entrega en terreno
        </Typography>
        <Typography variant="high-contrast-small">
          Texto Pequeño: Última actualización hace 15 minutos
        </Typography>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
}

// Status variants
export const StatusText: Story = {
  render: () => (
    <div className="space-y-3">
      <Typography variant="h4" className="mb-4">Estados de Trabajo</Typography>
      <Typography variant="status-success">
        ✓ Faena completada y entregada a calidad
      </Typography>
      <Typography variant="status-warning">
        ⚠ Esperando material en bodega
      </Typography>
      <Typography variant="status-danger">
        ✗ Trabajo rechazado - Requiere corrección
      </Typography>
      <Typography variant="status-info">
        ℹ En progreso - Ejecutándose según cronograma
      </Typography>
    </div>
  ),
}

// Form labels and help text
export const FormElements: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Typography variant="label-large" as="label">
          Nombre del Proyecto
        </Typography>
        <Typography variant="help-text">
          Ingrese el nombre completo del proyecto de construcción
        </Typography>
      </div>
      
      <div className="space-y-2">
        <Typography variant="label-default" as="label">
          Tipo de Unidad
        </Typography>
        <Typography variant="help-text">
          Seleccione el tipo de unidad (casa, apartamento, oficina, etc.)
        </Typography>
      </div>
      
      <div className="space-y-2">
        <Typography variant="label-small" as="label">
          Código de Partida
        </Typography>
        <Typography variant="caption">
          Formato: PAR-001, PAR-002, etc.
        </Typography>
      </div>
    </div>
  ),
}

// Construction workflow text
export const ConstructionWorkflow: Story = {
  render: () => (
    <div className="space-y-6">
      <Typography variant="h2">Flujo de Trabajo - Construcción</Typography>
      
      <div className="bg-primary-50 p-4 rounded-lg">
        <Typography variant="lead" className="mb-4">
          Proceso de Gestión de Materiales
        </Typography>
        
        <div className="space-y-3">
          <Typography variant="body-default">
            <strong>1. Kit Inicial Cotizado:</strong> Se realiza la cotización inicial de materiales necesarios para la partida específica.
          </Typography>
          
          <Typography variant="body-default">
            <strong>2. Solped Inicial Emitida:</strong> Se emite la solicitud de pedido para proceder con la compra de materiales.
          </Typography>
          
          <Typography variant="body-default">
            <strong>3. Kit Comprado:</strong> Los materiales han sido adquiridos y están en proceso de entrega.
          </Typography>
          
          <Typography variant="body-default">
            <strong>4. Kit Disponible en Bodega:</strong> Los materiales están disponibles en bodega para ser distribuidos.
          </Typography>
        </div>
      </div>
      
      <Typography variant="muted">
        Última actualización: 2 de septiembre de 2025 - Sistema de Gestión de Construcción PWA
      </Typography>
    </div>
  ),
}

// Mobile optimized text
export const MobileOptimized: Story = {
  render: () => (
    <div className="max-w-sm bg-white p-4 rounded-lg shadow-lg">
      <Typography variant="h4" className="mb-3">
        Registro Rápido
      </Typography>
      
      <div className="space-y-4">
        <div>
          <Typography variant="label-default" as="label" className="mb-1 block">
            Unidad
          </Typography>
          <Typography variant="body-large" className="font-mono bg-secondary-50 px-2 py-1 rounded">
            EA-1
          </Typography>
        </div>
        
        <div>
          <Typography variant="label-default" as="label" className="mb-1 block">
            Partida
          </Typography>
          <Typography variant="body-default">
            Hormigón Radier
          </Typography>
        </div>
        
        <div>
          <Typography variant="label-default" as="label" className="mb-1 block">
            Estado
          </Typography>
          <Typography variant="status-success">
            Faena Ejecutada
          </Typography>
        </div>
      </div>
      
      <Typography variant="caption" className="mt-4 block">
        Registro creado el 2 de septiembre, 14:30
      </Typography>
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// Code and technical text
export const TechnicalText: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="h4">Información Técnica</Typography>
      
      <Typography variant="body-default">
        El código de la unidad es <Typography variant="code" as="code">EA-001</Typography> y 
        se encuentra en el estado <Typography variant="code" as="code">MATERIALS_DELIVERED</Typography>.
      </Typography>
      
      <div className="bg-secondary-50 p-4 rounded-lg">
        <Typography variant="label-small" className="mb-2 block">
          COORDENADAS GPS
        </Typography>
        <Typography variant="code" as="code" className="block">
          Latitud: -33.4489, Longitud: -70.6693
        </Typography>
      </div>
      
      <Typography variant="link" as="a" href="#" className="block">
        Ver documentación técnica completa →
      </Typography>
    </div>
  ),
}