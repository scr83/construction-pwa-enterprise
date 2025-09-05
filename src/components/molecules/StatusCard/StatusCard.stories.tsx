import type { Meta, StoryObj } from '@storybook/react'
import { StatusCard } from './StatusCard'

const meta: Meta<typeof StatusCard> = {
  title: 'Molecules/StatusCard',
  component: StatusCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'StatusCard molecule displays construction work status with workflow states, progress tracking, and mobile-optimized interactions for field use.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'ASSIGNED',
        'MATERIALS_PLANNED',
        'MATERIALS_PURCHASED', 
        'MATERIALS_AVAILABLE',
        'MATERIALS_DELIVERED',
        'EXECUTED',
        'QUALITY_SUBMITTED',
        'QUALITY_RECEIVED',
        'QUALITY_APPROVED',
        'COMPLETED',
        'PAID',
      ],
    },
    size: {
      control: 'select',
      options: ['compact', 'default', 'large'],
    },
    priority: {
      control: 'select',
      options: ['low', 'normal', 'high', 'critical'],
    },
    interactive: {
      control: 'boolean',
    },
    showProgress: {
      control: 'boolean',
    },
    showTimestamp: {
      control: 'boolean',
    },
    showAssignment: {
      control: 'boolean',
    },
    compact: {
      control: 'boolean',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
    },
    quantity: {
      control: { type: 'number', min: 0, step: 0.1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic status card
export const Default: Story = {
  args: {
    title: 'Unidad EA-1',
    subtitle: 'Hormigón Radier',
    status: 'EXECUTED',
    location: 'Edificio A, Piso 1',
    assignedTo: 'Juan Pérez',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    quantity: 25.5,
    unit: 'm²',
  },
}

// Construction workflow progression
export const WorkflowProgression: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <StatusCard
        title="Unidad EA-1"
        subtitle="Partida: Trazado y Niveles"
        status="ASSIGNED"
        location="Edificio A, Piso 1"
        assignedTo="Juan Pérez"
        lastUpdated={new Date(Date.now() - 1 * 60 * 60 * 1000)}
        quantity={15.0}
        unit="m²"
      />
      
      <StatusCard
        title="Unidad EA-2"
        subtitle="Partida: Enfierradura"
        status="MATERIALS_PLANNED"
        location="Edificio A, Piso 1"
        assignedTo="María González"
        lastUpdated={new Date(Date.now() - 30 * 60 * 1000)}
        quantity={8.5}
        unit="ton"
        notes="Material especializado requerido"
      />
      
      <StatusCard
        title="Unidad EA-3"
        subtitle="Partida: Hormigón Radier"
        status="MATERIALS_AVAILABLE"
        location="Edificio A, Piso 1"
        assignedTo="Carlos Silva"
        lastUpdated={new Date(Date.now() - 45 * 60 * 1000)}
        quantity={32.0}
        unit="m³"
        photoCount={3}
      />
      
      <StatusCard
        title="Unidad EA-4"
        subtitle="Partida: Levante de Estructuras"
        status="EXECUTED"
        location="Edificio A, Piso 2"
        assignedTo="Ana Ruiz"
        lastUpdated={new Date(Date.now() - 4 * 60 * 60 * 1000)}
        quantity={18.2}
        unit="m²"
        showProgress
        progress={85}
        photoCount={7}
      />
      
      <StatusCard
        title="Unidad EA-5"
        subtitle="Partida: Revestimiento Exterior"
        status="QUALITY_SUBMITTED"
        location="Edificio A, Piso 2"
        assignedTo="Diego López"
        lastUpdated={new Date(Date.now() - 2 * 60 * 60 * 1000)}
        quantity={42.5}
        unit="m²"
        photoCount={12}
        priority="high"
        notes="Requiere inspección especializada"
      />
      
      <StatusCard
        title="Unidad EA-6"
        subtitle="Partida: Terminaciones"
        status="COMPLETED"
        location="Edificio A, Piso 3"
        assignedTo="Laura Morales"
        lastUpdated={new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)}
        quantity={28.0}
        unit="m²"
        showProgress
        progress={100}
        photoCount={15}
        actionLabel="Ver Detalles"
        onActionClick={() => alert('Ver detalles del trabajo completado')}
      />
    </div>
  ),
}

