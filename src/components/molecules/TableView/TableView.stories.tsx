import type { Meta, StoryObj } from '@storybook/react'
import { TableView } from './TableView'
import { Eye, Edit, Trash2, FileText } from 'lucide-react'

const meta: Meta<typeof TableView> = {
  title: 'Molecules/TableView',
  component: TableView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente de tabla responsive optimizado para datos de construcción. Mobile-first con funcionalidades avanzadas.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['simple', 'striped', 'bordered', 'compact'],
      description: 'Variante visual de la tabla'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del texto'
    },
    density: {
      control: 'select',
      options: ['tight', 'normal', 'loose'],
      description: 'Densidad de las filas'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga'
    },
    sortable: {
      control: 'boolean',
      description: 'Habilitar ordenamiento'
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Header pegajoso'
    },
    responsive: {
      control: 'boolean',
      description: 'Scroll horizontal responsive'
    },
    rowActions: {
      control: 'boolean',
      description: 'Mostrar acciones de fila'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Datos de ejemplo - Proyectos de construcción
const proyectosData = [
  {
    id: 'PROJ-001',
    nombre: 'Edificio Residencial Las Condes',
    codigo: 'RES-LC-2024-01',
    tipo: 'Residencial',
    estado: 'en_proceso',
    avance: 45.5,
    presupuesto: 2500000000,
    fechaInicio: '2024-03-15',
    responsable: 'Juan Pérez',
    ubicacion: 'Las Condes, Santiago',
    trabajadores: 25
  },
  {
    id: 'PROJ-002', 
    nombre: 'Centro Comercial Maipú',
    codigo: 'COM-MP-2024-02',
    tipo: 'Comercial',
    estado: 'completado',
    avance: 100,
    presupuesto: 8500000000,
    fechaInicio: '2023-08-01',
    responsable: 'María González',
    ubicacion: 'Maipú, Santiago',
    trabajadores: 48
  },
  {
    id: 'PROJ-003',
    nombre: 'Planta Industrial Quilicura', 
    codigo: 'IND-QL-2024-03',
    tipo: 'Industrial',
    estado: 'pendiente',
    avance: 15.2,
    presupuesto: 15000000000,
    fechaInicio: '2024-06-01',
    responsable: 'Carlos Silva',
    ubicacion: 'Quilicura, Santiago',
    trabajadores: 62
  },
  {
    id: 'PROJ-004',
    nombre: 'Hospital Universitario',
    codigo: 'INS-HU-2024-04', 
    tipo: 'Institucional',
    estado: 'en_proceso',
    avance: 78.3,
    presupuesto: 12000000000,
    fechaInicio: '2023-11-15',
    responsable: 'Ana Morales',
    ubicacion: 'Ñuñoa, Santiago',
    trabajadores: 35
  },
  {
    id: 'PROJ-005',
    nombre: 'Puente Peatonal Providencia',
    codigo: 'INF-PP-2024-05',
    tipo: 'Infraestructura', 
    estado: 'cancelado',
    avance: 0,
    presupuesto: 800000000,
    fechaInicio: '2024-01-10',
    responsable: 'Luis Herrera',
    ubicacion: 'Providencia, Santiago',
    trabajadores: 0
  }
]

// Definir columnas para proyectos
const proyectosColumns = [
  { key: 'codigo', title: 'Código', sortable: true, width: 140 },
  { key: 'nombre', title: 'Nombre del Proyecto', sortable: true },
  { key: 'tipo', title: 'Tipo', sortable: true, width: 120 },
  { key: 'estado', title: 'Estado', type: 'status' as const, sortable: true, width: 120, align: 'center' as const },
  { key: 'avance', title: 'Avance', type: 'percentage' as const, sortable: true, width: 100, align: 'right' as const },
  { key: 'presupuesto', title: 'Presupuesto', type: 'currency' as const, sortable: true, width: 150, align: 'right' as const },
  { key: 'fechaInicio', title: 'Fecha Inicio', type: 'date' as const, sortable: true, width: 120 },
  { key: 'responsable', title: 'Responsable', sortable: true, width: 140 },
  { key: 'trabajadores', title: 'Trabajadores', type: 'number' as const, sortable: true, width: 110, align: 'center' as const }
]

// Acciones de tabla
const tableActions = [
  {
    id: 'view',
    label: 'Ver',
    icon: <Eye className="w-4 h-4" />,
    variant: 'outline' as const,
    onClick: (row: any) => console.log('Ver proyecto:', row.nombre)
  },
  {
    id: 'edit',
    label: 'Editar',
    icon: <Edit className="w-4 h-4" />,
    variant: 'outline' as const,
    onClick: (row: any) => console.log('Editar proyecto:', row.nombre),
    show: (row: any) => row.estado !== 'completado' && row.estado !== 'cancelado'
  },
  {
    id: 'report',
    label: 'Reporte',
    icon: <FileText className="w-4 h-4" />,
    variant: 'outline' as const,
    onClick: (row: any) => console.log('Generar reporte:', row.nombre)
  },
  {
    id: 'delete',
    label: 'Eliminar',
    icon: <Trash2 className="w-4 h-4" />,
    variant: 'destructive' as const,
    onClick: (row: any) => console.log('Eliminar proyecto:', row.nombre),
    show: (row: any) => row.estado === 'pendiente'
  }
]

// Historia por defecto - Tabla de proyectos
export const Default: Story = {
  args: {
    columns: proyectosColumns,
    data: proyectosData,
    loading: false,
    sortable: true,
    variant: 'simple',
    size: 'md',
    density: 'normal',
    stickyHeader: false,
    responsive: true,
    rowActions: true,
    actions: tableActions,
    emptyMessage: 'No hay proyectos registrados',
    onSort: (column, direction) => console.log(`Ordenar por ${column} ${direction}`),
    onRowClick: (row) => console.log('Click en fila:', row.nombre)
  },
}

// Tabla rayada
export const Striped: Story = {
  args: {
    ...Default.args,
    variant: 'striped'
  },
}

// Tabla compacta
export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
    density: 'tight',
    size: 'sm'
  },
}

