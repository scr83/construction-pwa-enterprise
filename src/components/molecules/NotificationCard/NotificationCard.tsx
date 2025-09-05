'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'

const notificationCardVariants = cva(
  'relative w-full bg-white border rounded-lg transition-all duration-200 hover:shadow-sm',
  {
    variants: {
      variant: {
        info: 'border-blue-200 bg-blue-50',
        success: 'border-green-200 bg-green-50',
        warning: 'border-orange-200 bg-orange-50',
        danger: 'border-red-200 bg-red-50',
        critical: 'border-red-300 bg-red-100 shadow-md ring-1 ring-red-200',
        
        // Construction-specific variants
        safety: 'border-yellow-200 bg-yellow-50',
        quality: 'border-purple-200 bg-purple-50',
        material: 'border-indigo-200 bg-indigo-50',
        deadline: 'border-orange-300 bg-orange-100',
        
        // Neutral variants
        default: 'border-secondary-200 bg-white',
        urgent: 'border-red-400 bg-red-50 animate-pulse',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-5',
      },
      layout: {
        default: '',
        compact: 'flex items-start gap-3',
        expanded: 'space-y-4',
      },
      read: {
        true: 'opacity-75 bg-opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      layout: 'default',
      read: false,
    },
  }
)

// Construction notification types
export type NotificationType = 
  | 'SAFETY_ALERT'
  | 'QUALITY_ISSUE'
  | 'MATERIAL_DELAY'
  | 'DEADLINE_WARNING'
  | 'TASK_ASSIGNMENT'
  | 'INSPECTION_DUE'
  | 'WEATHER_ALERT'
  | 'SYSTEM_UPDATE'
  | 'DOCUMENT_APPROVAL'
  | 'EMERGENCY'

// Notification priority levels
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

// Construction notification interface
export interface ConstructionNotification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  
  // Metadata
  timestamp: Date
  read: boolean
  
  // Source information
  source: {
    type: 'USER' | 'SYSTEM' | 'SENSOR' | 'INTEGRATION'
    id?: string
    name?: string
    avatar?: string
  }
  
  // Context
  context?: {
    projectId?: string
    projectName?: string
    unitId?: string
    unitCode?: string
    taskId?: string
    inspectionId?: string
    location?: string
  }
  
  // Rich content
  media?: {
    images?: string[]
    documents?: Array<{
      id: string
      name: string
      url: string
      type: string
    }>
  }
  
  // Actions
  actions?: Array<{
    id: string
    label: string
    type: 'PRIMARY' | 'SECONDARY' | 'DANGER'
    icon?: string
    href?: string
    onClick?: () => void
  }>
  
  // Expiry and timing
  expiresAt?: Date
  urgent?: boolean
  
  // Grouping
  category?: string
  tags?: string[]
}

export interface NotificationCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationCardVariants> {
  // Notification data
  notification: ConstructionNotification
  
  // Display configuration
  showTimestamp?: boolean
  showSource?: boolean
  showContext?: boolean
  showActions?: boolean
  showMedia?: boolean
  
  // Interaction handlers
  onNotificationClick?: (notification: ConstructionNotification) => void
  onActionClick?: (action: ConstructionNotification['actions'][0], notification: ConstructionNotification) => void
  onDismiss?: (notification: ConstructionNotification) => void
  onMarkAsRead?: (notification: ConstructionNotification) => void
  onMarkAsUnread?: (notification: ConstructionNotification) => void
  
  // Visual options
  dismissible?: boolean
  clickable?: boolean
  showReadToggle?: boolean
  
  // Layout options
  maxActions?: number
  truncateMessage?: number
  
  // User context for role-based display
  currentUserRole?: 'EXECUTIVE' | 'SITE_MANAGER' | 'SUPERVISOR' | 'QUALITY_INSPECTOR' | 'WORKER'
  
  // Loading states
  isLoading?: boolean
  isProcessing?: boolean
}

