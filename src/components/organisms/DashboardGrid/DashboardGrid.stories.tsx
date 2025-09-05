'use client'

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DashboardGrid } from './DashboardGrid'
import type { DashboardProject, DashboardMetric } from './DashboardGrid'

const meta: Meta<typeof DashboardGrid> = {
  title: 'Construction/Organisms/DashboardGrid',
  component: DashboardGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Executive construction project overview dashboard with real-time metrics, project status, and alerts.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-secondary-50 p-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['executive', 'manager', 'compact'],
      description: 'Dashboard layout variant',
    },
    layout: {
      control: { type: 'select' },
      options: ['default', 'dense', 'loose'],
      description: 'Spacing layout',
    },
    projectsView: {
      control: { type: 'select' },
      options: ['cards', 'table', 'timeline'],
      description: 'Projects display format',
    },
    metricsColumns: {
      control: { type: 'select' },
      options: [2, 3, 4, 6],
      description: 'Number of metric columns',
    },
    showMetrics: {
      control: { type: 'boolean' },
      description: 'Show metrics section',
    },
    showProjects: {
      control: { type: 'boolean' },
      description: 'Show projects section',
    },
    showAlerts: {
      control: { type: 'boolean' },
      description: 'Show alerts section',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    autoRefresh: {
      control: { type: 'boolean' },
      description: 'Auto-refresh data',
    },
  },
}

export default meta
type Story = StoryObj<typeof DashboardGrid>

// Sample project data
const sampleProjects: DashboardProject[] = [
  {
    id: 'p1',
    name: 'Torres del Mar - Complejo Residencial Premium',
    code: 'TDM-2024',
    status: 'ACTIVE',
    progress: 68,
    timeline: {
      startDate: new Date('2024-01-15'),
      endDate: new Date('2025-03-30'),
    },
    budget: {
      total: 45000000,
      spent: 28500000,
      remaining: 16500000,
    },
    team: {
      total: 85,
      active: 78,
      available: 7,
    },
    quality: {
      score: 92,
      inspections: 156,
      approved: 144,
      pending: 12,
    },
    safety: {
      incidentCount: 2,
      daysWithoutIncident: 45,
    },
    location: 'Viña del Mar',
    manager: 'Carlos Mendoza',
    priority: 'HIGH',
    alerts: [
      {
        type: 'TIMELINE',
        message: 'Posible retraso en entrega de materiales para próxima semana',
        severity: 'WARNING',
      },
      {
        type: 'BUDGET',
        message: 'Consumo presupuestario por encima de lo planificado en 5%',
        severity: 'WARNING',
      },
    ],
  },
  {
    id: 'p2',
    name: 'Residencial Los Aromos - Casas Unifamiliares',
    code: 'RLA-2024',
    status: 'ACTIVE',
    progress: 42,
    timeline: {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-15'),
    },
    budget: {
      total: 18500000,
      spent: 7200000,
      remaining: 11300000,
    },
    team: {
      total: 32,
      active: 30,
      available: 2,
    },
    quality: {
      score: 88,
      inspections: 64,
      approved: 58,
      pending: 6,
    },
    safety: {
      incidentCount: 0,
      daysWithoutIncident: 128,
    },
    location: 'La Serena',
    manager: 'Ana Rodriguez',
    priority: 'MEDIUM',
  },
  {
    id: 'p3',
    name: 'Comercial Plaza Norte - Centro Comercial',
    code: 'CPN-2024',
    status: 'COMPLETED',
    progress: 100,
    timeline: {
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-02-28'),
      completedDate: new Date('2024-02-25'),
    },
    budget: {
      total: 65000000,
      spent: 63800000,
      remaining: 1200000,
    },
    team: {
      total: 0,
      active: 0,
      available: 0,
    },
    quality: {
      score: 96,
      inspections: 248,
      approved: 248,
      pending: 0,
    },
    safety: {
      incidentCount: 1,
      daysWithoutIncident: 0,
    },
    location: 'Santiago',
    manager: 'Ricardo Silva',
    priority: 'LOW',
  },
  {
    id: 'p4',
    name: 'Industrial MetalTech - Planta Procesamiento',
    code: 'IMT-2024',
    status: 'ACTIVE',
    progress: 85,
    timeline: {
      startDate: new Date('2023-10-15'),
      endDate: new Date('2024-08-30'),
    },
    budget: {
      total: 82000000,
      spent: 69700000,
      remaining: 12300000,
    },
    team: {
      total: 156,
      active: 145,
      available: 11,
    },
    quality: {
      score: 94,
      inspections: 312,
      approved: 298,
      pending: 14,
    },
    safety: {
      incidentCount: 3,
      daysWithoutIncident: 12,
    },
    location: 'Antofagasta',
    manager: 'Laura Martinez',
    priority: 'CRITICAL',
    alerts: [
      {
        type: 'SAFETY',
        message: 'Incidente de seguridad reportado - requiere investigación',
        severity: 'ERROR',
      },
      {
        type: 'QUALITY',
        message: 'Inspección crítica pendiente para equipos especializados',
        severity: 'WARNING',
      },
    ],
  },
  {
    id: 'p5',
    name: 'Infraestructura Vial - Autopista Norte',
    code: 'IVA-2024',
    status: 'ON_HOLD',
    progress: 28,
    timeline: {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-06-30'),
    },
    budget: {
      total: 120000000,
      spent: 32400000,
      remaining: 87600000,
    },
    team: {
      total: 45,
      active: 8,
      available: 37,
    },
    quality: {
      score: 75,
      inspections: 89,
      approved: 67,
      pending: 22,
    },
    safety: {
      incidentCount: 0,
      daysWithoutIncident: 89,
    },
    location: 'Valparaíso',
    manager: 'Miguel Torres',
    priority: 'HIGH',
    alerts: [
      {
        type: 'TIMELINE',
        message: 'Proyecto pausado por permisos ambientales pendientes',
        severity: 'ERROR',
      },
      {
        type: 'BUDGET',
        message: 'Presupuesto congelado hasta resolución de permisos',
        severity: 'WARNING',
      },
    ],
  },
  {
    id: 'p6',
    name: 'Residencial Vista Mar - Departamentos',
    code: 'RVM-2024',
    status: 'PLANNING',
    progress: 5,
    timeline: {
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-11-15'),
    },
    budget: {
      total: 28000000,
      spent: 1200000,
      remaining: 26800000,
    },
    team: {
      total: 12,
      active: 8,
      available: 4,
    },
    quality: {
      score: 0,
      inspections: 2,
      approved: 2,
      pending: 0,
    },
    safety: {
      incidentCount: 0,
      daysWithoutIncident: 365,
    },
    location: 'Valparaíso',
    manager: 'Patricia Gonzalez',
    priority: 'MEDIUM',
  },
]

