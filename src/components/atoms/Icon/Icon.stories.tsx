import type { Meta, StoryObj } from '@storybook/react'
import {
  Icon,
  ConstructionStatusIcon,
  MaterialStatusIcon,
  UserRoleIcon,
  ConnectionStatusIcon,
  getAvailableIcons,
} from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Construction-optimized icon component with semantic variants and specialized construction industry icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: getAvailableIcons(),
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', '2xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'muted'],
    },
    interactive: {
      control: 'boolean',
    },
    decorative: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic icon
export const Default: Story = {
  args: {
    name: 'hammer',
    label: 'Hammer icon',
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <Icon name="hard-hat" size="xs" />
        <p className="text-xs mt-1">XS</p>
      </div>
      <div className="text-center">
        <Icon name="hard-hat" size="sm" />
        <p className="text-xs mt-1">SM</p>
      </div>
      <div className="text-center">
        <Icon name="hard-hat" size="default" />
        <p className="text-xs mt-1">Default</p>
      </div>
      <div className="text-center">
        <Icon name="hard-hat" size="lg" />
        <p className="text-xs mt-1">LG</p>
      </div>
      <div className="text-center">
        <Icon name="hard-hat" size="xl" />
        <p className="text-xs mt-1">XL</p>
      </div>
      <div className="text-center">
        <Icon name="hard-hat" size="2xl" />
        <p className="text-xs mt-1">2XL</p>
      </div>
    </div>
  ),
}

// Color variants
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <Icon name="building" variant="default" size="lg" />
        <p className="text-xs mt-1">Default</p>
      </div>
      <div className="text-center">
        <Icon name="building" variant="primary" size="lg" />
        <p className="text-xs mt-1">Primary</p>
      </div>
      <div className="text-center">
        <Icon name="building" variant="secondary" size="lg" />
        <p className="text-xs mt-1">Secondary</p>
      </div>
      <div className="text-center">
        <Icon name="building" variant="success" size="lg" />
        <p className="text-xs mt-1">Success</p>
      </div>
      <div className="text-center">
        <Icon name="building" variant="warning" size="lg" />
        <p className="text-xs mt-1">Warning</p>
      </div>
      <div className="text-center">
        <Icon name="building" variant="danger" size="lg" />
        <p className="text-xs mt-1">Danger</p>
      </div>
      <div className="text-center">
        <Icon name="building" variant="muted" size="lg" />
        <p className="text-xs mt-1">Muted</p>
      </div>
    </div>
  ),
}

// Construction & Building icons
export const ConstructionBuilding: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <div className="text-center">
        <Icon name="hard-hat" size="xl" variant="primary" />
        <p className="text-sm mt-2">Casco de Seguridad</p>
      </div>
      <div className="text-center">
        <Icon name="hammer" size="xl" variant="primary" />
        <p className="text-sm mt-2">Martillo</p>
      </div>
      <div className="text-center">
        <Icon name="wrench" size="xl" variant="primary" />
        <p className="text-sm mt-2">Llave Inglesa</p>
      </div>
      <div className="text-center">
        <Icon name="truck" size="xl" variant="primary" />
        <p className="text-sm mt-2">Camión</p>
      </div>
      <div className="text-center">
        <Icon name="building" size="xl" variant="primary" />
        <p className="text-sm mt-2">Edificio</p>
      </div>
      <div className="text-center">
        <Icon name="home" size="xl" variant="primary" />
        <p className="text-sm mt-2">Casa</p>
      </div>
      <div className="text-center">
        <Icon name="warehouse" size="xl" variant="primary" />
        <p className="text-sm mt-2">Bodega</p>
      </div>
      <div className="text-center">
        <Icon name="ruler" size="xl" variant="primary" />
        <p className="text-sm mt-2">Regla</p>
      </div>
    </div>
  ),
}

