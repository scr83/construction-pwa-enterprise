'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { formatCurrency } from '@/lib/utils'

const metricDisplayVariants = cva(
  'relative rounded-lg border bg-card p-4 shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-secondary-200 bg-white hover:shadow-md',
        success: 'border-success-200 bg-success-50 hover:border-success-300',
        warning: 'border-warning-200 bg-warning-50 hover:border-warning-300',
        danger: 'border-danger-200 bg-danger-50 hover:border-danger-300',
        primary: 'border-primary-200 bg-primary-50 hover:border-primary-300',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  }
)

// Metric type configurations
export type MetricType = 'percentage' | 'currency' | 'count' | 'score' | 'ratio' | 'duration' | 'area' | 'volume' | 'weight'

const metricTypeConfig: Record<MetricType, {
  format: (value: number, unit?: string) => string
  defaultUnit?: string
}> = {
  percentage: {
    format: (value) => `${Math.round(value * 100) / 100}%`,
  },
  currency: {
    format: (value, unit = 'CLP') => {
      if (unit === 'CLP') return formatCurrency(value, 'CLP')
      if (unit === 'USD') return formatCurrency(value, 'USD')
      return `${value.toLocaleString()} ${unit}`
    },
    defaultUnit: 'CLP',
  },
  count: {
    format: (value, unit) => unit ? `${value.toLocaleString()} ${unit}` : value.toLocaleString(),
  },
  score: {
    format: (value, unit = '/10') => `${Math.round(value * 10) / 10}${unit}`,
    defaultUnit: '/10',
  },
  ratio: {
    format: (value, unit) => unit ? `${value}:${unit}` : `${value}`,
  },
  duration: {
    format: (value, unit = 'días') => `${value} ${unit}`,
    defaultUnit: 'días',
  },
  area: {
    format: (value, unit = 'm²') => `${value.toLocaleString()} ${unit}`,
    defaultUnit: 'm²',
  },
  volume: {
    format: (value, unit = 'm³') => `${value.toLocaleString()} ${unit}`,
    defaultUnit: 'm³',
  },
  weight: {
    format: (value, unit = 'kg') => `${value.toLocaleString()} ${unit}`,
    defaultUnit: 'kg',
  },
}

export type TrendDirection = 'up' | 'down' | 'neutral'

export interface MetricDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricDisplayVariants> {
  // Core content
  label: string
  value: number
  metricType?: MetricType
  unit?: string
  
  // Comparison and trends
  previousValue?: number
  change?: number // Absolute change
  changePercentage?: number // Percentage change
  trend?: TrendDirection
  
  // Visual indicators
  icon?: React.ReactNode
  target?: number // Target value for progress indication
  threshold?: {
    good?: number // Values above this are good
    warning?: number // Values above this are warning
    critical?: number // Values below this are critical
  }
  
  // Additional context
  description?: string
  subtitle?: string
  period?: string // "Último mes", "Esta semana", etc.
  
  // Interaction
  onClick?: () => void
  
  // Visual customization
  showTrend?: boolean
  showProgress?: boolean
  showComparison?: boolean
  compact?: boolean
}