// Sample custom metrics
const sampleMetrics: DashboardMetric[] = [
  {
    id: 'revenue',
    title: 'Ingresos Totales',
    value: 358500000,
    format: 'currency',
    trend: 'up',
    trendValue: 12.5,
    icon: 'trending-up',
    color: 'success',
    description: 'Ingresos acumulados de todos los proyectos',
  },
  {
    id: 'efficiency',
    title: 'Eficiencia Operativa',
    value: 87.3,
    format: 'percentage',
    target: 90,
    trend: 'up',
    trendValue: 3.2,
    icon: 'zap',
    color: 'warning',
    description: 'Eficiencia promedio en entrega de proyectos',
  },
  {
    id: 'safety-score',
    title: 'Índice de Seguridad',
    value: 94.8,
    format: 'number',
    target: 95,
    trend: 'down',
    trendValue: -1.2,
    icon: 'shield-check',
    color: 'info',
    description: 'Índice de seguridad corporativo',
  },
  {
    id: 'client-satisfaction',
    title: 'Satisfacción Cliente',
    value: 4.6,
    target: 4.5,
    unit: '/5',
    trend: 'up',
    trendValue: 0.3,
    icon: 'star',
    color: 'primary',
    description: 'Calificación promedio de satisfacción',
  },
]

// Default dashboard
export const Default: Story = {
  args: {
    projects: sampleProjects,
    metrics: sampleMetrics,
    showMetrics: true,
    showProjects: true,
    showAlerts: true,
    lastUpdate: new Date(),
  },
}

// Executive view with all features
export const ExecutiveView: Story = {
  args: {
    variant: 'executive',
    projects: sampleProjects,
    metrics: sampleMetrics,
    showMetrics: true,
    showProjects: true,
    showAlerts: true,
    executiveMode: true,
    showFinancialSummary: true,
    showPerformanceIndicators: true,
    showRiskAnalysis: true,
    metricsColumns: 4,
    projectsView: 'cards',
    lastUpdate: new Date(),
  },
}

// Manager compact view
export const ManagerCompact: Story = {
  args: {
    variant: 'compact',
    layout: 'dense',
    projects: sampleProjects.slice(0, 4),
    metrics: sampleMetrics.slice(0, 3),
    showMetrics: true,
    showProjects: true,
    showAlerts: true,
    metricsColumns: 3,
    projectsView: 'cards',
    maxProjects: 4,
    lastUpdate: new Date(),
  },
}

// Table view
export const TableView: Story = {
  args: {
    projects: sampleProjects,
    metrics: sampleMetrics,
    showMetrics: true,
    showProjects: true,
    showAlerts: false,
    projectsView: 'table',
    metricsColumns: 4,
    lastUpdate: new Date(),
  },
}

// Loading state
export const LoadingState: Story = {
  args: {
    projects: [],
    metrics: [],
    isLoading: true,
    showMetrics: true,
    showProjects: true,
    showAlerts: true,
  },
}