const NotificationCard = React.forwardRef<HTMLDivElement, NotificationCardProps>(
  (
    {
      className,
      variant,
      size,
      layout,
      read,
      notification,
      showTimestamp = true,
      showSource = true,
      showContext = true,
      showActions = true,
      showMedia = false,
      onNotificationClick,
      onActionClick,
      onDismiss,
      onMarkAsRead,
      onMarkAsUnread,
      dismissible = true,
      clickable = true,
      showReadToggle = false,
      maxActions = 3,
      truncateMessage,
      currentUserRole,
      isLoading = false,
      isProcessing = false,
      ...props
    },
    ref
  ) => {
    // Auto-determine variant based on notification type and priority
    const getVariantFromNotification = (): string => {
      if (variant) return variant
      
      if (notification.priority === 'CRITICAL' || notification.type === 'EMERGENCY') {
        return 'critical'
      }
      
      if (notification.urgent) {
        return 'urgent'
      }
      
      switch (notification.type) {
        case 'SAFETY_ALERT':
          return 'safety'
        case 'QUALITY_ISSUE':
          return 'quality'
        case 'MATERIAL_DELAY':
          return 'material'
        case 'DEADLINE_WARNING':
          return 'deadline'
        case 'TASK_ASSIGNMENT':
          return 'info'
        case 'INSPECTION_DUE':
          return 'warning'
        case 'WEATHER_ALERT':
          return 'warning'
        case 'SYSTEM_UPDATE':
          return 'info'
        case 'DOCUMENT_APPROVAL':
          return 'success'
        case 'EMERGENCY':
          return 'critical'
        default:
          return 'default'
      }
    }
    
    // Get notification icon based on type
    const getNotificationIcon = (): string => {
      switch (notification.type) {
        case 'SAFETY_ALERT':
          return 'shield-alert'
        case 'QUALITY_ISSUE':
          return 'alert-triangle'
        case 'MATERIAL_DELAY':
          return 'package-x'
        case 'DEADLINE_WARNING':
          return 'clock'
        case 'TASK_ASSIGNMENT':
          return 'clipboard-check'
        case 'INSPECTION_DUE':
          return 'search-check'
        case 'WEATHER_ALERT':
          return 'cloud-rain'
        case 'SYSTEM_UPDATE':
          return 'info'
        case 'DOCUMENT_APPROVAL':
          return 'file-check'
        case 'EMERGENCY':
          return 'siren'
        default:
          return 'bell'
      }
    }
    
    // Get notification type label in Spanish
    const getTypeLabel = (): string => {
      switch (notification.type) {
        case 'SAFETY_ALERT':
          return 'Alerta de Seguridad'
        case 'QUALITY_ISSUE':
          return 'Problema de Calidad'
        case 'MATERIAL_DELAY':
          return 'Retraso de Material'
        case 'DEADLINE_WARNING':
          return 'Advertencia de Plazo'
        case 'TASK_ASSIGNMENT':
          return 'Asignación de Tarea'
        case 'INSPECTION_DUE':
          return 'Inspección Pendiente'
        case 'WEATHER_ALERT':
          return 'Alerta Meteorológica'
        case 'SYSTEM_UPDATE':
          return 'Actualización del Sistema'
        case 'DOCUMENT_APPROVAL':
          return 'Aprobación de Documento'
        case 'EMERGENCY':
          return 'Emergencia'
        default:
          return 'Notificación'
      }
    }
    
    // Format timestamp
    const formatTimestamp = (timestamp: Date): string => {
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Ahora'
      if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
      
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `Hace ${diffInHours}h`
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `Hace ${diffInDays}d`
      
      return timestamp.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    }
    
    // Truncate message if needed
    const displayMessage = React.useMemo(() => {
      if (!truncateMessage) return notification.message
      if (notification.message.length <= truncateMessage) return notification.message
      return notification.message.substring(0, truncateMessage) + '...'
    }, [notification.message, truncateMessage])
    
    // Handle card click
    const handleCardClick = (e: React.MouseEvent) => {
      if (!clickable || isProcessing) return
      
      // Don't trigger if clicking on actions
      if ((e.target as HTMLElement).closest('button')) return
      
      if (onNotificationClick) {
        onNotificationClick(notification)
      }
      
      // Auto-mark as read when clicked
      if (!notification.read && onMarkAsRead) {
        onMarkAsRead(notification)
      }
    }
    
    // Handle action click
    const handleActionClick = (action: ConstructionNotification['actions'][0]) => (e: React.MouseEvent) => {
      e.stopPropagation()
      
      if (isProcessing) return
      
      if (onActionClick) {
        onActionClick(action, notification)
      }
      
      if (action.onClick) {
        action.onClick()
      }
    }
    
    // Handle dismiss
    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation()
      
      if (isProcessing) return
      
      if (onDismiss) {
        onDismiss(notification)
      }
    }
    
    // Handle read toggle
    const handleReadToggle = (e: React.MouseEvent) => {
      e.stopPropagation()
      
      if (isProcessing) return
      
      if (notification.read && onMarkAsUnread) {
        onMarkAsUnread(notification)
      } else if (!notification.read && onMarkAsRead) {
        onMarkAsRead(notification)
      }
    }
    
    const finalVariant = getVariantFromNotification()
    const icon = getNotificationIcon()
    const typeLabel = getTypeLabel()
    const displayActions = notification.actions?.slice(0, maxActions) || []

    if (isLoading) {
      return (
        <div className={cn(notificationCardVariants({ variant: 'default', size, layout }), 'animate-pulse', className)}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-secondary-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary-200 rounded w-3/4" />
              <div className="h-3 bg-secondary-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          notificationCardVariants({
            variant: finalVariant as any,
            size,
            layout,
            read: notification.read,
          }),
          clickable && 'cursor-pointer hover:shadow-sm',
          isProcessing && 'opacity-50 pointer-events-none',
          className
        )}
        onClick={handleCardClick}
        {...props}
      >
        {/* Priority indicator */}
        {(notification.priority === 'CRITICAL' || notification.urgent) && (
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-lg" />
        )}
        
        {/* Read indicator */}
        {!notification.read && (
          <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
        )}
        
        {/* Main content */}
        <div className={cn(
          layout === 'compact' ? 'flex items-start gap-3' : 'space-y-3'
        )}>
          {/* Header section */}
          <div className={cn(
            layout === 'compact' ? 'flex-1' : '',
            'flex items-start gap-3'
          )}>
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 p-2 rounded-full',
              finalVariant === 'critical' ? 'bg-red-200' :
              finalVariant === 'safety' ? 'bg-yellow-200' :
              finalVariant === 'quality' ? 'bg-purple-200' :
              finalVariant === 'material' ? 'bg-indigo-200' :
              finalVariant === 'deadline' ? 'bg-orange-200' :
              'bg-blue-200'
            )}>
              <Icon 
                name={icon as any} 
                size="sm"
                className={cn(
                  finalVariant === 'critical' ? 'text-red-600' :
                  finalVariant === 'safety' ? 'text-yellow-600' :
                  finalVariant === 'quality' ? 'text-purple-600' :
                  finalVariant === 'material' ? 'text-indigo-600' :
                  finalVariant === 'deadline' ? 'text-orange-600' :
                  'text-blue-600'
                )}
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title and metadata */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <Typography variant="body-default" className="font-semibold truncate">
                    {notification.title}
                  </Typography>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" size="xs">
                      {typeLabel}
                    </Badge>
                    
                    {notification.priority === 'CRITICAL' && (
                      <Badge variant="danger" size="xs">
                        Crítico
                      </Badge>
                    )}
                    
                    {notification.urgent && (
                      <Badge variant="warning" size="xs">
                        Urgente
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Actions menu */}
                <div className="flex items-center gap-1">
                  {showReadToggle && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={handleReadToggle}
                      title={notification.read ? 'Marcar como no leída' : 'Marcar como leída'}
                    >
                      <Icon name={notification.read ? 'mail-open' : 'mail'} size="xs" />
                    </Button>
                  )}
                  
                  {dismissible && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={handleDismiss}
                      title="Descartar notificación"
                    >
                      <Icon name="x" size="xs" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Message */}
              <Typography variant="body-small" className="text-secondary-700 mb-2">
                {displayMessage}
              </Typography>
              
              {/* Context information */}
              {showContext && notification.context && (
                <div className="flex items-center gap-3 text-xs text-secondary-600 mb-2">
                  {notification.context.projectName && (
                    <div className="flex items-center gap-1">
                      <Icon name="building" size="xs" />
                      <span>{notification.context.projectName}</span>
                    </div>
                  )}
                  
                  {notification.context.unitCode && (
                    <div className="flex items-center gap-1">
                      <Icon name="home" size="xs" />
                      <span>{notification.context.unitCode}</span>
                    </div>
                  )}
                  
                  {notification.context.location && (
                    <div className="flex items-center gap-1">
                      <Icon name="map-pin" size="xs" />
                      <span>{notification.context.location}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Source and timestamp */}
              <div className="flex items-center justify-between gap-2">
                {showSource && (
                  <div className="flex items-center gap-2">
                    {notification.source.avatar ? (
                      <Avatar
                        src={notification.source.avatar}
                        name={notification.source.name}
                        size="xs"
                      />
                    ) : (
                      <Icon 
                        name={
                          notification.source.type === 'SYSTEM' ? 'settings' :
                          notification.source.type === 'SENSOR' ? 'activity' :
                          notification.source.type === 'INTEGRATION' ? 'zap' :
                          'user'
                        } 
                        size="xs" 
                      />
                    )}
                    
                    <Typography variant="caption" color="muted">
                      {notification.source.name || 'Sistema'}
                    </Typography>
                  </div>
                )}
                
                {showTimestamp && (
                  <Typography variant="caption" color="muted">
                    {formatTimestamp(notification.timestamp)}
                  </Typography>
                )}
              </div>
            </div>
          </div>
          
          {/* Media content */}
          {showMedia && notification.media?.images && notification.media.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {notification.media.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Notification attachment"
                  className="w-16 h-16 object-cover rounded border border-secondary-200 flex-shrink-0"
                />
              ))}
              {notification.media.images.length > 3 && (
                <div className="w-16 h-16 bg-secondary-100 rounded border border-secondary-200 flex items-center justify-center text-xs text-secondary-600">
                  +{notification.media.images.length - 3}
                </div>
              )}
            </div>
          )}
          
          {/* Action buttons */}
          {showActions && displayActions.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-secondary-200">
              {displayActions.map((action) => (
                <Button
                  key={action.id}
                  variant={
                    action.type === 'PRIMARY' ? 'default' :
                    action.type === 'DANGER' ? 'destructive' :
                    'outline'
                  }
                  size="sm"
                  onClick={handleActionClick(action)}
                  leftIcon={action.icon ? <Icon name={action.icon as any} size="xs" /> : undefined}
                  disabled={isProcessing}
                >
                  {action.label}
                </Button>
              ))}
              
              {notification.actions && notification.actions.length > maxActions && (
                <Button variant="ghost" size="sm">
                  +{notification.actions.length - maxActions} más
                </Button>
              )}
            </div>
          )}
          
          {/* Expiry warning */}
          {notification.expiresAt && new Date() > new Date(notification.expiresAt.getTime() - 24 * 60 * 60 * 1000) && (
            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              <Icon name="clock" size="xs" />
              <span>
                Expira: {notification.expiresAt.toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
)

NotificationCard.displayName = 'NotificationCard'

export { NotificationCard, notificationCardVariants }
export type { ConstructionNotification, NotificationType, NotificationPriority }