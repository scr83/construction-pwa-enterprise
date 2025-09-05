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

const userMenuVariants = cva(
  'relative inline-block text-left',
  {
    variants: {
      variant: {
        default: '',
        compact: '',
        mobile: 'w-full',
      },
      position: {
        'bottom-right': '',
        'bottom-left': '',
        'top-right': '',
        'top-left': '',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'bottom-right',
    },
  }
)

export interface UserMenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userMenuVariants> {
  // User information
  user: {
    id: string
    name: string
    email?: string
    role: 'EXECUTIVE' | 'SITE_MANAGER' | 'SUPERVISOR' | 'QUALITY_INSPECTOR' | 'WORKER'
    avatar?: string
    status?: 'online' | 'offline' | 'away' | 'busy'
    project?: string
    shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT'
  }
  
  // Menu configuration
  menuItems?: Array<{
    id: string
    label: string
    icon: string
    href?: string
    onClick?: () => void
    badge?: string | number
    separator?: boolean
    disabled?: boolean
  }>
  
  // Construction-specific features
  showProjectInfo?: boolean
  showShiftInfo?: boolean
  showStatusToggle?: boolean
  
  // Notification counts
  notifications?: number
  criticalAlerts?: number
  
  // Menu behavior
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  closeOnClick?: boolean
  
  // Actions
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  onStatusChange?: (status: UserMenuProps['user']['status']) => void
  
  // Customization
  showAvatar?: boolean
  showName?: boolean
  showRole?: boolean
  showEmail?: boolean
  
  // Mobile optimization
  fullWidth?: boolean
}

const UserMenu = React.forwardRef<HTMLDivElement, UserMenuProps>(
  (
    {
      className,
      variant,
      position,
      user,
      menuItems = [],
      showProjectInfo = true,
      showShiftInfo = true,
      showStatusToggle = false,
      notifications = 0,
      criticalAlerts = 0,
      isOpen,
      onOpenChange,
      closeOnClick = true,
      onProfileClick,
      onSettingsClick,
      onLogoutClick,
      onStatusChange,
      showAvatar = true,
      showName = true,
      showRole = true,
      showEmail = false,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const open = isOpen !== undefined ? isOpen : internalOpen
    
    // Get current role for navigation
    const currentRole = searchParams.get('role')
    const roleQuery = currentRole ? `?role=${currentRole}` : ''
    
    // Handle menu toggle
    const handleToggle = () => {
      const newOpen = !open
      setInternalOpen(newOpen)
      if (onOpenChange) onOpenChange(newOpen)
    }
    
    // Handle menu item click
    const handleMenuItemClick = (item: NonNullable<UserMenuProps['menuItems']>[0]) => {
      console.log('🔥 MENU ITEM CLICKED:', item.id, item.label)
      console.log('🔥 Item disabled?', item.disabled)
      console.log('🔥 Item has onClick?', !!item.onClick)
      
      if (item.disabled) {
        console.log('🔥 ITEM DISABLED - RETURNING')
        return
      }
      
      if (item.onClick) {
        console.log('🔥 CALLING ITEM.ONCLICK')
        try {
          item.onClick()
          console.log('🔥 ONCLICK EXECUTED SUCCESSFULLY')
        } catch (error) {
          console.error('🔥 ONCLICK ERROR:', error)
        }
      } else {
        console.log('🔥 NO ONCLICK HANDLER')
      }
      
      if (closeOnClick) {
        console.log('🔥 CLOSING MENU')
        setInternalOpen(false)
        if (onOpenChange) onOpenChange(false)
      }
    }
    
    // Close menu when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setInternalOpen(false)
          if (onOpenChange) onOpenChange(false)
        }
      }
      
      if (open) {
        // Use a slight delay to avoid immediate closure
        setTimeout(() => {
          document.addEventListener('mousedown', handleClickOutside)
        }, 100)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, onOpenChange])
    
    // Get role label in Spanish
    const getRoleLabel = (role: UserMenuProps['user']['role']) => {
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
    
    // Get shift label in Spanish
    const getShiftLabel = (shift: UserMenuProps['user']['shift']) => {
      switch (shift) {
        case 'MORNING':
          return 'Mañana'
        case 'AFTERNOON':
          return 'Tarde'
        case 'NIGHT':
          return 'Noche'
        default:
          return shift
      }
    }
    
    // Default menu items with navigation
    const defaultMenuItems = [
      {
        id: 'profile',
        label: 'Mi Perfil',
        icon: 'user',
        onClick: onProfileClick || (() => router.push(`/profile${roleQuery}`)),
      },
      {
        id: 'settings',
        label: 'Configuración',
        icon: 'settings',
        onClick: onSettingsClick || (() => router.push(`/settings${roleQuery}`)),
      },
      {
        id: 'notifications',
        label: 'Notificaciones',
        icon: 'bell',
        badge: notifications > 0 ? notifications : undefined,
        onClick: () => router.push(`/notifications${roleQuery}`),
      },
      {
        id: 'separator1',
        label: '',
        icon: '',
        separator: true,
      },
      {
        id: 'help',
        label: 'Ayuda y Soporte',
        icon: 'help-circle',
        onClick: () => router.push(`/help${roleQuery}`),
      },
      {
        id: 'separator2',
        label: '',
        icon: '',
        separator: true,
      },
      {
        id: 'test-alert',
        label: '🔥 TEST ALERT',
        icon: 'bell',
        onClick: () => {
          alert('DROPDOWN ITEM CLICKED!')
        },
      },
      {
        id: 'logout',
        label: 'Cerrar Sesión',
        icon: 'log-out',
        onClick: onLogoutClick || (() => {
          console.log('🔥 LOGOUT ONCLICK CALLED')
          alert('LOGOUT CLICKED - WILL SIGNOUT')
          signOut({ callbackUrl: 'http://localhost:3000/' })
        }),
      },
      {
        id: 'emergency-logout',
        label: 'Salir (Alternativo)',
        icon: '',
        onClick: () => {
          console.log('🔥 EMERGENCY LOGOUT ONCLICK CALLED')
          alert('EMERGENCY LOGOUT - WILL REDIRECT')
          window.location.href = 'http://localhost:3000/'
        },
      },
    ]
    
    const allMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems
    
    // Get dropdown position classes
    const getDropdownPositionClasses = () => {
      switch (position) {
        case 'bottom-left':
          return 'left-0 mt-2'
        case 'top-right':
          return 'right-0 mb-2 bottom-full'
        case 'top-left':
          return 'left-0 mb-2 bottom-full'
        case 'bottom-right':
        default:
          return 'right-0 mt-2'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(userMenuVariants({ variant, position }), className)}
        {...props}
      >
        {/* Menu Trigger */}
        <Button
          variant="ghost"
          onClick={handleToggle}
          className={cn(
            'relative flex items-center gap-3 p-2',
            fullWidth && 'w-full justify-start',
            variant === 'compact' && 'gap-2',
            open && 'bg-secondary-100'
          )}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {/* Avatar */}
          {showAvatar && (
            <div className="relative">
              <Avatar
                src={user.avatar}
                name={user.name}
                role={user.role}
                status={user.status}
                showStatus={true}
                size={variant === 'compact' ? 'sm' : 'default'}
              />
              
              {/* Critical alerts indicator */}
              {criticalAlerts > 0 && (
                <Badge
                  count={criticalAlerts}
                  variant="danger"
                  size="xs"
                  className="absolute -top-1 -right-1"
                />
              )}
            </div>
          )}
          
          {/* User Info */}
          {(showName || showRole || showEmail) && variant !== 'compact' && (
            <div className="text-left flex-1 min-w-0">
              {showName && (
                <Typography variant="body-default" className="font-semibold truncate">
                  {user.name}
                </Typography>
              )}
              
              {showRole && (
                <Typography variant="body-small" color="muted" className="truncate">
                  {getRoleLabel(user.role)}
                </Typography>
              )}
              
              {showEmail && user.email && (
                <Typography variant="caption" color="muted" className="truncate">
                  {user.email}
                </Typography>
              )}
            </div>
          )}
          
          {/* Chevron */}
          {variant !== 'compact' && (
            <Icon 
              name={open ? 'chevron-up' : 'chevron-down'} 
              size="xs"
              className="text-secondary-400"
            />
          )}
          
          {/* Notifications badge */}
          {notifications > 0 && variant === 'compact' && (
            <Badge
              count={notifications}
              variant="primary"
              size="xs"
              className="absolute -top-1 -right-1"
            />
          )}
        </Button>
        
        {/* Dropdown Menu */}
        {open && (
          <div
            ref={menuRef}
            className={cn(
              'absolute z-[9999] w-72 bg-white border border-secondary-200 rounded-lg shadow-xl',
              getDropdownPositionClasses(),
              variant === 'mobile' && 'w-full',
              variant === 'compact' && 'w-64'
            )}
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-secondary-100">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  role={user.role}
                  status={user.status}
                  showStatus={true}
                  size="lg"
                />
                
                <div className="flex-1 min-w-0">
                  <Typography variant="body-default" className="font-semibold truncate">
                    {user.name}
                  </Typography>
                  <Typography variant="body-small" color="muted" className="truncate">
                    {getRoleLabel(user.role)}
                  </Typography>
                  {user.email && (
                    <Typography variant="caption" color="muted" className="truncate">
                      {user.email}
                    </Typography>
                  )}
                </div>
                
                {criticalAlerts > 0 && (
                  <Badge count={criticalAlerts} variant="danger" size="sm" />
                )}
              </div>
              
              {/* Project and Shift Info */}
              {(showProjectInfo || showShiftInfo) && (
                <div className="mt-3 flex items-center gap-4 text-xs text-secondary-600">
                  {showProjectInfo && user.project && (
                    <div className="flex items-center gap-1">
                      <Icon name="building" size="xs" />
                      <span>{user.project}</span>
                    </div>
                  )}
                  
                  {showShiftInfo && user.shift && (
                    <div className="flex items-center gap-1">
                      <Icon name="clock" size="xs" />
                      <span>Turno {getShiftLabel(user.shift)}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Status Toggle */}
              {showStatusToggle && (
                <div className="mt-3">
                  <Typography variant="caption" color="muted" className="mb-2">
                    Estado
                  </Typography>
                  <div className="flex gap-2">
                    {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={user.status === status ? 'default' : 'ghost'}
                        size="xs"
                        onClick={() => onStatusChange?.(status)}
                        leftIcon={
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            status === 'online' && 'bg-green-500',
                            status === 'away' && 'bg-yellow-500',
                            status === 'busy' && 'bg-red-500',
                            status === 'offline' && 'bg-gray-400'
                          )} />
                        }
                      >
                        {status === 'online' && 'En línea'}
                        {status === 'away' && 'Ausente'}
                        {status === 'busy' && 'Ocupado'}
                        {status === 'offline' && 'Desconectado'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Menu Items - Professional and Complete */}
            <div className="py-2">
              {/* Profile Section */}
              <button
                onClick={() => {
                  router.push(`/profile${roleQuery}`)
                  setInternalOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary-50 transition-colors"
              >
                <Icon name="user" size="sm" />
                <span className="flex-1 text-sm">Mi Perfil</span>
              </button>
              
              <button
                onClick={() => {
                  router.push(`/settings${roleQuery}`)
                  setInternalOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary-50 transition-colors"
              >
                <Icon name="settings" size="sm" />
                <span className="flex-1 text-sm">Configuración</span>
              </button>
              
              <button
                onClick={() => {
                  router.push(`/notifications${roleQuery}`)
                  setInternalOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary-50 transition-colors"
              >
                <Icon name="bell" size="sm" />
                <span className="flex-1 text-sm">Notificaciones</span>
              </button>
              
              {/* Separator */}
              <div className="border-t border-secondary-100 my-2" />
              
              {/* Help Section */}
              <button
                onClick={() => {
                  router.push(`/help${roleQuery}`)
                  setInternalOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary-50 transition-colors"
              >
                <Icon name="help-circle" size="sm" />
                <span className="flex-1 text-sm">Ayuda y Soporte</span>
              </button>
              
              {/* Separator */}
              <div className="border-t border-secondary-100 my-2" />
              
              {/* Logout Section */}
              <button
                onClick={() => {
                  signOut({ callbackUrl: 'http://localhost:3000/' })
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
              >
                <Icon name="log-out" size="sm" />
                <span className="flex-1 text-sm">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)

UserMenu.displayName = 'UserMenu'

export { UserMenu, userMenuVariants }