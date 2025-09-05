'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { StatusCard } from '@/components/molecules/StatusCard'
import { MetricDisplay } from '@/components/molecules/MetricDisplay'
import { NotificationCard } from '@/components/molecules/NotificationCard'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { ProgressBar } from '@/components/atoms/ProgressBar'

const projectCardVariants = cva(
  'bg-white rounded-lg border border-secondary-200 shadow-sm hover:shadow-md transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'p-6',
        compact: 'p-4',
        detailed: 'p-8',
        minimal: 'p-3',
      },
      layout: {
        vertical: 'flex flex-col space-y-4',
        horizontal: 'flex flex-row items-start gap-6',
        grid: 'grid grid-cols-1 md:grid-cols-2 gap-6 p-6',
      },
      status: {
        active: 'border-l-4 border-l-green-500',
        completed: 'border-l-4 border-l-blue-500',
        on_hold: 'border-l-4 border-l-orange-500',
        cancelled: 'border-l-4 border-l-red-500',
        planning: 'border-l-4 border-l-purple-500',
        default: '',
      },
      interactive: {
        clickable: 'cursor-pointer hover:bg-secondary-25',
        static: '',
        selectable: 'cursor-pointer hover:bg-secondary-25 hover:border-primary-300',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'vertical',
      status: 'default',
      interactive: 'static',
    },
  }
)

// Construction project interface
export interface ProjectData {
  id: string
  name: string
  code: string
  description?: string
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  
  // Timeline information
  timeline: {
    startDate: Date
    endDate: Date
    completedDate?: Date
    milestones?: Array<{
      id: string
      name: string
      date: Date
      completed: boolean
    }>
  }
  
  // Progress tracking
  progress: {
    overall: number
    phases: Array<{
      name: string
      progress: number
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    }>
  }
  
  // Financial information
  budget: {
    total: number
    spent: number
    committed: number
    remaining: number
    variance?: number
  }
  
  // Team information
  team: {
    manager: {
      id: string
      name: string
      avatar?: string
    }
    members: Array<{
      id: string
      name: string
      role: string
      avatar?: string
    }>
    totalCount: number
    activeCount: number
  }
  
  // Location and details
  location: {
    address: string
    city: string
    region: string
    coordinates?: { lat: number; lng: number }
  }
  
  // Quality metrics
  quality: {
    score: number
    inspections: {
      total: number
      passed: number
      failed: number
      pending: number
    }
    certifications?: string[]
  }
  
  // Safety information
  safety: {
    daysWithoutIncident: number
    totalIncidents: number
    lastIncident?: Date
    safetyScore: number
  }
  
  // Materials and resources
  materials: {
    totalItems: number
    deliveredItems: number
    pendingDeliveries: number
    criticalShortages?: number
  }
  
  // Alerts and notifications
  alerts: Array<{
    id: string
    type: 'BUDGET' | 'TIMELINE' | 'QUALITY' | 'SAFETY' | 'MATERIAL' | 'WEATHER'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    message: string
    timestamp: Date
    resolved?: boolean
  }>
  
  // Additional metadata
  metadata: {
    projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INFRASTRUCTURE'
    client: string
    contractor: string
    tags?: string[]
    images?: string[]
    documents?: number
  }
}

// Quick action configuration
export interface ProjectAction {
  id: string
  label: string
  icon: string
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost'
  onClick: (project: ProjectData) => void
  disabled?: boolean
  badge?: string | number
  permission?: string[]
}

export interface ProjectCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof projectCardVariants> {
  // Project data
  project: ProjectData
  
  // Display configuration
  showProgress?: boolean
  showTeam?: boolean
  showBudget?: boolean
  showQuality?: boolean
  showSafety?: boolean
  showMaterials?: boolean
  showTimeline?: boolean
  showAlerts?: boolean
  showMetrics?: boolean
  
  // Interactions
  onProjectClick?: (project: ProjectData) => void
  onManagerClick?: (manager: ProjectData['team']['manager']) => void
  onAlertClick?: (alert: ProjectData['alerts'][0], project: ProjectData) => void
  