// Materials & Tools icons
export const MaterialsTools: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <div className="text-center">
        <Icon name="package" size="xl" variant="secondary" />
        <p className="text-sm mt-2">Paquete</p>
      </div>
      <div className="text-center">
        <Icon name="package-check" size="xl" variant="success" />
        <p className="text-sm mt-2">Material OK</p>
      </div>
      <div className="text-center">
        <Icon name="package-x" size="xl" variant="danger" />
        <p className="text-sm mt-2">Material Faltante</p>
      </div>
      <div className="text-center">
        <Icon name="boxes" size="xl" variant="secondary" />
        <p className="text-sm mt-2">Inventario</p>
      </div>
      <div className="text-center">
        <Icon name="scale" size="xl" variant="secondary" />
        <p className="text-sm mt-2">Balanza</p>
      </div>
      <div className="text-center">
        <Icon name="calculator" size="xl" variant="secondary" />
        <p className="text-sm mt-2">Calculadora</p>
      </div>
    </div>
  ),
}

// Quality & Safety icons
export const QualitySafety: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <div className="text-center">
        <Icon name="shield" size="xl" variant="primary" />
        <p className="text-sm mt-2">Seguridad</p>
      </div>
      <div className="text-center">
        <Icon name="shield-check" size="xl" variant="success" />
        <p className="text-sm mt-2">Aprobado</p>
      </div>
      <div className="text-center">
        <Icon name="shield-alert" size="xl" variant="warning" />
        <p className="text-sm mt-2">Alerta</p>
      </div>
      <div className="text-center">
        <Icon name="alert-triangle" size="xl" variant="warning" />
        <p className="text-sm mt-2">Advertencia</p>
      </div>
      <div className="text-center">
        <Icon name="check-circle" size="xl" variant="success" />
        <p className="text-sm mt-2">Completado</p>
      </div>
      <div className="text-center">
        <Icon name="x-circle" size="xl" variant="danger" />
        <p className="text-sm mt-2">Rechazado</p>
      </div>
      <div className="text-center">
        <Icon name="eye" size="xl" variant="primary" />
        <p className="text-sm mt-2">Inspección</p>
      </div>
      <div className="text-center">
        <Icon name="clipboard" size="xl" variant="primary" />
        <p className="text-sm mt-2">Lista Verificación</p>
      </div>
    </div>
  ),
}

// Location & GPS icons
export const LocationGPS: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <div className="text-center">
        <Icon name="map-pin" size="xl" variant="danger" />
        <p className="text-sm mt-2">Ubicación</p>
      </div>
      <div className="text-center">
        <Icon name="navigation" size="xl" variant="primary" />
        <p className="text-sm mt-2">Navegación</p>
      </div>
      <div className="text-center">
        <Icon name="compass" size="xl" variant="primary" />
        <p className="text-sm mt-2">Brújula</p>
      </div>
      <div className="text-center">
        <Icon name="map" size="xl" variant="primary" />
        <p className="text-sm mt-2">Mapa</p>
      </div>
    </div>
  ),
}

// Specialized construction status icons
export const ConstructionStatusIcons: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Estados de Trabajo</h3>
        <div className="flex gap-6">
          <div className="text-center">
            <ConstructionStatusIcon status="pending" size="xl" />
            <p className="text-sm mt-2">Pendiente</p>
          </div>
          <div className="text-center">
            <ConstructionStatusIcon status="in-progress" size="xl" />
            <p className="text-sm mt-2">En Progreso</p>
          </div>
          <div className="text-center">
            <ConstructionStatusIcon status="completed" size="xl" />
            <p className="text-sm mt-2">Completado</p>
          </div>
          <div className="text-center">
            <ConstructionStatusIcon status="rejected" size="xl" />
            <p className="text-sm mt-2">Rechazado</p>
          </div>
          <div className="text-center">
            <ConstructionStatusIcon status="warning" size="xl" />
            <p className="text-sm mt-2">Advertencia</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Estados de Material</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <MaterialStatusIcon status="planned" size="lg" />
            <p className="text-sm mt-2">Planificado</p>
          </div>
          <div className="text-center">
            <MaterialStatusIcon status="requested" size="lg" />
            <p className="text-sm mt-2">Solicitado</p>
          </div>
          <div className="text-center">
            <MaterialStatusIcon status="purchased" size="lg" />
            <p className="text-sm mt-2">Comprado</p>
          </div>
          <div className="text-center">
            <MaterialStatusIcon status="in-warehouse" size="lg" />
            <p className="text-sm mt-2">En Bodega</p>
          </div>
          <div className="text-center">
            <MaterialStatusIcon status="delivered" size="lg" />
            <p className="text-sm mt-2">Entregado</p>
          </div>
          <div className="text-center">
            <MaterialStatusIcon status="installed" size="lg" />
            <p className="text-sm mt-2">Instalado</p>
          </div>
        </div>
      </div>
    </div>
  ),
}

