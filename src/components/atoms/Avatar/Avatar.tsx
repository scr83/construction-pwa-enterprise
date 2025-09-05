'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/atoms/Icon'
import { Badge } from '@/components/atoms/Badge'

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden bg-secondary-100 text-secondary-600 select-none',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        default: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-20 w-20 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
        rounded: 'rounded-lg',
      },
      variant: {
        default: 'bg-secondary-100 text-secondary-600',
        primary: 'bg-primary-100 text-primary-700',
        secondary: 'bg-secondary-200 text-secondary-700',
        
        // Construction role-based colors
        executive: 'bg-purple-100 text-purple-700',
        site_manager: 'bg-orange-100 text-orange-700',
        supervisor: 'bg-blue-100 text-blue-700',
        quality_inspector: 'bg-green-100 text-green-700',
        worker: 'bg-gray-100 text-gray-700',
        
        // Status-based colors
        online: 'bg-green-100 text-green-700',
        offline: 'bg-red-100 text-red-700',
        away: 'bg-yellow-100 text-yellow-700',
        busy: 'bg-red-100 text-red-700',
      },
      border: {
        none: '',
        thin: 'ring-2 ring-white',
        thick: 'ring-4 ring-white',
      },
    },
    defaultVariants: {
      size: 'default',
      shape: 'circle',
      variant: 'default',
      border: 'none',
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  // Image source
  src?: string
  alt?: string
  
  // Fallback content
  name?: string
  initials?: string
  fallbackIcon?: string
  
  // Status indicator
  status?: 'online' | 'offline' | 'away' | 'busy' | 'do-not-disturb'
  showStatus?: boolean
  statusPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  
  // Construction role
  role?: 'EXECUTIVE' | 'SITE_MANAGER' | 'SUPERVISOR' | 'QUALITY_INSPECTOR' | 'WORKER'
  
  // Badge/notification
  badge?: string | number
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  showBadge?: boolean
  
  // Interactive states
  clickable?: boolean
  loading?: boolean
  
  // Tooltip
  tooltip?: string
  
  // Error handling
  onError?: () => void
  onLoad?: () => void
  
  // Group avatar functionality
  groupCount?: number
  maxGroupDisplay?: number
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      shape,
      variant,
      border,
      src,
      alt,
      name,
      initials,
      fallbackIcon = 'user',
      status,
      showStatus = false,
      statusPosition = 'bottom-right',
      role,
      badge,
      badgeVariant = 'primary',
      showBadge = false,
      clickable = false,
      loading = false,
      tooltip,
      onError,
      onLoad,
      groupCount,
      maxGroupDisplay = 99,
      onClick,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false)
    
    // Auto-determine variant based on role
    const getVariantFromRole = (): string => {
      if (variant !== 'default') return variant as string
      
      if (role) {
        switch (role) {
          case 'EXECUTIVE':
            return 'executive'
          case 'SITE_MANAGER':
            return 'site_manager'
          case 'SUPERVISOR':
            return 'supervisor'
          case 'QUALITY_INSPECTOR':
            return 'quality_inspector'
          case 'WORKER':
            return 'worker'
        }
      }
      
      if (status) {
        return status
      }
      
      return 'default'
    }
    
    // Generate initials from name
    const getInitials = (): string => {
      if (initials) return initials
      if (!name) return ''
      
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    }
    
    // Handle image load error
    const handleImageError = () => {
      setImageError(true)
      if (onError) onError()
    }
    
    // Handle image load success
    const handleImageLoad = () => {
      if (onLoad) onLoad()
    }
    
    // Get status indicator color
    const getStatusColor = () => {
      switch (status) {
        case 'online':
          return 'bg-green-500'
        case 'away':
          return 'bg-yellow-500'
        case 'busy':
        case 'do-not-disturb':
          return 'bg-red-500'
        case 'offline':
        default:
          return 'bg-gray-400'
      }
    }
    
    // Get status position classes
    const getStatusPositionClasses = () => {
      const sizeMap = {
        xs: 'w-2 h-2',
        sm: 'w-2.5 h-2.5',
        default: 'w-3 h-3',
        lg: 'w-3.5 h-3.5',
        xl: 'w-4 h-4',
        '2xl': 'w-5 h-5',
      }
      
      const positionMap = {
        'top-right': 'top-0 right-0',
        'bottom-right': 'bottom-0 right-0',
        'top-left': 'top-0 left-0',
        'bottom-left': 'bottom-0 left-0',
      }
      
      return cn(
        'absolute rounded-full border-2 border-white',
        sizeMap[size || 'default'],
        positionMap[statusPosition]
      )
    }
    
    // Get badge position classes
    const getBadgePositionClasses = () => {
      const positionMap = {
        xs: '-top-1 -right-1',
        sm: '-top-1 -right-1',
        default: '-top-2 -right-2',
        lg: '-top-2 -right-2',
        xl: '-top-3 -right-3',
        '2xl': '-top-3 -right-3',
      }
      
      return cn('absolute', positionMap[size || 'default'])
    }
    
    const finalVariant = getVariantFromRole()
    const displayInitials = getInitials()
    const shouldShowImage = src && !imageError && !loading
    
    // Format group count
    const displayGroupCount = React.useMemo(() => {
      if (!groupCount) return null
      if (groupCount > maxGroupDisplay) return `${maxGroupDisplay}+`
      return groupCount.toString()
    }, [groupCount, maxGroupDisplay])

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({
            size,
            shape,
            variant: finalVariant as any,
            border,
          }),
          clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
          loading && 'animate-pulse',
          className
        )}
        onClick={onClick}
        title={tooltip || name}
        {...props}
      >
        {/* Image */}
        {shouldShowImage && (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
        {/* Fallback content */}
        {!shouldShowImage && (
          <>
            {loading ? (
              <div className="animate-spin">
                <Icon name="refresh" size={size === 'xs' || size === 'sm' ? 'xs' : 'sm'} />
              </div>
            ) : displayInitials ? (
              <span className="font-medium">
                {displayInitials}
              </span>
            ) : displayGroupCount ? (
              <span className="font-semibold">
                {displayGroupCount}
              </span>
            ) : (
              <Icon 
                name={fallbackIcon as any} 
                size={size === 'xs' || size === 'sm' ? 'xs' : size === 'lg' || size === 'xl' || size === '2xl' ? 'lg' : 'sm'} 
              />
            )}
          </>
        )}
        
        {/* Status indicator */}
        {showStatus && status && (
          <span
            className={cn(
              getStatusPositionClasses(),
              getStatusColor()
            )}
            aria-label={`Status: ${status}`}
          />
        )}
        
        {/* Badge */}
        {(showBadge || badge) && badge && (
          <div className={getBadgePositionClasses()}>
            <Badge
              size="xs"
              variant={badgeVariant}
              shape="rounded"
            >
              {typeof badge === 'string' ? badge : badge?.toString() || ''}
            </Badge>
          </div>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar, avatarVariants }