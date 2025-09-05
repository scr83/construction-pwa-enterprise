'use client'

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { NavigationBar } from './NavigationBar'
import type { UserProfile, NavigationNotification, NavigationItem } from './NavigationBar'

const meta: Meta<typeof NavigationBar> = {
  title: 'Construction/Organisms/NavigationBar',
  component: NavigationBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Mobile-first construction role-based navigation system with project switching, notifications, and emergency features.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['desktop', 'mobile', 'universal'],
      description: 'Navigation bar display variant',
    },
    layout: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Layout direction',
    },
    position: {
      control: { type: 'select' },
      options: ['static', 'fixed', 'sticky'],
      description: 'Positioning behavior',
    },
    showBreadcrumbs: {
      control: { type: 'boolean' },
      description: 'Show breadcrumb navigation',
    },
    showNotifications: {
      control: { type: 'boolean' },
      description: 'Show notification system',
    },
    showEmergencyButton: {
      control: { type: 'boolean' },
      description: 'Show emergency contact button',
    },
    isOffline: {
      control: { type: 'boolean' },
      description: 'Offline mode indicator',
    },
    compactMode: {
      control: { type: 'boolean' },
      description: 'Compact display mode',
    },
  },
}

export default meta
type Story = StoryObj<typeof NavigationBar>

// Sample users for different roles
const siteManager: UserProfile = {
  id: 'sm1',
  name: 'Carlos Mendoza',
  role: 'SITE_MANAGER',
  project: 'Torres del Mar',
  shift: 'MORNING',
  isOnline: true,
}

const supervisor: UserProfile = {
  id: 'sup1',
  name: 'Ana Rodriguez',
  role: 'SUPERVISOR',
  project: 'Torres del Mar',
  shift: 'AFTERNOON',
  isOnline: true,
}

const worker: UserProfile = {
  id: 'w1',
  name: 'Miguel Torres',
  role: 'WORKER',
  project: 'Torres del Mar',
  shift: 'MORNING',
  isOnline: true,
}

const qualityInspector: UserProfile = {
  id: 'qi1',
  name: 'Laura Silva',
  role: 'QUALITY_INSPECTOR',
  project: 'Torres del Mar',
  shift: 'MORNING',
  isOnline: true,
}

const executive: UserProfile = {
  id: 'exec1',
  name: 'Ricardo Vargas',
  role: 'EXECUTIVE',
  isOnline: true,
}

// Sample projects
const availableProjects = [
  { id: 'p1', name: 'Torres del Mar - Edificios A, B, C', code: 'TDM-2024' },
  { id: 'p2', name: 'Residencial Los Aromos', code: 'RLA-2024' },
  { id: 'p3', name: 'Comercial Plaza Norte', code: 'CPN-2024' },
]

const currentProject = availableProjects[0]

