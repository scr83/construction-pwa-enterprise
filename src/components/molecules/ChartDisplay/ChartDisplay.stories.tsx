import type { Meta, StoryObj } from '@storybook/react'
import { ChartDisplay } from './ChartDisplay'

const meta: Meta<typeof ChartDisplay> = {
  title: 'Molecules/ChartDisplay',
  component: ChartDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de gráficos optimizado para métricas de construcción. Integra Recharts con terminología y colores específicos del sector.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['bar', 'line', 'pie', 'area', 'progress'],
      description: 'Tipo de gráfico'
    },
    variant: {
      control: 'select',
      options: ['simple', 'detailed', 'compact', 'dashboard'],
      description: 'Variante visual'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del gráfico'
    },
    theme: {
      control: 'select',
      options: ['default', 'construction', 'minimal'],
      description: 'Tema de colores'
    },
    showLegend: {
      control: 'boolean',
      description: 'Mostrar leyenda'
    },
    showTooltip: {
      control: 'boolean',
      description: 'Mostrar tooltip'
    },
    showGrid: {
      control: 'boolean',
      description: 'Mostrar grilla'
    },
    showLabels: {
      control: 'boolean',
      description: 'Mostrar etiquetas'
    },
    currency: {
      control: 'boolean',
      description: 'Formatear como moneda'
    },
    percentage: {
      control: 'boolean',
      description: 'Formatear como porcentaje'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga'
    },
    responsive: {
      control: 'boolean',
      description: 'Diseño responsive'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Datos de ejemplo - Avance de proyectos
const proyectosAvanceData = [
  { name: 'Residencial Las Condes', value: 75 },
  { name: 'Centro Comercial Maipú', value: 100 },
  { name: 'Planta Industrial', value: 32 },
  { name: 'Hospital Universitario', value: 88 },
  { name: 'Puente Peatonal', value: 15 },
  { name: 'Torre Oficinas', value: 60 }
]

// Datos presupuestarios
const presupuestoData = [
  { name: 'Enero', value: 2500000000 },
  { name: 'Febrero', value: 3200000000 },
  { name: 'Marzo', value: 4100000000 },
  { name: 'Abril', value: 3800000000 },
  { name: 'Mayo', value: 4500000000 },
  { name: 'Junio', value: 5200000000 }
]

// Datos de estados de proyectos  
const estadosProyectosData = [
  { name: 'Completados', value: 12 },
  { name: 'En Progreso', value: 8 },
  { name: 'Pendientes', value: 5 },
  { name: 'Suspendidos', value: 2 }
]

// Datos múltiples series - Comparación mensual
const comparacionMensualData = [
  { name: 'Ene', planificado: 2800000000, ejecutado: 2500000000, gastado: 2200000000 },
  { name: 'Feb', planificado: 3000000000, ejecutado: 3200000000, gastado: 2900000000 },
  { name: 'Mar', planificado: 3500000000, ejecutado: 4100000000, gastado: 3800000000 },
  { name: 'Abr', planificado: 4000000000, ejecutado: 3800000000, gastado: 3600000000 },
  { name: 'May', planificado: 4200000000, ejecutado: 4500000000, gastado: 4100000000 },
  { name: 'Jun', planificado: 4800000000, ejecutado: 5200000000, gastado: 4900000000 }
]

const seriesComparacion = [
  { key: 'planificado', name: 'Planificado', color: '#3b82f6' },
  { key: 'ejecutado', name: 'Ejecutado', color: '#10b981' },
  { key: 'gastado', name: 'Gastado', color: '#f59e0b' }
]

// Historia por defecto - Gráfico de barras de avance
export const Default: Story = {
  args: {
    type: 'bar',
    title: 'Avance de Proyectos',
    subtitle: 'Porcentaje de avance físico por proyecto',
    data: proyectosAvanceData,
    variant: 'detailed',
    size: 'md',
    theme: 'construction',
    showLegend: false,
    showTooltip: true,
    showGrid: true,
    showLabels: false,
    percentage: true,
    responsive: true
  },
}

// Gráfico de líneas - Presupuesto mensual
export const LineChart: Story = {
  args: {
    type: 'line',
    title: 'Evolución Presupuestaria',
    subtitle: 'Ejecución presupuestaria mensual',
    data: presupuestoData,
    variant: 'detailed',
    size: 'lg',
    theme: 'construction',
    showLegend: false,
    showTooltip: true,
    showGrid: true,
    currency: true,
    responsive: true
  },
}

// Gráfico de torta - Estados de proyectos
export const PieChart: Story = {
  args: {
    type: 'pie',
    title: 'Estados de Proyectos',
    subtitle: 'Distribución actual de proyectos por estado',
    data: estadosProyectosData,
    variant: 'detailed',
    size: 'md',
    theme: 'construction',
    showLegend: true,
    showTooltip: true,
    showLabels: true,
    responsive: true
  },
}

// Gráfico de área - Comparación múltiple
export const AreaChart: Story = {
  args: {
    type: 'area',
    title: 'Comparación Presupuestaria',
    subtitle: 'Planificado vs Ejecutado vs Gastado',
    data: comparacionMensualData,
    series: seriesComparacion,
    variant: 'detailed',
    size: 'lg',
    theme: 'construction',
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    currency: true,
    responsive: true
  },
}

// Barras de progreso
export const ProgressBars: Story = {
  args: {
    type: 'progress',
    title: 'Distribución de Recursos',
    subtitle: 'Asignación de presupuesto por área',
    data: [
      { name: 'Mano de Obra', value: 45000000000 },
      { name: 'Materiales', value: 32000000000 },
      { name: 'Maquinaria', value: 18000000000 },
      { name: 'Subcontratos', value: 25000000000 },
      { name: 'Otros', value: 8000000000 }
    ],
    variant: 'detailed',
    size: 'md',
    theme: 'construction',
    currency: true,
    responsive: true
  },
}

// Gráfico compacto para dashboard
export const Compact: Story = {
  args: {
    type: 'bar',
    title: 'KPI Semanal',
    data: proyectosAvanceData.slice(0, 4),
    variant: 'compact',
    size: 'sm',
    theme: 'construction',
    showLegend: false,
    showTooltip: true,
    showGrid: false,
    percentage: true,
    responsive: true
  },
}

// Estado de carga
export const Loading: Story = {
  args: {
    type: 'bar',
    title: 'Cargando Datos...',
    subtitle: 'Obteniendo métricas de proyectos',
    data: [],
    loading: true,
    variant: 'detailed',
    size: 'md',
    theme: 'construction'
  },
}

// Estado de error
export const Error: Story = {
  args: {
    type: 'bar',
    title: 'Error en Datos',
    subtitle: 'No se pudieron cargar las métricas',
    data: [],
    error: 'Error al conectar con el servidor de datos',
    variant: 'detailed',
    size: 'md',
    theme: 'construction'
  },
}

// Sin datos
export const Empty: Story = {
  args: {
    type: 'bar',
    title: 'Métricas de Calidad',
    subtitle: 'Inspecciones realizadas este mes',
    data: [],
    emptyMessage: 'No hay inspecciones registradas este mes',
    variant: 'detailed',
    size: 'md',
    theme: 'construction'
  },
}

// Múltiples series - Barras
export const MultiSeriesBar: Story = {
  args: {
    type: 'bar',
    title: 'Análisis Presupuestario',
    subtitle: 'Comparativa mensual de presupuestos',
    data: comparacionMensualData,
    series: seriesComparacion,
    variant: 'detailed',
    size: 'lg',
    theme: 'construction',
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    currency: true,
    responsive: true
  },
}

// Gráfico extra grande
export const ExtraLarge: Story = {
  args: {
    type: 'line',
    title: 'Dashboard Ejecutivo',
    subtitle: 'Tendencias anuales de la empresa constructora',
    data: presupuestoData,
    variant: 'dashboard',
    size: 'xl',
    theme: 'construction',
    showLegend: false,
    showTooltip: true,
    showGrid: true,
    currency: true,
    responsive: true
  },
}

// Ejemplo en contenedor con fondo
export const InContainer: Story = {
  render: (args) => (
    <div className="w-full max-w-4xl p-6 bg-gray-100 rounded-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard ConstructorPro</h1>
        <p className="text-gray-600">Métricas clave de rendimiento</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartDisplay {...args} />
        <ChartDisplay 
          type="pie" 
          title="Estados de Proyectos"
          data={estadosProyectosData}
          variant="detailed"
          size="md"
          showLegend={true}
          responsive={true}
        />
      </div>
    </div>
  ),
  args: {
    type: 'bar',
    title: 'Avance por Proyecto',
    data: proyectosAvanceData.slice(0, 4),
    variant: 'detailed',
    size: 'md',
    percentage: true,
    responsive: true
  },
}