const MetricDisplay = React.forwardRef<HTMLDivElement, MetricDisplayProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      label,
      value,
      metricType = 'count',
      unit,
      previousValue,
      change,
      changePercentage,
      trend,
      icon,
      target,
      threshold,
      description,
      subtitle,
      period,
      onClick,
      showTrend = true,
      showProgress = false,
      showComparison = true,
      compact = false,
      ...props
    },
    ref
  ) => {
    const typeConfig = metricTypeConfig[metricType]
    const displayUnit = unit || typeConfig.defaultUnit
    const isInteractive = interactive || !!onClick
    
    // Auto-detect variant based on threshold values
    const getAutoVariant = (): VariantProps<typeof metricDisplayVariants>['variant'] => {
      if (variant !== 'default') return variant
      
      if (!threshold) return 'default'
      
      if (threshold.critical !== undefined && value <= threshold.critical) return 'danger'
      if (threshold.warning !== undefined && value <= threshold.warning) return 'warning'  
      if (threshold.good !== undefined && value >= threshold.good) return 'success'
      
      return 'default'
    }
    
    // Calculate trend direction from comparison values
    const getCalculatedTrend = (): TrendDirection => {
      if (trend) return trend
      
      if (changePercentage !== undefined) {
        if (changePercentage > 2) return 'up'
        if (changePercentage < -2) return 'down'
        return 'neutral'
      }
      
      if (change !== undefined && previousValue !== undefined) {
        const changePercent = (change / previousValue) * 100
        if (changePercent > 2) return 'up'
        if (changePercent < -2) return 'down'
        return 'neutral'
      }
      
      return 'neutral'
    }
    
    const autoVariant = getAutoVariant()
    const calculatedTrend = getCalculatedTrend()
    const formattedValue = typeConfig.format(value, displayUnit)
    
    // Calculate progress percentage if target is provided
    const progressPercentage = target ? Math.min((value / target) * 100, 100) : undefined
    
    const handleClick = () => {
      if (onClick) {
        onClick()
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          metricDisplayVariants({
            variant: autoVariant,
            size: compact ? 'compact' : size,
            interactive: isInteractive,
          }),
          className
        )}
        onClick={isInteractive ? handleClick : undefined}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleClick()
                }
              }
            : undefined
        }
        {...props}
      >
        {/* Header with icon and period */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {icon && (
              <div className="flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Typography 
                variant={compact ? 'label-small' : 'label-default'} 
                color="muted" 
                className="truncate"
                title={label}
              >
                {label}
              </Typography>
            </div>
          </div>
          
          {period && (
            <Typography variant="caption" color="muted">
              {period}
            </Typography>
          )}
        </div>

        {/* Main value */}
        <div className="mt-2">
          <Typography 
            variant={compact ? 'h5' : size === 'large' ? 'h3' : 'h4'}
            className="font-bold"
          >
            {formattedValue}
          </Typography>
          
          {subtitle && !compact && (
            <Typography variant="body-small" color="muted" className="mt-1">
              {subtitle}
            </Typography>
          )}
        </div>

        {/* Progress bar for target tracking */}
        {showProgress && progressPercentage !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <Typography variant="caption" color="muted">
                Meta: {typeConfig.format(target!, displayUnit)}
              </Typography>
              <Typography variant="caption" className="font-medium">
                {Math.round(progressPercentage)}%
              </Typography>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  progressPercentage >= 100 ? 'bg-success-500' :
                  progressPercentage >= 75 ? 'bg-primary-500' :
                  progressPercentage >= 50 ? 'bg-warning-500' :
                  'bg-secondary-400'
                )}
                style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
              />
            </div>
          </div>
        )}

        {/* Trend and comparison */}
        {(showTrend || showComparison) && (changePercentage !== undefined || change !== undefined || previousValue !== undefined) && (
          <div className="mt-3 flex items-center gap-3">
            {/* Trend indicator */}
            {showTrend && (
              <div className="flex items-center gap-1">
                {calculatedTrend === 'up' && (
                  <Icon name="trending-up" size="xs" variant="success" />
                )}
                {calculatedTrend === 'down' && (
                  <Icon name="trending-down" size="xs" variant="danger" />
                )}
                {calculatedTrend === 'neutral' && (
                  <div className="w-3 h-0.5 bg-secondary-400 rounded" />
                )}
              </div>
            )}
            
            {/* Comparison text */}
            {showComparison && (
              <div className="flex-1">
                {changePercentage !== undefined && (
                  <Typography 
                    variant="caption" 
                    className={cn(
                      'font-medium',
                      calculatedTrend === 'up' && 'text-success-600',
                      calculatedTrend === 'down' && 'text-danger-600',
                      calculatedTrend === 'neutral' && 'text-secondary-600'
                    )}
                  >
                    {changePercentage > 0 ? '+' : ''}{Math.round(changePercentage * 100) / 100}%
                  </Typography>
                )}
                
                {change !== undefined && previousValue !== undefined && changePercentage === undefined && (
                  <Typography 
                    variant="caption" 
                    className={cn(
                      'font-medium',
                      change > 0 ? 'text-success-600' : change < 0 ? 'text-danger-600' : 'text-secondary-600'
                    )}
                  >
                    {change > 0 ? '+' : ''}{typeConfig.format(change, displayUnit)}
                  </Typography>
                )}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {description && !compact && (
          <div className="mt-3 pt-3 border-t border-secondary-200">
            <Typography variant="body-small" color="muted">
              {description}
            </Typography>
          </div>
        )}
      </div>
    )
  }
)
MetricDisplay.displayName = 'MetricDisplay'

export { MetricDisplay, metricDisplayVariants, metricTypeConfig }