// User role icons
export const UserRoleIcons: Story = {
  render: () => (
    <div>
      <h3 className="text-lg font-medium mb-4">Roles de Usuario</h3>
      <div className="flex gap-6">
        <div className="text-center">
          <UserRoleIcon role="executive" size="xl" />
          <p className="text-sm mt-2">Gerencia</p>
        </div>
        <div className="text-center">
          <UserRoleIcon role="site-manager" size="xl" />
          <p className="text-sm mt-2">Jefe de Terreno</p>
        </div>
        <div className="text-center">
          <UserRoleIcon role="warehouse" size="xl" />
          <p className="text-sm mt-2">Bodega</p>
        </div>
        <div className="text-center">
          <UserRoleIcon role="technical-office" size="xl" />
          <p className="text-sm mt-2">Oficina Técnica</p>
        </div>
        <div className="text-center">
          <UserRoleIcon role="quality-control" size="xl" />
          <p className="text-sm mt-2">Control Calidad</p>
        </div>
      </div>
    </div>
  ),
}

// Connection status icons
export const ConnectionStatusIcons: Story = {
  render: () => (
    <div>
      <h3 className="text-lg font-medium mb-4">Estados de Conexión</h3>
      <div className="flex gap-6">
        <div className="text-center">
          <ConnectionStatusIcon status="online" size="lg" />
          <p className="text-sm mt-2">En Línea</p>
        </div>
        <div className="text-center">
          <ConnectionStatusIcon status="offline" size="lg" />
          <p className="text-sm mt-2">Sin Conexión</p>
        </div>
        <div className="text-center">
          <ConnectionStatusIcon status="poor" size="lg" />
          <p className="text-sm mt-2">Conexión Lenta</p>
        </div>
        <div className="text-center">
          <ConnectionStatusIcon status="connecting" size="lg" />
          <p className="text-sm mt-2">Conectando</p>
        </div>
      </div>
    </div>
  ),
}

// Interactive icons
export const Interactive: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon 
        name="settings" 
        size="xl" 
        interactive 
        variant="primary" 
        label="Configuración" 
      />
      <Icon 
        name="edit" 
        size="xl" 
        interactive 
        variant="secondary" 
        label="Editar" 
      />
      <Icon 
        name="trash" 
        size="xl" 
        interactive 
        variant="danger" 
        label="Eliminar" 
      />
      <Icon 
        name="search" 
        size="xl" 
        interactive 
        variant="primary" 
        label="Buscar" 
      />
    </div>
  ),
}

// Construction workflow icons
export const ConstructionWorkflow: Story = {
  render: () => (
    <div className="bg-primary-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-primary-900">
        Flujo de Trabajo - Construcción
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Icon name="clipboard" size="xl" variant="secondary" />
            <p className="text-sm mt-2 font-medium">Planificación</p>
            <p className="text-xs text-secondary-600">Kit Inicial</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Icon name="package" size="xl" variant="warning" />
            <p className="text-sm mt-2 font-medium">Materiales</p>
            <p className="text-xs text-secondary-600">En Bodega</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Icon name="hard-hat" size="xl" variant="primary" />
            <p className="text-sm mt-2 font-medium">Ejecución</p>
            <p className="text-xs text-secondary-600">Faena Activa</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Icon name="shield-check" size="xl" variant="success" />
            <p className="text-sm mt-2 font-medium">Calidad</p>
            <p className="text-xs text-secondary-600">Aprobado</p>
          </div>
        </div>
      </div>
    </div>
  ),
}

// All available icons showcase
export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 max-w-6xl">
      {getAvailableIcons().map((iconName) => (
        <div key={iconName} className="text-center p-2">
          <Icon name={iconName} size="lg" variant="primary" />
          <p className="text-xs mt-1 truncate" title={iconName}>
            {iconName}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}