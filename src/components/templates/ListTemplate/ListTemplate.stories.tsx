import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ListTemplate } from './ListTemplate'
import type { ListTemplateProps, ListItem, ListAction, ListColumn } from './ListTemplate'

const meta: Meta<typeof ListTemplate> = {
  title: 'Templates/ListTemplate',
  component: ListTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Plantilla para listados con filtros avanzados, búsqueda, ordenamiento y vistas múltiples (cards/tabla).'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: { type: 'radio' },
      options: ['grid', 'table', 'cards'],
      description: 'Tipo de vista para mostrar los elementos'
    },
    role: {
      control: { type: 'select' },
      options: ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica', 'control_calidad'],
      description: 'Rol del usuario para permisos'
    }
  }
}

export default meta
type Story = StoryObj<typeof ListTemplate>

// Datos de ejemplo para proyectos
const projectItems: ListItem[] = [
  {
    id: '1',
    title: 'Edificio Residencial Las Condes',
    subtitle: 'Proyecto habitacional de 15 pisos',
    description: 'Construcción de edificio residencial con 120 departamentos, áreas comunes y estacionamientos subterráneos.',
    status: 'active',
    priority: 'high',
    category: 'Residencial',
    tags: ['Hormigón', 'Estructura', 'Obra Gruesa'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    assignedTo: {
      id: 'u1',
      name: 'Carlos Mendoza',
      avatar: '/avatars/carlos.jpg',
      role: 'Jefe de Terreno'
    },
    metadata: {
      progress: 65,
      budget: 2500000000,
      location: 'Las Condes, Santiago',
      dueDate: '2024-08-30'
    }
  },
  {
    id: '2',
    title: 'Centro Comercial Plaza Norte',
    subtitle: 'Mall comercial de 3 niveles',
    description: 'Construcción de centro comercial con locales comerciales, food court y cines.',
    status: 'pending',
    priority: 'medium',
    category: 'Comercial',
    tags: ['Acero', 'Vidrio', 'Terminaciones'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    assignedTo: {
      id: 'u2',
      name: 'María González',
      avatar: '/avatars/maria.jpg',
      role: 'Arquitecta'
    },
    metadata: {
      progress: 25,
      budget: 4200000000,
      location: 'Huechuraba, Santiago',
      dueDate: '2024-12-15'
    }
  },
  {
    id: '3',
    title: 'Complejo Industrial Maipú',
    subtitle: 'Nave industrial y oficinas',
    description: 'Complejo industrial para manufactura con oficinas administrativas integradas.',
    status: 'completed',
    priority: 'low',
    category: 'Industrial',
    tags: ['Prefabricado', 'Instalaciones', 'Logística'],
    createdAt: '2023-08-01',
    updatedAt: '2024-01-05',
    assignedTo: {
      id: 'u3',
      name: 'Roberto Silva',
      avatar: '/avatars/roberto.jpg',
      role: 'Jefe de Proyecto'
    },
    metadata: {
      progress: 100,
      budget: 1800000000,
      location: 'Maipú, Santiago',
      dueDate: '2023-12-31'
    }
  },
  {
    id: '4',
    title: 'Hospital Regional Valparaíso',
    subtitle: 'Ampliación ala de emergencias',
    description: 'Ampliación del hospital con nuevas salas de emergencia, quirófanos y UCI.',
    status: 'active',
    priority: 'urgent',
    category: 'Salud',
    tags: ['Instalaciones Especiales', 'Normativa Estricta', 'Urgente'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-22',
    assignedTo: {
      id: 'u4',
      name: 'Ana Rodríguez',
      avatar: '/avatars/ana.jpg',
      role: 'Jefe de Terreno'
    },
    metadata: {
      progress: 40,
      budget: 3100000000,
      location: 'Valparaíso',
      dueDate: '2024-06-30'
    }
  },
  {
    id: '5',
    title: 'Conjunto Habitacional El Bosque',
    subtitle: '80 casas de interés social',
    description: 'Proyecto habitacional social con casas de 2 y 3 dormitorios, áreas verdes y equipamiento.',
    status: 'inactive',
    priority: 'medium',
    category: 'Habitacional Social',
    tags: ['Albañilería', 'Social', 'Sustentable'],
    createdAt: '2023-11-20',
    updatedAt: '2024-01-12',
    assignedTo: {
      id: 'u5',
      name: 'Luis Herrera',
      avatar: '/avatars/luis.jpg',
      role: 'Coordinador Social'
    },
    metadata: {
      progress: 15,
      budget: 1600000000,
      location: 'El Bosque, Santiago',
      dueDate: '2024-10-31'
    }
  }
]

// Datos de ejemplo para materiales
const materialItems: ListItem[] = [
  {
    id: 'm1',
    title: 'Cemento Portland Tipo I',
    subtitle: 'Bolsas de 25kg',
    description: 'Cemento de alta calidad para estructuras. Stock disponible en bodega central.',
    status: 'active',
    priority: 'high',
    category: 'Cemento',
    tags: ['Estructural', 'Alta Resistencia'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
    metadata: {
      stock: 850,
      minStock: 200,
      unitPrice: 7500,
      location: 'Bodega A-1'
    }
  },
  {
    id: 'm2',
    title: 'Fierro Corrugado 12mm',
    subtitle: 'Barras de 12 metros',
    description: 'Acero de refuerzo para hormigón armado. Certificación NCh204.',
    status: 'pending',
    priority: 'urgent',
    category: 'Acero',
    tags: ['Refuerzo', 'Certificado'],
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22',
    metadata: {
      stock: 45,
      minStock: 100,
      unitPrice: 12500,
      location: 'Patio de Acero'
    }
  },
  {
    id: 'm3',
    title: 'Ladrillo Fiscal Rojo',
    subtitle: 'Unidades estándar',
    description: 'Ladrillos de arcilla cocida para muros. Dimensión estándar 29x14x7 cm.',
    status: 'active',
    priority: 'medium',
    category: 'Albañilería',
    tags: ['Muro', 'Tradicional'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-21',
    metadata: {
      stock: 15000,
      minStock: 5000,
      unitPrice: 450,
      location: 'Bodega B-3'
    }
  }
]

// Datos de ejemplo para trabajadores
const workerItems: ListItem[] = [
  {
    id: 'w1',
    title: 'Juan Carlos Pérez',
    subtitle: 'Maestro Albañil',
    description: '15 años de experiencia en construcción. Especialista en obra gruesa y terminaciones.',
    status: 'active',
    priority: 'high',
    category: 'Albañilería',
    tags: ['Obra Gruesa', 'Terminaciones', 'Experiencia'],
    createdAt: '2020-03-15',
    updatedAt: '2024-01-22',
    assignedTo: {
      id: 'p1',
      name: 'Edificio Las Condes',
      avatar: '',
      role: 'Proyecto Activo'
    },
    metadata: {
      salary: 850000,
      performance: 92,
      hoursWorked: 2080,
      location: 'Las Condes'
    }
  },
  {
    id: 'w2',
    title: 'María Elena Castro',
    subtitle: 'Jornala Especializada',
    description: 'Especialista en instalaciones eléctricas y control de calidad.',
    status: 'active',
    priority: 'medium',
    category: 'Instalaciones',
    tags: ['Eléctrica', 'Control Calidad'],
    createdAt: '2021-07-10',
    updatedAt: '2024-01-20',
    assignedTo: {
      id: 'p2',
      name: 'Centro Comercial',
      avatar: '',
      role: 'Proyecto Activo'
    },
    metadata: {
      salary: 720000,
      performance: 88,
      hoursWorked: 1920,
      location: 'Huechuraba'
    }
  }
]

// Configuración de columnas
const projectColumns: ListColumn[] = [
  {
    key: 'title',
    label: 'Proyecto',
    sortable: true,
    render: (value, item) => (
      <div>
        <div className="font-semibold">{value}</div>
        <div className="text-sm text-gray-500">{item.subtitle}</div>
      </div>
    )
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
    render: (value) => {
      const colors = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800',
        inactive: 'bg-gray-100 text-gray-800'
      }
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value as keyof typeof colors]}`}>
          {value}
        </span>
      )
    }
  },
  {
    key: 'metadata.progress',
    label: 'Progreso',
    sortable: true,
    render: (value) => (
      <div className="w-24">
        <div className="flex justify-between text-sm mb-1">
          <span>{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    )
  },
  {
    key: 'assignedTo',
    label: 'Responsable',
    render: (value) => (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium">{value?.name?.charAt(0)}</span>
        </div>
        <div>
          <div className="text-sm font-medium">{value?.name}</div>
          <div className="text-xs text-gray-500">{value?.role}</div>
        </div>
      </div>
    )
  },
  {
    key: 'metadata.budget',
    label: 'Presupuesto',
    sortable: true,
    render: (value) => `$${new Intl.NumberFormat('es-CL').format(value)}`
  }
]

const materialColumns: ListColumn[] = [
  {
    key: 'title',
    label: 'Material',
    sortable: true,
    render: (value, item) => (
      <div>
        <div className="font-semibold">{value}</div>
        <div className="text-sm text-gray-500">{item.subtitle}</div>
      </div>
    )
  },
  {
    key: 'metadata.stock',
    label: 'Stock',
    sortable: true,
    render: (value, item) => {
      const isLowStock = value <= (item.metadata?.minStock || 0)
      return (
        <div className={`font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
          {new Intl.NumberFormat('es-CL').format(value)}
          {isLowStock && <span className="text-xs block">⚠️ Stock bajo</span>}
        </div>
      )
    }
  },
  {
    key: 'metadata.unitPrice',
    label: 'Precio Unitario',
    sortable: true,
    render: (value) => `$${new Intl.NumberFormat('es-CL').format(value)}`
  },
  {
    key: 'metadata.location',
    label: 'Ubicación',
    render: (value) => <span className="text-sm">{value}</span>
  }
]

// Acciones de ejemplo
const projectActions: ListAction[] = [
  {
    id: 'view',
    label: 'Ver Detalles',
    variant: 'secondary',
    onClick: (item) => console.log('Ver proyecto:', item.title)
  },
  {
    id: 'edit',
    label: 'Editar',
    variant: 'secondary',
    onClick: (item) => console.log('Editar proyecto:', item.title)
  },
  {
    id: 'complete',
    label: 'Completar',
    variant: 'primary',
    onClick: (item) => console.log('Completar proyecto:', item.title),
    condition: (item) => item.status === 'active'
  }
]

const bulkProjectActions: ListAction[] = [
  {
    id: 'export',
    label: 'Exportar Seleccionados',
    variant: 'secondary',
    onClick: () => console.log('Exportar proyectos seleccionados')
  },
  {
    id: 'archive',
    label: 'Archivar',
    variant: 'destructive',
    onClick: () => console.log('Archivar proyectos seleccionados')
  }
]

// Story Wrapper para manejo de estado
const ListWrapper = ({ children, ...props }: any) => {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleItemSelect = (item: ListItem) => {
    console.log('Item seleccionado:', item)
  }

  const handleBulkSelect = (items: ListItem[]) => {
    console.log('Items seleccionados:', items.map(i => i.title))
  }

  return (
    <ListTemplate
      {...props}
      key={refreshKey}
      onRefresh={handleRefresh}
      onItemSelect={handleItemSelect}
      onBulkSelect={handleBulkSelect}
    />
  )
}

// Historias principales
export const ProjectListing: Story = {
  render: (args) => (
    <ListWrapper
      {...args}
      title="Gestión de Proyectos"
      subtitle="Administre todos los proyectos de construcción"
      items={projectItems}
      columns={projectColumns}
      layout="cards"
      role="gerencia"
      actions={[
        {
          id: 'create',
          label: 'Nuevo Proyecto',
          variant: 'primary',
          onClick: () => console.log('Crear nuevo proyecto')
        }
      ]}
      bulkActions={bulkProjectActions}
      enableBulkSelect={true}
      filters={[
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: 'active', label: 'Activo' },
            { value: 'pending', label: 'Pendiente' },
            { value: 'completed', label: 'Completado' },
            { value: 'inactive', label: 'Inactivo' }
          ]
        },
        {
          key: 'priority',
          label: 'Prioridad',
          type: 'select',
          options: [
            { value: 'urgent', label: 'Urgente' },
            { value: 'high', label: 'Alta' },
            { value: 'medium', label: 'Media' },
            { value: 'low', label: 'Baja' }
          ]
        },
        {
          key: 'category',
          label: 'Categoría',
          type: 'select',
          options: [
            { value: 'Residencial', label: 'Residencial' },
            { value: 'Comercial', label: 'Comercial' },
            { value: 'Industrial', label: 'Industrial' },
            { value: 'Salud', label: 'Salud' }
          ]
        }
      ]}
      sortableColumns={['title', 'status', 'metadata.progress', 'metadata.budget']}
      defaultSort={{ key: 'priority', direction: 'desc' }}
    />
  )
}

