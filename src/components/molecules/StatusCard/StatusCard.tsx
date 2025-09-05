'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Typography } from '@/components/atoms/Typography'
import { Icon, ConstructionStatusIcon } from '@/components/atoms/Icon'
import { Button } from '@/components/atoms/Button'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import type { WorkStatus } from '@/types'

const statusCardVariants = cva(
  'relative rounded-lg border bg-card p-4 shadow-sm transition-all duration-200',
  {
    variants: {
      status: {
        // Construction workflow status variants
        pending: 'border-secondary-200 bg-secondary-50 hover:border-secondary-300',
        'materials-planned': 'border-warning-200 bg-warning-50 hover:border-warning-300',
        'materials-available': 'border-primary-200 bg-primary-50 hover:border-primary-300', 
        'in-progress': 'border-primary-200 bg-primary-50 hover:border-primary-300',
        'quality-submitted': 'border-warning-200 bg-warning-50 hover:border-warning-300',
        'quality-approved': 'border-success-200 bg-success-50 hover:border-success-300',
        completed: 'border-success-200 bg-success-50 hover:border-success-300',
        rejected: 'border-danger-200 bg-danger-50 hover:border-danger-300',
        paid: 'border-success-300 bg-success-100 hover:border-success-400',
      },
      size: {
        compact: 'p-3',
        default: 'p-4',
        large: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md active:scale-[0.98] transition-transform',
        false: '',
      },
      priority: {
        low: '',
        normal: '',
        high: 'ring-2 ring-warning-200',
        critical: 'ring-2 ring-danger-300',
      },
    },
    defaultVariants: {
      status: 'pending',
      size: 'default',
      interactive: false,
      priority: 'normal',
    },
  }
)

// Construction workflow status mapping
const constructionStatusConfig = {
  ASSIGNED: {
    label: 'Faena Asignada',
    description: 'Trabajo asignado al equipo',
    variant: 'pending' as const,
    iconVariant: 'secondary' as const,
  },
  MATERIALS_PLANNED: {
    label: 'Kit de Material Inicial',
    description: 'Material planificado y cotizado',
    variant: 'materials-planned' as const,
    iconVariant: 'warning' as const,
  },
  MATERIALS_PURCHASED: {
    label: 'Kit Comprado',
    description: 'Material adquirido en proceso',
    variant: 'materials-planned' as const,
    iconVariant: 'warning' as const,
  },
  MATERIALS_AVAILABLE: {
    label: 'Kit Disponible en Bodega',
    description: 'Material listo para entregar',
    variant: 'materials-available' as const,
    iconVariant: 'primary' as const,
  },
  MATERIALS_DELIVERED: {
    label: 'Kit Entregado a Terreno',
    description: 'Material disponible en sitio',
    variant: 'materials-available' as const,
    iconVariant: 'primary' as const,
  },
  EXECUTED: {
    label: 'Faena Ejecutada',
    description: 'Trabajo completado en terreno',
    variant: 'in-progress' as const,
    iconVariant: 'primary' as const,
  },
  QUALITY_SUBMITTED: {
    label: 'Entregado a Calidad',
    description: 'Enviado para revisión de calidad',
    variant: 'quality-submitted' as const,
    iconVariant: 'warning' as const,
  },
  QUALITY_RECEIVED: {
    label: 'Recibido por Calidad',
    description: 'En proceso de inspección',
    variant: 'quality-submitted' as const,
    iconVariant: 'warning' as const,
  },
  QUALITY_APPROVED: {
    label: 'Recepcionado por Asesoría',
    description: 'Aprobado por control de calidad',
    variant: 'quality-approved' as const,
    iconVariant: 'success' as const,
  },
  COMPLETED: {
    label: 'Trabajo Completado',
    description: 'Faena terminada exitosamente',
    variant: 'completed' as const,
    iconVariant: 'success' as const,
  },
  PAID: {
    label: 'Trato Pagado',
    description: 'Pago procesado y confirmado',
    variant: 'paid' as const,
    iconVariant: 'success' as const,
  },
} as const

export interface StatusCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof statusCardVariants>, 'status'> {
  // Core content
  title: string
  subtitle?: string
  description?: string
  
  // Construction workflow status
  status: WorkStatus
  customStatusLabel?: string
  
  // Progress and metrics
  progress?: number // 0-100 percentage
  quantity?: number
  unit?: string // m², kg, etc.
  
  // Timestamps
  lastUpdated?: Date | string
  dueDate?: Date | string
  
  // Location and assignment
  location?: string // Building, Floor, Unit
  assignedTo?: string
  
  // Additional context
  priority?: 'low' | 'normal' | 'high' | 'critical'
  notes?: string
  photoCount?: number
  
  // Interaction
  onCardClick?: () => void
  onActionClick?: () => void
  actionLabel?: string
  
  // Visual customization
  showProgress?: boolean
  showTimestamp?: boolean
  showAssignment?: boolean
  compact?: boolean
}

