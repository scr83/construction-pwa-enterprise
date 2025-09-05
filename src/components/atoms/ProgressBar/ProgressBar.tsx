'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/atoms/Icon'

const progressBarVariants = cva(
  'relative overflow-hidden rounded-full bg-secondary-200',
  {
    variants: {
      size: {
        xs: 'h-1',
        sm: 'h-2',
        default: 'h-3',
        lg: 'h-4',
        xl: 'h-6',
      },
      variant: {
        default: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
        
        // Construction-specific variants
        quality: '',
        safety: '',
        progress: '',
        completion: '',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
)

const progressFillVariants = cva(
  'h-full transition-all duration-500 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-primary-600',
        success: 'bg-green-600',
        warning: 'bg-orange-600',
        danger: 'bg-red-600',
        info: 'bg-blue-600',
        
        // Construction-specific variants
        quality: 'bg-purple-600',
        safety: 'bg-yellow-600',
        progress: 'bg-blue-600',
        completion: 'bg-emerald-600',
      },
      animated: {
        true: 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-[shimmer_2s_infinite]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      animated: false,
    },
  }
)

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressBarVariants> {
  // Progress value
  value: number
  max?: number
  
  // Display options
  showLabel?: boolean
  showPercentage?: boolean
  label?: string
  
  // Construction-specific features
  target?: number
  variance?: number
  unit?: string
  milestone?: boolean
  
  // Visual enhancements
  animated?: boolean
  striped?: boolean
  pulse?: boolean
  
  // Status indicators
  status?: 'on-track' | 'ahead' | 'behind' | 'critical'
  
  // Thresholds for color changes
  thresholds?: {
    warning?: number
    danger?: number
    success?: number
  }
  
  // Icons
  icon?: string
  
  // Format functions
  formatValue?: (value: number, max: number) => string
  formatLabel?: (value: number, max: number, target?: number) => string
  
  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      size,
      variant,
      value,
      max = 100,
      showLabel = false,
      showPercentage = false,
      label,
      target,
      variance,
      unit,
      milestone = false,
      animated = false,
      striped = false,
      pulse = false,
      status,
      thresholds,
      icon,
      formatValue,
      formatLabel,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // Calculate percentage
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    // Auto-determine variant based on thresholds or status
    const getVariantFromValue = (): string => {
      if (variant && variant !== 'default') return variant
      
      if (status) {
        switch (status) {
          case 'critical':
            return 'danger'
          case 'behind':
            return 'warning'
          case 'ahead':
            return 'info'
          case 'on-track':
            return 'success'
        }
      }
      
      if (thresholds) {
        if (thresholds.danger && percentage <= thresholds.danger) return 'danger'
        if (thresholds.warning && percentage <= thresholds.warning) return 'warning'
        if (thresholds.success && percentage >= thresholds.success) return 'success'
      }
      
      // Construction-specific auto-variants
      if (target) {
        const targetPercentage = (target / max) * 100
        const diff = percentage - targetPercentage
        
        if (Math.abs(diff) <= 5) return 'success' // Within 5% of target
        if (diff < -10) return 'danger' // More than 10% behind
        if (diff < 0) return 'warning' // Behind target
        return 'info' // Ahead of target
      }
      
      return 'default'
    }
    
    const finalVariant = getVariantFromValue()
    
    // Format display value
    const getDisplayValue = (): string => {
      if (formatValue) return formatValue(value, max)
      if (unit) return `${value}${unit}`
      return value.toString()
    }
    
    // Format label text
    const getDisplayLabel = (): string => {
      if (formatLabel) return formatLabel(value, max, target)
      if (label) return label
      if (showPercentage) return `${percentage.toFixed(1)}%`
      return getDisplayValue()
    }
    
    // Calculate target position if provided
    const targetPosition = target ? Math.min(Math.max((target / max) * 100, 0), 100) : undefined
    
    // Get variance status
    const getVarianceStatus = () => {
      if (!target || variance === undefined) return null
      
      const targetValue = target
      const diff = Math.abs(value - targetValue)
      const variancePercentage = (diff / targetValue) * 100
      
      if (variancePercentage <= variance) return 'within'
      if (value < targetValue) return 'below'
      return 'above'
    }
    
    const varianceStatus = getVarianceStatus()

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {/* Label and Value */}
        {(showLabel || showPercentage || label) && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {icon && <Icon name={icon as any} size="sm" />}
              
              <span className="text-sm font-medium text-secondary-900">
                {getDisplayLabel()}
              </span>
              
              {milestone && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  Hito
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {target && (
                <span className="text-xs text-secondary-600">
                  Meta: {target}{unit}
                </span>
              )}
              
              {showPercentage && (
                <span className="text-sm font-medium text-secondary-700">
                  {percentage.toFixed(1)}%
                </span>
              )}
              
              {varianceStatus && (
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded font-medium',
                  varianceStatus === 'within' && 'bg-green-100 text-green-700',
                  varianceStatus === 'above' && 'bg-blue-100 text-blue-700',
                  varianceStatus === 'below' && 'bg-red-100 text-red-700'
                )}>
                  {varianceStatus === 'within' && '✓ En meta'}
                  {varianceStatus === 'above' && '↑ Sobre meta'}
                  {varianceStatus === 'below' && '↓ Bajo meta'}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className={cn(progressBarVariants({ size, variant: finalVariant }))}>
          {/* Progress Fill */}
          <div
            className={cn(
              progressFillVariants({ variant: finalVariant, animated }),
              striped && 'bg-stripes',
              pulse && 'animate-pulse'
            )}
            style={{ width: `${percentage}%` }}
          />
          
          {/* Target Indicator */}
          {targetPosition !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-secondary-700 z-10"
              style={{ left: `${targetPosition}%` }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary-700 rotate-45" />
            </div>
          )}
          
          {/* Animated Shimmer Effect */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
          )}
        </div>
        
        {/* Additional Info */}
        {(target || variance !== undefined) && (
          <div className="flex items-center justify-between mt-1 text-xs text-secondary-600">
            {target && (
              <span>
                Progreso: {value} / {max} {unit}
              </span>
            )}
            
            {variance !== undefined && target && (
              <span>
                Variación permitida: ±{variance}%
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

// Multi-Progress Component for construction phases
export interface MultiProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  phases: Array<{
    id: string
    label: string
    value: number
    max: number
    variant?: ProgressBarProps['variant']
    target?: number
  }>
  
  // Display options
  showLabels?: boolean
  showPercentages?: boolean
  showTotals?: boolean
  
  // Layout
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'default' | 'lg'
  
  // Overall progress
  showOverall?: boolean
  overallLabel?: string
}

const MultiProgress = React.forwardRef<HTMLDivElement, MultiProgressProps>(
  (
    {
      className,
      phases,
      showLabels = true,
      showPercentages = true,
      showTotals = false,
      orientation = 'vertical',
      spacing = 'default',
      showOverall = true,
      overallLabel = 'Progreso General',
      ...props
    },
    ref
  ) => {
    // Calculate overall progress
    const totalValue = phases.reduce((sum, phase) => sum + phase.value, 0)
    const totalMax = phases.reduce((sum, phase) => sum + phase.max, 0)
    const overallPercentage = totalMax > 0 ? (totalValue / totalMax) * 100 : 0
    
    const spacingClasses = {
      sm: 'gap-2',
      default: 'gap-3',
      lg: 'gap-4',
    }
    
    const orientationClasses = {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    }

    return (
      <div
        ref={ref}
        className={cn('w-full space-y-4', className)}
        {...props}
      >
        {/* Overall Progress */}
        {showOverall && (
          <ProgressBar
            value={overallPercentage}
            max={100}
            label={overallLabel}
            showPercentage={showPercentages}
            variant="progress"
            size="lg"
          />
        )}
        
        {/* Individual Phases */}
        <div className={cn(
          'flex',
          orientationClasses[orientation],
          spacingClasses[spacing]
        )}>
          {phases.map((phase) => (
            <div key={phase.id} className={orientation === 'horizontal' ? 'flex-1' : ''}>
              <ProgressBar
                value={phase.value}
                max={phase.max}
                label={showLabels ? phase.label : undefined}
                showPercentage={showPercentages}
                target={phase.target}
                variant={phase.variant || 'default'}
                size="default"
              />
              
              {showTotals && (
                <div className="text-xs text-secondary-600 mt-1">
                  {phase.value} / {phase.max}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)

MultiProgress.displayName = 'MultiProgress'

export { ProgressBar, MultiProgress, progressBarVariants }