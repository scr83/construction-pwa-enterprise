'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Import organisms
import { NavigationBar } from '@/components/organisms/NavigationBar'
import { DashboardGrid } from '@/components/organisms/DashboardGrid'
import { ReportViewer } from '@/components/organisms/ReportViewer'
import { PhotoGallery } from '@/components/organisms/PhotoGallery'
import { TeamAssignment } from '@/components/organisms/TeamAssignment'
import { MaterialTracker } from '@/components/organisms/MaterialTracker'

// Import molecules
import { StatusCard } from '@/components/molecules/StatusCard'
import { MetricDisplay } from '@/components/molecules/MetricDisplay'
import { NotificationCard } from '@/components/molecules/NotificationCard'

// Import atoms
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Badge } from '@/components/atoms/Badge'
import { Loading } from '@/components/atoms/Loading'

const dashboardTemplateVariants = cva(
  'min-h-screen bg-secondary-25',
  {
    variants: {
      layout: {
        desktop: 'flex flex-col',
        mobile: 'flex flex-col',
        tablet: 'flex flex-col',
      },
      role: {
        GERENCIA: '', // Executive view
        JEFE_TERRENO: '', // Site manager view
        CONTROL_CALIDAD: '', // Quality inspector view
        OFICINA_TECNICA: '', // Technical office view
        BODEGA: '', // Warehouse manager view
      },
    },
    defaultVariants: {
      layout: 'desktop',
      role: 'JEFE_TERRENO',
    },
  }
)

// Dashboard configuration interfaces
export interface DashboardWidget {
  id: string
  type: 'METRIC' | 'STATUS' | 'CHART' | 'LIST' | 'NOTIFICATION' | 'QUICK_ACTION' | 'RECENT_ACTIVITY'
  title: string
  component?: React.ComponentType<any>
  data?: any
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  position: { x: number; y: number }
  minSize?: { w: number; h: number }
  maxSize?: { w: number; h: number }
  refresh?: boolean
  refreshInterval?: number // minutes
  permissions?: string[]
  mobileOrder?: number
}

export interface DashboardSection {
  id: string
  title: string
  icon: string
  widgets: DashboardWidget[]
  collapsed?: boolean
  permissions?: string[]
  role?: string[]
}

export interface DashboardNotification {
  id: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'URGENT'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  actions?: Array<{
    id: string
    label: string
    action: () => void
    variant?: 'default' | 'primary' | 'danger'
  }>
  project?: {
    id: string
    name: string
    code: string
  }
  user?: {
    id: string
    name: string
    role: string
  }
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  description?: string
  action: () => void
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  badge?: string | number
  permissions?: string[]
  roles?: string[]
  category?: string
  shortcut?: string
  enabled?: boolean
}

export interface DashboardMetrics {
  // Projects metrics
  projects: {
    total: number
    active: number
    completed: number
    delayed: number
    onBudget: number
    overBudget: number
  }
  
  // Work progress metrics
  work: {
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    overdueTasks: number
    qualityApproved: number
    qualityPending: number
  }
  
  // Financial metrics
  budget: {
    totalBudget: number
    spentAmount: number
    commitedAmount: number
    availableAmount: number
    variance: number
    projectedSpend: number
  }
  
  // Team metrics
  team: {
    totalMembers: number
    activeMembers: number
    availableMembers: number
    productivity: number
    safetyScore: number
    workloadBalance: number
  }
  
  // Materials metrics
  materials: {
    totalValue: number
    lowStockItems: number
    outOfStockItems: number
    pendingOrders: number
    recentReceipts: number
    criticalAlerts: number
  }
  
  // Quality metrics
  quality: {
    totalInspections: number
    passedInspections: number
    failedInspections: number
    pendingInspections: number
    overallScore: number
    trendsPositive: boolean
  }
  
  // Safety metrics
  safety: {
    daysWithoutIncident: number
    totalIncidents: number
    nearMisses: number
    safetyScore: number
    trainingsCompleted: number
    equipmentInspections: number
  }
}

export interface DashboardTemplateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardTemplateVariants> {
  // Configuration
  userRole: 'GERENCIA' | 'JEFE_TERRENO' | 'CONTROL_CALIDAD' | 'OFICINA_TECNICA' | 'BODEGA'
  sections?: DashboardSection[]
  quickActions?: QuickAction[]
  notifications?: DashboardNotification[]
  metrics?: DashboardMetrics
  
