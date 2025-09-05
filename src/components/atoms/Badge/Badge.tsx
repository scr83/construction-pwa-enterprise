'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/atoms/Icon'

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border transition-colors',
  {
    variants: {
      variant: {
        default: 'border-secondary-200 bg-secondary-50 text-secondary-700 hover:bg-secondary-100',
        primary: 'border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100',
        secondary: 'border-secondary-300 bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
        success: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
        warning: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
        danger: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
        info: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
        
        // Construction-specific variants
        safety: 'border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
        quality: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
        material: 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
        urgent: 'border-red-300 bg-red-100 text-red-800 hover:bg-red-200 animate-pulse',
        completed: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        
        // Outline variants
        outline: 'border-secondary-300 bg-transparent text-secondary-700 hover:bg-secondary-50',
        'outline-primary': 'border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50',
        'outline-success': 'border-green-300 bg-transparent text-green-700 hover:bg-green-50',
        'outline-warning': 'border-orange-300 bg-transparent text-orange-700 hover:bg-orange-50',
        'outline-danger': 'border-red-300 bg-transparent text-red-700 hover:bg-red-50',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs min-h-[1.25rem]',
        sm: 'px-2 py-1 text-xs min-h-[1.5rem]',
        default: 'px-2.5 py-1 text-sm min-h-[1.75rem]',
        lg: 'px-3 py-1.5 text-sm min-h-[2rem]',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-md',
        pill: 'rounded-full px-3',
      },
      interactive: {
        none: '',
        clickable: 'cursor-pointer hover:shadow-sm active:scale-95',
        removable: 'cursor-pointer hover:shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
      interactive: 'none',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  
  // Icon support
  icon?: string
  iconPosition?: 'left' | 'right'
  
  // Dot indicator
  showDot?: boolean
  dotColor?: 'red' | 'green' | 'blue' | 'orange' | 'purple' | 'yellow'
  
  // Removable functionality
  onRemove?: () => void
  removeLabel?: string
  
  // Count/number display
  count?: number
  maxCount?: number
  showZero?: boolean
  
  // Construction-specific props
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED'
  role?: 'EXECUTIVE' | 'SITE_MANAGER' | 'SUPERVISOR' | 'WORKER' | 'QUALITY_INSPECTOR'
  
  // Pulse animation for urgent items
  pulse?: boolean
  
  // Tooltip
  tooltip?: string
  
  // Accessibility
  'aria-label'?: string
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      interactive,
      children,
      icon,
      iconPosition = 'left',
      showDot = false,
      dotColor = 'red',
      onRemove,
      removeLabel = 'Remove',
      count,
      maxCount = 99,
      showZero = false,
      priority,
      status,
      role,
      pulse = false,
      tooltip,
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Auto-determine variant based on construction-specific props
    const getVariantFromProps = (): string => {
      if (variant) return variant
      
      if (priority) {
        switch (priority) {
          case 'CRITICAL':
            return 'urgent'
          case 'HIGH':
            return 'danger'
          case 'MEDIUM':
            return 'warning'
          case 'LOW':
            return 'info'
        }
      }
      
      if (status) {
        switch (status) {
          case 'ACTIVE':
            return 'success'
          case 'COMPLETED':
            return 'completed'
          case 'PENDING':
            return 'warning'
          case 'CANCELLED':
            return 'danger'
          case 'INACTIVE':
            return 'secondary'
        }
      }
      
      if (role) {
        switch (role) {
          case 'EXECUTIVE':
            return 'primary'
          case 'SITE_MANAGER':
            return 'warning'
          case 'SUPERVISOR':
            return 'info'
          case 'QUALITY_INSPECTOR':
            return 'quality'
          case 'WORKER':
            return 'secondary'
        }
      }
      
      return 'default'
    }
    
    const finalVariant = getVariantFromProps()
    const finalInteractive = onRemove ? 'removable' : (onClick ? 'clickable' : interactive)
    
    // Format count display
    const displayCount = React.useMemo(() => {
      if (count === undefined) return null
      if (count === 0 && !showZero) return null
      if (count > maxCount) return `${maxCount}+`
      return count.toString()
    }, [count, maxCount, showZero])
    
    // Get dot color class
    const getDotColorClass = () => {
      switch (dotColor) {
        case 'red':
          return 'bg-red-500'
        case 'green':
          return 'bg-green-500'
        case 'blue':
          return 'bg-blue-500'
        case 'orange':
          return 'bg-orange-500'
        case 'purple':
          return 'bg-purple-500'
        case 'yellow':
          return 'bg-yellow-500'
        default:
          return 'bg-red-500'
      }
    }
    
    const badgeContent = (
      <>
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <Icon name={icon as any} size="xs" />
        )}
        
        {/* Dot indicator */}
        {showDot && (
          <span className={cn('w-2 h-2 rounded-full', getDotColorClass())} />
        )}
        
        {/* Content */}
        <span className="truncate">
          {displayCount !== null ? displayCount : children}
        </span>
        
        {/* Right icon */}
        {icon && iconPosition === 'right' && (
          <Icon name={icon as any} size="xs" />
        )}
        
        {/* Remove button */}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
            aria-label={removeLabel}
          >
            <Icon name="x-circle" size="xs" />
          </button>
        )}
      </>
    )

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({
            variant: finalVariant as any,
            size,
            shape,
            interactive: finalInteractive,
          }),
          pulse && 'animate-pulse',
          className
        )}
        onClick={onClick}
        title={tooltip}
        aria-label={ariaLabel}
        {...props}
      >
        {badgeContent}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }