import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { MobileTemplate } from './MobileTemplate'
import type { MobileTemplateProps, MobileNotification } from './MobileTemplate'

const meta: Meta<typeof MobileTemplate> = {
  title: 'Templates/MobileTemplate',
  component: MobileTemplate,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        component: 'Plantilla móvil PWA-ready con gestos, navegación adaptativa y funcionalidades offline.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['portrait', 'landscape', 'responsive'],
      description: 'Orientación del dispositivo'
    },
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark', 'auto', 'construction'],
      description: 'Tema de la aplicación'
    },
    role: {
      control: { type: 'select' },
      options: ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica', 'control_calidad'],
      description: 'Rol del usuario'
    }
  }
}

export default meta
type Story = StoryObj<typeof MobileTemplate>

// Componentes de contenido de ejemplo
const ProjectDashboard = () => (
  <div className="p-4 space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-100 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-blue-800">12</div>
        <div className="text-sm text-blue-600">Proyectos Activos</div>
      </div>
      <div className="bg-green-100 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-green-800">94%</div>
        <div className="text-sm text-green-600">Cumplimiento</div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-semibold mb-3">Tareas Pendientes</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm">Inspección Edificio Norte</span>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Urgente</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm">Revisión de Materiales</span>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Hoy</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm">Reporte Semanal</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Mañana</span>
        </div>
      </div>
    </div>
  </div>
)

const ConstructionForm = () => (
  <div className="p-4 space-y-4">
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-semibold mb-4">Inspección de Obra</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Proyecto</label>
          <select className="w-full p-3 border border-gray-300 rounded-lg">
            <option>Edificio Las Condes</option>
            <option>Centro Comercial Plaza Norte</option>
            <option>Hospital Regional</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Estado de la Estructura</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-3 border border-green-300 bg-green-50 text-green-800 rounded-lg font-medium">
              Excelente
            </button>
            <button className="p-3 border border-gray-300 rounded-lg">
              Bueno
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Fotografías</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm text-gray-600">Toca para tomar foto</div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Ubicación GPS</label>
          <button className="w-full p-3 border border-blue-300 bg-blue-50 text-blue-800 rounded-lg font-medium">
            📍 Capturar Ubicación Actual
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Observaciones</label>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg h-20"
            placeholder="Escribe tus observaciones aquí..."
          />
        </div>
      </div>
    </div>
  </div>
)