const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  (
    {
      className,
      size,
      interactive,
      priority,
      title,
      subtitle,
      description,
      status,
      customStatusLabel,
      progress,
      quantity,
      unit,
      lastUpdated,
      dueDate,
      location,
      assignedTo,
      notes,
      photoCount,
      onCardClick,
      onActionClick,
      actionLabel,
      showProgress = false,
      showTimestamp = true,
      showAssignment = true,
      compact = false,
      ...props
    },
    ref
  ) => {
    const statusInfo = constructionStatusConfig[status] || constructionStatusConfig.ASSIGNED
    const isInteractive = interactive || !!onCardClick
    
    const handleCardClick = () => {
      if (onCardClick) {
        onCardClick()
      }
    }
    
    const handleActionClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onActionClick) {
        onActionClick()
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          statusCardVariants({
            status: statusInfo.variant,
            size: compact ? 'compact' : size,
            interactive: isInteractive,
            priority,
          }),
          className
        )}
        onClick={isInteractive ? handleCardClick : undefined}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCardClick()
                }
              }
            : undefined
        }
        {...props}
      >
        {/* Priority indicator */}
        {priority === 'critical' && (
          <div className="absolute right-2 top-2">
            <Icon name="alert-triangle" size="sm" variant="danger" />
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <ConstructionStatusIcon 
              status={
                status === 'COMPLETED' ? 'completed' :
                status === 'EXECUTED' ? 'in-progress' :
                status.includes('QUALITY') && status.includes('APPROVED') ? 'completed' :
                status.includes('QUALITY') ? 'warning' :
                status.includes('MATERIALS') ? 'in-progress' :
                'pending'
              }
              size={compact ? 'default' : 'lg'}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Typography 
                  variant={compact ? 'body-default' : 'h5'} 
                  className="truncate font-semibold"
                  title={title}
                >
                  {title}
                </Typography>
                
                {subtitle && (
                  <Typography 
                    variant="body-small" 
                    color="muted" 
                    className="truncate"
                    title={subtitle}
                  >
                    {subtitle}
                  </Typography>
                )}
              </div>
              
              {quantity && unit && (
                <div className="flex-shrink-0">
                  <Typography variant="body-small" className="font-mono font-medium">
                    {quantity} {unit}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <Typography 
              variant="label-small" 
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                statusInfo.variant === 'pending' && 'bg-secondary-100 text-secondary-700',
                statusInfo.variant === 'materials-planned' && 'bg-warning-100 text-warning-700',
                statusInfo.variant === 'materials-available' && 'bg-primary-100 text-primary-700',
                statusInfo.variant === 'in-progress' && 'bg-primary-100 text-primary-700',
                statusInfo.variant === 'quality-submitted' && 'bg-warning-100 text-warning-700',
                statusInfo.variant === 'quality-approved' && 'bg-success-100 text-success-700',
                statusInfo.variant === 'completed' && 'bg-success-100 text-success-700',
                statusInfo.variant === 'rejected' && 'bg-danger-100 text-danger-700',
                statusInfo.variant === 'paid' && 'bg-success-200 text-success-800'
              )}
            >
              {customStatusLabel || statusInfo.label}
            </Typography>
            
            {photoCount && photoCount > 0 && (
              <div className="flex items-center gap-1 text-secondary-500">
                <Icon name="camera" size="xs" />
                <Typography variant="caption">{photoCount}</Typography>
              </div>
            )}
          </div>
          
          {description && !compact && (
            <Typography variant="body-small" color="muted" className="mt-2">
              {description}
            </Typography>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && progress !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <Typography variant="caption" color="muted">
                Progreso
              </Typography>
              <Typography variant="caption" className="font-medium">
                {Math.round(progress)}%
              </Typography>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  progress >= 100 ? 'bg-success-500' :
                  progress >= 75 ? 'bg-primary-500' :
                  progress >= 50 ? 'bg-warning-500' :
                  'bg-secondary-400'
                )}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          </div>
        )}

        {/* Location and assignment */}
        {!compact && (showAssignment || location) && (
          <div className="mt-3 space-y-1">
            {location && (
              <div className="flex items-center gap-2">
                <Icon name="map-pin" size="xs" variant="muted" />
                <Typography variant="caption" color="muted">
                  {location}
                </Typography>
              </div>
            )}
            
            {showAssignment && assignedTo && (
              <div className="flex items-center gap-2">
                <Icon name="user" size="xs" variant="muted" />
                <Typography variant="caption" color="muted">
                  {assignedTo}
                </Typography>
              </div>
            )}
          </div>
        )}

        {/* Timestamps */}
        {showTimestamp && (lastUpdated || dueDate) && (
          <div className="mt-3 flex items-center justify-between text-xs text-secondary-500">
            {lastUpdated && (
              <div className="flex items-center gap-1">
                <Icon name="clock" size="xs" />
                <Typography variant="caption">
                  {formatRelativeTime(lastUpdated)}
                </Typography>
              </div>
            )}
            
            {dueDate && (
              <div className="flex items-center gap-1">
                <Icon name="calendar" size="xs" />
                <Typography variant="caption">
                  Vence: {formatDate(dueDate, { month: 'short', day: 'numeric' })}
                </Typography>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {notes && !compact && (
          <div className="mt-3">
            <Typography variant="body-small" className="text-secondary-600 italic">
              "{notes}"
            </Typography>
          </div>
        )}

        {/* Action button */}
        {actionLabel && onActionClick && (
          <div className="mt-4 pt-3 border-t border-secondary-200">
            <Button
              size="sm"
              variant="outline"
              onClick={handleActionClick}
              className="w-full"
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    )
  }
)
StatusCard.displayName = 'StatusCard'

export { StatusCard, statusCardVariants, constructionStatusConfig }