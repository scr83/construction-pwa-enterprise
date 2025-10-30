import type { Meta, StoryObj } from '@storybook/react'
import { DashboardTemplate } from './DashboardTemplate'
import type { DashboardSection, DashboardNotification, QuickAction, DashboardMetrics } from './DashboardTemplate'

const meta = {
  title: 'Components/Templates/DashboardTemplate',
  component: DashboardTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive dashboard template combining NavigationBar, DashboardGrid, and all organisms for role-based construction management interfaces with real-time metrics, notifications, and quick actions.',
      },
    },
  },
  argTypes: {
    userRole: {
      control: { type: 'select' },
      options: ['GERENCIA', 'JEFE_TERRENO', 'CONTROL_CALIDAD', 'OFICINA_TECNICA', 'BODEGA'],
      description: 'User role for dashboard customization',
    },
    layout: {
      control: { type: 'select' },
      options: ['desktop', 'mobile', 'tablet'],
      description: 'Layout variant',
    },
    enableRealTimeUpdates: {
      control: { type: 'boolean' },
      description: 'Enable real-time data updates',
    },
    showNotificationPanel: {
      control: { type: 'boolean' },
      description: 'Show notification panel',
    },
    compactMode: {
      control: { type: 'boolean' },
      description: 'Use compact display mode',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardTemplate>

export default meta
type Story = StoryObj<typeof meta>

// Sample data
const sampleMetrics: DashboardMetrics = {
  projects: {
    total: 8,
    active: 5,
    completed: 2,
    delayed: 1,
    onBudget: 6,
    overBudget: 2
  },
  work: {
    totalTasks: 145,
    completedTasks: 89,
    pendingTasks: 45,
    overdueTasks: 11,
    qualityApproved: 72,
    qualityPending: 17
  },
  budget: {
    totalBudget: 15500000000,
    spentAmount: 9800000000,
    commitedAmount: 2100000000,
    availableAmount: 3600000000,
    variance: -2.5,
    projectedSpend: 14900000000
  },
  team: {
    totalMembers: 125,
    activeMembers: 118,
    availableMembers: 32,
    productivity: 87,
    safetyScore: 94,
    workloadBalance: 76
  },
  materials: {
    totalValue: 450000000,
    lowStockItems: 12,
    outOfStockItems: 3,
    pendingOrders: 8,
    recentReceipts: 15,
    criticalAlerts: 2
  },
  quality: {
    totalInspections: 89,
    passedInspections: 72,
    failedInspections: 6,
    pendingInspections: 11,
    overallScore: 92,
    trendsPositive: true
  },
  safety: {
    daysWithoutIncident: 45,
    totalIncidents: 0,
    nearMisses: 2,
    safetyScore: 96,
    trainingsCompleted: 85,
    equipmentInspections: 42
  }
}

const sampleNotifications: DashboardNotification[] = [
  {
    id: 'notif-001',
    type: 'WARNING',
    title: 'Material Crítico - Stock Bajo',
    message: 'Cemento Portland Tipo I: Solo quedan 2 días de stock según consumo actual',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    priority: 'HIGH',
    project: {
      id: 'proj-001',
      name: 'Torre Las Condes',
      code: 'TLC-001'
    },
    actions: [
      {
        id: 'order-cement',
        label: 'Crear Orden',
        action: () => console.log('Creating cement order'),
        variant: 'primary'
      },
      {
        id: 'view-inventory',
        label: 'Ver Inventario',
        action: () => console.log('View inventory')
      }
    ]
  },
  {
    id: 'notif-002',
    type: 'SUCCESS',
    title: 'Inspección de Calidad Aprobada',
    message: 'Estructura Piso 5 - Torre A: Inspección completada con score 95%',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    priority: 'MEDIUM',
    project: {
      id: 'proj-001',
      name: 'Torre Las Condes',
      code: 'TLC-001'
    },
    user: {
      id: 'user-quality-001',
      name: 'Ana Morales',
      role: 'Inspector de Calidad'
    }
  },
  {
    id: 'notif-003',
    type: 'ERROR',
    title: 'Retraso en Cronograma',
    message: 'Actividad "Instalaciones Eléctricas" presenta 3 días de retraso',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
    priority: 'CRITICAL',
    project: {
      id: 'proj-002',
      name: 'Centro Comercial',
      code: 'CCN-002'
    },
    actions: [
      {
        id: 'reassign-team',
        label: 'Reasignar Equipo',
        action: () => console.log('Reassign team'),
        variant: 'primary'
      }
    ]
  },
  {
    id: 'notif-004',
    type: 'INFO',
    title: 'Nuevo Miembro del Equipo',
    message: 'Miguel Torres se ha unido al proyecto como Especialista en Soldadura',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
    priority: 'LOW',
    user: {
      id: 'user-new-001',
      name: 'Miguel Torres',
      role: 'Especialista'
    }
  }
]

const sampleQuickActions: QuickAction[] = [
  {
    id: 'create-work-order',
    label: 'Nueva Orden de Trabajo',
    icon: 'clipboard-list',
    description: 'Crear orden de trabajo para actividad específica',
    action: () => console.log('Create work order'),
    variant: 'primary',
    category: 'Work',
    shortcut: 'Ctrl+N',
    enabled: true,
    roles: ['GERENCIA', 'JEFE_TERRENO', 'OFICINA_TECNICA']
  },
  {
    id: 'receive-materials',
    label: 'Recibir Materiales',
    icon: 'package',
    description: 'Registrar recepción de materiales en bodega',
    action: () => console.log('Receive materials'),
    variant: 'success',
    badge: 3,
    category: 'Materials',
    enabled: true,
    roles: ['BODEGA', 'JEFE_TERRENO']
  },
  {
    id: 'quality-inspection',
    label: 'Inspección de Calidad',
    icon: 'shield-check',
    description: 'Iniciar nueva inspección de calidad',
    action: () => console.log('Quality inspection'),
    variant: 'warning',
    category: 'Quality',
    enabled: true,
    roles: ['CONTROL_CALIDAD', 'JEFE_TERRENO']
  },
  {
    id: 'upload-photos',
    label: 'Subir Fotos de Progreso',
    icon: 'camera',
    description: 'Documentar avance con fotografías',
    action: () => console.log('Upload progress photos'),
    variant: 'default',
    category: 'Documentation',
    enabled: true,
    roles: ['JEFE_TERRENO', 'CONTROL_CALIDAD']
  },
  {
    id: 'generate-report',
    label: 'Generar Reporte',
    icon: 'file-text',
    description: 'Crear reporte de progreso o presupuesto',
    action: () => console.log('Generate report'),
    variant: 'secondary',
    category: 'Reports',
    enabled: true,
    roles: ['GERENCIA', 'OFICINA_TECNICA']
  },
  {
    id: 'emergency-alert',
    label: 'Alerta de Seguridad',
    icon: 'alert-triangle',
    description: 'Reportar incidente o situación de emergencia',
    action: () => console.log('Emergency alert'),
    variant: 'danger',
    category: 'Safety',
    enabled: true,
    roles: ['JEFE_TERRENO', 'CONTROL_CALIDAD']
  }
]

const sampleSections: DashboardSection[] = [
  {
    id: 'projects-overview',
    title: 'Vista General de Proyectos',
    icon: 'folder',
    widgets: [
      {
        id: 'active-projects',
        type: 'LIST',
        title: 'Proyectos Activos',
        size: 'lg',
        position: { x: 0, y: 0 },
        refresh: true,
        refreshInterval: 5
      },
      {
        id: 'project-timeline',
        type: 'CHART',
        title: 'Cronograma General',
        size: 'xl',
        position: { x: 1, y: 0 },
        refresh: true,
        refreshInterval: 10
      }
    ]
  },
  {
    id: 'team-performance',
    title: 'Rendimiento del Equipo',
    icon: 'users',
    widgets: [
      {
        id: 'team-metrics',
        type: 'METRIC',
        title: 'Métricas de Equipo',
        size: 'md',
        position: { x: 0, y: 1 },
        refresh: true,
        refreshInterval: 15
      },
      {
        id: 'workload-distribution',
        type: 'CHART',
        title: 'Distribución de Carga',
        size: 'lg',
        position: { x: 1, y: 1 },
        refresh: true
      }
    ]
  },
  {
    id: 'recent-activity',
    title: 'Actividad Reciente',
    icon: 'activity',
    widgets: [
      {
        id: 'recent-actions',
        type: 'RECENT_ACTIVITY',
        title: 'Acciones Recientes',
        size: 'full',
        position: { x: 0, y: 2 },
        refresh: true,
        refreshInterval: 2
      }
    ]
  }
]

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', path: '/', permissions: [] },
  { id: 'projects', label: 'Proyectos', icon: 'folder', path: '/proyectos', badge: '5', permissions: [] },
  { id: 'team', label: 'Equipo', icon: 'users', path: '/team', permissions: [] },
  { id: 'materials', label: 'Materiales', icon: 'package', path: '/materials', badge: '2', permissions: [] },
  { id: 'quality', label: 'Calidad', icon: 'shield-check', path: '/quality', permissions: [] },
  { id: 'reports', label: 'Reportes', icon: 'bar-chart', path: '/reports', permissions: [] }
]

// Default story - Site Manager view
export const Default: Story = {
  args: {
    userRole: 'JEFE_TERRENO',
    layout: 'desktop',
    sections: sampleSections,
    quickActions: sampleQuickActions,
    notifications: sampleNotifications,
    metrics: sampleMetrics,
    enableRealTimeUpdates: true,
    showNotificationPanel: false,
    currentUser: {
      id: 'user-001',
      name: 'Carlos Rodriguez',
      role: 'Jefe de Terreno',
      avatar: '/avatars/carlos-rodriguez.jpg',
      permissions: ['view', 'create', 'edit', 'assign']
    },
    currentProject: {
      id: 'proj-001',
      name: 'Torre Residencial Las Condes',
      code: 'TLC-001',
      role: 'Jefe de Terreno'
    },
    navigationItems,
    syncStatus: 'synced',
    lastUpdate: new Date(),
    onlineUsers: ['user-002', 'user-003', 'user-004'],
  },
}

// Executive Management view
export const ExecutiveManagement: Story = {
  args: {
    ...Default.args,
    userRole: 'GERENCIA',
    currentUser: {
      id: 'user-exec-001',
      name: 'Patricia Silva',
      role: 'Gerencia General',
      avatar: '/avatars/patricia-silva.jpg',
      permissions: ['view', 'create', 'edit', 'assign', 'approve', 'manage']
    },
    sections: [
      {
        id: 'executive-overview',
        title: 'Vista Ejecutiva',
        icon: 'trending-up',
        widgets: [
          {
            id: 'portfolio-metrics',
            type: 'METRIC',
            title: 'Métricas del Portafolio',
            size: 'xl',
            position: { x: 0, y: 0 },
            refresh: true,
            refreshInterval: 10
          },
          {
            id: 'financial-overview',
            type: 'CHART',
            title: 'Vista Financiera',
            size: 'lg',
            position: { x: 1, y: 0 }
          }
        ]
      },
      ...sampleSections.slice(1)
    ],
    enableWidgetCustomization: true,
    showNotificationPanel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Executive management dashboard with comprehensive portfolio metrics, financial overview, and advanced customization options.',
      },
    },
  },
}

