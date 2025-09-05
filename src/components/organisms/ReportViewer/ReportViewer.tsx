'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { MetricDisplay } from '@/components/molecules/MetricDisplay'
import { StatusCard } from '@/components/molecules/StatusCard'
import { FilterDropdown, type FilterOption } from '@/components/molecules/FilterDropdown'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Badge } from '@/components/atoms/Badge'
import { Loading } from '@/components/atoms/Loading'
import { ProgressBar } from '@/components/atoms/ProgressBar'

const reportViewerVariants = cva(
  'bg-white rounded-lg border border-secondary-200 shadow-sm',
  {
    variants: {
      variant: {
        default: 'p-6',
        compact: 'p-4',
        full: 'p-8',
      },
      layout: {
        dashboard: 'grid gap-6',
        report: 'flex flex-col space-y-6',
        analytics: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'dashboard',
    },
  }
)

// Report data interfaces
export interface ReportMetric {
  id: string
  title: string
  value: number
  target?: number
  previousValue?: number
  format: 'currency' | 'percentage' | 'count' | 'score'
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  color?: 'success' | 'warning' | 'danger' | 'primary' | 'info'
  description?: string
}

export interface ReportDataPoint {
  date: Date
  value: number
  label?: string
  category?: string
}

export interface ReportChart {
  id: string
  title: string
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter'
  data: ReportDataPoint[]
  xAxis?: string
  yAxis?: string
  categories?: string[]
  colors?: string[]
}

export interface QualityReport {
  id: string
  projectId: string
  projectName: string
  inspector: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  inspectionDate: Date
  areas: Array<{
    id: string
    name: string
    score: number
    maxScore: number
    status: 'approved' | 'rejected' | 'conditional'
    observations?: string
    photos?: string[]
  }>
  overallScore: number
  overallStatus: 'approved' | 'rejected' | 'conditional'
  nextInspectionDate?: Date
  correctionsDue?: Date
  recommendations?: string[]
  certifications?: Array<{
    type: string
    status: 'valid' | 'expired' | 'pending'
    expiryDate?: Date
  }>
}

export interface SafetyReport {
  id: string
  projectId: string
  projectName: string
  reportDate: Date
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  metrics: {
    daysWithoutIncident: number
    totalIncidents: number
    nearMisses: number
    safetyTrainingHours: number
    equipmentInspections: number
    safetyScore: number
  }
  incidents: Array<{
    id: string
    type: 'minor' | 'major' | 'critical' | 'near_miss'
    description: string
    location: string
    date: Date
    involvedPersonnel: string[]
    correctionActions: string[]
    status: 'open' | 'in_progress' | 'resolved'
  }>
  recommendations: string[]
  nextReviewDate: Date
}

export interface ProgressReport {
  id: string
  projectId: string
  projectName: string
  reportDate: Date
  period: 'weekly' | 'monthly'
  phases: Array<{
    id: string
    name: string
    plannedProgress: number
    actualProgress: number
    status: 'ahead' | 'on_track' | 'behind' | 'critical'
    milestones: Array<{
      name: string
      plannedDate: Date
      actualDate?: Date
      status: 'completed' | 'in_progress' | 'delayed'
    }>
  }>
  budget: {
    totalBudget: number
    spentAmount: number
    commitedAmount: number
    projectedSpend: number
    variance: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  }
  resources: {
    workers: {
      planned: number
      actual: number
      productivity: number
    }
    materials: {
      deliveredOnTime: number
      totalDeliveries: number
      criticalShortages: number
    }
    equipment: {
      utilization: number
      downtime: number
      maintenanceOverdue: number
    }
  }
}

export interface BudgetReport {
  id: string
  projectId: string
  projectName: string
  reportDate: Date
  period: 'monthly' | 'quarterly'
  categories: Array<{
    id: string
    name: string
    budgeted: number
    spent: number
    committed: number
    remaining: number
    variance: number
    forecastToComplete: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  }>
  cashFlow: {
    inflow: ReportDataPoint[]
    outflow: ReportDataPoint[]
    netCashFlow: ReportDataPoint[]
  }
  payments: {
    pending: number
    overdue: number
    total: number
    averagePaymentDelay: number
  }
  changeOrders: Array<{
    id: string
    description: string
    amount: number
    status: 'pending' | 'approved' | 'rejected'
    date: Date
    impact: string
  }>
}

export interface ReportData {
  id: string
  title: string
  type: 'progress' | 'budget' | 'quality' | 'safety' | 'analytics'
  project?: {
    id: string
    name: string
    code: string
  }
  dateRange: {
    from: Date
    to: Date
  }
  generatedDate: Date
  generatedBy: {
    id: string
    name: string
    role: string
  }
  metrics: ReportMetric[]
  charts?: ReportChart[]
  
  // Specific report data
  progressData?: ProgressReport
  budgetData?: BudgetReport
  qualityData?: QualityReport
  safetyData?: SafetyReport
  
  // Export configuration
  exportFormats: Array<'pdf' | 'excel' | 'csv' | 'json'>
  scheduledDelivery?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    recipients: string[]
    nextDelivery: Date
  }
}