export const MaterialInventory: Story = {
  render: (args) => (
    <ListWrapper
      {...args}
      title="Inventario de Materiales"
      subtitle="Control de stock y materiales de construcción"
      items={materialItems}
      columns={materialColumns}
      layout="table"
      role="bodega"
      actions={[
        {
          id: 'add',
          label: 'Agregar Material',
          variant: 'primary',
          onClick: () => console.log('Agregar material')
        },
        {
          id: 'order',
          label: 'Hacer Pedido',
          variant: 'secondary',
          onClick: () => console.log('Hacer pedido')
        }
      ]}
      filters={[
        {
          key: 'category',
          label: 'Categoría',
          type: 'select',
          options: [
            { value: 'Cemento', label: 'Cemento' },
            { value: 'Acero', label: 'Acero' },
            { value: 'Albañilería', label: 'Albañilería' }
          ]
        }
      ]}
      emptyStateTitle="Sin materiales"
      emptyStateMessage="No hay materiales registrados en el inventario"
      emptyStateAction={{
        label: 'Agregar primer material',
        onClick: () => console.log('Agregar primer material')
      }}
    />
  )
}

export const WorkerManagement: Story = {
  render: (args) => (
    <ListWrapper
      {...args}
      title="Gestión de Personal"
      subtitle="Administración de trabajadores y equipos"
      items={workerItems}
      layout="cards"
      role="jefe_terreno"
      actions={[
        {
          id: 'hire',
          label: 'Contratar Personal',
          variant: 'primary',
          onClick: () => console.log('Contratar personal')
        }
      ]}
      filters={[
        {
          key: 'category',
          label: 'Especialidad',
          type: 'select',
          options: [
            { value: 'Albañilería', label: 'Albañilería' },
            { value: 'Instalaciones', label: 'Instalaciones' },
            { value: 'Terminaciones', label: 'Terminaciones' }
          ]
        },
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: 'active', label: 'Activo' },
            { value: 'inactive', label: 'Inactivo' }
          ]
        }
      ]}
    />
  )
}

