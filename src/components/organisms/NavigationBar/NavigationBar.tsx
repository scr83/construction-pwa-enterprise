'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { UserMenu } from '@/components/molecules/UserMenu'

const navigationBarVariants = cva(
  'w-full bg-white border-b border-secondary-200 shadow-sm',
  {
    variants: {
      variant: {
        desktop: 'hidden md:flex',
        mobile: 'flex md:hidden',
        universal: 'flex',
      },
      layout: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      position: {
        static: 'relative',
        fixed: 'fixed top-0 left-0 right-0 z-50',
        sticky: 'sticky top-0 z-40',
      },
    },
    defaultVariants: {
      variant: 'universal',
      layout: 'horizontal',
      position: 'static',
    },
  }
)

// Construction user roles with specific navigation needs
export type ConstructionRole = 
  | 'SITE_MANAGER' 
  | 'SUPERVISOR' 
  | 'WORKER' 
  | 'QUALITY_INSPECTOR' 
  | 'EXECUTIVE'

// Navigation item interface
export interface NavigationItem {
  id: string
  label: string
  icon: string
  href?: string
  onClick?: () => void
  badge?: string | number
  roles: ConstructionRole[]
  children?: NavigationItem[]
  isActive?: boolean
  disabled?: boolean
}

// User profile interface
export interface UserProfile {
  id: string
  name: string
  role: ConstructionRole
  avatar?: string
  project?: string
  shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT'
  isOnline?: boolean
}

// Notification interface
export interface NavigationNotification {
  id: string
  type: 'TASK' | 'QUALITY' | 'SAFETY' | 'MATERIAL' | 'SYSTEM'
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: Date
  read?: boolean
}

export interface NavigationBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navigationBarVariants> {
  // User context
  currentUser?: UserProfile
  
  // User menu callbacks
  onUserProfileClick?: () => void
  onUserSettingsClick?: () => void
  onUserLogoutClick?: () => void
  onUserStatusChange?: (status: 'online' | 'offline' | 'away' | 'busy') => void
  
  // Navigation configuration
  navigationItems?: NavigationItem[]
  activeRoute?: string
  onNavigate?: (item: NavigationItem) => void
  
  // Mobile features
  isMobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void
  showBreadcrumbs?: boolean
  breadcrumbs?: Array<{ label: string; href?: string }>
  
  // Construction features
  currentProject?: {
    id: string
    name: string
    code: string
  }
  onProjectChange?: (projectId: string) => void
  availableProjects?: Array<{ id: string; name: string; code: string }>
  
  // Notifications
  notifications?: NavigationNotification[]
  onNotificationClick?: (notification: NavigationNotification) => void
  onNotificationDismiss?: (notificationId: string) => void
  showNotifications?: boolean
  
  // Quick actions
  quickActions?: NavigationItem[]
  showQuickActions?: boolean
  
  // Emergency features
  emergencyContact?: () => void
  showEmergencyButton?: boolean
  
  // Offline support
  isOffline?: boolean
  pendingSyncCount?: number
  
  // Customization
  logo?: React.ReactNode
  showLogo?: boolean
  compactMode?: boolean
}

// Default navigation items for different roles
const getDefaultNavigationItems = (role: ConstructionRole): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'layout-dashboard',
      roles: ['SITE_MANAGER', 'SUPERVISOR', 'QUALITY_INSPECTOR', 'EXECUTIVE'],
      href: '/dashboard',
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: 'building-2',
      roles: ['SITE_MANAGER', 'SUPERVISOR', 'EXECUTIVE'],
      href: '/projects',
    },
    {
      id: 'tasks',
      label: 'Tareas',
      icon: 'list-checks',
      roles: ['SITE_MANAGER', 'SUPERVISOR', 'WORKER'],
      href: '/tasks',
    },
    {
      id: 'quality',
      label: 'Calidad',
      icon: 'shield-check',
      roles: ['SITE_MANAGER', 'SUPERVISOR', 'QUALITY_INSPECTOR'],
      href: '/quality',
    },
    {
      id: 'materials',
      label: 'Materiales',
      icon: 'package',
      roles: ['SITE_MANAGER', 'SUPERVISOR', 'WORKER'],
      href: '/materials',
    },
    {
      id: 'team',
      label: 'Equipo',
      icon: 'users',
      roles: ['SITE_MANAGER', 'SUPERVISOR'],
      href: '/team',
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'chart-bar',
      roles: ['SITE_MANAGER', 'SUPERVISOR', 'QUALITY_INSPECTOR', 'EXECUTIVE'],
      href: '/reports',
    },
  ]

  return baseItems.filter(item => item.roles.includes(role))
}