const MaterialsList = () => (
  <div className="p-4 space-y-4">
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b">
        <input 
          type="text" 
          placeholder="Buscar materiales..." 
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div className="divide-y">
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">Cemento Portland</div>
            <div className="text-sm text-gray-500">Stock: 850 sacos</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-600">✓ Disponible</div>
            <div className="text-xs text-gray-500">Bodega A-1</div>
          </div>
        </div>
        
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">Fierro 12mm</div>
            <div className="text-sm text-gray-500">Stock: 45 barras</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-red-600">⚠️ Stock Bajo</div>
            <div className="text-xs text-gray-500">Patio Acero</div>
          </div>
        </div>
        
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">Ladrillo Fiscal</div>
            <div className="text-sm text-gray-500">Stock: 15,000 unid.</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-600">✓ Disponible</div>
            <div className="text-xs text-gray-500">Bodega B-3</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Story Wrapper para manejo de estado
const MobileWrapper = ({ children, ...props }: any) => {
  const [notifications, setNotifications] = useState<MobileNotification[]>([
    {
      id: '1',
      title: 'Inspección Programada',
      message: 'Recuerda la inspección en Edificio Norte a las 14:00',
      type: 'info',
      timestamp: new Date().toISOString()
    }
  ])
  
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const handleNotificationDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleCameraCapture = (file: File) => {
    console.log('Foto capturada:', file.name)
    setNotifications(prev => [...prev, {
      id: Date.now().toString(),
      title: 'Foto Capturada',
      message: 'La imagen se ha guardado correctamente',
      type: 'success',
      timestamp: new Date().toISOString()
    }])
  }

  const handleLocationCapture = (coords: GeolocationCoordinates) => {
    console.log('Ubicación capturada:', coords.latitude, coords.longitude)
    setNotifications(prev => [...prev, {
      id: Date.now().toString(),
      title: 'Ubicación Obtenida',
      message: `Lat: ${coords.latitude.toFixed(6)}, Lng: ${coords.longitude.toFixed(6)}`,
      type: 'success',
      timestamp: new Date().toISOString()
    }])
  }

  return (
    <MobileTemplate
      {...props}
      notifications={notifications}
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      onNotificationDismiss={handleNotificationDismiss}
      onCameraCapture={handleCameraCapture}
      onLocationCapture={handleLocationCapture}
    />
  )
}

// Historias principales
export const ConstructionDashboard: Story = {
  render: (args) => (
    <MobileWrapper
      {...args}
      title="Control de Obra"
      subtitle="Edificio Las Condes"
      role="jefe_terreno"
      navigation={{
        type: 'bottom',
        position: 'fixed',
        items: [
          { id: 'home', label: 'Inicio', icon: '🏠', active: true, onClick: () => console.log('Home') },
          { id: 'projects', label: 'Proyectos', icon: '🏗️', onClick: () => console.log('Projects') },
          { id: 'materials', label: 'Materiales', icon: '📦', badge: 3, onClick: () => console.log('Materials') },
          { id: 'reports', label: 'Reportes', icon: '📊', onClick: () => console.log('Reports') },
          { id: 'profile', label: 'Perfil', icon: '👤', onClick: () => console.log('Profile') }
        ]
      }}
      cameraAccess={true}
      locationAccess={true}
      gestures={{
        enablePullToRefresh: true,
        enableSwipe: true,
        refreshThreshold: 80
      }}
      pwaConfig={{
        installable: true,
        enableOffline: true,
        enableNotifications: true
      }}
      installPrompt={{
        title: 'Instalar App de Construcción',
        message: 'Instala la aplicación para acceso rápido y funcionalidades offline',
        installText: 'Instalar',
        dismissText: 'Ahora no'
      }}
    >
      <ProjectDashboard />
    </MobileWrapper>
  )
}

export const InspectionForm: Story = {
  render: (args) => (
    <MobileWrapper
      {...args}
      title="Nueva Inspección"
      showBackButton={true}
      onBack={() => console.log('Volver')}
      role="control_calidad"
      cameraAccess={true}
      locationAccess={true}
      theme="construction"
      hapticFeedback={true}
    >
      <ConstructionForm />
    </MobileWrapper>
  )
}

export const WarehouseInventory: Story = {
  render: (args) => (
    <MobileWrapper
      {...args}
      title="Inventario"
      subtitle="Bodega Central"
      role="bodega"
      navigation={{
        type: 'floating',
        items: [
          { id: 'add', label: 'Agregar', icon: '+', onClick: () => console.log('Add material') }
        ]
      }}
      connectionStatus="online"
    >
      <MaterialsList />
    </MobileWrapper>
  )
}

export const OfflineMode: Story = {
  render: (args) => (
    <MobileWrapper
      {...args}
      title="Modo Offline"
      subtitle="Sin conexión a internet"
      role="jefe_terreno"
      connectionStatus="offline"
      offline={{
        enabled: true,
        strategies: ['cache-first'],
        offlineMessage: 'Los datos se sincronizarán cuando recupere la conexión',
        syncOnReconnect: true
      }}
      onOfflineAction={() => {
        console.log('Intentando sincronizar...')
      }}
    >
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="font-medium text-yellow-800">Modo Offline</span>
          </div>
          <p className="text-yellow-700 text-sm">
            Sus datos se guardarán localmente y se sincronizarán automáticamente cuando recupere la conexión.
          </p>
        </div>
        <ProjectDashboard />
      </div>
    </MobileWrapper>
  )
}

export const DarkTheme: Story = {
  render: (args) => (
    <MobileWrapper
      {...args}
      title="Modo Nocturno"
      subtitle="Trabajo en condiciones de poca luz"
      theme="dark"
      role="jefe_terreno"
      navigation={{
        type: 'bottom',
        position: 'fixed',
        items: [
          { id: 'home', label: 'Inicio', icon: '🏠', active: true, onClick: () => console.log('Home') },
          { id: 'tasks', label: 'Tareas', icon: '✅', onClick: () => console.log('Tasks') },
          { id: 'tools', label: 'Herram.', icon: '🔧', onClick: () => console.log('Tools') }
        ]
      }}
    >
      <div className="p-4 space-y-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-3">Trabajo Nocturno</h3>
          <p className="text-gray-300 text-sm mb-4">
            Interfaz optimizada para trabajo en condiciones de poca luz y uso prolongado.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-600 text-white rounded-lg font-medium">
              Iniciar Turno
            </button>
            <button className="p-3 border border-gray-600 text-gray-300 rounded-lg">
              Ver Horarios
            </button>
          </div>
        </div>
      </div>
    </MobileWrapper>
  )
}

export const PWAInstallation: Story = {
  render: (args) => (
    <MobileWrapper
      {...args}
      title="Instalar Aplicación"
      role="gerencia"
      pwaConfig={{
        installable: true,
        standalone: true,
        enableNotifications: true,
        enableOffline: true
      }}
      installPrompt={{
        title: '🏗️ App de Construcción',
        message: 'Instale nuestra aplicación PWA para acceso rápido, notificaciones push y funcionalidades offline completas.',
        installText: 'Instalar Ahora',
        dismissText: 'Recordar Después'
      }}
      onInstallPrompt={() => {
        console.log('PWA installation initiated')
      }}
    >
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">📱</div>
          <h3 className="font-semibold text-blue-900 mb-2">Aplicación Web Progresiva</h3>
          <p className="text-blue-700 text-sm mb-4">
            Instale nuestra PWA para una experiencia nativa con todas las funcionalidades offline.
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-600">✓</span>
              <span>Funciona sin internet</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-600">✓</span>
              <span>Notificaciones push</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-600">✓</span>
              <span>Acceso directo desde pantalla inicio</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-600">✓</span>
              <span>Actualizaciones automáticas</span>
            </div>
          </div>
        </div>
      </div>
    </MobileWrapper>
  )
}

export const LandscapeMode: Story = {
  render: (args) => (
    <MobileWrapper
      {...args}
      title="Planos y Diagramas"
      subtitle="Vista horizontal optimizada"
      orientation="landscape"
      role="oficina_tecnica"
    >
      <div className="p-4">
        <div className="bg-white border rounded-lg p-4 h-64">
          <h3 className="font-semibold mb-3">Plano Estructural - Piso 5</h3>
          <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded h-full flex items-center justify-center">
            <div className="text-center text-blue-600">
              <div className="text-3xl mb-2">📐</div>
              <div className="text-sm">Vista optimizada para planos</div>
              <div className="text-xs mt-1">Rotación horizontal detectada</div>
            </div>
          </div>
        </div>
      </div>
    </MobileWrapper>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile2'
    }
  }
}

export const LoadingState: Story = {
  render: (args) => (
    <MobileTemplate
      {...args}
      title="Cargando..."
      role="jefe_terreno"
      isLoading={true}
    >
      <div>Loading content...</div>
    </MobileTemplate>
  )
}

export const ErrorState: Story = {
  render: (args) => (
    <MobileWrapper
      {...args}
      title="Error de Conexión"
      role="jefe_terreno"
      error="No se pudo cargar la información. Verifique su conexión a internet."
    >
      <div>Error content...</div>
    </MobileWrapper>
  )
}