// Filtered view (only active projects)
export const FilteredView: Story = {
  args: {
    projects: sampleProjects,
    metrics: sampleMetrics,
    filterStatus: ['ACTIVE'],
    showMetrics: true,
    showProjects: true,
    showAlerts: true,
    metricsColumns: 4,
    lastUpdate: new Date(),
  },
}

// Mobile responsive
export const MobileView: Story = {
  args: {
    variant: 'compact',
    projects: sampleProjects.slice(0, 3),
    metrics: sampleMetrics.slice(0, 4),
    showMetrics: true,
    showProjects: true,
    showAlerts: true,
    metricsColumns: 2,
    projectsView: 'cards',
    mobileLayout: 'stack',
    lastUpdate: new Date(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Critical alerts focus
export const CriticalAlerts: Story = {
  args: {
    projects: sampleProjects.filter(p => p.priority === 'CRITICAL' || p.alerts?.some(a => a.severity === 'ERROR')),
    metrics: sampleMetrics,
    showMetrics: false,
    showProjects: true,
    showAlerts: true,
    metricsColumns: 4,
    projectsView: 'cards',
    lastUpdate: new Date(),
  },
}

// Metrics only view
export const MetricsOnly: Story = {
  args: {
    projects: sampleProjects,
    metrics: [
      ...sampleMetrics,
      {
        id: 'projects-on-time',
        title: 'Proyectos a Tiempo',
        value: 75,
        format: 'percentage',
        target: 80,
        trend: 'down',
        trendValue: -5,
        icon: 'clock',
        color: 'warning',
      },
      {
        id: 'cost-variance',
        title: 'Variación de Costos',
        value: -3.2,
        format: 'percentage',
        trend: 'up',
        trendValue: 1.1,
        icon: 'dollar-sign',
        color: 'success',
      },
      {
        id: 'quality-incidents',
        title: 'Incidentes de Calidad',
        value: 8,
        trend: 'down',
        trendValue: -2,
        icon: 'alert-triangle',
        color: 'danger',
      },
      {
        id: 'team-productivity',
        title: 'Productividad Equipos',
        value: 91.2,
        format: 'percentage',
        target: 90,
        trend: 'up',
        trendValue: 4.8,
        icon: 'users',
        color: 'success',
      },
    ],
    showMetrics: true,
    showProjects: false,
    showAlerts: false,
    metricsColumns: 4,
    lastUpdate: new Date(),
  },
}

// Interactive demo
export const InteractiveDemo: Story = {
  args: {
    projects: sampleProjects,
    metrics: sampleMetrics,
    showMetrics: true,
    showProjects: true,
    showAlerts: true,
    autoRefresh: false,
    metricsColumns: 4,
    projectsView: 'cards',
    lastUpdate: new Date(),
  },
  render: function InteractiveDashboardDemo(args) {
    const [projects, setProjects] = React.useState(args.projects || [])
    const [lastUpdate, setLastUpdate] = React.useState(args.lastUpdate || new Date())
    const [isLoading, setIsLoading] = React.useState(false)
    const [projectsView, setProjectsView] = React.useState<'cards' | 'table' | 'timeline'>(args.projectsView || 'cards')
    const [filterStatus, setFilterStatus] = React.useState<string[]>([])
    
    const handleRefresh = async () => {
      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        // Update some random metrics
        setProjects(prev => prev.map(p => ({
          ...p,
          progress: Math.min(100, p.progress + Math.random() * 2),
          quality: {
            ...p.quality,
            score: Math.min(100, p.quality.score + (Math.random() - 0.5) * 4),
          },
          safety: {
            ...p.safety,
            daysWithoutIncident: p.safety.daysWithoutIncident + 1,
          },
        })))
        
        setLastUpdate(new Date())
        setIsLoading(false)
      }, 2000)
    }
    
    const handleProjectClick = (project: DashboardProject) => {
      console.log('Project clicked:', project.name)
      alert(`Navegando a proyecto: ${project.code} - ${project.name}`)
    }
    
    const handleMetricClick = (metric: DashboardMetric) => {
      console.log('Metric clicked:', metric.title)
      alert(`Ver detalles de métrica: ${metric.title}`)
    }
    
    const handleAlertClick = (alert: any, project: DashboardProject) => {
      console.log('Alert clicked:', alert.message)
      alert(`Alerta en ${project.code}: ${alert.message}`)
    }

    return (
      <DashboardGrid
        {...args}
        projects={projects}
        isLoading={isLoading}
        lastUpdate={lastUpdate}
        projectsView={projectsView}
        filterStatus={filterStatus}
        onRefresh={handleRefresh}
        onProjectClick={handleProjectClick}
        onMetricClick={handleMetricClick}
        onAlertClick={handleAlertClick}
        onFilterChange={setFilterStatus}
      />
    )
  },
}