const NavigationBar = React.forwardRef<HTMLDivElement, NavigationBarProps>(
  (
    {
      className,
      variant,
      layout,
      position,
      currentUser,
      onUserProfileClick,
      onUserSettingsClick,
      onUserLogoutClick,
      onUserStatusChange,
      navigationItems,
      activeRoute,
      onNavigate,
      isMobileMenuOpen = false,
      onMobileMenuToggle,
      showBreadcrumbs = false,
      breadcrumbs = [],
      currentProject,
      onProjectChange,
      availableProjects = [],
      notifications = [],
      onNotificationClick,
      onNotificationDismiss,
      showNotifications = true,
      quickActions = [],
      showQuickActions = false,
      emergencyContact,
      showEmergencyButton = false,
      isOffline = false,
      pendingSyncCount = 0,
      logo,
      showLogo = true,
      compactMode = false,
      ...props
    },
    ref
  ) => {
    const [showNotificationPanel, setShowNotificationPanel] = React.useState(false)
    const [showProjectSelector, setShowProjectSelector] = React.useState(false)
    
    // Get role from URL params and router for navigation
    const searchParams = useSearchParams()
    const router = useRouter()
    const roleParam = searchParams.get('role') || 'jefe_terreno'
    
    // Map role parameter to ConstructionRole type
    const mapRoleFromParam = (role: string): ConstructionRole => {
      switch (role) {
        case 'gerencia':
          return 'EXECUTIVE'
        case 'jefe_terreno':
          return 'SITE_MANAGER'
        case 'oficina_tecnica':
          return 'SUPERVISOR'
        case 'control_calidad':
          return 'QUALITY_INSPECTOR'
        case 'bodega':
          return 'WORKER'
        default:
          return 'SITE_MANAGER'
      }
    }
    
    const effectiveRole = currentUser?.role || mapRoleFromParam(roleParam)
    const items = navigationItems || getDefaultNavigationItems(effectiveRole)
    const unreadNotifications = notifications.filter(n => !n.read).length
    const criticalNotifications = notifications.filter(n => n.priority === 'CRITICAL' && !n.read).length
    
    // Default navigation handlers with role parameter preservation
    const currentRole = searchParams.get('role')
    const roleQuery = currentRole ? `?role=${currentRole}` : ''
    
    const defaultProfileClick = () => router.push(`/profile${roleQuery}`)
    const defaultSettingsClick = () => router.push(`/settings${roleQuery}`)
    const defaultLogoutClick = () => {
      console.log('🔥🔥🔥 NAVIGATION BAR LOGOUT CLICKED 🔥🔥🔥')
      signOut({ callbackUrl: '/' })
    }
    
    // Get role-specific styling and behavior
    const getRoleVariant = (role: ConstructionRole) => {
      switch (role) {
        case 'EXECUTIVE':
          return 'bg-primary-700 text-white'
        case 'SITE_MANAGER':
          return 'bg-orange-600 text-white'
        case 'SUPERVISOR':
          return 'bg-blue-600 text-white'
        case 'QUALITY_INSPECTOR':
          return 'bg-green-600 text-white'
        case 'WORKER':
          return 'bg-gray-600 text-white'
        default:
          return 'bg-secondary-600 text-white'
      }
    }

    const getRoleLabel = (role: ConstructionRole) => {
      switch (role) {
        case 'EXECUTIVE':
          return 'Ejecutivo'
        case 'SITE_MANAGER':
          return 'Jefe de Terreno'
        case 'SUPERVISOR':
          return 'Supervisor'
        case 'QUALITY_INSPECTOR':
          return 'Inspector de Calidad'
        case 'WORKER':
          return 'Operario'
        default:
          return role
      }
    }

    // Handle navigation item click
    const handleNavigationClick = (item: NavigationItem) => {
      if (item.disabled) return
      
      if (onNavigate) {
        onNavigate(item)
      }
      
      if (item.onClick) {
        item.onClick()
      }
      
      // Close mobile menu after navigation
      if (isMobileMenuOpen && onMobileMenuToggle) {
        onMobileMenuToggle()
      }
    }

    // Handle project change
    const handleProjectSelect = (project: { id: string; name: string; code: string }) => {
      if (onProjectChange) {
        onProjectChange(project.id)
      }
      setShowProjectSelector(false)
    }

    // Close dropdowns when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node
        if (!target) return
        
        const navElement = ref && 'current' in ref ? ref.current : null
        if (navElement && !navElement.contains(target)) {
          setShowNotificationPanel(false)
          setShowProjectSelector(false)
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [ref])

    return (
      <nav
        ref={ref}
        className={cn(navigationBarVariants({ variant, layout, position }), className)}
        {...props}
      >
        {/* Main Navigation Content */}
        <div className="flex items-center justify-between w-full px-4 py-3">
          {/* Left Section: Logo + Mobile Menu + Project */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="md:hidden"
              aria-label="Toggle navigation menu"
            >
              <Icon name={isMobileMenuOpen ? 'x' : 'menu'} size="sm" />
            </Button>
            
            {/* Logo */}
            {showLogo && (
              <div className="flex items-center gap-2">
                {logo || <Icon name="hard-hat" size="lg" className="text-primary-600" />}
                {!compactMode && (
                  <Typography variant="h6" className="font-bold hidden sm:block">
                    ConstructorApp
                  </Typography>
                )}
              </div>
            )}
            
            {/* Current Project Selector */}
            {currentProject && availableProjects.length > 1 && (
              <div className="relative hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProjectSelector(!showProjectSelector)}
                  rightIcon={<Icon name="chevron-down" size="xs" />}
                  className="max-w-xs"
                >
                  <div className="text-left truncate">
                    <div className="text-xs text-secondary-500">{currentProject.code}</div>
                    <div className="text-sm font-medium truncate">{currentProject.name}</div>
                  </div>
                </Button>
                
                {/* Project Dropdown */}
                {showProjectSelector && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-secondary-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <Typography variant="caption" color="muted" className="px-2 py-1">
                        Cambiar Proyecto
                      </Typography>
                      {availableProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => handleProjectSelect(project)}
                          className={cn(
                            'w-full text-left px-2 py-2 hover:bg-secondary-50 rounded text-sm',
                            project.id === currentProject.id && 'bg-primary-50 text-primary-700'
                          )}
                        >
                          <div className="font-medium">{project.code}</div>
                          <div className="text-xs text-secondary-500 truncate">{project.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Center Section: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <Button
                key={item.id}
                variant={activeRoute === item.href ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleNavigationClick(item)}
                disabled={item.disabled}
                leftIcon={<Icon name={item.icon as any} size="sm" />}
                className="relative"
              >
                {!compactMode && item.label}
                {item.badge && (
                  <Badge
                    size="xs"
                    variant="danger"
                    count={typeof item.badge === 'number' ? item.badge : undefined}
                    className="absolute -top-1 -right-1"
                  >
                    {typeof item.badge === 'string' ? item.badge : ''}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          
          {/* Right Section: Status + Notifications + User */}
          <div className="flex items-center gap-2">
            {/* Offline Status */}
            {isOffline && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <Icon name="wifi-off" size="xs" />
                {!compactMode && 'Sin conexión'}
              </div>
            )}
            
            {/* Pending Sync */}
            {pendingSyncCount > 0 && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-200"
                  leftIcon={<Icon name="refresh-cw" size="xs" />}
                >
                  Sync
                </Button>
                <Badge
                  size="xs"
                  variant="warning"
                  count={pendingSyncCount}
                  className="absolute -top-1 -right-1"
                />
              </div>
            )}
            
            {/* Emergency Button */}
            {showEmergencyButton && (
              <Button
                variant="destructive"
                size="sm"
                onClick={emergencyContact}
                leftIcon={<Icon name="phone" size="xs" />}
                className="hidden sm:flex"
              >
                {!compactMode && 'SOS'}
              </Button>
            )}
            
            {/* Quick Actions */}
            {showQuickActions && quickActions.length > 0 && (
              <div className="hidden lg:flex items-center gap-1">
                {quickActions.slice(0, 3).map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigationClick(action)}
                    disabled={action.disabled}
                  >
                    <Icon name={action.icon as any} size="xs" />
                  </Button>
                ))}
              </div>
            )}
            
            {/* Notifications */}
            {showNotifications && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                  className="relative"
                >
                  <Icon name="bell" size="sm" />
                  {unreadNotifications > 0 && (
                    <Badge
                      size="xs"
                      variant={criticalNotifications > 0 ? "danger" : "primary"}
                      count={unreadNotifications}
                      className={cn(
                        "absolute -top-1 -right-1",
                        criticalNotifications > 0 && "animate-pulse"
                      )}
                    />
                  )}
                </Button>
                
                {/* Notification Panel */}
                {showNotificationPanel && (
                  <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-secondary-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b">
                      <Typography variant="label-default" className="font-semibold">
                        Notificaciones
                      </Typography>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-secondary-500">
                        No hay notificaciones
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            'p-3 border-b border-secondary-100 cursor-pointer hover:bg-secondary-50',
                            !notification.read && 'bg-blue-50'
                          )}
                          onClick={() => {
                            if (onNotificationClick) onNotificationClick(notification)
                            setShowNotificationPanel(false)
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon 
                                  name={notification.type === 'CRITICAL' ? 'alert-triangle' : 'info'} 
                                  size="xs" 
                                  className={cn(
                                    notification.priority === 'CRITICAL' ? 'text-red-500' :
                                    notification.priority === 'HIGH' ? 'text-orange-500' :
                                    notification.priority === 'MEDIUM' ? 'text-blue-500' :
                                    'text-secondary-400'
                                  )}
                                />
                                <Typography variant="caption" className="font-medium">
                                  {notification.type}
                                </Typography>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                              <Typography variant="body-small" className="text-secondary-700">
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="muted" suppressHydrationWarning>
                                {new Date(notification.timestamp).toLocaleString('es-CL', { 
                                  hour12: false,
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            </div>
                            {onNotificationDismiss && (
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onNotificationDismiss(notification.id)
                                }}
                              >
                                <Icon name="x" size="xs" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* User Profile */}
            <UserMenu
              user={{
                id: currentUser?.id || 'default-user',
                name: currentUser?.name || 'Usuario',
                email: `${(currentUser?.name || 'usuario').toLowerCase().replace(' ', '.')}@constructorapp.com`,
                avatar: currentUser?.avatar,
                role: effectiveRole,
                status: currentUser?.isOnline ? "online" : "offline",
                project: currentUser?.project,
                shift: currentUser?.shift
              }}
              onProfileClick={onUserProfileClick || defaultProfileClick}
              onSettingsClick={onUserSettingsClick || defaultSettingsClick}
              onLogoutClick={onUserLogoutClick || defaultLogoutClick}
              onStatusChange={onUserStatusChange}
              position="bottom-right"
            />
          </div>
        </div>
        
        {/* Breadcrumbs */}
        {showBreadcrumbs && breadcrumbs.length > 0 && (
          <div className="px-4 py-2 border-t border-secondary-100 bg-secondary-25">
            <div className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Icon name="chevron-right" size="xs" className="text-secondary-400" />}
                  <button
                    className={cn(
                      'hover:text-primary-600',
                      index === breadcrumbs.length - 1 ? 'text-secondary-700 font-medium' : 'text-secondary-500'
                    )}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 bg-white">
            <div className="p-4 space-y-2">
              {/* Current Project (Mobile) */}
              {currentProject && (
                <div className="mb-4 p-3 bg-secondary-50 rounded-lg">
                  <Typography variant="caption" color="muted">Proyecto Actual</Typography>
                  <Typography variant="body-default" className="font-medium">{currentProject.code}</Typography>
                  <Typography variant="body-small" color="muted">{currentProject.name}</Typography>
                </div>
              )}
              
              {/* Navigation Items */}
              {items.map((item) => (
                <Button
                  key={item.id}
                  variant={activeRoute === item.href ? 'default' : 'ghost'}
                  size="default"
                  onClick={() => handleNavigationClick(item)}
                  disabled={item.disabled}
                  leftIcon={<Icon name={item.icon as any} size="sm" />}
                  className="w-full justify-start relative"
                >
                  {item.label}
                  {item.badge && (
                    <Badge
                      size="xs"
                      variant="danger"
                      count={typeof item.badge === 'number' ? item.badge : undefined}
                      className="ml-auto"
                    >
                      {typeof item.badge === 'string' ? item.badge : ''}
                    </Badge>
                  )}
                </Button>
              ))}
              
              {/* Quick Actions (Mobile) */}
              {showQuickActions && quickActions.length > 0 && (
                <div className="pt-4 border-t border-secondary-200">
                  <Typography variant="caption" color="muted" className="mb-2">Acciones Rápidas</Typography>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigationClick(action)}
                        disabled={action.disabled}
                        leftIcon={<Icon name={action.icon as any} size="xs" />}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Emergency Button (Mobile) */}
              {showEmergencyButton && (
                <div className="pt-4">
                  <Button
                    variant="destructive"
                    size="default"
                    onClick={emergencyContact}
                    leftIcon={<Icon name="phone" size="sm" />}
                    className="w-full"
                  >
                    Contacto de Emergencia
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    )
  }
)

NavigationBar.displayName = 'NavigationBar'

export { NavigationBar, navigationBarVariants }
export type { NavigationItem, UserProfile, NavigationNotification }