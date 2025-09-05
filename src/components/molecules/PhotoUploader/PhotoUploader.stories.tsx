import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { PhotoUploader, type PhotoFile } from './PhotoUploader'

const meta: Meta<typeof PhotoUploader> = {
  title: 'Molecules/PhotoUploader',
  component: PhotoUploader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PhotoUploader molecule handles image uploads with GPS metadata capture, drag-and-drop functionality, and construction-specific contexts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    constructionContext: {
      control: 'select',
      options: ['work-progress', 'quality-inspection', 'materials', 'safety', 'general'],
    },
    state: {
      control: 'select',
      options: ['idle', 'dragover', 'uploading', 'success', 'error'],
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
    },
    previewColumns: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
    },
    maxFiles: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
    },
    multiple: {
      control: 'boolean',
    },
    captureGPS: {
      control: 'boolean',
    },
    requireGPS: {
      control: 'boolean',
    },
    showPreview: {
      control: 'boolean',
    },
    showMetadata: {
      control: 'boolean',
    },
    allowRemove: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic photo uploader
export const Default: Story = {
  args: {
    constructionContext: 'general',
    captureGPS: true,
    maxFiles: 5,
  },
}

// Construction context variations
export const ConstructionContexts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Progreso de Trabajo</h3>
        <PhotoUploader
          constructionContext="work-progress"
          captureGPS
          maxFiles={8}
          workRecordId="work-123"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Inspección de Calidad</h3>
        <PhotoUploader
          constructionContext="quality-inspection"
          captureGPS
          requireGPS
          maxFiles={10}
          qualityRecordId="quality-456"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Control de Materiales</h3>
        <PhotoUploader
          constructionContext="materials"
          captureGPS
          maxFiles={6}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Seguridad en Obra</h3>
        <PhotoUploader
          constructionContext="safety"
          captureGPS
          requireGPS
          maxFiles={5}
        />
      </div>
    </div>
  ),
}

// With preview and files
export const WithFiles: Story = {
  render: () => {
    const [files, setFiles] = React.useState<PhotoFile[]>([
      {
        id: '1',
        name: 'progress-before.jpg',
        size: 2048576,
        type: 'image/jpeg',
        lastModified: Date.now(),
        preview: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=300&fit=crop',
        uploadStatus: 'success',
        uploadProgress: 100,
        metadata: {
          filename: 'progress-before.jpg',
          url: '/uploads/progress-before.jpg',
          geolocation: {
            latitude: -33.4489,
            longitude: -70.6693,
            accuracy: 10,
            timestamp: Date.now() - 3600000,
          },
          workRecordId: 'work-123',
        },
      } as PhotoFile,
      {
        id: '2',
        name: 'materials-delivered.jpg',
        size: 1536432,
        type: 'image/jpeg',
        lastModified: Date.now(),
        preview: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop',
        uploadStatus: 'uploading',
        uploadProgress: 65,
      } as PhotoFile,
      {
        id: '3',
        name: 'quality-issue.jpg',
        size: 1024768,
        type: 'image/jpeg',
        lastModified: Date.now(),
        preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop',
        uploadStatus: 'error',
        errorMessage: 'Error al subir la imagen',
      } as PhotoFile,
    ])
    
    const handleFilesSelected = (newFiles: PhotoFile[]) => {
      setFiles(prev => [...prev, ...newFiles])
    }
    
    const handleFilesRemove = (fileIds: string[]) => {
      setFiles(prev => prev.filter(f => !fileIds.includes(f.id)))
    }
    
    return (
      <PhotoUploader
        constructionContext="work-progress"
        files={files}
        onFilesSelected={handleFilesSelected}
        onFilesRemove={handleFilesRemove}
        captureGPS
        maxFiles={8}
        showMetadata
      />
    )
  },
}

