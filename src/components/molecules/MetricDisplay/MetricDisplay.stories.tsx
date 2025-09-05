import type { Meta, StoryObj } from '@storybook/react'
import { MetricDisplay } from './MetricDisplay'
import { Icon } from '@/components/atoms/Icon'

const meta: Meta<typeof MetricDisplay> = {
  title: 'Molecules/MetricDisplay',
  component: MetricDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'MetricDisplay molecule shows construction KPIs and metrics with trend indicators, progress tracking, and threshold-based visual feedback.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    metricType: {
      control: 'select',
      options: ['percentage', 'currency', 'count', 'score', 'ratio', 'duration', 'area', 'volume', 'weight'],
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'primary'],
    },
    size: {
      control: 'select',
      options: ['compact', 'default', 'large'],
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
    interactive: {
      control: 'boolean',
    },
    showTrend: {
      control: 'boolean',
    },
    showProgress: {
      control: 'boolean',
    },
    showComparison: {
      control: 'boolean',
    },
    compact: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic metric display
export const Default: Story = {
  args: {
    label: 'Trabajos Completados',
    value: 145,
    metricType: 'count',
    unit: 'unidades',
    changePercentage: 8.5,
    period: 'Esta semana',
    icon: <Icon name="check-circle" size="sm" variant="success" />,
  },
}

// Construction KPI dashboard
export const ConstructionKPIs: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl">
      {/* Progress percentage */}
      <MetricDisplay
        label="Progreso del Proyecto"
        value={73.5}
        metricType="percentage"
        target={100}
        showProgress
        changePercentage={5.2}
        period="Esta semana"
        icon={<Icon name="bar-chart" size="sm" variant="primary" />}
        threshold={{ good: 70, warning: 50, critical: 30 }}
        description="Avance general del proyecto según cronograma"
      />
      
      {/* Budget tracking */}
      <MetricDisplay
        label="Presupuesto Utilizado"
        value={2450000}
        metricType="currency"
        unit="CLP"
        target={3000000}
        showProgress
        changePercentage={-2.1}
        period="Último mes"
        icon={<Icon name="calculator" size="sm" variant="primary" />}
        threshold={{ critical: 2800000, warning: 2600000, good: 2400000 }}
        description="Gasto acumulado versus presupuesto total"
      />
      
      {/* Quality score */}
      <MetricDisplay
        label="Índice de Calidad"
        value={8.7}
        metricType="score"
        unit="/10"
        changePercentage={3.2}
        period="Último mes"
        icon={<Icon name="shield-check" size="sm" variant="success" />}
        threshold={{ good: 8, warning: 6, critical: 4 }}
        description="Promedio de evaluaciones de calidad"
      />
      
      {/* Material efficiency */}
      <MetricDisplay
        label="Eficiencia Material"
        value={94.2}
        metricType="percentage"
        changePercentage={1.8}
        period="Esta semana"
        icon={<Icon name="package-check" size="sm" variant="success" />}
        threshold={{ good: 90, warning: 80, critical: 70 }}
        description="Porcentaje de material utilizado vs planificado"
      />
    </div>
  ),
}

// Different metric types
export const MetricTypes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Area metrics */}
      <MetricDisplay
        label="Área Construida"
        value={1250.5}
        metricType="area"
        unit="m²"
        changePercentage={15.3}
        period="Este mes"
        icon={<Icon name="ruler" size="sm" variant="primary" />}
      />
      
      {/* Volume metrics */}
      <MetricDisplay
        label="Hormigón Utilizado"
        value={180.25}
        metricType="volume"
        unit="m³"
        target={200}
        showProgress
        period="Esta semana"
        icon={<Icon name="package" size="sm" variant="secondary" />}
      />
      
      {/* Weight metrics */}
      <MetricDisplay
        label="Enfierradura Total"
        value={12500}
        metricType="weight"
        unit="kg"
        changePercentage={8.7}
        period="Último mes"
        icon={<Icon name="scale" size="sm" variant="secondary" />}
      />
      
      {/* Duration metrics */}
      <MetricDisplay
        label="Tiempo Promedio por Faena"
        value={2.5}
        metricType="duration"
        unit="días"
        changePercentage={-12.5}
        trend="down"
        period="Última semana"
        icon={<Icon name="timer" size="sm" variant="primary" />}
        description="Reducción en tiempo indica mayor eficiencia"
      />
      
      {/* Count metrics */}
      <MetricDisplay
        label="Trabajadores Activos"
        value={28}
        metricType="count"
        unit="personas"
        change={3}
        previousValue={25}
        period="Hoy"
        icon={<Icon name="users" size="sm" variant="primary" />}
      />
      
      {/* Ratio metrics */}
      <MetricDisplay
        label="Relación Costo-Eficiencia"
        value={1.2}
        metricType="ratio"
        unit="1"
        changePercentage={-5.2}
        trend="down"
        period="Último mes"
        icon={<Icon name="trending-up" size="sm" variant="success" />}
        description="Menor ratio indica mejor eficiencia de costos"
      />
    </div>
  ),
}