  // Layout options
  sidebarCollapsed?: boolean
  showNotificationPanel?: boolean
  enableWidgetCustomization?: boolean
  enableRealTimeUpdates?: boolean
  
  // Data and state
  currentProject?: {
    id: string
    name: string
    code: string
    role: string
  }
  
  currentUser?: {
    id: string
    name: string
    role: string
    avatar?: string
    permissions: string[]
  }
  
  // Navigation
  activeModule?: string
  navigationItems?: Array<{
    id: string
    label: string
    icon: string
    path: string
    badge?: string | number
    permissions?: string[]
  }>
  
  // Callbacks
  onNavigate?: (path: string) => void
  onQuickAction?: (actionId: string) => void
  onNotificationAction?: (notificationId: string, actionId: string) => void
  onNotificationDismiss?: (notificationId: string) => void
  onWidgetRefresh?: (widgetId: string) => void
  onSectionToggle?: (sectionId: string, collapsed: boolean) => void
  onSettingsOpen?: () => void
  
  // Loading states
  isLoading?: boolean
  isRefreshing?: boolean
  
  // Customization
  theme?: 'light' | 'dark' | 'construction'
  compactMode?: boolean
  
  // Real-time features
  onlineUsers?: string[]
  lastUpdate?: Date
  syncStatus?: 'synced' | 'syncing' | 'error' | 'offline'
  
  // Mobile features
  swipeGestures?: boolean
  pullToRefresh?: boolean
}

