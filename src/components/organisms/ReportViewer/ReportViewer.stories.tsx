import type { Meta, StoryObj } from '@storybook/react'
import { ReportViewer } from './ReportViewer'
import type { ReportData, ReportMetric } from './ReportViewer'

const meta = {
  title: 'Components/Organisms/ReportViewer',
  component: ReportViewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive construction reports and analytics display interface with role-based access, export capabilities, and interactive data visualization for construction project management.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'full'],
      description: 'Visual variant of the report viewer',
    },
    layout: {
      control: { type: 'select' },
      options: ['dashboard', 'report', 'analytics'],
      description: 'Layout configuration for different report types',
    },
    userRole: {
      control: { type: 'select' },
      options: ['GERENCIA', 'JEFE_TERRENO', 'CONTROL_CALIDAD', 'OFICINA_TECNICA', 'BODEGA'],
      description: 'User role for permission-based report access',
    },
    showFilters: {
      control: { type: 'boolean' },
      description: 'Show filter controls',
    },
    showExportOptions: {
      control: { type: 'boolean' },
      description: 'Show export functionality',
    },
    compactView: {
      control: { type: 'boolean' },
      description: 'Use compact display mode',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReportViewer>

export default meta
type Story = StoryObj<typeof meta>

// Sample data for stories
const sampleProgressMetrics: ReportMetric[] = [
  {
    id: 'progress-overall',
    title: 'Progreso General',
    value: 67,
    target: 70,
    previousValue: 62,
    format: 'percentage',
    trend: 'up',
    trendValue: 5,
    color: 'warning',
    description: 'Progreso total del proyecto vs planificado'
  },
  {
    id: 'budget-spent',
    title: 'Presupuesto Gastado',
    value: 1250000000,
    target: 2000000000,
    format: 'currency',
    unit: 'CLP',
    trend: 'stable',
    color: 'success',
    description: 'Gasto acumulado del proyecto'
  },
  {
    id: 'quality-score',
    title: 'Score de Calidad',
    value: 92,
    target: 90,
    previousValue: 88,
    format: 'score',
    trend: 'up',
    trendValue: 4,
    color: 'success',
    description: 'Puntuación promedio de inspecciones'
  },
  {
    id: 'safety-days',
    title: 'Días sin Incidentes',
    value: 45,
    previousValue: 30,
    format: 'count',
    unit: 'días',
    trend: 'up',
    trendValue: 15,
    color: 'success',
    description: 'Días consecutivos sin accidentes'
  },
]

const sampleProgressReport: ReportData = {
  id: 'progress-2024-03-15',
  title: 'Informe de Progreso Semanal',
  type: 'progress',
  project: {
    id: 'proj-residencial-001',
    name: 'Torre Residencial Las Condes',
    code: 'TRC-001'
  },
  dateRange: {
    from: new Date('2024-03-08'),
    to: new Date('2024-03-15')
  },
  generatedDate: new Date('2024-03-15T14:30:00'),
  generatedBy: {
    id: 'user-jefe-001',
    name: 'Carlos Rodriguez',
    role: 'Jefe de Terreno'
  },
  metrics: sampleProgressMetrics,
  exportFormats: ['pdf', 'excel', 'csv'],
  progressData: {
    id: 'progress-data-001',
    projectId: 'proj-residencial-001',
    projectName: 'Torre Residencial Las Condes',
    reportDate: new Date('2024-03-15'),
    period: 'weekly',
    phases: [
      {
        id: 'phase-structure',
        name: 'Estructura Hormigón',
        plannedProgress: 75,
        actualProgress: 67,
        status: 'behind',
        milestones: [
          {
            name: 'Fundaciones Completas',
            plannedDate: new Date('2024-02-15'),
            actualDate: new Date('2024-02-18'),
            status: 'completed'
          },
          {
            name: 'Losa Piso 5',
            plannedDate: new Date('2024-03-10'),
            status: 'delayed'
          }
        ]
      },
      {
        id: 'phase-masonry',
        name: 'Tabiquería y Albañilería',
        plannedProgress: 40,
        actualProgress: 45,
        status: 'ahead',
        milestones: [
          {
            name: 'Tabiques Pisos 1-3',
            plannedDate: new Date('2024-03-20'),
            actualDate: new Date('2024-03-15'),
            status: 'completed'
          }
        ]
      },
      {
        id: 'phase-installations',
        name: 'Instalaciones Técnicas',
        plannedProgress: 25,
        actualProgress: 25,
        status: 'on_track',
        milestones: [
          {
            name: 'Canalización Eléctrica',
            plannedDate: new Date('2024-04-01'),
            status: 'in_progress'
          }
        ]
      }
    ],
    budget: {
      totalBudget: 2000000000,
      spentAmount: 1250000000,
      commitedAmount: 300000000,
      projectedSpend: 1900000000,
      variance: -5,
      riskLevel: 'low'
    },
    resources: {
      workers: {
        planned: 45,
        actual: 42,
        productivity: 87
      },
      materials: {
        deliveredOnTime: 23,
        totalDeliveries: 25,
        criticalShortages: 1
      },
      equipment: {
        utilization: 78,
        downtime: 12,
        maintenanceOverdue: 0
      }
    }
  },
  scheduledDelivery: {
    frequency: 'weekly',
    recipients: ['gerencia@constructora.cl', 'calidad@constructora.cl'],
    nextDelivery: new Date('2024-03-22T09:00:00')
  }
}

const sampleQualityReport: ReportData = {
  id: 'quality-2024-03-15',
  title: 'Informe de Control de Calidad',
  type: 'quality',
  project: {
    id: 'proj-residencial-001',
    name: 'Torre Residencial Las Condes',
    code: 'TRC-001'
  },
  dateRange: {
    from: new Date('2024-03-15'),
    to: new Date('2024-03-15')
  },
  generatedDate: new Date('2024-03-15T16:45:00'),
  generatedBy: {
    id: 'user-quality-001',
    name: 'Ana Morales',
    role: 'Inspector de Calidad'
  },
  metrics: [
    {
      id: 'quality-overall',
      title: 'Score General',
      value: 92,
      target: 90,
      format: 'score',
      color: 'success'
    },
    {
      id: 'inspections-passed',
      title: 'Inspecciones Aprobadas',
      value: 8,
      target: 10,
      format: 'count',
      color: 'warning'
    }
  ],
  exportFormats: ['pdf', 'excel'],
  qualityData: {
    id: 'quality-inspection-001',
    projectId: 'proj-residencial-001',
    projectName: 'Torre Residencial Las Condes',
    inspector: {
      id: 'user-quality-001',
      name: 'Ana Morales',
      role: 'Inspector de Calidad',
      avatar: '/avatars/ana-morales.jpg'
    },
    inspectionDate: new Date('2024-03-15T10:00:00'),
    areas: [
      {
        id: 'area-structure',
        name: 'Estructura de Hormigón - Piso 4',
        score: 95,
        maxScore: 100,
        status: 'approved',
        observations: 'Calidad del hormigón excelente, resistencia según especificación.'
      },
      {
        id: 'area-finishes',
        name: 'Terminaciones - Baños Tipo A',
        score: 88,
        maxScore: 100,
        status: 'conditional',
        observations: 'Algunas juntas de cerámica requieren corrección menor.'
      },
      {
        id: 'area-electrical',
        name: 'Instalación Eléctrica - Panel Principal',
        score: 100,
        maxScore: 100,
        status: 'approved',
        observations: 'Instalación cumple norma SEC completamente.'
      }
    ],
    overallScore: 92,
    overallStatus: 'approved',
    nextInspectionDate: new Date('2024-03-22'),
    correctionsDue: new Date('2024-03-20'),
    recommendations: [
      'Reforzar control de calidad en terminaciones cerámicas',
      'Implementar checklist adicional para juntas y sellados',
      'Capacitar cuadrilla en técnicas de emboquillado'
    ],
    certifications: [
      {
        type: 'SEC Eléctrica',
        status: 'valid',
        expiryDate: new Date('2024-06-15')
      }
    ]
  }
}

const sampleSafetyReport: ReportData = {
  id: 'safety-2024-03-15',
  title: 'Informe de Seguridad Mensual',
  type: 'safety',
  project: {
    id: 'proj-residencial-001',
    name: 'Torre Residencial Las Condes',
    code: 'TRC-001'
  },
  dateRange: {
    from: new Date('2024-02-15'),
    to: new Date('2024-03-15')
  },
  generatedDate: new Date('2024-03-15T17:00:00'),
  generatedBy: {
    id: 'user-safety-001',
    name: 'Miguel Torres',
    role: 'Prevencionista'
  },
  metrics: [
    {
      id: 'safety-score',
      title: 'Score de Seguridad',
      value: 95,
      target: 90,
      format: 'score',
      color: 'success'
    },
    {
      id: 'days-without-incident',
      title: 'Días sin Incidentes',
      value: 45,
      format: 'count',
      unit: 'días',
      color: 'success'
    }
  ],
  exportFormats: ['pdf', 'excel'],
  safetyData: {
    id: 'safety-report-001',
    projectId: 'proj-residencial-001',
    projectName: 'Torre Residencial Las Condes',
    reportDate: new Date('2024-03-15'),
    period: 'monthly',
    metrics: {
      daysWithoutIncident: 45,
      totalIncidents: 0,
      nearMisses: 2,
      safetyTrainingHours: 120,
      equipmentInspections: 25,
      safetyScore: 95
    },
    incidents: [
      {
        id: 'incident-001',
        type: 'near_miss',
        description: 'Material cayó cerca de trabajador en planta baja',
        location: 'Torre A - Planta Baja',
        date: new Date('2024-03-08'),
        involvedPersonnel: ['Juan Pérez - Maestro'],
        correctionActions: [
          'Reforzar señalización de zona de riesgo',
          'Instalar barrera adicional de protección'
        ],
        status: 'resolved'
      }
    ],
    recommendations: [
      'Mantener programa de capacitación semanal',
      'Reforzar inspección diaria de equipos de protección',
      'Implementar sistema de reporte digital de casi accidentes'
    ],
    nextReviewDate: new Date('2024-04-15')
  }
}

const availableProjects = [
  { id: 'proj-001', name: 'Torre Residencial Las Condes', code: 'TRC-001' },
  { id: 'proj-002', name: 'Centro Comercial Plaza Norte', code: 'CPN-002' },
  { id: 'proj-003', name: 'Bodega Industrial Quilicura', code: 'BIQ-003' },
]

// Default story
export const Default: Story = {
  args: {
    variant: 'default',
    layout: 'dashboard',
    showFilters: true,
    showExportOptions: true,
    showMetrics: true,
    showCharts: true,
    availableProjects,
    userRole: 'JEFE_TERRENO',
    compactView: false,
    isLoading: false,
  },
}

// Progress report story
export const ProgressReport: Story = {
  args: {
    ...Default.args,
    report: sampleProgressReport,
    layout: 'report',
    variant: 'full',
    showComparisons: true,
    showRecommendations: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress report showing construction phases, milestones, budget variance, and resource utilization with detailed phase breakdowns.',
      },
    },
  },
}

