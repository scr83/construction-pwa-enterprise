'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { Loading } from '@/components/atoms/Loading'
import type { PhotoMetadata } from '@/types'

const photoUploaderVariants = cva(
  'relative rounded-lg border-2 border-dashed transition-all duration-200',
  {
    variants: {
      state: {
        idle: 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50/50',
        dragover: 'border-primary-500 bg-primary-50',
        uploading: 'border-primary-400 bg-primary-50',
        success: 'border-success-400 bg-success-50',
        error: 'border-danger-400 bg-danger-50',
      },
      size: {
        small: 'p-4',
        default: 'p-6',
        large: 'p-8',
      },
    },
    defaultVariants: {
      state: 'idle',
      size: 'default',
    },
  }
)

export interface PhotoFile extends File {
  id: string
  preview?: string
  metadata?: PhotoMetadata
  uploadProgress?: number
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error'
  errorMessage?: string
}

export interface PhotoUploaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof photoUploaderVariants> {
  // Upload configuration
  multiple?: boolean
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedFileTypes?: string[]
  
  // Construction-specific features
  captureGPS?: boolean
  requireGPS?: boolean
  constructionContext?: 'work-progress' | 'quality-inspection' | 'materials' | 'safety' | 'general'
  workRecordId?: string
  qualityRecordId?: string
  
  // Upload handling
  onFilesSelected?: (files: PhotoFile[]) => void
  onUploadProgress?: (fileId: string, progress: number) => void
  onUploadComplete?: (fileId: string, url: string) => void
  onUploadError?: (fileId: string, error: string) => void
  onFilesRemove?: (fileIds: string[]) => void
  
  // Current state
  files?: PhotoFile[]
  isUploading?: boolean
  disabled?: boolean
  
  // UI customization
  showPreview?: boolean
  previewColumns?: number
  allowRemove?: boolean
  showMetadata?: boolean
}