// Status-based variants
export const StatusVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricDisplay
        label="Trabajos en Regla"
        value={145}
        metricType="count"
        variant="success"
        changePercentage={5.2}
        period="Esta semana"
        icon={<Icon name="check-circle" size="sm" variant="success" />}
      />
      
      <MetricDisplay
        label="Atención Requerida"
        value={8}
        metricType="count"
        variant="warning"
        changePercentage={-15.5}
        period="Esta semana"
        icon={<Icon name="alert-triangle" size="sm" variant="warning" />}
      />
      
      <MetricDisplay
        label="Situación Crítica"
        value={2}
        metricType="count"
        variant="danger"
        changePercentage={0}
        trend="neutral"
        period="Esta semana"
        icon={<Icon name="x-circle" size="sm" variant="danger" />}
      />
      
      <MetricDisplay
        label="Total General"
        value={155}
        metricType="count"
        variant="primary"
        changePercentage={3.8}
        period="Esta semana"
        icon={<Icon name="bar-chart" size="sm" variant="primary" />}
      />
    </div>
  ),
}

// Threshold-based automatic variants
export const AutomaticThresholds: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Good performance - will show as success */}
      <MetricDisplay
        label="Eficiencia Excelente"
        value={95}
        metricType="percentage"
        threshold={{ good: 80, warning: 60, critical: 40 }}
        changePercentage={2.1}
        period="Esta semana"
        icon={<Icon name="trending-up" size="sm" variant="success" />}
      />
      
      {/* Warning performance - will show as warning */}
      <MetricDisplay
        label="Eficiencia Regular"
        value={65}
        metricType="percentage"
        threshold={{ good: 80, warning: 60, critical: 40 }}
        changePercentage={-5.3}
        period="Esta semana"
        icon={<Icon name="alert-triangle" size="sm" variant="warning" />}
      />
      
      {/* Critical performance - will show as danger */}
      <MetricDisplay
        label="Eficiencia Crítica"
        value={35}
        metricType="percentage"
        threshold={{ good: 80, warning: 60, critical: 40 }}
        changePercentage={-12.8}
        period="Esta semana"
        icon={<Icon name="trending-down" size="sm" variant="danger" />}
      />
    </div>
  ),
}

// Interactive metrics
export const Interactive: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <MetricDisplay
        label="Presupuesto del Proyecto"
        value={2450000}
        metricType="currency"
        unit="CLP"
        target={3000000}
        showProgress
        changePercentage={-2.1}
        period="Último mes"
        icon={<Icon name="calculator" size="sm" variant="primary" />}
        interactive
        onClick={() => alert('Navegando a detalles del presupuesto...')}
        description="Haz clic para ver desglose detallado"
      />
      
      <MetricDisplay
        label="Calidad Promedio"
        value={8.7}
        metricType="score"
        unit="/10"
        changePercentage={3.2}
        period="Último mes"
        icon={<Icon name="shield-check" size="sm" variant="success" />}
        interactive
        onClick={() => alert('Abriendo reportes de calidad...')}
        threshold={{ good: 8, warning: 6, critical: 4 }}
        description="Haz clic para ver inspecciones detalladas"
      />
    </div>
  ),
}

// Compact layout for dashboards
export const CompactLayout: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-5xl">
      <MetricDisplay
        label="Completados"
        value={145}
        metricType="count"
        changePercentage={8.5}
        compact
        icon={<Icon name="check-circle" size="xs" variant="success" />}
      />
      
      <MetricDisplay
        label="En Progreso"
        value={23}
        metricType="count"
        changePercentage={-2.1}
        compact
        icon={<Icon name="timer" size="xs" variant="primary" />}
      />
      
      <MetricDisplay
        label="Eficiencia"
        value={94.2}
        metricType="percentage"
        changePercentage={1.8}
        compact
        threshold={{ good: 90, warning: 80, critical: 70 }}
        icon={<Icon name="trending-up" size="xs" variant="success" />}
      />
      
      <MetricDisplay
        label="Calidad"
        value={8.7}
        metricType="score"
        changePercentage={3.2}
        compact
        threshold={{ good: 8, warning: 6, critical: 4 }}
        icon={<Icon name="shield-check" size="xs" variant="success" />}
      />
      
      <MetricDisplay
        label="Costos"
        value={87.3}
        metricType="percentage"
        changePercentage={-1.2}
        compact
        icon={<Icon name="calculator" size="xs" variant="primary" />}
      />
      
      <MetricDisplay
        label="Material"
        value={180.25}
        metricType="volume"
        unit="m³"
        changePercentage={15.3}
        compact
        icon={<Icon name="package" size="xs" variant="secondary" />}
      />
    </div>
  ),
}