// Quality Inspector view
export const QualityInspector: Story = {
  args: {
    ...Default.args,
    userRole: 'CONTROL_CALIDAD',
    currentUser: {
      id: 'user-quality-001',
      name: 'Ana Morales',
      role: 'Inspector de Calidad',
      avatar: '/avatars/ana-morales.jpg',
      permissions: ['view', 'inspect', 'approve', 'reject']
    },
    sections: [
      {
        id: 'quality-dashboard',
        title: 'Control de Calidad',
        icon: 'shield-check',
        widgets: [
          {
            id: 'pending-inspections',
            type: 'LIST',
            title: 'Inspecciones Pendientes',
            size: 'lg',
            position: { x: 0, y: 0 },
            refresh: true,
            refreshInterval: 5
          },
          {
            id: 'quality-metrics',
            type: 'METRIC',
            title: 'Métricas de Calidad',
            size: 'md',
            position: { x: 1, y: 0 }
          }
        ]
      },
      {
        id: 'inspection-history',
        title: 'Historial de Inspecciones',
        icon: 'history',
        widgets: [
          {
            id: 'recent-inspections',
            type: 'CHART',
            title: 'Inspecciones Recientes',
            size: 'xl',
            position: { x: 0, y: 1 }
          }
        ]
      }
    ],
    notifications: sampleNotifications.filter(n => 
      n.type === 'WARNING' || n.user?.role === 'Inspector de Calidad'
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Quality inspector dashboard focused on inspection workflows, quality metrics, and approval processes.',
      },
    },
  },
}