// Filter configurations
export interface ReportFilter {
  projects?: string[]
  dateRange?: { from: Date; to: Date }
  reportTypes?: string[]
  status?: string[]
  priority?: string[]
  department?: string[]
  role?: string[]
}

export interface ReportViewerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof reportViewerVariants> {
  // Report data
  report?: ReportData
  reports?: ReportData[]
  
  // Display configuration
  showFilters?: boolean
  showExportOptions?: boolean
  showMetrics?: boolean
  showCharts?: boolean
  showComparisons?: boolean
  showRecommendations?: boolean
  
  // Filter configuration
  availableProjects?: Array<{ id: string; name: string; code: string }>
  availableReportTypes?: Array<{ id: string; name: string; description?: string }>
  defaultFilters?: ReportFilter
  onFiltersChange?: (filters: ReportFilter) => void
  
  // Actions
  onGenerateReport?: (config: any) => void
  onExportReport?: (format: 'pdf' | 'excel' | 'csv' | 'json', reportId: string) => void
  onScheduleReport?: (config: any) => void
  onShareReport?: (reportId: string, recipients: string[]) => void
  onPrintReport?: (reportId: string) => void
  
  // Chart interactions
  onChartClick?: (chartId: string, dataPoint: ReportDataPoint) => void
  onMetricClick?: (metric: ReportMetric) => void
  onDrillDown?: (dimension: string, value: string) => void
  
  // Loading states
  isGenerating?: boolean
  isExporting?: boolean
  isLoading?: boolean
  
  // User context
  userRole?: 'GERENCIA' | 'JEFE_TERRENO' | 'CONTROL_CALIDAD' | 'OFICINA_TECNICA' | 'BODEGA'
  userPermissions?: string[]
  
