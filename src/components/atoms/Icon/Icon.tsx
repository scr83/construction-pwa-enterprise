'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  // Construction & Building
  HardHat,
  Hammer,
  Wrench,
  Truck,
  Building,
  Building2,
  Home,
  Warehouse,
  
  // Navigation & Menu Icons
  Menu,
  LayoutDashboard,
  ListChecks,
  ClipboardList,
  FileText,
  Zap,
  LogOut,
  HelpCircle,
  Info,
  X,
  
  // Materials & Tools
  Package,
  Package2,
  PackageCheck,
  PackageX,
  Boxes,
  Scale,
  Ruler,
  Calculator,
  
  // Quality & Safety
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Clipboard,
  
  // Location & GPS
  MapPin,
  Navigation,
  Compass,
  Map,
  
  // People & Teams
  User,
  Users,
  UserCheck,
  UserX,
  Crown,
  
  // Status & Progress
  Clock,
  Timer,
  Calendar,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  
  // Communication
  Phone,
  Mail,
  MessageSquare,
  Bell,
  BellRing,
  
  // Actions
  Plus,
  Minus,
  Edit,
  Trash,
  Save,
  Upload,
  Download,
  RefreshCw as Refresh,
  Loader2,
  Search,
  Filter,
  
  // Navigation
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  
  // System
  Settings,
  Cog,
  Wifi,
  WifiOff,
  Database,
  Server,
  Cloud as CloudSync,
  
  // Media
  Camera,
  Image,
  FileImage,
  Film,
  
  // Documents
  FileText,
  File,
  Folder,
  FolderOpen,
  Download as DownloadIcon,
  
  // Miscellaneous
  Star,
  Heart,
  Flag,
  Tag,
  Link,
  ExternalLink,
} from 'lucide-react'

// Construction-specific icon mapping
const constructionIcons = {
  // Construction & Building
  'hard-hat': HardHat,
  'hammer': Hammer,
  'wrench': Wrench,
  'truck': Truck,
  'building': Building,
  'building-2': Building2,
  'home': Home,
  'warehouse': Warehouse,
  
  // Materials & Tools
  'package': Package,
  'package-2': Package2,
  'package-check': PackageCheck,
  'package-x': PackageX,
  'boxes': Boxes,
  'scale': Scale,
  'ruler': Ruler,
  'calculator': Calculator,
  
  // Quality & Safety
  'shield': Shield,
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'eye': Eye,
  'clipboard': Clipboard,
  
  // Location & GPS
  'map-pin': MapPin,
  'navigation': Navigation,
  'compass': Compass,
  'map': Map,
  
  // People & Teams
  'user': User,
  'users': Users,
  'user-check': UserCheck,
  'user-x': UserX,
  'crown': Crown,
  
  // Status & Progress
  'clock': Clock,
  'timer': Timer,
  'calendar': Calendar,
  'calendar-days': CalendarDays,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  
  // Communication
  'phone': Phone,
  'mail': Mail,
  'message-square': MessageSquare,
  'bell': Bell,
  'bell-ring': BellRing,
  
  // Actions
  'plus': Plus,
  'minus': Minus,
  'edit': Edit,
  'trash': Trash,
  'save': Save,
  'upload': Upload,
  'download': Download,
  'refresh': Refresh,
  'loader-2': Loader2,
  'search': Search,
  'filter': Filter,
  
  // Navigation
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  
  // System
  'settings': Settings,
  'cog': Cog,
  'wifi': Wifi,
  'wifi-off': WifiOff,
  'database': Database,
  'server': Server,
  'cloud-sync': CloudSync,
  
  // Navigation & Menu Icons
  'menu': Menu,
  'layout-dashboard': LayoutDashboard,
  'list-checks': ListChecks,
  'clipboard-list': ClipboardList,
  'file-text': FileText,
  'chart-bar': BarChart,
  'zap': Zap,
  'log-out': LogOut,
  'help-circle': HelpCircle,
  'info': Info,
  'x': X,
  
  // Media
  'camera': Camera,
  'image': Image,
  'file-image': FileImage,
  'film': Film,
  
  // Documents
  'file': File,
  'folder': Folder,
  'folder-open': FolderOpen,
  'download-icon': DownloadIcon,
  
  // Miscellaneous
  'star': Star,
  'heart': Heart,
  'flag': Flag,
  'tag': Tag,
  'link': Link,
  'external-link': ExternalLink,
} as const