// Warehouse Manager view
export const WarehouseManager: Story = {
  args: {
    ...Default.args,
    userRole: 'BODEGA',
    currentUser: {
      id: 'user-warehouse-001',
      name: 'Roberto González',
      role: 'Jefe de Bodega',
      avatar: '/avatars/roberto-gonzalez.jpg',
      permissions: ['view', 'receive', 'distribute', 'adjust', 'inventory']
    },
    sections: [
      {
        id: 'inventory-overview',
        title: 'Vista de Inventario',
        icon: 'package',
        widgets: [
          {
            id: 'inventory-status',
            type: 'METRIC',
            title: 'Estado del Inventario',
            size: 'lg',
            position: { x: 0, y: 0 }
          },
          {
            id: 'recent-movements',
            type: 'LIST',
            title: 'Movimientos Recientes',
            size: 'lg',
            position: { x: 1, y: 0 }
          }
        ]
      },
      {
        id: 'alerts-actions',
        title: 'Alertas y Acciones',
        icon: 'alert-circle',
        widgets: [
          {
            id: 'stock-alerts',
            type: 'NOTIFICATION',
            title: 'Alertas de Stock',
            size: 'md',
            position: { x: 0, y: 1 }
          },
          {
            id: 'pending-orders',
            type: 'LIST',
            title: 'Órdenes Pendientes',
            size: 'md',
            position: { x: 1, y: 1 }
          }
        ]
      }
    ],
    notifications: sampleNotifications.filter(n => 
      n.message.includes('Material') || n.message.includes('Stock')
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Warehouse manager dashboard with inventory tracking, stock alerts, and material movement workflows.',
      },
    },
  },
}

