'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { MetricDisplay } from '@/components/molecules/MetricDisplay'
import { StatusCard } from '@/components/molecules/StatusCard'
import { NotificationCard } from '@/components/molecules/NotificationCard'
import { FilterDropdown } from '@/components/molecules/FilterDropdown'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Loading } from '@/components/atoms/Loading'
import { Badge } from '@/components/atoms/Badge'
import { ProgressBar } from '@/components/atoms/ProgressBar'

const dashboardGridVariants = cva(
  'w-full space-y-6',
  {
    variants: {
      variant: {
        executive: 'max-w-7xl mx-auto',
        manager: 'max-w-6xl mx-auto',
        compact: 'max-w-4xl mx-auto',
      },
      layout: {
        default: '',
        dense: 'space-y-4',
        loose: 'space-y-8',
      },
    },
    defaultVariants: {
      variant: 'executive',
      layout: 'default',
    },
  }
)

// Project status for dashboard overview
export interface DashboardProject {
  id: string
  name: string
  code: string
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  progress: number
  timeline: {
    startDate: Date
    endDate: Date
    completedDate?: Date
  }
  budget: {
    total: number
    spent: number
    remaining: number
  }
  team: {
    total: number
    active: number
    available: number
  }
  quality: {
    score: number
    inspections: number
    approved: number
    pending: number
  }
  safety: {
    incidentCount: number
    lastIncident?: Date
    daysWithoutIncident: number
  }
  location: string
  manager: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  alerts?: Array<{
    type: 'BUDGET' | 'TIMELINE' | 'QUALITY' | 'SAFETY' | 'MATERIAL'
    message: string
    severity: 'INFO' | 'WARNING' | 'ERROR'
  }>
}

// Metric configuration for different dashboard views
export interface DashboardMetric {
  id: string
  title: string
  value: number | string
  target?: number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  format?: 'number' | 'currency' | 'percentage' | 'duration' | 'date'
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
  description?: string
  clickable?: boolean
  onClick?: () => void
}

// Real-time update configuration
export interface DashboardUpdate {
  timestamp: Date
  source: string
  data: Partial<DashboardProject>
}

export interface DashboardGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardGridVariants> {
  // Data
  projects: DashboardProject[]
  metrics: DashboardMetric[]
  
  // Real-time features
  isLoading?: boolean
  lastUpdate?: Date
  updateFrequency?: number // seconds
  onRefresh?: () => void
  autoRefresh?: boolean
  
  // Filtering and sorting
  filterStatus?: string[]
  sortBy?: 'name' | 'progress' | 'priority' | 'timeline' | 'budget'
  sortOrder?: 'asc' | 'desc'
  onFilterChange?: (filters: string[]) => void
  onSortChange?: (sort: string, order: 'asc' | 'desc') => void
  
  // View customization
  showMetrics?: boolean
  showProjects?: boolean
  showAlerts?: boolean
  metricsColumns?: 2 | 3 | 4 | 6
  projectsView?: 'cards' | 'table' | 'timeline'
  
  // Interactions
  onProjectClick?: (project: DashboardProject) => void
  onMetricClick?: (metric: DashboardMetric) => void
  onAlertClick?: (alert: DashboardProject['alerts'][0], project: DashboardProject) => void
  
  // Executive features
  executiveMode?: boolean
  showFinancialSummary?: boolean
  showPerformanceIndicators?: boolean
  showRiskAnalysis?: boolean
  