// Quality report story
export const QualityReport: Story = {
  args: {
    ...Default.args,
    report: sampleQualityReport,
    userRole: 'CONTROL_CALIDAD',
    showFilters: false,
    variant: 'full',
  },
  parameters: {
    docs: {
      description: {
        story: 'Quality control inspection report with area-by-area scoring, inspector details, and recommendations for improvement.',
      },
    },
  },
}

// Safety report story
export const SafetyReport: Story = {
  args: {
    ...Default.args,
    report: sampleSafetyReport,
    userRole: 'JEFE_TERRENO',
    showAdvancedAnalytics: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Safety report tracking incidents, near misses, training hours, and safety metrics with preventive recommendations.',
      },
    },
  },
}

// Management dashboard view
export const ManagementDashboard: Story = {
  args: {
    ...Default.args,
    userRole: 'GERENCIA',
    layout: 'analytics',
    variant: 'full',
    showAdvancedAnalytics: true,
    showComparisons: true,
    autoRefresh: true,
    refreshInterval: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Executive dashboard view with comprehensive analytics, auto-refresh capability, and advanced reporting features for management oversight.',
      },
    },
  },
}

// Compact mobile view
export const CompactMobileView: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
    compactView: true,
    showFilters: false,
    report: {
      ...sampleProgressReport,
      metrics: sampleProgressReport.metrics.slice(0, 2),
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized compact view for field use with essential metrics and touch-friendly interface.',
      },
    },
  },
}