// Technical Office view
export const TechnicalOffice: Story = {
  args: {
    ...Default.args,
    userRole: 'OFICINA_TECNICA',
    currentUser: {
      id: 'user-tech-001',
      name: 'Luis Hernández',
      role: 'Jefe Oficina Técnica',
      avatar: '/avatars/luis-hernandez.jpg',
      permissions: ['view', 'create', 'edit', 'plan', 'budget', 'contract']
    },
    sections: [
      {
        id: 'planning-overview',
        title: 'Vista de Planificación',
        icon: 'calendar',
        widgets: [
          {
            id: 'project-timeline',
            type: 'CHART',
            title: 'Cronograma General',
            size: 'xl',
            position: { x: 0, y: 0 }
          },
          {
            id: 'budget-tracking',
            type: 'METRIC',
            title: 'Seguimiento Presupuestario',
            size: 'lg',
            position: { x: 1, y: 0 }
          }
        ]
      },
      {
        id: 'contracts-procurement',
        title: 'Contratos y Adquisiciones',
        icon: 'file-text',
        widgets: [
          {
            id: 'active-contracts',
            type: 'LIST',
            title: 'Contratos Activos',
            size: 'lg',
            position: { x: 0, y: 1 }
          }
        ]
      }
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Technical office dashboard with project planning, budget tracking, and contract management focus.',
      },
    },
  },
}

// Mobile responsive view
export const MobileView: Story = {
  args: {
    ...Default.args,
    layout: 'mobile',
    compactMode: true,
    sidebarCollapsed: true,
    sections: sampleSections.map(section => ({
      ...section,
      widgets: section.widgets.slice(0, 2) // Limit widgets on mobile
    })),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized dashboard with compact widgets, collapsed sidebar, and touch-friendly interactions.',
      },
    },
  },
}

// Real-time updates demo
export const RealTimeUpdates: Story = {
  args: {
    ...Default.args,
    enableRealTimeUpdates: true,
    isRefreshing: true,
    syncStatus: 'syncing',
    notifications: [
      ...sampleNotifications,
      {
        id: 'realtime-001',
        type: 'INFO',
        title: 'Actualización en Tiempo Real',
        message: 'Los datos se actualizan automáticamente cada 2 minutos',
        timestamp: new Date(),
        read: false,
        priority: 'LOW'
      }
    ],
    onlineUsers: ['user-002', 'user-003', 'user-004', 'user-005', 'user-006'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with real-time updates, live user indicators, and automatic data synchronization.',
      },
    },
  },
}

// High notification volume
export const HighNotificationVolume: Story = {
  args: {
    ...Default.args,
    showNotificationPanel: true,
    notifications: [
      ...sampleNotifications,
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `bulk-notif-${i}`,
        type: (i % 2 === 0 ? 'WARNING' : 'INFO') as any,
        title: `Notificación Automática ${i + 1}`,
        message: `Mensaje de prueba para notificación número ${i + 1}`,
        timestamp: new Date(Date.now() - i * 1000 * 60 * 15),
        read: i > 8,
        priority: (i < 5 ? 'HIGH' : 'MEDIUM') as any,
      }))
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with high volume of notifications demonstrating notification panel scrolling and management.',
      },
    },
  },
}

// Loading state
export const LoadingState: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard loading state with skeleton placeholders and loading indicators.',
      },
    },
  },
}

// Offline mode
export const OfflineMode: Story = {
  args: {
    ...Default.args,
    syncStatus: 'offline',
    enableRealTimeUpdates: false,
    notifications: [
      {
        id: 'offline-001',
        type: 'WARNING',
        title: 'Modo Sin Conexión',
        message: 'Los datos se sincronizarán cuando se restablezca la conexión',
        timestamp: new Date(),
        read: false,
        priority: 'MEDIUM'
      },
      ...sampleNotifications.slice(0, 2)
    ],
    onlineUsers: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard in offline mode with sync indicators and limited functionality for field operations without connectivity.',
      },
    },
  },
}