// Interactive status cards
export const Interactive: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <StatusCard
        title="Unidad EA-10"
        subtitle="Hormigón Emplantillado"
        status="MATERIALS_DELIVERED"
        location="Edificio B, Piso 1"
        assignedTo="Roberto Chen"
        lastUpdated={new Date(Date.now() - 30 * 60 * 1000)}
        quantity={12.5}
        unit="m³"
        interactive={true}
        onCardClick={() => alert('Navegando a detalles de EA-10')}
        actionLabel="Iniciar Faena"
        onActionClick={() => alert('Iniciando trabajo en EA-10')}
        photoCount={2}
      />
      
      <StatusCard
        title="Unidad EA-11"
        subtitle="Instalaciones Bajo Radier"
        status="QUALITY_RECEIVED"
        location="Edificio B, Piso 1"
        assignedTo="Patricia Valdez"
        lastUpdated={new Date(Date.now() - 1 * 60 * 60 * 1000)}
        priority="high"
        interactive
        onCardClick={() => alert('Navegando a detalles de EA-11')}
        actionLabel="Revisar Calidad"
        onActionClick={() => alert('Abriendo checklist de calidad')}
        notes="Instalación eléctrica completa"
        photoCount={8}
      />
    </div>
  ),
}

// Priority levels
export const PriorityLevels: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <StatusCard
        title="Unidad EA-20"
        subtitle="Trabajo Rutinario"
        status="ASSIGNED"
        priority="low"
        location="Edificio C, Piso 1"
        assignedTo="Equipo Alpha"
        quantity={5.0}
        unit="m²"
        notes="Trabajo de rutina, sin urgencia"
      />
      
      <StatusCard
        title="Unidad EA-21"
        subtitle="Trabajo Estándar"
        status="EXECUTED"
        priority="normal"
        location="Edificio C, Piso 2"
        assignedTo="Equipo Beta"
        quantity={15.5}
        unit="m²"
        showProgress
        progress={75}
      />
      
      <StatusCard
        title="Unidad EA-22"
        subtitle="Trabajo Prioritario"
        status="MATERIALS_PLANNED"
        priority="high"
        location="Edificio C, Piso 3"
        assignedTo="Equipo Gamma"
        quantity={22.0}
        unit="m²"
        notes="Material especializado en camino"
        dueDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
      />
      
      <StatusCard
        title="Unidad EA-23"
        subtitle="Emergencia - Corrección"
        status="QUALITY_SUBMITTED"
        priority="critical"
        location="Edificio C, Piso 4"
        assignedTo="Equipo Delta"
        quantity={8.0}
        unit="m²"
        photoCount={5}
        notes="Requiere corrección inmediata según norma"
        actionLabel="Acción Urgente"
        onActionClick={() => alert('Iniciando protocolo de emergencia')}
      />
    </div>
  ),
}

// Compact layout for mobile/dashboard
export const CompactLayout: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <StatusCard
        title="EA-1: Radier"
        status="EXECUTED"
        quantity={25.5}
        unit="m²"
        compact
        interactive
        onCardClick={() => alert('EA-1 detalles')}
        photoCount={3}
      />
      
      <StatusCard
        title="EA-2: Enfierradura"
        status="MATERIALS_AVAILABLE"
        quantity={8.5}
        unit="ton"
        compact
        interactive
        onCardClick={() => alert('EA-2 detalles')}
        priority="high"
      />
      
      <StatusCard
        title="EA-3: Estructuras"
        status="QUALITY_APPROVED"
        quantity={18.2}
        unit="m²"
        compact
        interactive
        onCardClick={() => alert('EA-3 detalles')}
        photoCount={12}
      />
      
      <StatusCard
        title="EA-4: Terminaciones"
        status="COMPLETED"
        quantity={28.0}
        unit="m²"
        compact
        interactive
        onCardClick={() => alert('EA-4 detalles')}
        photoCount={15}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// Progress tracking showcase
export const ProgressTracking: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <StatusCard
        title="Proyecto Las Torres - Fase 1"
        subtitle="Cimentaciones y Estructura"
        status="EXECUTED"
        location="Edificio Principal"
        assignedTo="Equipo Estructural"
        lastUpdated={new Date(Date.now() - 3 * 60 * 60 * 1000)}
        showProgress
        progress={45}
        quantity={150.0}
        unit="m³"
        photoCount={23}
        notes="Avance según cronograma establecido"
      />
      
      <StatusCard
        title="Proyecto Las Torres - Fase 2"
        subtitle="Instalaciones y Acabados"
        status="MATERIALS_DELIVERED"
        location="Edificio Principal"
        assignedTo="Equipo Instalaciones"
        lastUpdated={new Date(Date.now() - 1 * 60 * 60 * 1000)}
        showProgress
        progress={15}
        quantity={85.0}
        unit="unidades"
        photoCount={8}
        dueDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
      />
    </div>
  ),
}