  // Display preferences
  compactView?: boolean
  showAdvancedAnalytics?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

const ReportViewer = React.forwardRef<HTMLDivElement, ReportViewerProps>(
  (
    {
      className,
      variant,
      layout,
      report,
      reports,
      showFilters = true,
      showExportOptions = true,
      showMetrics = true,
      showCharts = true,
      showComparisons = false,
      showRecommendations = true,
      availableProjects = [],
      availableReportTypes = [],
      defaultFilters,
      onFiltersChange,
      onGenerateReport,
      onExportReport,
      onScheduleReport,
      onShareReport,
      onPrintReport,
      onChartClick,
      onMetricClick,
      onDrillDown,
      isGenerating = false,
      isExporting = false,
      isLoading = false,
      userRole = 'JEFE_TERRENO',
      userPermissions = [],
      compactView = false,
      showAdvancedAnalytics = false,
      autoRefresh = false,
      refreshInterval = 5,
      ...props
    },
    ref
  ) => {
    const [activeFilters, setActiveFilters] = React.useState<ReportFilter>(defaultFilters || {})
    const [selectedChart, setSelectedChart] = React.useState<string | null>(null)
    const [chartFullScreen, setChartFullScreen] = React.useState(false)
    const [exportMenuOpen, setExportMenuOpen] = React.useState(false)
    const [generatingReport, setGeneratingReport] = React.useState(false)
    const [autoRefreshEnabled, setAutoRefreshEnabled] = React.useState(autoRefresh)

    // Auto-refresh functionality
    React.useEffect(() => {
      if (!autoRefreshEnabled || !refreshInterval) return

      const interval = setInterval(() => {
        // Trigger data refresh
        console.log('Auto-refreshing report data...')
      }, refreshInterval * 60 * 1000)

      return () => clearInterval(interval)
    }, [autoRefreshEnabled, refreshInterval])

    // Handle filter changes
    const handleFilterChange = (filterType: keyof ReportFilter, value: any) => {
      const newFilters = { ...activeFilters, [filterType]: value }
      setActiveFilters(newFilters)
      onFiltersChange?.(newFilters)
    }

    // Handle export
    const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
      if (!report) return
      
      setExportMenuOpen(false)
      await onExportReport?.(format, report.id)
    }

    // Handle generate new report
    const handleGenerateReport = async () => {
      setGeneratingReport(true)
      try {
        await onGenerateReport?.({
          filters: activeFilters,
          userRole,
          timestamp: new Date()
        })
      } finally {
        setGeneratingReport(false)
      }
    }

    // Get role-based report types
    const getAvailableReportTypes = (): FilterOption[] => {
      const baseTypes = [
        { value: 'progress', label: 'Progreso de Obra', icon: 'trending-up' },
        { value: 'budget', label: 'Análisis Presupuestario', icon: 'dollar-sign' },
        { value: 'quality', label: 'Control de Calidad', icon: 'shield-check' },
        { value: 'safety', label: 'Seguridad', icon: 'hard-hat' },
        { value: 'analytics', label: 'Análisis Avanzado', icon: 'bar-chart' },
      ]

      // Filter based on user role
      switch (userRole) {
        case 'GERENCIA':
          return baseTypes // All reports
        case 'JEFE_TERRENO':
          return baseTypes.filter(t => ['progress', 'quality', 'safety'].includes(t.value))
        case 'CONTROL_CALIDAD':
          return baseTypes.filter(t => ['quality', 'safety'].includes(t.value))
        case 'OFICINA_TECNICA':
          return baseTypes.filter(t => ['progress', 'budget', 'analytics'].includes(t.value))
        case 'BODEGA':
          return baseTypes.filter(t => ['progress'].includes(t.value))
        default:
          return baseTypes.slice(0, 2)
      }
    }

    // Get project filter options
    const projectOptions: FilterOption[] = availableProjects.map(project => ({
      value: project.id,
      label: `${project.code} - ${project.name}`,
      icon: 'folder'
    }))

    // Date range filter options
    const dateRangeOptions: FilterOption[] = [
      { value: 'today', label: 'Hoy', icon: 'calendar' },
      { value: 'week', label: 'Esta Semana', icon: 'calendar' },
      { value: 'month', label: 'Este Mes', icon: 'calendar' },
      { value: 'quarter', label: 'Este Trimestre', icon: 'calendar' },
      { value: 'year', label: 'Este Año', icon: 'calendar' },
      { value: 'custom', label: 'Personalizado', icon: 'calendar' },
    ]

    if (isLoading) {
      return (
        <div
          className={cn(
            reportViewerVariants({ variant, layout }),
            'animate-pulse',
            className
          )}
        >
          <div className="space-y-6">
            <div className="h-8 bg-secondary-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-secondary-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-secondary-200 rounded"></div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(reportViewerVariants({ variant, layout }), className)}
        {...props}
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Typography variant="h4" className="font-bold">
                {report?.title || 'Informes de Construcción'}
              </Typography>
              {report && (
                <Badge
                  variant={
                    report.type === 'progress' ? 'primary' :
                    report.type === 'budget' ? 'success' :
                    report.type === 'quality' ? 'warning' :
                    report.type === 'safety' ? 'danger' : 'secondary'
                  }
                  icon={
                    report.type === 'progress' ? 'trending-up' :
                    report.type === 'budget' ? 'dollar-sign' :
                    report.type === 'quality' ? 'shield-check' :
                    report.type === 'safety' ? 'hard-hat' : 'bar-chart'
                  }
                >
                  {report.type === 'progress' ? 'Progreso' :
                   report.type === 'budget' ? 'Presupuesto' :
                   report.type === 'quality' ? 'Calidad' :
                   report.type === 'safety' ? 'Seguridad' : 'Análisis'}
                </Badge>
              )}
            </div>
            
            {report && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                {report.project && (
                  <span className="flex items-center gap-1">
                    <Icon name="folder" size="xs" />
                    {report.project.code} - {report.project.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Icon name="calendar" size="xs" />
                  {report.dateRange.from.toLocaleDateString()} - {report.dateRange.to.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="user" size="xs" />
                  Generado por {report.generatedBy.name}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="clock" size="xs" />
                  {report.generatedDate.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Auto-refresh toggle */}
            <Button
              variant={autoRefreshEnabled ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              leftIcon={<Icon name="refresh-cw" size="xs" className={autoRefreshEnabled ? 'animate-spin' : ''} />}
              title={`Auto-actualización ${autoRefreshEnabled ? 'activa' : 'inactiva'}`}
            >
              {!compactView && (autoRefreshEnabled ? 'Detener' : 'Auto')}
            </Button>
            
            {/* Generate new report */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateReport}
              disabled={generatingReport}
              leftIcon={<Icon name="plus" size="xs" />}
            >
              {generatingReport ? <Loading size="xs" /> : (!compactView && 'Generar')}
            </Button>
            
            {/* Export options */}
            {showExportOptions && report && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  leftIcon={<Icon name="download" size="xs" />}
                  disabled={isExporting}
                >
                  {isExporting ? <Loading size="xs" /> : (!compactView && 'Exportar')}
                </Button>
                
                {exportMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg z-50 py-1 min-w-[140px]">
                    {report.exportFormats.map((format) => (
                      <button
                        key={format}
                        onClick={() => handleExport(format)}
                        className="w-full text-left px-3 py-2 hover:bg-secondary-50 flex items-center gap-2 text-sm"
                      >
                        <Icon 
                          name={
                            format === 'pdf' ? 'file-text' :
                            format === 'excel' ? 'file-spreadsheet' :
                            format === 'csv' ? 'file' : 'code'
                          } 
                          size="xs" 
                        />
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Additional actions */}
            {report && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPrintReport?.(report.id)}
                  leftIcon={<Icon name="printer" size="xs" />}
                >
                  {!compactView && 'Imprimir'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShareReport?.(report.id, [])}
                  leftIcon={<Icon name="share" size="xs" />}
                >
                  {!compactView && 'Compartir'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-6 p-4 bg-secondary-25 rounded-lg border border-secondary-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FilterDropdown
                label="Proyectos"
                options={projectOptions}
                value={activeFilters.projects || []}
                onValueChange={(value) => handleFilterChange('projects', value)}
                multiple
                placeholder="Seleccionar proyectos"
                icon="folder"
              />
              
              <FilterDropdown
                label="Tipo de Informe"
                options={getAvailableReportTypes()}
                value={activeFilters.reportTypes || []}
                onValueChange={(value) => handleFilterChange('reportTypes', value)}
                multiple
                placeholder="Seleccionar tipos"
                icon="bar-chart"
              />
              
              <FilterDropdown
                label="Período"
                options={dateRangeOptions}
                value={activeFilters.dateRange ? ['custom'] : []}
                onValueChange={(value) => {
                  // Handle date range selection
                  console.log('Date range selected:', value)
                }}
                placeholder="Seleccionar período"
                icon="calendar"
              />
              
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveFilters({})
                    onFiltersChange?.({})
                  }}
                  leftIcon={<Icon name="x" size="xs" />}
                  className="w-full justify-center"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>
        )}

        {!report ? (
          // No report selected state
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="bar-chart" size="lg" className="text-secondary-400" />
            </div>
            <Typography variant="h6" className="font-semibold mb-2">
              No hay informes para mostrar
            </Typography>
            <Typography variant="body-default" color="muted" className="mb-4">
              Selecciona los filtros y genera un nuevo informe para comenzar
            </Typography>
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              disabled={generatingReport}
              leftIcon={<Icon name="plus" size="xs" />}
            >
              {generatingReport ? <Loading size="sm" /> : 'Generar Informe'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            {showMetrics && report.metrics.length > 0 && (
              <div>
                <Typography variant="h6" className="font-semibold mb-4">
                  Métricas Clave
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {report.metrics.map((metric) => (
                    <MetricDisplay
                      key={metric.id}
                      title={metric.title}
                      value={metric.value}
                      target={metric.target}
                      previousValue={metric.previousValue}
                      format={metric.format}
                      unit={metric.unit}
                      trend={metric.trend}
                      color={metric.color}
                      size={compactView ? 'sm' : 'default'}
                      onClick={() => onMetricClick?.(metric)}
                      interactive
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Report-specific content */}
            {report.type === 'progress' && report.progressData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Typography variant="h6" className="font-semibold">
                    Progreso por Fases
                  </Typography>
                </div>
                
                <div className="space-y-4">
                  {report.progressData.phases.map((phase) => (
                    <div key={phase.id} className="p-4 border border-secondary-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Typography variant="body-default" className="font-medium">
                          {phase.name}
                        </Typography>
                        <StatusCard
                          status={{
                            value: phase.status === 'ahead' ? 'Adelantado' :
                                   phase.status === 'on_track' ? 'En Tiempo' :
                                   phase.status === 'behind' ? 'Atrasado' : 'Crítico',
                            variant: phase.status === 'ahead' ? 'success' :
                                   phase.status === 'on_track' ? 'primary' :
                                   phase.status === 'behind' ? 'warning' : 'danger'
                          }}
                          size="sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso Planificado:</span>
                          <span className="font-medium">{phase.plannedProgress}%</span>
                        </div>
                        <ProgressBar
                          progress={phase.plannedProgress}
                          variant="secondary"
                          size="sm"
                          showLabel={false}
                        />
                        
                        <div className="flex justify-between text-sm">
                          <span>Progreso Real:</span>
                          <span className={cn(
                            'font-medium',
                            phase.actualProgress >= phase.plannedProgress ? 'text-green-600' : 'text-red-600'
                          )}>
                            {phase.actualProgress}%
                          </span>
                        </div>
                        <ProgressBar
                          progress={phase.actualProgress}
                          variant={phase.actualProgress >= phase.plannedProgress ? 'success' : 'danger'}
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quality report specific content */}
            {report.type === 'quality' && report.qualityData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Typography variant="h6" className="font-semibold">
                    Inspección de Calidad
                  </Typography>
                  <Badge
                    variant={
                      report.qualityData.overallStatus === 'approved' ? 'success' :
                      report.qualityData.overallStatus === 'conditional' ? 'warning' : 'danger'
                    }
                    icon={
                      report.qualityData.overallStatus === 'approved' ? 'check-circle' :
                      report.qualityData.overallStatus === 'conditional' ? 'alert-circle' : 'x-circle'
                    }
                  >
                    {report.qualityData.overallStatus === 'approved' ? 'Aprobado' :
                     report.qualityData.overallStatus === 'conditional' ? 'Condicional' : 'Rechazado'}
                  </Badge>
                </div>
                
                {/* Inspector info */}
                <div className="p-4 bg-secondary-25 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="label-default" className="font-semibold">
                        Inspector: {report.qualityData.inspector.name}
                      </Typography>
                      <Typography variant="caption" color="muted">
                        {report.qualityData.inspector.role} • {report.qualityData.inspectionDate.toLocaleDateString()}
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography variant="h5" className="font-bold">
                        {report.qualityData.overallScore}
                      </Typography>
                      <Typography variant="caption" color="muted">
                        Score General
                      </Typography>
                    </div>
                  </div>
                </div>
                
                {/* Areas inspection */}
                <div className="space-y-3">
                  <Typography variant="body-default" className="font-medium">
                    Áreas Inspeccionadas
                  </Typography>
                  {report.qualityData.areas.map((area) => (
                    <div key={area.id} className="p-3 border border-secondary-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Typography variant="body-small" className="font-medium">
                          {area.name}
                        </Typography>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {area.score}/{area.maxScore}
                          </span>
                          <StatusCard
                            status={{
                              value: area.status === 'approved' ? 'Aprobado' :
                                     area.status === 'conditional' ? 'Condicional' : 'Rechazado',
                              variant: area.status === 'approved' ? 'success' :
                                      area.status === 'conditional' ? 'warning' : 'danger'
                            }}
                            size="sm"
                          />
                        </div>
                      </div>
                      {area.observations && (
                        <Typography variant="caption" color="muted" className="block mt-2">
                          {area.observations}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {showRecommendations && (report.qualityData?.recommendations || report.safetyData?.recommendations) && (
              <div className="p-4 bg-warning-25 border border-warning-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="lightbulb" size="sm" className="text-warning-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <Typography variant="label-default" className="font-semibold text-warning-800 mb-2">
                      Recomendaciones
                    </Typography>
                    <ul className="space-y-1">
                      {(report.qualityData?.recommendations || report.safetyData?.recommendations || []).map((rec, index) => (
                        <li key={index} className="text-sm text-warning-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-warning-600 rounded-full mt-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Click outside to close export menu */}
        {exportMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setExportMenuOpen(false)}
          />
        )}
      </div>
    )
  }
)

ReportViewer.displayName = 'ReportViewer'

export { ReportViewer, reportViewerVariants }
export type { 
  ReportData, 
  ReportMetric, 
  ReportChart, 
  QualityReport, 
  SafetyReport, 
  ProgressReport, 
  BudgetReport,
  ReportFilter 
}