// Different states
export const States: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <h4 className="text-md font-medium mb-2">Estado Inicial</h4>
        <PhotoUploader
          state="idle"
          constructionContext="general"
          size="small"
        />
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Arrastrando Archivo</h4>
        <PhotoUploader
          state="dragover"
          constructionContext="general"
          size="small"
        />
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Subiendo</h4>
        <PhotoUploader
          state="uploading"
          constructionContext="general"
          size="small"
          isUploading
        />
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Éxito</h4>
        <PhotoUploader
          state="success"
          constructionContext="general"
          size="small"
        />
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Error</h4>
        <PhotoUploader
          state="error"
          constructionContext="general"
          size="small"
        />
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Deshabilitado</h4>
        <PhotoUploader
          constructionContext="general"
          size="small"
          disabled
        />
      </div>
    </div>
  ),
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-medium mb-4">Tamaño Pequeño</h4>
        <PhotoUploader
          size="small"
          constructionContext="general"
          maxFiles={3}
        />
      </div>
      
      <div>
        <h4 className="text-lg font-medium mb-4">Tamaño Por Defecto</h4>
        <PhotoUploader
          size="default"
          constructionContext="work-progress"
          maxFiles={5}
        />
      </div>
      
      <div>
        <h4 className="text-lg font-medium mb-4">Tamaño Grande</h4>
        <PhotoUploader
          size="large"
          constructionContext="quality-inspection"
          maxFiles={8}
        />
      </div>
    </div>
  ),
}

// Preview configurations
export const PreviewConfigurations: Story = {
  render: () => {
    const mockFiles: PhotoFile[] = Array.from({ length: 6 }, (_, i) => ({
      id: `file-${i}`,
      name: `construction-photo-${i + 1}.jpg`,
      size: 2048576,
      type: 'image/jpeg',
      lastModified: Date.now(),
      preview: `https://images.unsplash.com/photo-${[
        '1541888946425-d81bb19240f5',
        '1589939705384-5185137a7f0f',
        '1486406146926-c627a92ad1ab',
        '1582268611958-ebfd3cd78400',
        '1593642532842-98d0fd5ebc1a',
        '1616401077536-e21bd7e5ddb0',
      ][i]}?w=300&h=300&fit=crop`,
      uploadStatus: 'success',
      uploadProgress: 100,
      metadata: {
        filename: `construction-photo-${i + 1}.jpg`,
        url: `/uploads/construction-photo-${i + 1}.jpg`,
        geolocation: {
          latitude: -33.4489 + (Math.random() - 0.5) * 0.01,
          longitude: -70.6693 + (Math.random() - 0.5) * 0.01,
          accuracy: Math.floor(Math.random() * 20) + 5,
          timestamp: Date.now() - Math.random() * 3600000,
        },
      },
    })) as PhotoFile[]
    
    return (
      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-medium mb-4">2 Columnas</h4>
          <PhotoUploader
            files={mockFiles.slice(0, 4)}
            previewColumns={2}
            constructionContext="materials"
            showMetadata
          />
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-4">3 Columnas (Por Defecto)</h4>
          <PhotoUploader
            files={mockFiles}
            previewColumns={3}
            constructionContext="work-progress"
            showMetadata
          />
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-4">4 Columnas</h4>
          <PhotoUploader
            files={mockFiles}
            previewColumns={4}
            constructionContext="quality-inspection"
          />
        </div>
      </div>
    )
  },
}

// Interactive upload simulation
export const InteractiveUpload: Story = {
  render: () => {
    const [files, setFiles] = React.useState<PhotoFile[]>([])
    const [isUploading, setIsUploading] = React.useState(false)
    
    const handleFilesSelected = (newFiles: PhotoFile[]) => {
      const filesWithUpload = newFiles.map(file => ({
        ...file,
        uploadStatus: 'pending' as const,
        uploadProgress: 0,
      }))
      
      setFiles(prev => [...prev, ...filesWithUpload])
      
      // Simulate upload progress
      setIsUploading(true)
      filesWithUpload.forEach((file, index) => {
        setTimeout(() => {
          const interval = setInterval(() => {
            setFiles(current => 
              current.map(f => 
                f.id === file.id
                  ? {
                      ...f,
                      uploadStatus: 'uploading' as const,
                      uploadProgress: Math.min((f.uploadProgress || 0) + 10, 100),
                    }
                  : f
              )
            )
          }, 200)
          
          setTimeout(() => {
            clearInterval(interval)
            setFiles(current =>
              current.map(f =>
                f.id === file.id
                  ? {
                      ...f,
                      uploadStatus: Math.random() > 0.2 ? 'success' : 'error',
                      uploadProgress: 100,
                      ...(Math.random() <= 0.2 && {
                        errorMessage: 'Error simulado al subir la imagen',
                      }),
                    }
                  : f
              )
            )
            
            if (index === filesWithUpload.length - 1) {
              setTimeout(() => setIsUploading(false), 500)
            }
          }, 2500)
        }, index * 500)
      })
    }
    
    const handleFilesRemove = (fileIds: string[]) => {
      setFiles(prev => prev.filter(f => !fileIds.includes(f.id)))
    }
    
    return (
      <div className="max-w-2xl">
        <h3 className="text-lg font-medium mb-4">Subida Interactiva</h3>
        <PhotoUploader
          constructionContext="work-progress"
          files={files}
          isUploading={isUploading}
          onFilesSelected={handleFilesSelected}
          onFilesRemove={handleFilesRemove}
          captureGPS
          maxFiles={10}
          showMetadata
        />
      </div>
    )
  },
}