const PhotoUploader = React.forwardRef<HTMLDivElement, PhotoUploaderProps>(
  (
    {
      className,
      state: propState,
      size,
      multiple = true,
      maxFiles = 10,
      maxFileSize = 10 * 1024 * 1024, // 10MB
      acceptedFileTypes = ['image/*'],
      captureGPS = true,
      requireGPS = false,
      constructionContext = 'general',
      workRecordId,
      qualityRecordId,
      onFilesSelected,
      onUploadProgress,
      onUploadComplete,
      onUploadError,
      onFilesRemove,
      files = [],
      isUploading = false,
      disabled = false,
      showPreview = true,
      previewColumns = 3,
      allowRemove = true,
      showMetadata = false,
      ...props
    },
    ref
  ) => {
    const [dragState, setDragState] = React.useState<'idle' | 'dragover'>('idle')
    const [gpsPermission, setGpsPermission] = React.useState<'unknown' | 'granted' | 'denied'>('unknown')
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const dragCounterRef = React.useRef(0)
    
    // Determine current state
    const currentState = propState || (() => {
      if (isUploading) return 'uploading'
      if (dragState === 'dragover') return 'dragover'
      if (files.some(f => f.uploadStatus === 'error')) return 'error'
      if (files.every(f => f.uploadStatus === 'success') && files.length > 0) return 'success'
      return 'idle'
    })()
    
    // Get GPS location
    const getCurrentLocation = (): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation no soportada en este navegador'))
          return
        }
        
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        )
      })
    }
    
    // Check GPS permission on mount
    React.useEffect(() => {
      if (!captureGPS || !navigator.permissions) return
      
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setGpsPermission(result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'unknown')
        
        result.addEventListener('change', () => {
          setGpsPermission(result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'unknown')
        })
      })
    }, [captureGPS])
    
    // Process selected files
    const processFiles = async (fileList: FileList) => {
      if (disabled) return
      
      const newFiles: PhotoFile[] = []
      const filesToProcess = Array.from(fileList).slice(0, maxFiles - files.length)
      
      for (const file of filesToProcess) {
        // Validate file type
        const isValidType = acceptedFileTypes.some(type => {
          if (type === 'image/*') return file.type.startsWith('image/')
          return file.type === type
        })
        
        if (!isValidType) {
          console.warn(`Tipo de archivo no permitido: ${file.type}`)
          continue
        }
        
        // Validate file size
        if (file.size > maxFileSize) {
          console.warn(`Archivo muy grande: ${file.size} bytes`)
          continue
        }
        
        // Create PhotoFile object
        const photoFile: PhotoFile = Object.assign(file, {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          preview: URL.createObjectURL(file),
          uploadStatus: 'pending' as const,
          uploadProgress: 0,
        })
        
        // Capture GPS if enabled
        if (captureGPS) {
          try {
            const position = await getCurrentLocation()
            photoFile.metadata = {
              filename: file.name,
              url: '', // Will be set after upload
              geolocation: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: Date.now(),
              },
              ...(workRecordId && { workRecordId }),
              ...(qualityRecordId && { qualityRecordId }),
            }
            setGpsPermission('granted')
          } catch (error) {
            console.warn('Error obteniendo ubicación GPS:', error)
            setGpsPermission('denied')
            
            if (requireGPS) {
              photoFile.uploadStatus = 'error'
              photoFile.errorMessage = 'Se requiere ubicación GPS para esta foto'
            }
          }
        }
        
        newFiles.push(photoFile)
      }
      
      if (onFilesSelected && newFiles.length > 0) {
        onFilesSelected(newFiles)
      }
    }
    
    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files
      if (!fileList) return
      
      processFiles(fileList)
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    
    // Handle drag and drop
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current++
      setDragState('dragover')
    }
    
    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current--
      if (dragCounterRef.current === 0) {
        setDragState('idle')
      }
    }
    
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current = 0
      setDragState('idle')
      
      const fileList = e.dataTransfer.files
      if (fileList) {
        processFiles(fileList)
      }
    }
    
    // Remove files
    const handleRemoveFile = (fileId: string) => {
      if (onFilesRemove) {
        onFilesRemove([fileId])
      }
    }
    
    // Open file dialog
    const openFileDialog = () => {
      if (fileInputRef.current && !disabled) {
        fileInputRef.current.click()
      }
    }
    
    // Get context-specific instructions
    const getContextInstructions = () => {
      switch (constructionContext) {
        case 'work-progress':
          return 'Capture fotos del progreso del trabajo antes, durante y después de la ejecución'
        case 'quality-inspection':
          return 'Documente cualquier problema de calidad, defectos o elementos que requieran atención'
        case 'materials':
          return 'Fotografíe los materiales recibidos, su estado y ubicación en el sitio'
        case 'safety':
          return 'Capture condiciones de seguridad, uso de EPP y cumplimiento de protocolos'
        default:
          return 'Seleccione o arrastre archivos de imagen para subir'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(photoUploaderVariants({ state: currentState, size }), className)}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...props}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          multiple={multiple}
          onChange={handleFileChange}
          className="sr-only"
          disabled={disabled}
        />
        
        {/* GPS status indicator */}
        {captureGPS && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {gpsPermission === 'granted' && (
              <>
                <Icon name="map-pin" size="xs" variant="success" />
                <Typography variant="caption" color="success">GPS OK</Typography>
              </>
            )}
            {gpsPermission === 'denied' && (
              <>
                <Icon name="map-pin" size="xs" variant="danger" />
                <Typography variant="caption" color="danger">Sin GPS</Typography>
              </>
            )}
            {gpsPermission === 'unknown' && (
              <>
                <Icon name="map-pin" size="xs" variant="muted" />
                <Typography variant="caption" color="muted">GPS...</Typography>
              </>
            )}
          </div>
        )}
        
        {/* Main upload area */}
        {files.length === 0 && (
          <div className="text-center">
            <div className="mb-4">
              {currentState === 'uploading' ? (
                <Loading constructionContext="photos" size="xl" />
              ) : currentState === 'error' ? (
                <Icon name="x-circle" size="xl" variant="danger" />
              ) : currentState === 'success' ? (
                <Icon name="check-circle" size="xl" variant="success" />
              ) : (
                <Icon name="camera" size="xl" variant="primary" />
              )}
            </div>
            
            <Typography variant="h5" className="mb-2">
              {currentState === 'dragover' ? 'Suelte las imágenes aquí' : 'Subir Fotografías'}
            </Typography>
            
            <Typography variant="body-small" color="muted" className="mb-4">
              {getContextInstructions()}
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={openFileDialog}
                disabled={disabled || isUploading}
                leftIcon={<Icon name="camera" size="sm" />}
              >
                Seleccionar Imágenes
              </Button>
              
              {/* Camera capture button for mobile */}
              <Button
                variant="outline"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute('capture', 'environment')
                    fileInputRef.current.click()
                  }
                }}
                disabled={disabled || isUploading}
                leftIcon={<Icon name="camera" size="sm" />}
                className="sm:hidden"
              >
                Tomar Foto
              </Button>
            </div>
            
            <Typography variant="caption" color="muted" className="mt-4 block">
              Máximo {maxFiles} archivos • {Math.round(maxFileSize / 1024 / 1024)}MB por archivo
            </Typography>
          </div>
        )}
        
        {/* File previews */}
        {files.length > 0 && showPreview && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6">
                Fotografías ({files.length}/{maxFiles})
              </Typography>
              
              {files.length < maxFiles && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openFileDialog}
                  disabled={disabled || isUploading}
                  leftIcon={<Icon name="plus" size="xs" />}
                >
                  Agregar
                </Button>
              )}
            </div>
            
            <div className={cn(
              'grid gap-4',
              previewColumns === 1 && 'grid-cols-1',
              previewColumns === 2 && 'grid-cols-1 sm:grid-cols-2',
              previewColumns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
              previewColumns >= 4 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            )}>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative group rounded-lg overflow-hidden border border-secondary-200"
                >
                  {/* Image preview */}
                  <div className="aspect-square relative bg-secondary-100">
                    {file.preview && (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          if (file.preview) {
                            URL.revokeObjectURL(file.preview)
                          }
                        }}
                      />
                    )}
                    
                    {/* Upload progress overlay */}
                    {file.uploadStatus === 'uploading' && file.uploadProgress !== undefined && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <Loading size="lg" />
                          <Typography variant="body-small" color="white" className="mt-2">
                            {Math.round(file.uploadProgress)}%
                          </Typography>
                        </div>
                      </div>
                    )}
                    
                    {/* Status indicators */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {file.uploadStatus === 'success' && (
                        <div className="bg-success-500 text-white p-1 rounded">
                          <Icon name="check" size="xs" />
                        </div>
                      )}
                      {file.uploadStatus === 'error' && (
                        <div className="bg-danger-500 text-white p-1 rounded">
                          <Icon name="x" size="xs" />
                        </div>
                      )}
                      {file.metadata?.geolocation && (
                        <div className="bg-primary-500 text-white p-1 rounded">
                          <Icon name="map-pin" size="xs" />
                        </div>
                      )}
                    </div>
                    
                    {/* Remove button */}
                    {allowRemove && (
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="absolute top-2 left-2 bg-danger-500 hover:bg-danger-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={file.uploadStatus === 'uploading'}
                      >
                        <Icon name="trash" size="xs" />
                      </button>
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className="p-2">
                    <Typography variant="caption" className="truncate block" title={file.name}>
                      {file.name}
                    </Typography>
                    
                    {file.uploadStatus === 'error' && file.errorMessage && (
                      <Typography variant="caption" color="danger" className="mt-1">
                        {file.errorMessage}
                      </Typography>
                    )}
                    
                    {showMetadata && file.metadata?.geolocation && (
                      <div className="mt-1 text-xs text-secondary-500">
                        <div>GPS: {file.metadata.geolocation.latitude.toFixed(6)}, {file.metadata.geolocation.longitude.toFixed(6)}</div>
                        <div>Precisión: ±{Math.round(file.metadata.geolocation.accuracy)}m</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* GPS requirement warning */}
        {requireGPS && gpsPermission === 'denied' && (
          <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="alert-triangle" size="sm" variant="warning" />
              <Typography variant="body-small" color="warning">
                Se requiere acceso a la ubicación GPS para subir fotos en este contexto.
              </Typography>
            </div>
          </div>
        )}
      </div>
    )
  }
)
PhotoUploader.displayName = 'PhotoUploader'

export { PhotoUploader, photoUploaderVariants }
export type { PhotoFile }