  // Mobile optimization
  mobileLayout?: 'stack' | 'carousel' | 'accordion'
  maxProjects?: number
}

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  (
    {
      className,
      variant,
      layout,
      projects = [],
      metrics = [],
      isLoading = false,
      lastUpdate,
      updateFrequency = 30,
      onRefresh,
      autoRefresh = false,
      filterStatus = [],
      sortBy = 'priority',
      sortOrder = 'desc',
      onFilterChange,
      onSortChange,
      showMetrics = true,
      showProjects = true,
      showAlerts = true,
      metricsColumns = 4,
      projectsView = 'cards',
      onProjectClick,
      onMetricClick,
      onAlertClick,
      executiveMode = false,
      showFinancialSummary = false,
      showPerformanceIndicators = false,
      showRiskAnalysis = false,
      mobileLayout = 'stack',
      maxProjects,
      ...props
    },
    ref
  ) => {
    const [refreshing, setRefreshing] = React.useState(false)
    const refreshInterval = React.useRef<NodeJS.Timeout>()
    
    // Auto refresh functionality
    React.useEffect(() => {
      if (autoRefresh && onRefresh) {
        refreshInterval.current = setInterval(() => {
          onRefresh()
        }, updateFrequency * 1000)
        
        return () => {
          if (refreshInterval.current) {
            clearInterval(refreshInterval.current)
          }
        }
      }
    }, [autoRefresh, onRefresh, updateFrequency])
    
    // Manual refresh
    const handleRefresh = async () => {
      if (onRefresh && !refreshing) {
        setRefreshing(true)
        await onRefresh()
        setTimeout(() => setRefreshing(false), 1000)
      }
    }
    
    // Filter and sort projects
    const filteredAndSortedProjects = React.useMemo(() => {
      let filtered = projects
      
      if (filterStatus.length > 0) {
        filtered = filtered.filter(p => filterStatus.includes(p.status))
      }
      
      if (maxProjects) {
        filtered = filtered.slice(0, maxProjects)
      }
      
      return filtered.sort((a, b) => {
        let comparison = 0
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'progress':
            comparison = a.progress - b.progress
            break
          case 'priority':
            const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
            break
          case 'timeline':
            comparison = new Date(a.timeline.endDate).getTime() - new Date(b.timeline.endDate).getTime()
            break
          case 'budget':
            comparison = a.budget.total - b.budget.total
            break
          default:
            comparison = 0
        }
        
        return sortOrder === 'desc' ? -comparison : comparison
      })
    }, [projects, filterStatus, sortBy, sortOrder, maxProjects])
    
    // Calculate summary metrics
    const summaryMetrics = React.useMemo(() => {
      const totalProjects = projects.length
      const activeProjects = projects.filter(p => p.status === 'ACTIVE').length
      const completedProjects = projects.filter(p => p.status === 'COMPLETED').length
      const averageProgress = projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects || 0
      const totalBudget = projects.reduce((sum, p) => sum + p.budget.total, 0)
      const totalSpent = projects.reduce((sum, p) => sum + p.budget.spent, 0)
      const totalTeamMembers = projects.reduce((sum, p) => sum + p.team.total, 0)
      const averageQuality = projects.reduce((sum, p) => sum + p.quality.score, 0) / totalProjects || 0
      const totalSafetyIncidents = projects.reduce((sum, p) => sum + p.safety.incidentCount, 0)
      
      return [
        {
          id: 'total-projects',
          title: 'Proyectos Totales',
          value: totalProjects,
          trend: 'stable' as const,
          icon: 'building-2',
          color: 'primary' as const,
        },
        {
          id: 'active-projects',
          title: 'Proyectos Activos',
          value: activeProjects,
          trend: 'up' as const,
          icon: 'play',
          color: 'success' as const,
        },
        {
          id: 'average-progress',
          title: 'Progreso Promedio',
          value: averageProgress,
          format: 'percentage' as const,
          trend: 'up' as const,
          icon: 'trending-up',
          color: 'info' as const,
        },
        {
          id: 'budget-utilization',
          title: 'Presupuesto Utilizado',
          value: (totalSpent / totalBudget) * 100,
          format: 'percentage' as const,
          trend: totalSpent > totalBudget * 0.8 ? 'warning' as const : 'stable' as const,
          icon: 'dollar-sign',
          color: totalSpent > totalBudget * 0.8 ? 'warning' as const : 'success' as const,
        },
      ]
    }, [projects])
    
    // Get project status color
    const getProjectStatusColor = (status: DashboardProject['status']) => {
      switch (status) {
        case 'ACTIVE':
          return 'success'
        case 'COMPLETED':
          return 'success'
        case 'ON_HOLD':
          return 'warning'
        case 'CANCELLED':
          return 'danger'
        case 'PLANNING':
          return 'info'
        default:
          return 'secondary'
      }
    }
    
    // Get project status label
    const getProjectStatusLabel = (status: DashboardProject['status']) => {
      switch (status) {
        case 'ACTIVE':
          return 'Activo'
        case 'COMPLETED':
          return 'Completado'
        case 'ON_HOLD':
          return 'En Espera'
        case 'CANCELLED':
          return 'Cancelado'
        case 'PLANNING':
          return 'Planificación'
        default:
          return status
      }
    }
    
    // Get priority color
    const getPriorityColor = (priority: DashboardProject['priority']) => {
      switch (priority) {
        case 'CRITICAL':
          return 'text-red-600 bg-red-100'
        case 'HIGH':
          return 'text-orange-600 bg-orange-100'
        case 'MEDIUM':
          return 'text-blue-600 bg-blue-100'
        case 'LOW':
          return 'text-gray-600 bg-gray-100'
        default:
          return 'text-gray-600 bg-gray-100'
      }
    }

    if (isLoading && projects.length === 0) {
      return (
        <div className={cn(dashboardGridVariants({ variant, layout }), className)}>
          <Loading size="lg" />
          <Typography variant="body-large" color="muted" className="text-center">
            Cargando dashboard...
          </Typography>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(dashboardGridVariants({ variant, layout }), className)}
        {...props}
      >
        {/* Header with refresh controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h4" className="font-bold">
              Dashboard Ejecutivo
            </Typography>
            {lastUpdate && (
              <Typography variant="body-small" color="muted" suppressHydrationWarning>
                Última actualización: {lastUpdate.toLocaleTimeString('es-CL', { hour12: false })}
              </Typography>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filters */}
            <div className="hidden md:flex items-center gap-2">
              <FilterDropdown
                options={[
                  { id: 'ACTIVE', label: 'Activos', value: 'ACTIVE' },
                  { id: 'COMPLETED', label: 'Completados', value: 'COMPLETED' },
                  { id: 'ON_HOLD', label: 'En Espera', value: 'ON_HOLD' },
                  { id: 'PLANNING', label: 'Planificación', value: 'PLANNING' }
                ]}
                activeFilters={filterStatus.map(status => ({ id: status, value: status }))}
                onFilterChange={(filters) => onFilterChange && onFilterChange(filters.map(f => f.value))}
                placeholder="Filtrar por estado"
                triggerVariant="outline"
              />
              
              <FilterDropdown
                options={[
                  { id: 'name', label: 'Nombre', value: 'name' },
                  { id: 'progress', label: 'Progreso', value: 'progress' },
                  { id: 'priority', label: 'Prioridad', value: 'priority' },
                  { id: 'timeline', label: 'Cronograma', value: 'timeline' },
                  { id: 'budget', label: 'Presupuesto', value: 'budget' }
                ]}
                activeFilters={[{ id: sortBy, value: sortBy }]}
                onFilterChange={(filters) => {
                  if (filters.length > 0 && onSortChange) {
                    onSortChange(filters[0].value, sortOrder)
                  }
                }}
                placeholder="Ordenar por"
                triggerVariant="outline"
                maxSelections={1}
              />
            </div>
            
            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              leftIcon={
                <Icon 
                  name="refresh-cw" 
                  size="xs" 
                  className={refreshing ? 'animate-spin' : ''} 
                />
              }
            >
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        {showMetrics && (
          <div className="mb-8">
            <Typography variant="h6" className="font-semibold mb-4">
              Métricas Clave
            </Typography>
            
            <div className={cn(
              'grid gap-4',
              metricsColumns === 2 && 'grid-cols-1 sm:grid-cols-2',
              metricsColumns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
              metricsColumns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
              metricsColumns === 6 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
            )}>
              {[...summaryMetrics, ...metrics].map((metric) => (
                <MetricDisplay
                  key={metric.id}
                  title={metric.title}
                  value={metric.value}
                  target={metric.target}
                  unit={metric.unit}
                  trend={metric.trend}
                  trendValue={metric.trendValue}
                  format={metric.format}
                  color={metric.color}
                  icon={metric.icon}
                  description={metric.description}
                  clickable={metric.clickable || !!onMetricClick}
                  onClick={() => {
                    if (onMetricClick) onMetricClick(metric)
                    if (metric.onClick) metric.onClick()
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Critical Alerts */}
        {showAlerts && (
          <div className="mb-8">
            {projects.some(p => p.alerts && p.alerts.length > 0) && (
              <div>
                <Typography variant="h6" className="font-semibold mb-4">
                  Alertas Críticas
                </Typography>
                
                <div className="space-y-3">
                  {projects
                    .filter(p => p.alerts && p.alerts.length > 0)
                    .slice(0, 5)
                    .map(project => (
                      project.alerts?.map((alert, index) => (
                        <NotificationCard
                          key={`${project.id}-${index}`}
                          title={`${project.code} - ${alert.type}`}
                          message={alert.message}
                          type={alert.type.toLowerCase() as any}
                          priority={alert.severity.toLowerCase() as any}
                          timestamp={new Date()}
                          user={{
                            name: project.manager,
                            avatar: undefined,
                            role: 'Jefe de Proyecto'
                          }}
                          onAction={() => onAlertClick && onAlertClick(alert, project)}
                          onDismiss={() => console.log('Dismiss alert')}
                          showAvatar
                          showActions
                          clickable
                        />
                      ))
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Projects Overview */}
        {showProjects && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                Proyectos ({filteredAndSortedProjects.length})
              </Typography>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={projectsView === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => console.log('Switch to cards view')}
                >
                  <Icon name="grid-3x3" size="xs" />
                </Button>
                <Button
                  variant={projectsView === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => console.log('Switch to table view')}
                >
                  <Icon name="list" size="xs" />
                </Button>
              </div>
            </div>

            {projectsView === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg border border-secondary-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onProjectClick && onProjectClick(project)}
                  >
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <Typography variant="h6" className="font-semibold truncate">
                          {project.code}
                        </Typography>
                        <Typography variant="body-small" color="muted" className="truncate">
                          {project.name}
                        </Typography>
                        <Typography variant="caption" color="muted">
                          {project.location}
                        </Typography>
                      </div>
                      
                      <Badge
                        variant={project.priority === 'CRITICAL' ? 'danger' : 
                                project.priority === 'HIGH' ? 'warning' : 
                                project.priority === 'MEDIUM' ? 'primary' : 'secondary'}
                        size="xs"
                      >
                        {project.priority}
                      </Badge>
                    </div>

                    {/* Status and Progress */}
                    <div className="mb-4 space-y-3">
                      <StatusCard
                        status={{
                          value: getProjectStatusLabel(project.status),
                          variant: getProjectStatusColor(project.status) as any,
                        }}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Typography variant="caption" color="muted">Progreso</Typography>
                          <Typography variant="caption" className="font-medium">{project.progress}%</Typography>
                        </div>
                        <ProgressBar
                          progress={project.progress}
                          variant="default"
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Typography variant="caption" color="muted">Presupuesto</Typography>
                        <Typography variant="body-small" className="font-medium">
                          ${(project.budget.spent / 1000000).toFixed(1)}M / ${(project.budget.total / 1000000).toFixed(1)}M
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="muted">Equipo</Typography>
                        <Typography variant="body-small" className="font-medium">
                          {project.team.active}/{project.team.total}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="muted">Calidad</Typography>
                        <Typography variant="body-small" className="font-medium">
                          {project.quality.score}%
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="muted">Seguridad</Typography>
                        <Typography variant="body-small" className="font-medium">
                          {project.safety.daysWithoutIncident} días
                        </Typography>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="pt-4 border-t border-secondary-100">
                      <div className="flex items-center justify-between text-xs text-secondary-600">
                        <span>Inicio: {project.timeline.startDate.toLocaleDateString()}</span>
                        <span>Fin: {project.timeline.endDate.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Alerts indicator */}
                    {project.alerts && project.alerts.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <Icon name="alert-triangle" size="xs" className="text-orange-600" />
                        <Badge
                          variant="warning"
                          size="xs"
                          count={project.alerts.length}
                        >
                          alerta{project.alerts.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {projectsView === 'table' && (
              <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Proyecto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Progreso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Presupuesto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Calidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                      {filteredAndSortedProjects.map((project) => (
                        <tr 
                          key={project.id} 
                          className="hover:bg-secondary-25 cursor-pointer"
                          onClick={() => onProjectClick && onProjectClick(project)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <Typography variant="body-default" className="font-medium">
                                {project.code}
                              </Typography>
                              <Typography variant="body-small" color="muted">
                                {project.name}
                              </Typography>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusCard
                              status={{
                                value: getProjectStatusLabel(project.status),
                                variant: getProjectStatusColor(project.status) as any,
                              }}
                              size="sm"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full mr-3">
                                <ProgressBar
                                  progress={project.progress}
                                  variant="default"
                                  size="sm"
                                  showLabel={false}
                                />
                              </div>
                              <span className="text-sm font-medium text-secondary-900 min-w-0">
                                {project.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Typography variant="body-small" className="font-medium">
                              ${(project.budget.spent / 1000000).toFixed(1)}M
                            </Typography>
                            <Typography variant="caption" color="muted">
                              de ${(project.budget.total / 1000000).toFixed(1)}M
                            </Typography>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Typography variant="body-small" className="font-medium">
                              {project.quality.score}%
                            </Typography>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">
                              <Icon name="more-horizontal" size="sm" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

DashboardGrid.displayName = 'DashboardGrid'

export { DashboardGrid, dashboardGridVariants }
export type { DashboardProject, DashboardMetric, DashboardUpdate }