import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { Search, User, Mail, MapPin, Package, Calculator } from 'lucide-react'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Input component optimized for construction field conditions with high visibility modes, touch-friendly sizing, and industry-specific features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning'],
    },
    contrast: {
      control: 'select',
      options: ['default', 'high'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    weatherResistant: {
      control: 'boolean',
    },
    gpsCoordinates: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic input
export const Default: Story = {
  args: {
    placeholder: 'Ingrese información...',
  },
}

// With label and helper text
export const WithLabel: Story = {
  args: {
    label: 'Nombre del Proyecto',
    placeholder: 'Ej: Edificio Residencial Las Torres',
    helperText: 'Ingrese el nombre completo del proyecto de construcción',
  },
}

// Different sizes for mobile optimization
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input size="sm" label="Pequeño" placeholder="Texto pequeño" />
      <Input size="default" label="Por Defecto" placeholder="Tamaño estándar móvil" />
      <Input size="lg" label="Grande" placeholder="Optimizado para campo" />
      <Input size="xl" label="Extra Grande" placeholder="Máxima visibilidad exterior" />
    </div>
  ),
}

// Construction-specific inputs with units
export const ConstructionMeasurements: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        label="Área de Construcción"
        type="number"
        placeholder="0"
        unitLabel="m²"
        helperText="Área total en metros cuadrados"
      />
      <Input
        label="Cantidad de Material"
        type="number"
        placeholder="0"
        unitLabel="kg"
        helperText="Peso del material en kilogramos"
      />
      <Input
        label="Volumen de Hormigón"
        type="number"
        placeholder="0.00"
        unitLabel="m³"
        step="0.01"
        helperText="Volumen en metros cúbicos"
      />
      <Input
        label="Progreso de Avance"
        type="number"
        placeholder="0"
        unitLabel="%"
        min="0"
        max="100"
        helperText="Porcentaje de trabajo completado"
      />
    </div>
  ),
}

// GPS coordinates input
export const GPSCoordinates: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        label="Latitud"
        gpsCoordinates
        placeholder="-33.4489"
        leftIcon={<MapPin className="h-4 w-4" />}
        helperText="Coordenada de latitud GPS"
      />
      <Input
        label="Longitud"
        gpsCoordinates
        placeholder="-70.6693"
        leftIcon={<MapPin className="h-4 w-4" />}
        helperText="Coordenada de longitud GPS"
      />
    </div>
  ),
}

// Form validation states
export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        label="Campo Válido"
        value="Edificio Las Torres"
        successMessage="Información verificada correctamente"
      />
      <Input
        label="Campo con Error"
        value="123"
        errorMessage="El nombre debe tener al menos 5 caracteres"
      />
      <Input
        label="Campo con Advertencia"
        value="Proyecto Temporal"
        variant="warning"
        helperText="Este nombre parece ser temporal"
      />
    </div>
  ),
}

// Weather-resistant mode for outdoor use
export const WeatherResistant: Story = {
  render: () => (
    <div className="bg-neutral-100 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-neutral-900">
        Modo Alta Visibilidad - Condiciones Exteriores
      </h3>
      <div className="space-y-4 max-w-md">
        <Input
          weatherResistant
          label="Código de Unidad"
          placeholder="EA-001"
          leftIcon={<Package className="h-5 w-5" />}
          helperText="Ingrese el código de la unidad"
        />
        <Input
          weatherResistant
          label="Cantidad Registrada"
          type="number"
          placeholder="0"
          unitLabel="m³"
          leftIcon={<Calculator className="h-5 w-5" />}
          helperText="Cantidad de material utilizado"
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
}

// Construction worker form
export const FieldWorkerForm: Story = {
  render: () => (
    <div className="max-w-sm bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-primary-900">
        Registro de Faena
      </h3>
      <div className="space-y-4">
        <Input
          label="Trabajador"
          placeholder="Juan Pérez"
          leftIcon={<User className="h-4 w-4" />}
          size="lg"
        />
        <Input
          label="Unidad"
          value="EA-1"
          disabled
          leftIcon={<Package className="h-4 w-4" />}
          size="lg"
        />
        <Input
          label="Cantidad Ejecutada"
          type="number"
          placeholder="0"
          unitLabel="m²"
          leftIcon={<Calculator className="h-4 w-4" />}
          size="lg"
          helperText="Área completada en esta sesión"
        />
        <Input
          label="Observaciones"
          placeholder="Material en buenas condiciones..."
          size="lg"
        />
      </div>
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// Loading and disabled states
export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        label="Cargando Datos"
        placeholder="Sincronizando..."
        loading
        helperText="Conectando con servidor..."
      />
      <Input
        label="Campo Deshabilitado"
        value="Valor fijo del sistema"
        disabled
        helperText="Este valor no puede ser modificado"
      />
      <Input
        label="Búsqueda Activa"
        placeholder="Buscar proyectos..."
        leftIcon={<Search className="h-4 w-4" />}
        loading
      />
    </div>
  ),
}

// Password input with toggle
export const PasswordInput: Story = {
  args: {
    type: 'password',
    label: 'Contraseña',
    placeholder: 'Ingrese su contraseña',
    showPasswordToggle: true,
    helperText: 'Mínimo 8 caracteres',
  },
}

// Email input
export const EmailInput: Story = {
  args: {
    type: 'email',
    label: 'Correo Electrónico',
    placeholder: 'usuario@construccion.com',
    leftIcon: <Mail className="h-4 w-4" />,
    helperText: 'Correo corporativo o personal',
  },
}

// Construction search
export const ConstructionSearch: Story = {
  render: () => (
    <div className="max-w-md">
      <Input
        type="search"
        placeholder="Buscar unidades, partidas, trabajadores..."
        leftIcon={<Search className="h-4 w-4" />}
        size="lg"
        helperText="Busque por código, nombre o estado"
      />
    </div>
  ),
}