import type { Meta, StoryObj } from '@storybook/react'
import { 
  Loading, 
  MaterialsLoading, 
  PhotoUploadLoading, 
  WorkRecordLoading, 
  QualityCheckLoading 
} from './Loading'

const meta: Meta<typeof Loading> = {
  title: 'Atoms/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Loading component designed for construction environments with offline sync indicators, progress tracking, and connection status awareness.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'sync', 'offline', 'error', 'success'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    syncType: {
      control: 'select',
      options: ['upload', 'download', 'offline', 'database', 'general'],
    },
    connectionStatus: {
      control: 'select',
      options: ['online', 'offline', 'poor', 'connecting'],
    },
    constructionContext: {
      control: 'select',
      options: ['materials', 'quality', 'work-record', 'photos', 'project', 'general'],
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
    },
    fullScreen: {
      control: 'boolean',
    },
    overlay: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic loading spinner
export const Default: Story = {
  args: {
    message: 'Cargando...',
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <Loading size="xs" message="Extra pequeño" />
      </div>
      <div className="text-center">
        <Loading size="sm" message="Pequeño" />
      </div>
      <div className="text-center">
        <Loading size="default" message="Por defecto" />
      </div>
      <div className="text-center">
        <Loading size="lg" message="Grande" />
      </div>
      <div className="text-center">
        <Loading size="xl" message="Extra grande" />
      </div>
    </div>
  ),
}

// Connection status variants
export const ConnectionStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-4">Estados de Conexión</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <Loading 
            connectionStatus="online"
            message="Sincronización en línea"
            size="lg"
          />
        </div>
        
        <div className="p-4 border rounded-lg">
          <Loading 
            connectionStatus="offline"
            message="Trabajando sin conexión"
            variant="offline"
            size="lg"
          />
        </div>
        
        <div className="p-4 border rounded-lg">
          <Loading 
            connectionStatus="poor"
            message="Conexión lenta"
            variant="sync"
            size="lg"
          />
        </div>
        
        <div className="p-4 border rounded-lg">
          <Loading 
            connectionStatus="connecting"
            message="Reconectando..."
            syncType="download"
            size="lg"
          />
        </div>
      </div>
    </div>
  ),
}

// Progress indicators
export const ProgressIndicators: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <Loading 
        message="Subiendo fotografías"
        progress={25}
        syncType="upload"
        size="lg"
      />
      
      <Loading 
        message="Sincronizando materiales"
        progress={60}
        syncType="database"
        size="lg"
      />
      
      <Loading 
        message="Guardando sin conexión"
        progress={80}
        connectionStatus="offline"
        variant="offline"
        size="lg"
      />
      
      <Loading 
        message="Proceso completado"
        progress={100}
        variant="success"
        size="lg"
      />
    </div>
  ),
}

// Construction-specific contexts
export const ConstructionContexts: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="p-4 border rounded-lg text-center">
        <Loading 
          constructionContext="materials"
          syncType="database"
          size="lg"
        />
      </div>
      
      <div className="p-4 border rounded-lg text-center">
        <Loading 
          constructionContext="quality"
          syncType="upload"
          size="lg"
        />
      </div>
      
      <div className="p-4 border rounded-lg text-center">
        <Loading 
          constructionContext="work-record"
          syncType="offline"
          connectionStatus="offline"
          size="lg"
        />
      </div>
      
      <div className="p-4 border rounded-lg text-center">
        <Loading 
          constructionContext="photos"
          syncType="upload"
          progress={45}
          size="lg"
        />
      </div>
      
      <div className="p-4 border rounded-lg text-center">
        <Loading 
          constructionContext="project"
          syncType="download"
          size="lg"
        />
      </div>
      
      <div className="p-4 border rounded-lg text-center">
        <Loading 
          variant="error"
          message="Error de sincronización"
          submessage="Reintentando..."
          size="lg"
        />
      </div>
    </div>
  ),
}

// Specialized construction loading components
export const SpecializedComponents: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-6">Componentes Especializados</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h4 className="text-md font-medium mb-4 text-center">Carga de Materiales</h4>
          <MaterialsLoading progress={35} />
        </div>
        
        <div className="p-6 border rounded-lg">
          <h4 className="text-md font-medium mb-4 text-center">Subida de Fotos</h4>
          <PhotoUploadLoading progress={72} connectionStatus="online" />
        </div>
        
        <div className="p-6 border rounded-lg">
          <h4 className="text-md font-medium mb-4 text-center">Registro de Trabajo</h4>
          <WorkRecordLoading connectionStatus="offline" />
        </div>
        
        <div className="p-6 border rounded-lg">
          <h4 className="text-md font-medium mb-4 text-center">Control de Calidad</h4>
          <QualityCheckLoading />
        </div>
      </div>
    </div>
  ),
}

// Full screen loading
export const FullScreenLoading: Story = {
  render: () => (
    <div className="relative h-96 border rounded-lg overflow-hidden">
      <div className="p-4">
        <h3>Contenido de la página</h3>
        <p>Este contenido estaría detrás del loading...</p>
      </div>
      
      <Loading 
        fullScreen
        message="Sincronizando datos del proyecto"
        submessage="Esto puede tardar unos segundos..."
        constructionContext="project"
        size="xl"
      />
    </div>
  ),
}

// Mobile loading states
export const MobileOptimized: Story = {
  render: () => (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <h3 className="font-bold">Registro de Faena</h3>
      </div>
      
      {/* Content with loading */}
      <div className="p-4 space-y-6">
        <div className="text-center">
          <Loading 
            constructionContext="work-record"
            syncType="upload"
            progress={45}
            connectionStatus="online"
            size="lg"
            className="mb-4"
          />
          <p className="text-sm text-secondary-600">
            Guardando información de la faena...
          </p>
        </div>
        
        {/* Form fields simulation */}
        <div className="space-y-3 opacity-50">
          <div className="h-4 bg-secondary-200 rounded animate-pulse"></div>
          <div className="h-4 bg-secondary-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-secondary-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// Loading with custom messages
export const CustomMessages: Story = {
  render: () => (
    <div className="space-y-6">
      <Loading 
        message="Verificando calidad del hormigón..."
        submessage="Analizando muestras según norma NCh 1019"
        constructionContext="quality"
        size="lg"
        progress={30}
      />
      
      <Loading 
        message="Actualizando inventario de bodega"
        submessage="Sincronizando con sistema ERP"
        constructionContext="materials"
        syncType="database"
        size="lg"
      />
      
      <Loading 
        message="Procesando fotografías GPS"
        submessage="Verificando coordenadas y metadatos"
        constructionContext="photos"
        syncType="upload"
        progress={65}
        size="lg"
      />
    </div>
  ),
}

// Error states
export const ErrorStates: Story = {
  render: () => (
    <div className="space-y-6">
      <Loading 
        variant="error"
        message="Error de conexión"
        submessage="No se pudo conectar al servidor"
        size="lg"
        showIcon={true}
      />
      
      <Loading 
        variant="error"
        message="Falló la subida de archivos"
        submessage="Verifique su conexión a internet"
        constructionContext="photos"
        connectionStatus="offline"
        size="lg"
      />
    </div>
  ),
}