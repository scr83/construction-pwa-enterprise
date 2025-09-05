'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2, Wifi, WifiOff, RefreshCw, Cloud as CloudSync, Database, AlertCircle } from 'lucide-react'

const loadingVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      // Standard loading spinner
      default: '',
      // Sync-specific loading states
      sync: 'text-primary-600',
      offline: 'text-warning-600',
      error: 'text-danger-600',
      success: 'text-success-600',
    },
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    fullScreen: {
      true: 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    fullScreen: false,
  },
})

const spinnerVariants = cva('animate-spin', {
  variants: {
    speed: {
      slow: 'animate-spin-slow',
      default: 'animate-spin',
      fast: 'animate-spin-fast',
    },
  },
  defaultVariants: {
    speed: 'default',
  },
})

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  // Loading states
  message?: string
  submessage?: string
  
  // Sync-specific props
  syncType?: 'upload' | 'download' | 'offline' | 'database' | 'general'
  progress?: number // 0-100 percentage
  connectionStatus?: 'online' | 'offline' | 'poor' | 'connecting'
  
  // Construction-specific loading contexts
  constructionContext?: 'materials' | 'quality' | 'work-record' | 'photos' | 'project' | 'general'
  
  // Visual customization
  showIcon?: boolean
  showMessage?: boolean
  overlay?: boolean // For full-screen loading
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      className,
      variant,
      size,
      fullScreen,
      message,
      submessage,
      syncType = 'general',
      progress,
      connectionStatus = 'online',
      constructionContext = 'general',
      showIcon = true,
      showMessage = true,
      overlay = false,
      ...props
    },
    ref
  ) => {
    // Get appropriate icon based on sync type and connection status
    const getLoadingIcon = () => {
      if (!showIcon) return null
      
      const iconSize = size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'default' ? 24 : size === 'lg' ? 32 : 48
      
      if (connectionStatus === 'offline') {
        return <WifiOff size={iconSize} className="text-warning-600" />
      }
      
      switch (syncType) {
        case 'upload':
          return <CloudSync size={iconSize} className="animate-pulse" />
        case 'download':
          return <RefreshCw size={iconSize} className={spinnerVariants({})} />
        case 'database':
          return <Database size={iconSize} className="animate-pulse" />
        case 'offline':
          return <WifiOff size={iconSize} />
        default:
          return <Loader2 size={iconSize} className={spinnerVariants({})} />
      }
    }
    
    // Get loading message based on context
    const getDefaultMessage = () => {
      if (message) return message
      
      if (connectionStatus === 'offline') {
        return 'Trabajando sin conexión...'
      }
      
      switch (constructionContext) {
        case 'materials':
          return 'Sincronizando inventario de materiales...'
        case 'quality':
          return 'Actualizando registros de calidad...'
        case 'work-record':
          return 'Guardando registro de faena...'
        case 'photos':
          return 'Subiendo fotografías...'
        case 'project':
          return 'Cargando datos del proyecto...'
        default:
          return 'Cargando...'
      }
    }
    
    // Get submessage for connection status
    const getConnectionSubmessage = () => {
      if (submessage) return submessage
      
      switch (connectionStatus) {
        case 'offline':
          return 'Los datos se sincronizarán al reconectar'
        case 'poor':
          return 'Conexión lenta, por favor espere...'
        case 'connecting':
          return 'Reconectando...'
        default:
          return null
      }
    }

    const content = (
      <div
        className={cn(
          loadingVariants({ variant, size, fullScreen }),
          fullScreen && 'flex-col gap-4',
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Loading icon */}
          {showIcon && (
            <div className="flex items-center gap-2">
              {getLoadingIcon()}
              {connectionStatus === 'online' && (
                <Wifi size={16} className="text-success-600" />
              )}
              {connectionStatus === 'poor' && (
                <AlertCircle size={16} className="text-warning-600" />
              )}
            </div>
          )}
          
          {/* Progress bar */}
          {progress !== undefined && (
            <div className="w-48 bg-secondary-200 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  connectionStatus === 'offline'
                    ? 'bg-warning-500'
                    : variant === 'error'
                    ? 'bg-danger-500'
                    : 'bg-primary-500'
                )}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          )}
          
          {/* Messages */}
          {showMessage && (
            <div className="text-center space-y-1">
              <p
                className={cn(
                  'font-medium',
                  size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base',
                  fullScreen && 'text-lg',
                  connectionStatus === 'offline' ? 'text-warning-700' : 'text-secondary-800'
                )}
              >
                {getDefaultMessage()}
              </p>
              
              {getConnectionSubmessage() && (
                <p
                  className={cn(
                    'text-secondary-600',
                    size === 'xs' ? 'text-xs' : 'text-sm',
                    fullScreen && 'text-base'
                  )}
                >
                  {getConnectionSubmessage()}
                </p>
              )}
              
              {progress !== undefined && (
                <p className="text-xs text-secondary-500 font-mono">
                  {Math.round(progress)}% completado
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )

    if (overlay || fullScreen) {
      return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          {content}
        </div>
      )
    }

    return content
  }
)
Loading.displayName = 'Loading'

// Specialized loading components for common construction scenarios
export const MaterialsLoading: React.FC<{ progress?: number }> = ({ progress }) => (
  <Loading
    constructionContext="materials"
    syncType="database"
    {...(progress !== undefined && { progress })}
    size="lg"
  />
)

export const PhotoUploadLoading: React.FC<{ progress?: number; connectionStatus?: LoadingProps['connectionStatus'] }> = ({ 
  progress, 
  connectionStatus 
}) => (
  <Loading
    constructionContext="photos"
    syncType="upload"
    {...(progress !== undefined && { progress })}
    {...(connectionStatus && { connectionStatus })}
    size="lg"
  />
)

export const WorkRecordLoading: React.FC<{ connectionStatus?: LoadingProps['connectionStatus'] }> = ({ 
  connectionStatus = 'online'
}) => (
  <Loading
    constructionContext="work-record"
    syncType={connectionStatus === 'offline' ? 'offline' : 'upload'}
    connectionStatus={connectionStatus}
    size="default"
  />
)

export const QualityCheckLoading: React.FC = () => (
  <Loading
    constructionContext="quality"
    syncType="database"
    size="lg"
  />
)

export { Loading, loadingVariants }