export const MobileOptimized: Story = {
  render: (args) => (
    <div className="max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <ListWrapper
        {...args}
        title="Proyectos Móvil"
        subtitle="Vista optimizada para dispositivos móviles"
        items={projectItems.slice(0, 3)}
        layout="cards"
        role="jefe_terreno"
        size="sm"
        density="compact"
        itemsPerPage={6}
        enableSearch={true}
        filters={[
          {
            key: 'status',
            label: 'Estado',
            type: 'select',
            options: [
              { value: 'active', label: 'Activo' },
              { value: 'pending', label: 'Pendiente' }
            ]
          }
        ]}
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const TableView: Story = {
  render: (args) => (
    <ListWrapper
      {...args}
      title="Vista de Tabla"
      subtitle="Datos mostrados en formato tabular"
      items={projectItems}
      columns={projectColumns}
      layout="table"
      role="oficina_tecnica"
      enableBulkSelect={true}
      bulkActions={bulkProjectActions}
      sortableColumns={['title', 'status', 'metadata.progress']}
      actions={projectActions}
      filters={[
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: 'active', label: 'Activo' },
            { value: 'pending', label: 'Pendiente' },
            { value: 'completed', label: 'Completado' }
          ]
        }
      ]}
    />
  )
}

export const EmptyState: Story = {
  render: (args) => (
    <ListWrapper
      {...args}
      title="Lista Vacía"
      subtitle="Demostración del estado vacío"
      items={[]}
      layout="cards"
      role="gerencia"
      emptyStateTitle="No hay proyectos"
      emptyStateMessage="Aún no se han creado proyectos. Comience creando su primer proyecto."
      emptyStateAction={{
        label: 'Crear Primer Proyecto',
        onClick: () => console.log('Crear primer proyecto')
      }}
    />
  )
}

export const LoadingState: Story = {
  args: {
    title: 'Cargando Proyectos',
    subtitle: 'Obteniendo información...',
    items: [],
    layout: 'cards',
    role: 'gerencia',
    isLoading: true
  }
}

export const ErrorState: Story = {
  args: {
    title: 'Error en la Carga',
    subtitle: 'No se pudo obtener la información',
    items: [],
    layout: 'cards',
    role: 'gerencia',
    error: 'No se pudo conectar con el servidor. Verifique su conexión a internet e intente nuevamente.'
  }
}