// Construction dashboard simulation
export const ConstructionDashboard: Story = {
  render: () => (
    <div className="space-y-6 max-w-7xl">
      {/* Main KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">KPIs Principales del Proyecto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricDisplay
            label="Progreso General"
            value={73.5}
            metricType="percentage"
            target={100}
            showProgress
            changePercentage={5.2}
            period="Esta semana"
            icon={<Icon name="bar-chart" size="sm" variant="primary" />}
            threshold={{ good: 70, warning: 50, critical: 30 }}
            interactive
            onClick={() => alert('Ver detalles de progreso')}
          />
          
          <MetricDisplay
            label="Presupuesto Utilizado"
            value={2450000}
            metricType="currency"
            unit="CLP"
            target={3000000}
            showProgress
            changePercentage={-2.1}
            period="Último mes"
            icon={<Icon name="calculator" size="sm" variant="primary" />}
            interactive
            onClick={() => alert('Ver detalles financieros')}
          />
          
          <MetricDisplay
            label="Índice de Calidad"
            value={8.7}
            metricType="score"
            unit="/10"
            changePercentage={3.2}
            period="Último mes"
            icon={<Icon name="shield-check" size="sm" variant="success" />}
            threshold={{ good: 8, warning: 6, critical: 4 }}
            interactive
            onClick={() => alert('Ver reportes de calidad')}
          />
          
          <MetricDisplay
            label="Eficiencia Material"
            value={94.2}
            metricType="percentage"
            changePercentage={1.8}
            period="Esta semana"
            icon={<Icon name="package-check" size="sm" variant="success" />}
            threshold={{ good: 90, warning: 80, critical: 70 }}
            interactive
            onClick={() => alert('Ver inventario de materiales')}
          />
        </div>
      </div>
      
      {/* Secondary metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Métricas Operacionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricDisplay
            label="Trabajadores Activos"
            value={28}
            metricType="count"
            unit="personas"
            change={3}
            previousValue={25}
            period="Hoy"
            icon={<Icon name="users" size="sm" variant="primary" />}
          />
          
          <MetricDisplay
            label="Tiempo Promedio por Faena"
            value={2.5}
            metricType="duration"
            unit="días"
            changePercentage={-12.5}
            period="Última semana"
            icon={<Icon name="timer" size="sm" variant="success" />}
            description="Reducción indica mayor eficiencia"
          />
          
          <MetricDisplay
            label="Área Completada"
            value={1250.5}
            metricType="area"
            unit="m²"
            changePercentage={15.3}
            period="Este mes"
            icon={<Icon name="ruler" size="sm" variant="primary" />}
          />
        </div>
      </div>
    </div>
  ),
}

// Mobile dashboard layout
export const MobileDashboard: Story = {
  render: () => (
    <div className="max-w-sm mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 mb-4">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <p className="text-primary-100 text-sm">Proyecto Las Torres</p>
      </div>
      
      {/* Main metrics */}
      <div className="px-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricDisplay
            label="Progreso"
            value={73.5}
            metricType="percentage"
            changePercentage={5.2}
            compact
            icon={<Icon name="bar-chart" size="xs" variant="primary" />}
            interactive
            onClick={() => alert('Ver progreso')}
          />
          
          <MetricDisplay
            label="Calidad"
            value={8.7}
            metricType="score"
            changePercentage={3.2}
            compact
            threshold={{ good: 8, warning: 6, critical: 4 }}
            icon={<Icon name="shield-check" size="xs" variant="success" />}
            interactive
            onClick={() => alert('Ver calidad')}
          />
        </div>
        
        <MetricDisplay
          label="Presupuesto Utilizado"
          value={2450000}
          metricType="currency"
          unit="CLP"
          target={3000000}
          showProgress
          changePercentage={-2.1}
          period="Último mes"
          icon={<Icon name="calculator" size="sm" variant="primary" />}
          interactive
          onClick={() => alert('Ver presupuesto detallado')}
        />
        
        <div className="grid grid-cols-2 gap-3">
          <MetricDisplay
            label="Trabajos OK"
            value={145}
            metricType="count"
            changePercentage={8.5}
            compact
            icon={<Icon name="check-circle" size="xs" variant="success" />}
            interactive
            onClick={() => alert('Ver trabajos')}
          />
          
          <MetricDisplay
            label="Pendientes"
            value={8}
            metricType="count"
            changePercentage={-15.5}
            compact
            icon={<Icon name="clock" size="xs" variant="warning" />}
            interactive
            onClick={() => alert('Ver pendientes')}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
}