// Mobile layout
export const MobileLayout: Story = {
  render: () => {
    const [files, setFiles] = React.useState<PhotoFile[]>([
      {
        id: '1',
        name: 'mobile-photo-1.jpg',
        size: 1536432,
        type: 'image/jpeg',
        lastModified: Date.now(),
        preview: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=300&fit=crop',
        uploadStatus: 'success',
        uploadProgress: 100,
      } as PhotoFile,
      {
        id: '2',
        name: 'mobile-photo-2.jpg',
        size: 2048576,
        type: 'image/jpeg',
        lastModified: Date.now(),
        preview: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop',
        uploadStatus: 'success',
        uploadProgress: 100,
      } as PhotoFile,
    ])
    
    const handleFilesSelected = (newFiles: PhotoFile[]) => {
      setFiles(prev => [...prev, ...newFiles])
    }
    
    const handleFilesRemove = (fileIds: string[]) => {
      setFiles(prev => prev.filter(f => !fileIds.includes(f.id)))
    }
    
    return (
      <div className="max-w-sm mx-auto bg-background min-h-screen">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 mb-4">
          <h2 className="text-lg font-bold">Registro Fotográfico</h2>
          <p className="text-primary-100 text-sm">EA-1 - Hormigón Radier</p>
        </div>
        
        {/* Photo uploader */}
        <div className="px-4">
          <PhotoUploader
            constructionContext="work-progress"
            files={files}
            onFilesSelected={handleFilesSelected}
            onFilesRemove={handleFilesRemove}
            captureGPS
            maxFiles={8}
            previewColumns={2}
            size="small"
          />
          
          <div className="mt-6 space-y-3">
            <button className="w-full px-4 py-3 bg-primary-600 text-white rounded-md text-lg font-medium">
              Finalizar Registro
            </button>
            <button className="w-full px-4 py-2 border border-secondary-300 text-secondary-700 rounded-md">
              Guardar Borrador
            </button>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
}

// GPS features showcase
export const GPSFeatures: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-medium mb-4">GPS Opcional (Por Defecto)</h4>
        <PhotoUploader
          constructionContext="general"
          captureGPS
          requireGPS={false}
          maxFiles={3}
        />
      </div>
      
      <div>
        <h4 className="text-lg font-medium mb-4">GPS Requerido</h4>
        <PhotoUploader
          constructionContext="quality-inspection"
          captureGPS
          requireGPS
          maxFiles={5}
        />
      </div>
      
      <div>
        <h4 className="text-lg font-medium mb-4">Sin GPS</h4>
        <PhotoUploader
          constructionContext="materials"
          captureGPS={false}
          maxFiles={4}
        />
      </div>
    </div>
  ),
}

// Quality inspection workflow
export const QualityInspectionWorkflow: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary-900">Inspección de Calidad</h2>
        <p className="text-secondary-600">Documente los hallazgos de la inspección</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Evidencia de Conformidad</h3>
          <PhotoUploader
            constructionContext="quality-inspection"
            captureGPS
            requireGPS
            maxFiles={8}
            previewColumns={2}
            qualityRecordId="quality-789"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">No Conformidades</h3>
          <PhotoUploader
            constructionContext="quality-inspection"
            captureGPS
            requireGPS
            maxFiles={6}
            previewColumns={2}
            qualityRecordId="quality-789"
          />
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
        <button className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-md hover:bg-secondary-50">
          Guardar Borrador
        </button>
        <button className="flex-1 px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700">
          Aprobar Inspección
        </button>
        <button className="flex-1 px-4 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700">
          Rechazar con Observaciones
        </button>
      </div>
    </div>
  ),
}