  // Actions
  quickActions?: ProjectAction[]
  primaryAction?: ProjectAction
  secondaryActions?: ProjectAction[]
  
  // Customization
  maxAlerts?: number
  maxTeamMembers?: number
  compactMode?: boolean
  
  // Selection
  isSelected?: boolean
  isSelectable?: boolean
  onSelect?: (project: ProjectData, selected: boolean) => void
  
  // Loading states
  isLoading?: boolean
  isUpdating?: boolean
  
  // User context
  userRole?: 'EXECUTIVE' | 'SITE_MANAGER' | 'SUPERVISOR' | 'WORKER' | 'QUALITY_INSPECTOR'
  userPermissions?: string[]
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    {
      className,
      variant,
      layout,
      status,
      interactive,
      project,
      showProgress = true,
      showTeam = true,
      showBudget = true,
      showQuality = true,
      showSafety = true,
      showMaterials = false,
      showTimeline = false,
      showAlerts = true,
      showMetrics = false,
      onProjectClick,
      onManagerClick,
      onAlertClick,
      quickActions = [],
      primaryAction,
      secondaryActions = [],
      maxAlerts = 3,
      maxTeamMembers = 4,
      compactMode = false,
      isSelected = false,
      isSelectable = false,
      onSelect,
      isLoading = false,
      isUpdating = false,
      userRole = 'SUPERVISOR',
      userPermissions = [],
      ...props
    },
    ref
  ) => {
    const [showAllAlerts, setShowAllAlerts] = React.useState(false)
    const [showTeamDetails, setShowTeamDetails] = React.useState(false)
    
    // Handle project click
    const handleProjectClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      
      if (isSelectable && onSelect) {
        onSelect(project, !isSelected)
        return
      }
      
      if (onProjectClick) {
        onProjectClick(project)
      }
    }
    
    // Handle action click
    const handleActionClick = (action: ProjectAction) => (e: React.MouseEvent) => {
      e.stopPropagation()
      action.onClick(project)
    }
    
    // Get status configuration
    const getStatusConfig = () => {
      switch (project.status) {
        case 'ACTIVE':
          return { label: 'Activo', variant: 'success', color: 'text-green-700' }
        case 'COMPLETED':
          return { label: 'Completado', variant: 'success', color: 'text-blue-700' }
        case 'ON_HOLD':
          return { label: 'En Espera', variant: 'warning', color: 'text-orange-700' }
        case 'CANCELLED':
          return { label: 'Cancelado', variant: 'danger', color: 'text-red-700' }
        case 'PLANNING':
          return { label: 'Planificación', variant: 'info', color: 'text-purple-700' }
        default:
          return { label: project.status, variant: 'secondary', color: 'text-gray-700' }
      }
    }
    
    // Get priority styling
    const getPriorityConfig = () => {
      switch (project.priority) {
        case 'CRITICAL':
          return { 
            label: 'Crítico', 
            className: 'bg-red-100 text-red-800 border-red-200',
            icon: 'alert-triangle'
          }
        case 'HIGH':
          return { 
            label: 'Alta', 
            className: 'bg-orange-100 text-orange-800 border-orange-200',
            icon: 'arrow-up'
          }
        case 'MEDIUM':
          return { 
            label: 'Media', 
            className: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: 'minus'
          }
        case 'LOW':
          return { 
            label: 'Baja', 
            className: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: 'arrow-down'
          }
        default:
          return { 
            label: project.priority, 
            className: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: 'help-circle'
          }
      }
    }
    
    // Calculate days until deadline
    const daysUntilDeadline = Math.ceil((project.timeline.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const isOverdue = daysUntilDeadline < 0 && project.status !== 'COMPLETED'
    const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0 && project.status !== 'COMPLETED'
    
    // Count critical alerts
    const criticalAlerts = project.alerts.filter(a => a.severity === 'CRITICAL' && !a.resolved).length
    const highAlerts = project.alerts.filter(a => a.severity === 'HIGH' && !a.resolved).length
    
    const statusConfig = getStatusConfig()
    const priorityConfig = getPriorityConfig()
    
    const cardStatus = project.status.toLowerCase().replace('_', '_') as keyof typeof projectCardVariants.variants.status
    const cardInteractive = isSelectable ? 'selectable' : (onProjectClick ? 'clickable' : 'static')

    if (isLoading) {
      return (
        <div
          className={cn(
            projectCardVariants({ variant, layout, status: cardStatus, interactive: cardInteractive }),
            'animate-pulse',
            className
          )}
        >
          <div className="space-y-4">
            <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
            <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-2 bg-secondary-200 rounded"></div>
              <div className="h-2 bg-secondary-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          projectCardVariants({ variant, layout, status: cardStatus, interactive: cardInteractive }),
          isSelected && 'border-primary-500 bg-primary-25',
          isUpdating && 'opacity-75',
          className
        )}
        onClick={handleProjectClick}
        {...props}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <Typography variant={compactMode ? "h6" : "h5"} className="font-bold truncate">
                  {project.code}
                </Typography>
                <Typography 
                  variant={compactMode ? "body-small" : "body-default"} 
                  color="muted" 
                  className="truncate mb-1"
                >
                  {project.name}
                </Typography>
                {project.location && !compactMode && (
                  <div className="flex items-center gap-1 text-xs text-secondary-500">
                    <Icon name="map-pin" size="xs" />
                    <span>{project.location.city}, {project.location.region}</span>
                  </div>
                )}
              </div>
              
              {/* Priority Badge */}
              <Badge
                variant={project.priority === 'CRITICAL' ? 'danger' : 
                        project.priority === 'HIGH' ? 'warning' : 
                        project.priority === 'MEDIUM' ? 'primary' : 'secondary'}
                size="xs"
                icon={priorityConfig.icon as any}
              >
                {!compactMode && priorityConfig.label}
              </Badge>
            </div>
            
            {/* Project Type and Client */}
            {!compactMode && (
              <div className="flex items-center gap-4 text-xs text-secondary-600 mb-3">
                <span className="flex items-center gap-1">
                  <Icon name="building" size="xs" />
                  {project.metadata.projectType}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="user" size="xs" />
                  {project.metadata.client}
                </span>
              </div>
            )}
            
            {/* Status and Progress */}
            <div className="space-y-2 mb-3">
              <StatusCard
                status={{
                  value: statusConfig.label,
                  variant: statusConfig.variant as any,
                }}
                size={compactMode ? "sm" : "default"}
              />
              
              {showProgress && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Typography variant="caption" color="muted">Progreso General</Typography>
                    <Typography variant="caption" className="font-medium">{project.progress.overall}%</Typography>
                  </div>
                  <ProgressBar
                    progress={project.progress.overall}
                    variant="default"
                    size={compactMode ? "sm" : "default"}
                    showLabel={false}
                  />
                </div>
              )}
              
              {/* Timeline urgency indicators */}
              <div className="flex items-center gap-2 mt-2">
                {isOverdue && (
                  <Badge variant="danger" size="xs" icon="alert-circle">
                    Atrasado {Math.abs(daysUntilDeadline)} días
                  </Badge>
                )}
                {isUrgent && (
                  <Badge variant="warning" size="xs" icon="clock">
                    {daysUntilDeadline} días restantes
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Selection checkbox */}
          {isSelectable && (
            <div className="ml-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect?.(project, e.target.checked)}
                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        {showMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {showBudget && (
              <MetricDisplay
                title="Presupuesto"
                value={(project.budget.spent / 1000000)}
                target={(project.budget.total / 1000000)}
                format="currency"
                unit="M"
                size="sm"
                color={project.budget.variance && project.budget.variance > 0 ? 'warning' : 'success'}
              />
            )}
            
            {showQuality && (
              <MetricDisplay
                title="Calidad"
                value={project.quality.score}
                format="percentage"
                size="sm"
                color={project.quality.score >= 90 ? 'success' : project.quality.score >= 75 ? 'warning' : 'danger'}
              />
            )}
            
            {showSafety && (
              <MetricDisplay
                title="Seguridad"
                value={project.safety.daysWithoutIncident}
                unit="días"
                size="sm"
                color={project.safety.daysWithoutIncident >= 30 ? 'success' : 'warning'}
              />
            )}
            
            {showTeam && (
              <MetricDisplay
                title="Equipo"
                value={project.team.activeCount}
                target={project.team.totalCount}
                format="number"
                size="sm"
                color="info"
              />
            )}
          </div>
        )}

        {/* Detailed Information Grid */}
        {!compactMode && layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Budget Information */}
              {showBudget && (
                <div>
                  <Typography variant="label-default" className="font-semibold mb-2">
                    Presupuesto
                  </Typography>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gastado:</span>
                      <span className="font-medium">${(project.budget.spent / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-medium">${(project.budget.total / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Restante:</span>
                      <span className={cn(
                        'font-medium',
                        project.budget.remaining < project.budget.total * 0.1 ? 'text-red-600' : 'text-green-600'
                      )}>
                        ${(project.budget.remaining / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    {project.budget.variance && (
                      <div className="flex justify-between text-sm">
                        <span>Variación:</span>
                        <span className={cn(
                          'font-medium',
                          project.budget.variance > 0 ? 'text-red-600' : 'text-green-600'
                        )}>
                          {project.budget.variance > 0 ? '+' : ''}{project.budget.variance}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Timeline Information */}
              {showTimeline && (
                <div>
                  <Typography variant="label-default" className="font-semibold mb-2">
                    Cronograma
                  </Typography>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Inicio:</span>
                      <span>{project.timeline.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fin:</span>
                      <span>{project.timeline.endDate.toLocaleDateString()}</span>
                    </div>
                    {project.timeline.completedDate && (
                      <div className="flex justify-between">
                        <span>Completado:</span>
                        <span className="text-green-600">{project.timeline.completedDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              {/* Quality Information */}
              {showQuality && (
                <div>
                  <Typography variant="label-default" className="font-semibold mb-2">
                    Control de Calidad
                  </Typography>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Score General:</span>
                      <span className="font-medium">{project.quality.score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inspecciones:</span>
                      <span>{project.quality.inspections.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aprobadas:</span>
                      <span className="text-green-600">{project.quality.inspections.passed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendientes:</span>
                      <span className={project.quality.inspections.pending > 0 ? 'text-orange-600' : ''}>
                        {project.quality.inspections.pending}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Safety Information */}
              {showSafety && (
                <div>
                  <Typography variant="label-default" className="font-semibold mb-2">
                    Seguridad
                  </Typography>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Score Seguridad:</span>
                      <span className="font-medium">{project.safety.safetyScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Días sin incidentes:</span>
                      <span className="text-green-600">{project.safety.daysWithoutIncident}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total incidentes:</span>
                      <span className={project.safety.totalIncidents > 0 ? 'text-red-600' : 'text-green-600'}>
                        {project.safety.totalIncidents}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Section */}
        {showTeam && !compactMode && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="label-default" className="font-semibold">
                Equipo ({project.team.activeCount}/{project.team.totalCount})
              </Typography>
              {project.team.members.length > maxTeamMembers && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowTeamDetails(!showTeamDetails)
                  }}
                >
                  {showTeamDetails ? 'Ocultar' : `Ver todos (${project.team.members.length})`}
                </Button>
              )}
            </div>
            
            {/* Manager */}
            <div 
              className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-secondary-50 rounded p-1 -m-1"
              onClick={(e) => {
                e.stopPropagation()
                if (onManagerClick) onManagerClick(project.team.manager)
              }}
            >
              <Avatar
                size="xs"
                name={project.team.manager.name}
                src={project.team.manager.avatar}
                roleIndicator={{
                  color: 'primary-600',
                  label: 'Manager'
                }}
              />
              <div>
                <Typography variant="body-small" className="font-medium">
                  {project.team.manager.name}
                </Typography>
                <Typography variant="caption" color="muted">
                  Jefe de Proyecto
                </Typography>
              </div>
            </div>
            
            {/* Team Members */}
            <div className="flex -space-x-2">
              {project.team.members
                .slice(0, showTeamDetails ? undefined : maxTeamMembers)
                .map((member, index) => (
                  <div key={member.id} className="relative hover:z-10 hover:scale-110 transition-transform">
                    <Avatar
                      size="sm"
                      name={member.name}
                      src={member.avatar}
                      className="border-2 border-white"
                      title={`${member.name} - ${member.role}`}
                    />
                  </div>
                ))}
              
              {!showTeamDetails && project.team.members.length > maxTeamMembers && (
                <Badge
                  variant="secondary"
                  size="sm"
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center"
                >
                  +{project.team.members.length - maxTeamMembers}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Alerts Section */}
        {showAlerts && project.alerts.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="label-default" className="font-semibold">
                Alertas ({project.alerts.filter(a => !a.resolved).length})
              </Typography>
              {project.alerts.length > maxAlerts && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowAllAlerts(!showAllAlerts)
                  }}
                >
                  {showAllAlerts ? 'Ocultar' : `Ver todas (${project.alerts.length})`}
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {project.alerts
                .filter(a => !a.resolved)
                .slice(0, showAllAlerts ? undefined : maxAlerts)
                .map((alert) => (
                  <NotificationCard
                    key={alert.id}
                    title={alert.type}
                    message={alert.message}
                    type={alert.type.toLowerCase() as any}
                    priority={alert.severity.toLowerCase() as any}
                    timestamp={alert.timestamp}
                    user={{
                      name: project.team.manager.name,
                      avatar: project.team.manager.avatar,
                      role: 'Jefe de Proyecto'
                    }}
                    onAction={() => onAlertClick && onAlertClick(alert, project)}
                    onDismiss={() => console.log('Dismiss alert')}
                    size="sm"
                    showAvatar={false}
                    showActions
                    clickable
                  />
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
          <div className="flex items-center gap-2">
            {/* Critical indicators */}
            <div className="flex items-center gap-2">
              {criticalAlerts > 0 && (
                <Badge variant="danger" size="xs" icon="alert-triangle" count={criticalAlerts}>
                  crítico{criticalAlerts !== 1 ? 's' : ''}
                </Badge>
              )}
              {highAlerts > 0 && (
                <Badge variant="warning" size="xs" icon="alert-circle" count={highAlerts}>
                  urgente{highAlerts !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            {/* Last update */}
            <Typography variant="caption" color="muted">
              Actualizado hace 2h
            </Typography>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || 'ghost'}
                size="sm"
                onClick={handleActionClick(action)}
                disabled={action.disabled}
                leftIcon={<Icon name={action.icon as any} size="xs" />}
                className="relative"
              >
                {!compactMode && action.label}
                {action.badge && (
                  <Badge
                    size="xs"
                    variant="danger"
                    count={typeof action.badge === 'number' ? action.badge : undefined}
                    className="absolute -top-1 -right-1"
                  >
                    {typeof action.badge === 'string' ? action.badge : ''}
                  </Badge>
                )}
              </Button>
            ))}
            
            {/* Primary Action */}
            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'default'}
                size="sm"
                onClick={handleActionClick(primaryAction)}
                disabled={primaryAction.disabled}
                leftIcon={<Icon name={primaryAction.icon as any} size="xs" />}
              >
                {primaryAction.label}
              </Button>
            )}
            
            {/* More actions menu */}
            {secondaryActions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Show more actions menu')
                }}
              >
                <Icon name="more-horizontal" size="sm" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
)

ProjectCard.displayName = 'ProjectCard'

export { ProjectCard, projectCardVariants }
export type { ProjectData, ProjectAction }