// Different construction activities
export const ConstructionActivities: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatusCard
        title="Hormigón Radier"
        subtitle="EA-1 a EA-5"
        status="QUALITY_APPROVED"
        location="Sector Norte"
        assignedTo="Cuadrilla Hormigones"
        quantity={125.5}
        unit="m³"
        showProgress
        progress={100}
        photoCount={18}
        notes="Cumple especificaciones técnicas NCh 1019"
      />
      
      <StatusCard
        title="Enfierradura Losas"
        subtitle="Nivel +3.50"
        status="EXECUTED"
        location="Sector Sur"
        assignedTo="Cuadrilla Fierreros"
        quantity={12.8}
        unit="ton"
        showProgress
        progress={80}
        photoCount={12}
        priority="high"
        dueDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
      />
      
      <StatusCard
        title="Revestimiento Smart Panel"
        subtitle="Fachada Principal"
        status="MATERIALS_PLANNED"
        location="Exterior Norte"
        assignedTo="Cuadrilla Revestimientos"
        quantity={240.0}
        unit="m²"
        notes="Material importado, confirmar fechas de entrega"
        actionLabel="Verificar Material"
        onActionClick={() => alert('Consultando estado de importación')}
      />
      
      <StatusCard
        title="Instalación Eléctrica"
        subtitle="Tableros Principales"
        status="QUALITY_SUBMITTED"
        location="Sala Eléctrica"
        assignedTo="Electricistas Certificados"
        quantity={8}
        unit="tableros"
        photoCount={25}
        priority="critical"
        notes="Requiere inspección SEC antes de energizar"
        actionLabel="Coordinar SEC"
        onActionClick={() => alert('Agendando inspección SEC')}
      />
      
      <StatusCard
        title="Pintura Interior"
        subtitle="Apartamentos 1A-1H"
        status="COMPLETED"
        location="Piso 1"
        assignedTo="Equipo Pintores"
        quantity={180.0}
        unit="m²"
        showProgress
        progress={100}
        photoCount={32}
        notes="Pintura premium aplicada según especificaciones"
      />
      
      <StatusCard
        title="Instalación Griferías"
        subtitle="Baños y Cocinas"
        status="PAID"
        location="Todos los niveles"
        assignedTo="Gasfiteros Especializados"
        quantity={64}
        unit="unidades"
        showProgress
        progress={100}
        photoCount={45}
        notes="Trabajo completado y pagado - Garantía 2 años"
      />
    </div>
  ),
}

// Mobile dashboard simulation
export const MobileDashboard: Story = {
  render: () => (
    <div className="max-w-sm mx-auto bg-background min-h-screen">
      {/* Header simulation */}
      <div className="bg-primary-600 text-white p-4 mb-4">
        <h2 className="text-lg font-bold">Mis Trabajos</h2>
        <p className="text-primary-100 text-sm">Juan Pérez - Jefe de Terreno</p>
      </div>
      
      {/* Status cards list */}
      <div className="px-4 space-y-3">
        <StatusCard
          title="EA-1: Radier Completo"
          status="EXECUTED"
          quantity={25.5}
          unit="m²"
          interactive
          onCardClick={() => alert('Ver EA-1')}
          photoCount={5}
          priority="high"
          showTimestamp
          lastUpdated={new Date(Date.now() - 2 * 60 * 60 * 1000)}
        />
        
        <StatusCard
          title="EA-2: Enfierradura Base"
          status="MATERIALS_AVAILABLE"
          quantity={8.5}
          unit="ton"
          interactive
          onCardClick={() => alert('Ver EA-2')}
          actionLabel="Iniciar Trabajo"
          onActionClick={() => alert('Iniciando EA-2')}
          showTimestamp
          lastUpdated={new Date(Date.now() - 30 * 60 * 1000)}
        />
        
        <StatusCard
          title="EA-3: Inspección Calidad"
          status="QUALITY_RECEIVED"
          quantity={42.0}
          unit="m²"
          interactive
          onCardClick={() => alert('Ver EA-3')}
          photoCount={8}
          priority="critical"
          notes="Pendiente firma del inspector"
          showTimestamp
          lastUpdated={new Date(Date.now() - 1 * 60 * 60 * 1000)}
        />
        
        <StatusCard
          title="EA-4: Trabajo Completado"
          status="COMPLETED"
          quantity={18.2}
          unit="m²"
          interactive
          onCardClick={() => alert('Ver EA-4')}
          showProgress
          progress={100}
          photoCount={12}
          showTimestamp
          lastUpdated={new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)}
        />
      </div>
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
}