// Loading state
export const LoadingState: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton placeholders while report data is being fetched.',
      },
    },
  },
}

// Empty state
export const EmptyState: Story = {
  args: {
    ...Default.args,
    report: undefined,
    reports: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no reports are available, guiding users to generate their first report.',
      },
    },
  },
}

// Generating report state
export const GeneratingReport: Story = {
  args: {
    ...Default.args,
    isGenerating: true,
    report: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'State shown while a new report is being generated with filters applied.',
      },
    },
  },
}

// Multi-project analytics
export const MultiProjectAnalytics: Story = {
  args: {
    ...Default.args,
    layout: 'analytics',
    variant: 'full',
    userRole: 'GERENCIA',
    report: {
      ...sampleProgressReport,
      title: 'Análisis Comparativo Multi-Proyecto',
      type: 'analytics',
      metrics: [
        ...sampleProgressMetrics,
        {
          id: 'projects-on-time',
          title: 'Proyectos en Tiempo',
          value: 3,
          target: 5,
          format: 'count',
          color: 'warning'
        },
        {
          id: 'total-budget-variance',
          title: 'Varianza Presupuestaria',
          value: -2.5,
          format: 'percentage',
          color: 'success'
        }
      ],
    },
    showAdvancedAnalytics: true,
    showComparisons: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced analytics view for executives comparing multiple projects with comprehensive KPIs and variance analysis.',
      },
    },
  },
}

// Role-based access - Bodega user
export const BodegaUserView: Story = {
  args: {
    ...Default.args,
    userRole: 'BODEGA',
    report: {
      ...sampleProgressReport,
      title: 'Informe de Materiales y Suministros',
      metrics: sampleProgressReport.metrics.filter(m => 
        ['budget-spent'].includes(m.id)
      ),
    },
    showAdvancedAnalytics: false,
    showExportOptions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Warehouse manager view with limited report types focused on materials and supply chain metrics.',
      },
    },
  },
}

// Export functionality demo
export const ExportFunctionality: Story = {
  args: {
    ...Default.args,
    report: sampleProgressReport,
    isExporting: true,
    showExportOptions: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of export functionality with multiple format options (PDF, Excel, CSV, JSON) and loading states.',
      },
    },
  },
}