const DashboardTemplate = React.forwardRef<HTMLDivElement, DashboardTemplateProps>(
  (
    {
      className,
      layout,
      role,
      userRole,
      sections = [],
      quickActions = [],
      notifications = [],
      metrics,
      sidebarCollapsed = false,
      showNotificationPanel = false,
      enableWidgetCustomization = false,
      enableRealTimeUpdates = true,
      currentProject,
      currentUser,
      activeModule,
      navigationItems = [],
      onNavigate,
      onQuickAction,
      onNotificationAction,
      onNotificationDismiss,
      onWidgetRefresh,
      onSectionToggle,
      onSettingsOpen,
      isLoading = false,
      isRefreshing = false,
      theme = 'construction',
      compactMode = false,
      onlineUsers = [],
      lastUpdate,
      syncStatus = 'synced',
      swipeGestures = false,
      pullToRefresh = false,
      ...props
    },
    ref
  ) => {
    const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(new Set())
    const [refreshingWidgets, setRefreshingWidgets] = React.useState<Set<string>>(new Set())
    const [showQuickActionsPanel, setShowQuickActionsPanel] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    // Auto-refresh functionality
    React.useEffect(() => {
      if (!enableRealTimeUpdates) return

      const interval = setInterval(() => {
        // Auto-refresh widgets that have refresh enabled
        sections.forEach(section => {
          section.widgets.forEach(widget => {
            if (widget.refresh && widget.refreshInterval) {
              onWidgetRefresh?.(widget.id)
            }
          })
        })
      }, 60000) // Check every minute

      return () => clearInterval(interval)
    }, [sections, enableRealTimeUpdates, onWidgetRefresh])

    // Handle section toggle
    const handleSectionToggle = (sectionId: string) => {
      const newCollapsed = new Set(collapsedSections)
      if (newCollapsed.has(sectionId)) {
        newCollapsed.delete(sectionId)
      } else {
        newCollapsed.add(sectionId)
      }
      setCollapsedSections(newCollapsed)
      onSectionToggle?.(sectionId, newCollapsed.has(sectionId))
    }

    // Handle widget refresh
    const handleWidgetRefresh = async (widgetId: string) => {
      setRefreshingWidgets(prev => new Set(prev).add(widgetId))
      try {
        await onWidgetRefresh?.(widgetId)
      } finally {
        setRefreshingWidgets(prev => {
          const newSet = new Set(prev)
          newSet.delete(widgetId)
          return newSet
        })
      }
    }

    // Get role-based dashboard configuration
    const getRoleDashboardConfig = () => {
      const baseConfig = {
        title: 'Dashboard de Construcción',
        subtitle: 'Panel de Control Principal'
      }

      switch (userRole) {
        case 'GERENCIA':
          return {
            ...baseConfig,
            title: 'Dashboard Ejecutivo',
            subtitle: 'Vista General de Proyectos y Performance',
            primaryColor: 'purple',
            focusAreas: ['budget', 'projects', 'team', 'quality']
          }
        case 'JEFE_TERRENO':
          return {
            ...baseConfig,
            title: 'Dashboard de Terreno',
            subtitle: 'Control de Obra y Equipos',
            primaryColor: 'blue',
            focusAreas: ['work', 'team', 'materials', 'safety']
          }
        case 'CONTROL_CALIDAD':
          return {
            ...baseConfig,
            title: 'Dashboard de Calidad',
            subtitle: 'Control e Inspecciones',
            primaryColor: 'green',
            focusAreas: ['quality', 'work', 'safety', 'team']
          }
        case 'OFICINA_TECNICA':
          return {
            ...baseConfig,
            title: 'Dashboard Técnico',
            subtitle: 'Planificación y Costos',
            primaryColor: 'orange',
            focusAreas: ['budget', 'projects', 'materials', 'team']
          }
        case 'BODEGA':
          return {
            ...baseConfig,
            title: 'Dashboard de Bodega',
            subtitle: 'Control de Materiales e Inventario',
            primaryColor: 'cyan',
            focusAreas: ['materials', 'work', 'team']
          }
        default:
          return baseConfig
      }
    }

    const dashboardConfig = getRoleDashboardConfig()

    // Get critical notifications count
    const criticalNotifications = notifications.filter(n => 
      !n.read && (n.priority === 'CRITICAL' || n.type === 'ERROR' || n.type === 'URGENT')
    ).length

    // Get quick actions for current role
    const roleQuickActions = quickActions.filter(action => 
      !action.roles || action.roles.includes(userRole)
    )

    if (isLoading) {
      return (
        <div className={cn(dashboardTemplateVariants({ layout, role }), className)}>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Loading size="lg" />
              <Typography variant="body-default" color="muted" className="mt-4">
                Cargando dashboard...
              </Typography>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(dashboardTemplateVariants({ layout, role }), className)}
        {...props}
      >
        {/* Navigation Bar removed - already provided by ProtectedLayout */}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Dashboard Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Dashboard Header */}
            <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h3" className="font-bold text-gray-900">
                    {dashboardConfig.title}
                  </Typography>
                  <Typography variant="body-default" color="muted">
                    {dashboardConfig.subtitle}
                    {currentProject && ` • ${currentProject.name}`}
                  </Typography>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Refresh indicator */}
                  {enableRealTimeUpdates && (
                    <div className="flex items-center gap-2">
                      {isRefreshing && <Loading size="xs" />}
                      <Badge
                        variant={syncStatus === 'synced' ? 'success' : 
                                syncStatus === 'syncing' ? 'primary' :
                                syncStatus === 'offline' ? 'warning' : 'danger'}
                        size="xs"
                      >
                        {syncStatus === 'synced' ? 'Actualizado' :
                         syncStatus === 'syncing' ? 'Sincronizando' :
                         syncStatus === 'offline' ? 'Sin conexión' : 'Error'}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Quick actions button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickActionsPanel(true)}
                    leftIcon={<Icon name="zap" size="xs" />}
                  >
                    Acciones Rápidas
                  </Button>
                  
                  {/* Settings */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSettingsOpen}
                    leftIcon={<Icon name="settings" size="xs" />}
                  >
                    <span className="hidden md:inline">Configurar</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 space-y-6">
              {/* Key Metrics Overview */}
              {metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                  {/* Role-specific key metrics */}
                  {userRole === 'GERENCIA' && (
                    <>
                      <MetricDisplay
                        title="Proyectos Activos"
                        value={metrics.projects.active}
                        target={metrics.projects.total}
                        format="count"
                        color="primary"
                        size="sm"
                        trend={metrics.projects.active > metrics.projects.completed ? 'up' : 'stable'}
                      />
                      <MetricDisplay
                        title="Presupuesto Total"
                        value={metrics.budget.totalBudget / 1000000000}
                        format="currency"
                        unit="MM"
                        color="success"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Varianza Presupuestaria"
                        value={metrics.budget.variance}
                        format="percentage"
                        color={metrics.budget.variance < 0 ? 'success' : 'warning'}
                        size="sm"
                        trend={metrics.budget.variance < 0 ? 'up' : 'down'}
                      />
                      <MetricDisplay
                        title="Equipo Total"
                        value={metrics.team.totalMembers}
                        format="count"
                        color="info"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Score Calidad"
                        value={metrics.quality.overallScore}
                        format="percentage"
                        color="success"
                        size="sm"
                        trend={metrics.quality.trendsPositive ? 'up' : 'stable'}
                      />
                      <MetricDisplay
                        title="Días sin Accidentes"
                        value={metrics.safety.daysWithoutIncident}
                        format="count"
                        unit="días"
                        color="success"
                        size="sm"
                      />
                    </>
                  )}
                  
                  {userRole === 'JEFE_TERRENO' && (
                    <>
                      <MetricDisplay
                        title="Tareas Completadas"
                        value={metrics.work.completedTasks}
                        target={metrics.work.totalTasks}
                        format="count"
                        color="primary"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Equipo Disponible"
                        value={metrics.team.availableMembers}
                        target={metrics.team.totalMembers}
                        format="count"
                        color="success"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Productividad"
                        value={metrics.team.productivity}
                        format="percentage"
                        color="primary"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Materiales Críticos"
                        value={metrics.materials.criticalAlerts}
                        format="count"
                        color={metrics.materials.criticalAlerts > 0 ? 'warning' : 'success'}
                        size="sm"
                      />
                      <MetricDisplay
                        title="Score Seguridad"
                        value={metrics.safety.safetyScore}
                        format="percentage"
                        color="success"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Tareas Atrasadas"
                        value={metrics.work.overdueTasks}
                        format="count"
                        color={metrics.work.overdueTasks > 0 ? 'danger' : 'success'}
                        size="sm"
                      />
                    </>
                  )}
                  
                  {userRole === 'CONTROL_CALIDAD' && (
                    <>
                      <MetricDisplay
                        title="Inspecciones Pendientes"
                        value={metrics.quality.pendingInspections}
                        format="count"
                        color={metrics.quality.pendingInspections > 5 ? 'warning' : 'primary'}
                        size="sm"
                      />
                      <MetricDisplay
                        title="Score General"
                        value={metrics.quality.overallScore}
                        format="percentage"
                        color="success"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Aprobaciones"
                        value={metrics.quality.passedInspections}
                        target={metrics.quality.totalInspections}
                        format="count"
                        color="success"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Rechazos"
                        value={metrics.quality.failedInspections}
                        format="count"
                        color={metrics.quality.failedInspections > 0 ? 'danger' : 'success'}
                        size="sm"
                      />
                      <MetricDisplay
                        title="Trabajo Pendiente"
                        value={metrics.work.pendingTasks}
                        format="count"
                        color="warning"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Días sin Incidentes"
                        value={metrics.safety.daysWithoutIncident}
                        format="count"
                        unit="días"
                        color="success"
                        size="sm"
                      />
                    </>
                  )}
                  
                  {userRole === 'BODEGA' && (
                    <>
                      <MetricDisplay
                        title="Valor Inventario"
                        value={metrics.materials.totalValue / 1000000}
                        format="currency"
                        unit="M"
                        color="primary"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Stock Bajo"
                        value={metrics.materials.lowStockItems}
                        format="count"
                        color={metrics.materials.lowStockItems > 0 ? 'warning' : 'success'}
                        size="sm"
                      />
                      <MetricDisplay
                        title="Sin Stock"
                        value={metrics.materials.outOfStockItems}
                        format="count"
                        color={metrics.materials.outOfStockItems > 0 ? 'danger' : 'success'}
                        size="sm"
                      />
                      <MetricDisplay
                        title="Órdenes Pendientes"
                        value={metrics.materials.pendingOrders}
                        format="count"
                        color="info"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Recepciones Recientes"
                        value={metrics.materials.recentReceipts}
                        format="count"
                        color="success"
                        size="sm"
                      />
                      <MetricDisplay
                        title="Alertas Críticas"
                        value={metrics.materials.criticalAlerts}
                        format="count"
                        color={metrics.materials.criticalAlerts > 0 ? 'danger' : 'success'}
                        size="sm"
                      />
                    </>
                  )}
                </div>
              )}

              {/* Dashboard Sections */}
              {sections.map((section) => (
                <div key={section.id} className="bg-white rounded-lg border border-secondary-200 shadow-sm">
                  {/* Section Header */}
                  <div className="flex items-center justify-between p-4 border-b border-secondary-200">
                    <div className="flex items-center gap-3">
                      <Icon name={section.icon as any} size="sm" />
                      <Typography variant="h6" className="font-semibold">
                        {section.title}
                      </Typography>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Section refresh */}
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          section.widgets.forEach(widget => {
                            if (widget.refresh) {
                              handleWidgetRefresh(widget.id)
                            }
                          })
                        }}
                        leftIcon={<Icon name="refresh-cw" size="xs" />}
                      >
                        Actualizar
                      </Button>
                      
                      {/* Collapse toggle */}
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleSectionToggle(section.id)}
                        leftIcon={
                          <Icon 
                            name={collapsedSections.has(section.id) ? "chevron-down" : "chevron-up"} 
                            size="xs" 
                          />
                        }
                      />
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  {!collapsedSections.has(section.id) && (
                    <div className="p-4">
                      <DashboardGrid
                        widgets={section.widgets}
                        isRefreshing={refreshingWidgets.size > 0}
                        onWidgetRefresh={handleWidgetRefresh}
                        compactMode={compactMode}
                        userRole={userRole}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>

          {/* Notification Panel */}
          {showNotificationPanel && (
            <aside className="w-80 bg-white border-l border-secondary-200 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-secondary-200 p-4">
                <div className="flex items-center justify-between">
                  <Typography variant="h6" className="font-semibold">
                    Notificaciones
                  </Typography>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setShowNotificationPanel(false)}
                    leftIcon={<Icon name="x" size="xs" />}
                  />
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="bell" size="lg" className="mx-auto mb-2 text-secondary-400" />
                    <Typography variant="body-default" color="muted">
                      No hay notificaciones
                    </Typography>
                  </div>
                ) : (
                  notifications
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        title={notification.title}
                        message={notification.message}
                        type={notification.type.toLowerCase() as any}
                        priority={notification.priority.toLowerCase() as any}
                        timestamp={notification.timestamp}
                        user={notification.user}
                        project={notification.project}
                        actions={notification.actions?.map(action => ({
                          id: action.id,
                          label: action.label,
                          action: action.action
                        }))}
                        onAction={(actionId) => onNotificationAction?.(notification.id, actionId)}
                        onDismiss={() => onNotificationDismiss?.(notification.id)}
                        showActions
                        clickable
                        className={!notification.read ? 'border-primary-200 bg-primary-25' : ''}
                      />
                    ))
                )}
              </div>
            </aside>
          )}
        </div>

        {/* Quick Actions Panel */}
        {showQuickActionsPanel && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuickActionsPanel(false)}
          >
            <div 
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-secondary-200 p-4">
                <div className="flex items-center justify-between">
                  <Typography variant="h5" className="font-semibold">
                    Acciones Rápidas
                  </Typography>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickActionsPanel(false)}
                    leftIcon={<Icon name="x" size="sm" />}
                  />
                </div>
              </div>
              
              <div className="p-4">
                {roleQuickActions.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="zap" size="lg" className="mx-auto mb-2 text-secondary-400" />
                    <Typography variant="body-default" color="muted">
                      No hay acciones rápidas disponibles
                    </Typography>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roleQuickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => {
                          action.action()
                          onQuickAction?.(action.id)
                          setShowQuickActionsPanel(false)
                        }}
                        disabled={!action.enabled}
                        className={cn(
                          'p-4 text-left rounded-lg border border-secondary-200 hover:shadow-md transition-all',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          action.variant === 'primary' && 'border-primary-200 bg-primary-25 hover:bg-primary-50',
                          action.variant === 'success' && 'border-success-200 bg-success-25 hover:bg-success-50',
                          action.variant === 'warning' && 'border-warning-200 bg-warning-25 hover:bg-warning-50',
                          action.variant === 'danger' && 'border-danger-200 bg-danger-25 hover:bg-danger-50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Icon name={action.icon as any} size="sm" className="mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Typography variant="body-default" className="font-medium">
                                {action.label}
                              </Typography>
                              {action.badge && (
                                <Badge size="xs" variant="secondary">
                                  {action.badge}
                                </Badge>
                              )}
                            </div>
                            {action.description && (
                              <Typography variant="caption" color="muted" className="mt-1">
                                {action.description}
                              </Typography>
                            )}
                            {action.shortcut && (
                              <Typography variant="caption" color="muted" className="mt-1 font-mono">
                                {action.shortcut}
                              </Typography>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

DashboardTemplate.displayName = 'DashboardTemplate'

export { DashboardTemplate, dashboardTemplateVariants }
export type { 
  DashboardTemplateProps,
  DashboardWidget,
  DashboardSection,
  DashboardNotification,
  QuickAction,
  DashboardMetrics
}