// Estado de carga
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true
  },
}

// Tabla vacía
export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
    emptyMessage: 'No se encontraron proyectos que coincidan con los filtros aplicados'
  },
}

// Header pegajoso con altura máxima
export const StickyHeader: Story = {
  args: {
    ...Default.args,
    stickyHeader: true,
    maxHeight: '400px',
    data: [...proyectosData, ...proyectosData, ...proyectosData] // Más datos para scroll
  },
}

// Tabla sin acciones
export const WithoutActions: Story = {
  args: {
    ...Default.args,
    rowActions: false,
    actions: []
  },
}

// Solo lectura - Datos de inspecciones
const inspeccionesData = [
  {
    id: 'INS-001',
    fecha: '2024-03-15',
    proyecto: 'Edificio Las Condes',
    tipo: 'Estructural',
    inspector: 'Pedro Ramirez',
    resultado: 'aprobado',
    observaciones: 2,
    duracion: 45
  },
  {
    id: 'INS-002',
    fecha: '2024-03-14',
    proyecto: 'Centro Comercial Maipú', 
    tipo: 'Instalaciones',
    inspector: 'Carmen Torres',
    resultado: 'observaciones',
    observaciones: 5,
    duracion: 32
  },
  {
    id: 'INS-003',
    fecha: '2024-03-13',
    proyecto: 'Hospital Universitario',
    tipo: 'Calidad',
    inspector: 'Roberto Díaz',
    resultado: 'rechazado',
    observaciones: 12,
    duracion: 67
  }
]

const inspeccionesColumns = [
  { key: 'fecha', title: 'Fecha', type: 'date' as const, sortable: true, width: 120 },
  { key: 'proyecto', title: 'Proyecto', sortable: true },
  { key: 'tipo', title: 'Tipo Inspección', sortable: true, width: 140 },
  { key: 'inspector', title: 'Inspector', sortable: true, width: 140 },
  { key: 'resultado', title: 'Resultado', type: 'status' as const, align: 'center' as const, width: 120 },
  { key: 'observaciones', title: 'Observaciones', type: 'number' as const, align: 'center' as const, width: 120 },
  { key: 'duracion', title: 'Duración (min)', type: 'number' as const, align: 'right' as const, width: 120 }
]

export const InspectionTable: Story = {
  args: {
    columns: inspeccionesColumns,
    data: inspeccionesData,
    variant: 'striped',
    size: 'md',
    density: 'normal',
    sortable: true,
    rowActions: true,
    actions: [
      {
        id: 'view-report',
        label: 'Ver Reporte',
        icon: <FileText className="w-4 h-4" />,
        variant: 'outline' as const,
        onClick: (row: any) => console.log('Ver reporte inspección:', row.id)
      }
    ],
    emptyMessage: 'No hay inspecciones registradas',
    onRowClick: (row) => console.log('Ver inspección:', row.id)
  },
}

// Tabla con selección múltiple
export const WithSelection: Story = {
  args: {
    ...Default.args,
    selectedRows: ['PROJ-001', 'PROJ-003'],
    onRowSelect: (rowId, selected) => console.log(`${selected ? 'Seleccionar' : 'Deseleccionar'} fila:`, rowId)
  },
}