// Sample notifications
const sampleNotifications: NavigationNotification[] = [
  {
    id: 'n1',
    type: 'SAFETY',
    message: 'Recordatorio: Reunión de seguridad a las 8:00 AM',
    priority: 'HIGH',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 'n2',
    type: 'TASK',
    message: 'Nueva tarea asignada: Inspección estructural EA-101',
    priority: 'MEDIUM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
  },
  {
    id: 'n3',
    type: 'MATERIAL',
    message: 'Material llegará con retraso: Hormigón programado para mañana',
    priority: 'LOW',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
  {
    id: 'n4',
    type: 'QUALITY',
    message: 'Reporte de calidad rechazado: EA-102 requiere correcciones',
    priority: 'CRITICAL',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
  },
  {
    id: 'n5',
    type: 'SYSTEM',
    message: 'Actualización de sistema programada para esta noche',
    priority: 'LOW',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
  },
]

// Quick actions
const quickActions: NavigationItem[] = [
  {
    id: 'new-task',
    label: 'Nueva Tarea',
    icon: 'plus',
    roles: ['SITE_MANAGER', 'SUPERVISOR'],
    onClick: () => console.log('New task'),
  },
  {
    id: 'scan-qr',
    label: 'Escanear QR',
    icon: 'qr-code',
    roles: ['SITE_MANAGER', 'SUPERVISOR', 'WORKER', 'QUALITY_INSPECTOR'],
    onClick: () => console.log('Scan QR'),
  },
  {
    id: 'photo-report',
    label: 'Foto Reporte',
    icon: 'camera',
    roles: ['SITE_MANAGER', 'SUPERVISOR', 'WORKER', 'QUALITY_INSPECTOR'],
    onClick: () => console.log('Photo report'),
  },
]

// Site Manager Navigation
export const SiteManager: Story = {
  args: {
    currentUser: siteManager,
    currentProject,
    availableProjects,
    notifications: sampleNotifications,
    quickActions,
    showQuickActions: true,
    showEmergencyButton: true,
    activeRoute: '/dashboard',
  },
}

// Supervisor Navigation
export const Supervisor: Story = {
  args: {
    currentUser: supervisor,
    currentProject,
    availableProjects,
    notifications: sampleNotifications.slice(0, 3),
    quickActions: quickActions.slice(0, 2),
    showQuickActions: true,
    showEmergencyButton: true,
    activeRoute: '/tasks',
  },
}

// Worker Navigation (Limited Access)
export const Worker: Story = {
  args: {
    currentUser: worker,
    currentProject,
    availableProjects: [currentProject], // Workers see only their project
    notifications: sampleNotifications.filter(n => n.type === 'TASK' || n.type === 'SAFETY'),
    quickActions: quickActions.filter(qa => qa.roles.includes('WORKER')),
    showQuickActions: true,
    showEmergencyButton: true,
    activeRoute: '/tasks',
  },
}

// Quality Inspector Navigation
export const QualityInspector: Story = {
  args: {
    currentUser: qualityInspector,
    currentProject,
    availableProjects,
    notifications: sampleNotifications.filter(n => n.type === 'QUALITY' || n.type === 'SYSTEM'),
    quickActions: quickActions.filter(qa => qa.roles.includes('QUALITY_INSPECTOR')),
    showQuickActions: true,
    activeRoute: '/quality',
  },
}

// Executive Navigation (Full Access)
export const Executive: Story = {
  args: {
    currentUser: executive,
    availableProjects,
    notifications: sampleNotifications,
    showQuickActions: false, // Executives don't need quick actions
    activeRoute: '/reports',
  },
}

// Mobile View
export const Mobile: Story = {
  args: {
    currentUser: siteManager,
    variant: 'mobile',
    currentProject,
    availableProjects,
    notifications: sampleNotifications,
    quickActions,
    showQuickActions: true,
    showEmergencyButton: true,
    isMobileMenuOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Offline Mode
export const OfflineMode: Story = {
  args: {
    currentUser: siteManager,
    currentProject,
    availableProjects,
    notifications: [],
    isOffline: true,
    pendingSyncCount: 5,
    quickActions,
    showQuickActions: true,
  },
}

// Compact Mode
export const CompactMode: Story = {
  args: {
    currentUser: supervisor,
    currentProject,
    availableProjects,
    notifications: sampleNotifications,
    compactMode: true,
    quickActions,
    showQuickActions: true,
  },
}

// With Breadcrumbs
export const WithBreadcrumbs: Story = {
  args: {
    currentUser: siteManager,
    currentProject,
    availableProjects,
    notifications: sampleNotifications,
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Proyectos', href: '/projects' },
      { label: 'Torres del Mar', href: '/projects/tdm-2024' },
      { label: 'Edificio A' },
    ],
    quickActions,
    showQuickActions: true,
  },
}

// Fixed Position
export const FixedPosition: Story = {
  args: {
    currentUser: siteManager,
    position: 'fixed',
    currentProject,
    availableProjects,
    notifications: sampleNotifications,
    quickActions,
    showQuickActions: true,
    showEmergencyButton: true,
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
        <div className="pt-20 p-8">
          <div className="space-y-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="p-4 bg-secondary-50 rounded-lg">
                <h3 className="font-semibold">Contenido de ejemplo {i + 1}</h3>
                <p className="text-secondary-600">
                  Esta es una página con contenido que se puede desplazar debajo de la navegación fija.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  ],
}

// Critical Notifications
export const CriticalNotifications: Story = {
  args: {
    currentUser: siteManager,
    currentProject,
    availableProjects,
    notifications: [
      {
        id: 'critical1',
        type: 'SAFETY',
        message: 'EMERGENCIA: Accidente reportado en Edificio A - Piso 3',
        priority: 'CRITICAL',
        timestamp: new Date(),
        read: false,
      },
      {
        id: 'critical2',
        type: 'QUALITY',
        message: 'CRÍTICO: Falla estructural detectada en EA-203',
        priority: 'CRITICAL',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
      ...sampleNotifications,
    ],
    quickActions,
    showQuickActions: true,
    showEmergencyButton: true,
  },
}

// Interactive Demo
export const InteractiveDemo: Story = {
  args: {
    currentUser: siteManager,
    currentProject,
    availableProjects,
    notifications: sampleNotifications,
    quickActions,
    showQuickActions: true,
    showEmergencyButton: true,
    activeRoute: '/dashboard',
  },
  render: function InteractiveNavigationDemo(args) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [activeRoute, setActiveRoute] = React.useState(args.activeRoute)
    const [notifications, setNotifications] = React.useState(args.notifications || [])
    
    const handleNavigate = (item: NavigationItem) => {
      if (item.href) {
        setActiveRoute(item.href)
        console.log('Navigate to:', item.href)
      }
    }
    
    const handleNotificationDismiss = (notificationId: string) => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    }
    
    const handleNotificationClick = (notification: NavigationNotification) => {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, read: true }
            : n
        )
      )
      console.log('Notification clicked:', notification.message)
    }
    
    const handleProjectChange = (projectId: string) => {
      const project = availableProjects.find(p => p.id === projectId)
      console.log('Project changed to:', project?.name)
    }

    return (
      <div className="min-h-screen bg-secondary-50">
        <NavigationBar
          {...args}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          activeRoute={activeRoute}
          onNavigate={handleNavigate}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onNotificationDismiss={handleNotificationDismiss}
          onProjectChange={handleProjectChange}
          emergencyContact={() => {
            alert('¡Contacto de emergencia activado!')
            console.log('Emergency contact triggered')
          }}
        />
        
        <div className="pt-4 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Demo Interactivo</h2>
              <div className="space-y-4">
                <p className="text-secondary-600">
                  Esta navegación es completamente interactiva. Puedes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-secondary-600">
                  <li>Cambiar entre proyectos usando el selector</li>
                  <li>Ver y gestionar notificaciones</li>
                  <li>Navegar usando los elementos del menú</li>
                  <li>Usar el menú móvil en pantallas pequeñas</li>
                  <li>Activar el contacto de emergencia</li>
                  <li>Ver acciones rápidas específicas por rol</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-3">Estado Actual</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Usuario:</span> {args.currentUser?.name}</div>
                  <div><span className="font-medium">Rol:</span> {args.currentUser?.role}</div>
                  <div><span className="font-medium">Proyecto:</span> {args.currentProject?.name}</div>
                  <div><span className="font-medium">Ruta Activa:</span> {activeRoute}</div>
                  <div><span className="font-medium">Notificaciones:</span> {notifications.length}</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-3">Funcionalidades</h3>
                <div className="space-y-2 text-sm">
                  <div>✅ Navegación adaptativa por rol</div>
                  <div>✅ Cambio de proyecto en tiempo real</div>
                  <div>✅ Sistema de notificaciones</div>
                  <div>✅ Menú móvil responsivo</div>
                  <div>✅ Indicadores de estado offline</div>
                  <div>✅ Acciones rápidas contextuales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}