type ConstructionIconName = keyof typeof constructionIcons

const iconVariants = cva('', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-10 w-10',
    },
    variant: {
      default: 'text-current',
      primary: 'text-primary-600',
      secondary: 'text-secondary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      danger: 'text-danger-600',
      muted: 'text-secondary-400',
    },
    interactive: {
      true: 'cursor-pointer hover:opacity-75 transition-opacity',
      false: '',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
    interactive: false,
  },
})

export interface IconProps
  extends React.SVGProps<SVGSVGElement>,
    VariantProps<typeof iconVariants> {
  name: ConstructionIconName
  label?: string // For accessibility
  decorative?: boolean // If true, adds aria-hidden
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      size,
      variant,
      interactive,
      label,
      decorative = false,
      className,
      ...props
    },
    ref
  ) => {
    const IconComponent = constructionIcons[name]
    
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in construction icons`)
      return null
    }

    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({ size, variant, interactive }), className)}
        aria-label={decorative ? undefined : label || name}
        aria-hidden={decorative}
        role={decorative ? 'presentation' : 'img'}
        {...props}
      />
    )
  }
)
Icon.displayName = 'Icon'

// Specialized construction icon components
export const ConstructionStatusIcon: React.FC<{
  status: 'pending' | 'in-progress' | 'completed' | 'rejected' | 'warning'
  size?: IconProps['size']
}> = ({ status, size = 'default' }) => {
  const iconMap = {
    pending: { name: 'clock' as const, variant: 'secondary' as const },
    'in-progress': { name: 'timer' as const, variant: 'primary' as const },
    completed: { name: 'check-circle' as const, variant: 'success' as const },
    rejected: { name: 'x-circle' as const, variant: 'danger' as const },
    warning: { name: 'alert-triangle' as const, variant: 'warning' as const },
  }
  
  const { name, variant } = iconMap[status]
  return <Icon name={name} variant={variant} size={size} />
}

export const MaterialStatusIcon: React.FC<{
  status: 'planned' | 'requested' | 'purchased' | 'in-warehouse' | 'delivered' | 'installed'
  size?: IconProps['size']
}> = ({ status, size = 'default' }) => {
  const iconMap = {
    planned: { name: 'clipboard' as const, variant: 'secondary' as const },
    requested: { name: 'package' as const, variant: 'warning' as const },
    purchased: { name: 'package-check' as const, variant: 'primary' as const },
    'in-warehouse': { name: 'warehouse' as const, variant: 'primary' as const },
    delivered: { name: 'truck' as const, variant: 'success' as const },
    installed: { name: 'check-circle' as const, variant: 'success' as const },
  }
  
  const { name, variant } = iconMap[status]
  return <Icon name={name} variant={variant} size={size} />
}

export const UserRoleIcon: React.FC<{
  role: 'executive' | 'site-manager' | 'warehouse' | 'technical-office' | 'quality-control'
  size?: IconProps['size']
}> = ({ role, size = 'default' }) => {
  const iconMap = {
    executive: { name: 'crown' as const, variant: 'primary' as const },
    'site-manager': { name: 'hard-hat' as const, variant: 'primary' as const },
    warehouse: { name: 'warehouse' as const, variant: 'primary' as const },
    'technical-office': { name: 'calculator' as const, variant: 'primary' as const },
    'quality-control': { name: 'shield-check' as const, variant: 'primary' as const },
  }
  
  const { name, variant } = iconMap[role]
  return <Icon name={name} variant={variant} size={size} />
}

export const ConnectionStatusIcon: React.FC<{
  status: 'online' | 'offline' | 'poor' | 'connecting'
  size?: IconProps['size']
}> = ({ status, size = 'sm' }) => {
  const iconMap = {
    online: { name: 'wifi' as const, variant: 'success' as const },
    offline: { name: 'wifi-off' as const, variant: 'danger' as const },
    poor: { name: 'wifi' as const, variant: 'warning' as const },
    connecting: { name: 'refresh' as const, variant: 'secondary' as const },
  }
  
  const { name, variant } = iconMap[status]
  return <Icon name={name} variant={variant} size={size} />
}

// Get all available icon names for documentation/development
export const getAvailableIcons = (): ConstructionIconName[] => {
  return Object.keys(constructionIcons) as ConstructionIconName[]
}

export { Icon, iconVariants }
export type { ConstructionIconName }