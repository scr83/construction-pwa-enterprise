'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { PhotoUploader, type PhotoFile } from '@/components/molecules/PhotoUploader'
import { StatusCard } from '@/components/molecules/StatusCard'
import { FilterDropdown, type FilterOption } from '@/components/molecules/FilterDropdown'
import { DatePicker, type DateRange } from '@/components/molecules/DatePicker'
import { Typography } from '@/components/atoms/Typography'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Badge } from '@/components/atoms/Badge'
import { Loading } from '@/components/atoms/Loading'
import { Avatar } from '@/components/atoms/Avatar'
import { Checkbox } from '@/components/atoms/Checkbox'

const photoGalleryVariants = cva(
  'bg-white rounded-lg border border-secondary-200 shadow-sm',
  {
    variants: {
      variant: {
        default: 'p-6',
        compact: 'p-4',
        full: 'p-8',
        mobile: 'p-3',
      },
      layout: {
        grid: 'flex flex-col',
        masonry: 'flex flex-col',
        timeline: 'flex flex-col',
        details: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
      },
      mode: {
        view: '',
        edit: 'border-primary-200',
        select: 'border-warning-200',
        upload: 'border-success-200',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'grid',
      mode: 'view',
    },
  }
)

// Photo metadata interfaces
export interface PhotoAnnotation {
  id: string
  type: 'point' | 'rectangle' | 'circle' | 'arrow' | 'text'
  coordinates: {
    x: number
    y: number
    width?: number
    height?: number
  }
  content: string
  author: {
    id: string
    name: string
    role: string
  }
  timestamp: Date
  severity?: 'info' | 'warning' | 'error' | 'critical'
  resolved?: boolean
  category?: 'quality' | 'safety' | 'progress' | 'materials' | 'general'
}

export interface GPSLocation {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number
  address?: string
  zone?: string
  floor?: string
  unit?: string
}

export interface ConstructionPhoto {
  id: string
  filename: string
  originalFilename: string
  url: string
  thumbnailUrl?: string
  fullResolutionUrl?: string
  
  // Basic metadata
  size: number
  dimensions: { width: number; height: number }
  format: string
  mimeType: string
  
  // Timestamps
  capturedDate: Date
  uploadedDate: Date
  lastModifiedDate?: Date
  
  // Location data
  gps?: GPSLocation
  constructionZone?: string
  level?: string
  area?: string
  
  // Construction context
  project: {
    id: string
    name: string
    code: string
  }
  activity?: {
    id: string
    name: string
    code: string
    partida?: string
  }
  workOrder?: {
    id: string
    title: string
    status: string
  }
  qualityInspection?: {
    id: string
    type: string
    status: 'pending' | 'approved' | 'rejected' | 'conditional'
  }
  
  // User and team data
  capturedBy: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  assignedTo?: Array<{
    id: string
    name: string
    role: string
  }>
  
  // Photo organization
  tags: string[]
  category: 'progress' | 'quality' | 'safety' | 'materials' | 'before' | 'after' | 'problem' | 'solution'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'archived'
  
  // Annotations and reviews
  annotations: PhotoAnnotation[]
  notes?: string
  description?: string
  
  // Workflow integration
  approvalFlow?: {
    requiredApprovals: number
    currentApprovals: number
    approvers: Array<{
      id: string
      name: string
      role: string
      approved: boolean
      timestamp?: Date
      comments?: string
    }>
  }
  
  // Quality assessment
  qualityScore?: number
  technicalCompliance?: boolean
  
  // Relationships
  relatedPhotos?: string[]
  beforePhoto?: string
  afterPhoto?: string
  parentPhotoId?: string
  childPhotos?: string[]
  
  // Sync and storage
  syncStatus: 'synced' | 'pending' | 'failed' | 'offline'
  storageLocation: 'local' | 'cloud' | 'both'
  backupStatus?: 'pending' | 'completed' | 'failed'
  
  // Access control
  visibility: 'public' | 'team' | 'management' | 'private'
  permissions: Array<{
    role: string
    canView: boolean
    canEdit: boolean
    canDelete: boolean
    canApprove: boolean
  }>
}

// Filter and search interfaces
export interface PhotoFilter {
  projects?: string[]
  categories?: string[]
  tags?: string[]
  status?: string[]
  priority?: string[]
  capturedBy?: string[]
  dateRange?: DateRange
  location?: {
    zones?: string[]
    levels?: string[]
    areas?: string[]
  }
  gps?: {
    radius?: number
    center?: { lat: number; lng: number }
  }
  annotations?: {
    hasAnnotations?: boolean
    severity?: string[]
    resolved?: boolean
  }
  quality?: {
    minScore?: number
    technicalCompliance?: boolean
  }
  workflow?: {
    requiresApproval?: boolean
    approvalStatus?: string[]
  }
  sync?: {
    status?: string[]
    location?: string[]
  }
}

// Batch operation interfaces
export interface BatchOperation {
  id: string
  type: 'approve' | 'reject' | 'tag' | 'move' | 'delete' | 'export' | 'sync' | 'annotate'
  targetPhotos: string[]
  parameters: Record<string, any>
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress?: number
  result?: {
    successful: number
    failed: number
    errors?: Array<{
      photoId: string
      error: string
    }>
  }
  createdBy: string
  createdAt: Date
  completedAt?: Date
}

export interface PhotoGalleryProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof photoGalleryVariants> {
  // Photo data
  photos?: ConstructionPhoto[]
  selectedPhotos?: string[]
  
  // Display configuration
  columns?: number
  showMetadata?: boolean
  showAnnotations?: boolean
  showFilters?: boolean
  showBatchOperations?: boolean
  showUploader?: boolean
  enablePhotoCapture?: boolean
  
  // Layout options
  thumbnailSize?: 'sm' | 'md' | 'lg'
  photoSpacing?: 'tight' | 'normal' | 'loose'
  
  // Filter and search
  currentFilters?: PhotoFilter
  availableProjects?: Array<{ id: string; name: string; code: string }>
  availableUsers?: Array<{ id: string; name: string; role: string }>
  availableZones?: string[]
  availableTags?: string[]
  onFiltersChange?: (filters: PhotoFilter) => void
  onSearch?: (query: string) => void
  
  // Photo interactions
  onPhotoClick?: (photo: ConstructionPhoto) => void
  onPhotoDoubleClick?: (photo: ConstructionPhoto) => void
  onPhotoSelect?: (photoId: string, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
  onPhotoDelete?: (photoId: string) => void
  onPhotosDelete?: (photoIds: string[]) => void
  
  // Upload and capture
  onPhotoUpload?: (files: PhotoFile[]) => void
  onPhotoCapture?: (photo: File, metadata: any) => void
  onUploadProgress?: (fileId: string, progress: number) => void
  onUploadComplete?: (fileId: string, photo: ConstructionPhoto) => void
  onUploadError?: (fileId: string, error: string) => void
  
  // Annotation functionality
  onAnnotationAdd?: (photoId: string, annotation: Omit<PhotoAnnotation, 'id' | 'timestamp'>) => void
  onAnnotationEdit?: (photoId: string, annotationId: string, changes: Partial<PhotoAnnotation>) => void
  onAnnotationDelete?: (photoId: string, annotationId: string) => void
  onAnnotationResolve?: (photoId: string, annotationId: string, resolved: boolean) => void
  
  // Workflow actions
  onPhotoApprove?: (photoId: string, comments?: string) => void
  onPhotoReject?: (photoId: string, reason: string) => void
  onStatusChange?: (photoId: string, status: ConstructionPhoto['status']) => void
  onTagsUpdate?: (photoId: string, tags: string[]) => void
  
  // Batch operations
  onBatchOperation?: (operation: Omit<BatchOperation, 'id' | 'createdAt'>) => void
  activeBatchOperations?: BatchOperation[]
  
  // Export and sharing
  onExportPhotos?: (photoIds: string[], format: 'zip' | 'pdf' | 'excel') => void
  onSharePhotos?: (photoIds: string[], recipients: string[]) => void
  onDownloadPhoto?: (photoId: string, size: 'thumbnail' | 'medium' | 'full') => void
  
  // Sync functionality
  onSyncPhotos?: (photoIds?: string[]) => void
  onRetrySync?: (photoId: string) => void
  autoSync?: boolean
  offlineMode?: boolean
  
  // Loading and error states
  isLoading?: boolean
  isUploading?: boolean
  isSyncing?: boolean
  error?: string
  
  // User context and permissions
  currentUser?: {
    id: string
    name: string
    role: string
    permissions: string[]
  }
  
  // View preferences
  viewMode?: 'grid' | 'masonry' | 'timeline' | 'details'
  sortBy?: 'date' | 'name' | 'size' | 'priority' | 'status'
  sortOrder?: 'asc' | 'desc'
  groupBy?: 'date' | 'project' | 'category' | 'status' | 'user'
  onViewPreferencesChange?: (preferences: any) => void
  
  // Mobile optimizations
  enableSwipeGestures?: boolean
  enablePinchZoom?: boolean
  fullscreenMode?: boolean
  
  // Advanced features
  enableAI?: boolean
  aiFeatures?: Array<'auto-tagging' | 'quality-detection' | 'object-recognition' | 'text-extraction'>
  onAIAnalysis?: (photoId: string) => void
}

const PhotoGallery = React.forwardRef<HTMLDivElement, PhotoGalleryProps>(
  (
    {
      className,
      variant,
      layout,
      mode,
      photos = [],
      selectedPhotos = [],
      columns = 4,
      showMetadata = true,
      showAnnotations = true,
      showFilters = true,
      showBatchOperations = true,
      showUploader = true,
      enablePhotoCapture = true,
      thumbnailSize = 'md',
      photoSpacing = 'normal',
      currentFilters = {},
      availableProjects = [],
      availableUsers = [],
      availableZones = [],
      availableTags = [],
      onFiltersChange,
      onSearch,
      onPhotoClick,
      onPhotoDoubleClick,
      onPhotoSelect,
      onSelectAll,
      onPhotoDelete,
      onPhotosDelete,
      onPhotoUpload,
      onPhotoCapture,
      onUploadProgress,
      onUploadComplete,
      onUploadError,
      onAnnotationAdd,
      onAnnotationEdit,
      onAnnotationDelete,
      onAnnotationResolve,
      onPhotoApprove,
      onPhotoReject,
      onStatusChange,
      onTagsUpdate,
      onBatchOperation,
      activeBatchOperations = [],
      onExportPhotos,
      onSharePhotos,
      onDownloadPhoto,
      onSyncPhotos,
      onRetrySync,
      autoSync = true,
      offlineMode = false,
      isLoading = false,
      isUploading = false,
      isSyncing = false,
      error,
      currentUser,
      viewMode = 'grid',
      sortBy = 'date',
      sortOrder = 'desc',
      groupBy,
      onViewPreferencesChange,
      enableSwipeGestures = true,
      enablePinchZoom = true,
      fullscreenMode = false,
      enableAI = false,
      aiFeatures = [],
      onAIAnalysis,
      ...props
    },
    ref
  ) => {
    const [selectedPhotoIds, setSelectedPhotoIds] = React.useState<Set<string>>(new Set(selectedPhotos))
    const [searchQuery, setSearchQuery] = React.useState('')
    const [activeFilters, setActiveFilters] = React.useState<PhotoFilter>(currentFilters)
    const [fullscreenPhoto, setFullscreenPhoto] = React.useState<string | null>(null)
    const [annotationMode, setAnnotationMode] = React.useState(false)
    const [batchMode, setBatchMode] = React.useState(false)
    const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false)

    // Auto-sync effect
    React.useEffect(() => {
      if (autoSync && !offlineMode) {
        const interval = setInterval(() => {
          const unsyncedPhotos = photos.filter(p => p.syncStatus === 'pending').map(p => p.id)
          if (unsyncedPhotos.length > 0) {
            onSyncPhotos?.(unsyncedPhotos)
          }
        }, 30000) // Sync every 30 seconds

        return () => clearInterval(interval)
      }
    }, [autoSync, offlineMode, photos, onSyncPhotos])

    // Handle photo selection
    const handlePhotoSelect = (photoId: string, selected: boolean) => {
      const newSelected = new Set(selectedPhotoIds)
      if (selected) {
        newSelected.add(photoId)
      } else {
        newSelected.delete(photoId)
      }
      setSelectedPhotoIds(newSelected)
      onPhotoSelect?.(photoId, selected)
    }

    // Handle select all
    const handleSelectAll = (selected: boolean) => {
      if (selected) {
        const allIds = new Set(filteredPhotos.map(p => p.id))
        setSelectedPhotoIds(allIds)
      } else {
        setSelectedPhotoIds(new Set())
      }
      onSelectAll?.(selected)
    }

    // Handle filter changes
    const handleFilterChange = (filterType: keyof PhotoFilter, value: any) => {
      const newFilters = { ...activeFilters, [filterType]: value }
      setActiveFilters(newFilters)
      onFiltersChange?.(newFilters)
    }

    // Handle search
    const handleSearch = (query: string) => {
      setSearchQuery(query)
      onSearch?.(query)
    }

    // Filter photos based on current filters and search
    const filteredPhotos = React.useMemo(() => {
      let result = photos

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        result = result.filter(photo => 
          photo.filename.toLowerCase().includes(query) ||
          photo.description?.toLowerCase().includes(query) ||
          photo.notes?.toLowerCase().includes(query) ||
          photo.tags.some(tag => tag.toLowerCase().includes(query)) ||
          photo.capturedBy.name.toLowerCase().includes(query) ||
          photo.project.name.toLowerCase().includes(query)
        )
      }

      // Apply filters
      if (activeFilters.projects?.length) {
        result = result.filter(photo => activeFilters.projects!.includes(photo.project.id))
      }
      
      if (activeFilters.categories?.length) {
        result = result.filter(photo => activeFilters.categories!.includes(photo.category))
      }
      
      if (activeFilters.status?.length) {
        result = result.filter(photo => activeFilters.status!.includes(photo.status))
      }
      
      if (activeFilters.priority?.length) {
        result = result.filter(photo => activeFilters.priority!.includes(photo.priority))
      }
      
      if (activeFilters.capturedBy?.length) {
        result = result.filter(photo => activeFilters.capturedBy!.includes(photo.capturedBy.id))
      }
      
      if (activeFilters.tags?.length) {
        result = result.filter(photo => 
          activeFilters.tags!.some(tag => photo.tags.includes(tag))
        )
      }

      // Date range filter
      if (activeFilters.dateRange?.start || activeFilters.dateRange?.end) {
        result = result.filter(photo => {
          const photoDate = new Date(photo.capturedDate)
          if (activeFilters.dateRange?.start && photoDate < activeFilters.dateRange.start) return false
          if (activeFilters.dateRange?.end && photoDate > activeFilters.dateRange.end) return false
          return true
        })
      }

      // Sort results
      result.sort((a, b) => {
        let comparison = 0
        
        switch (sortBy) {
          case 'date':
            comparison = new Date(a.capturedDate).getTime() - new Date(b.capturedDate).getTime()
            break
          case 'name':
            comparison = a.filename.localeCompare(b.filename)
            break
          case 'size':
            comparison = a.size - b.size
            break
          case 'priority':
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 }
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
            break
          case 'status':
            comparison = a.status.localeCompare(b.status)
            break
        }
        
        return sortOrder === 'asc' ? comparison : -comparison
      })

      return result
    }, [photos, searchQuery, activeFilters, sortBy, sortOrder])

    // Group photos if groupBy is set
    const groupedPhotos = React.useMemo(() => {
      if (!groupBy) return { '': filteredPhotos }

      const groups: Record<string, ConstructionPhoto[]> = {}
      
      filteredPhotos.forEach(photo => {
        let groupKey = ''
        
        switch (groupBy) {
          case 'date':
            groupKey = photo.capturedDate.toLocaleDateString()
            break
          case 'project':
            groupKey = photo.project.name
            break
          case 'category':
            groupKey = photo.category
            break
          case 'status':
            groupKey = photo.status
            break
          case 'user':
            groupKey = photo.capturedBy.name
            break
        }
        
        if (!groups[groupKey]) {
          groups[groupKey] = []
        }
        groups[groupKey].push(photo)
      })
      
      return groups
    }, [filteredPhotos, groupBy])

    // Get thumbnail size classes
    const getThumbnailSizeClasses = () => {
      switch (thumbnailSize) {
        case 'sm': return 'w-24 h-24'
        case 'lg': return 'w-48 h-48'
        default: return 'w-32 h-32'
      }
    }

    // Get photo spacing classes
    const getPhotoSpacingClasses = () => {
      switch (photoSpacing) {
        case 'tight': return 'gap-1'
        case 'loose': return 'gap-6'
        default: return 'gap-3'
      }
    }

    // Filter options
    const categoryOptions: FilterOption[] = [
      { value: 'progress', label: 'Progreso', icon: 'trending-up' },
      { value: 'quality', label: 'Calidad', icon: 'shield-check' },
      { value: 'safety', label: 'Seguridad', icon: 'hard-hat' },
      { value: 'materials', label: 'Materiales', icon: 'package' },
      { value: 'before', label: 'Antes', icon: 'arrow-left' },
      { value: 'after', label: 'Después', icon: 'arrow-right' },
      { value: 'problem', label: 'Problema', icon: 'alert-triangle' },
      { value: 'solution', label: 'Solución', icon: 'check-circle' },
    ]

    const statusOptions: FilterOption[] = [
      { value: 'draft', label: 'Borrador', icon: 'edit' },
      { value: 'review', label: 'En Revisión', icon: 'eye' },
      { value: 'approved', label: 'Aprobado', icon: 'check' },
      { value: 'rejected', label: 'Rechazado', icon: 'x' },
      { value: 'archived', label: 'Archivado', icon: 'archive' },
    ]

    const priorityOptions: FilterOption[] = [
      { value: 'critical', label: 'Crítico', icon: 'alert-triangle' },
      { value: 'high', label: 'Alto', icon: 'arrow-up' },
      { value: 'medium', label: 'Medio', icon: 'minus' },
      { value: 'low', label: 'Bajo', icon: 'arrow-down' },
    ]

    if (isLoading) {
      return (
        <div
          className={cn(
            photoGalleryVariants({ variant, layout, mode }),
            'animate-pulse',
            className
          )}
        >
          <div className="space-y-6">
            <div className="h-8 bg-secondary-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-secondary-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(photoGalleryVariants({ variant, layout, mode }), className)}
        {...props}
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Typography variant="h4" className="font-bold">
                Galería de Fotos
              </Typography>
              <Badge variant="secondary" count={filteredPhotos.length}>
                {filteredPhotos.length === 1 ? 'foto' : 'fotos'}
              </Badge>
              
              {/* Sync status indicator */}
              <div className="flex items-center gap-2">
                {isSyncing && (
                  <Badge variant="primary" icon="refresh-cw">
                    <Icon name="refresh-cw" size="xs" className="animate-spin mr-1" />
                    Sincronizando
                  </Badge>
                )}
                {offlineMode && (
                  <Badge variant="warning" icon="wifi-off">
                    Sin Conexión
                  </Badge>
                )}
                {autoSync && !offlineMode && (
                  <Badge variant="success" icon="check-circle" size="xs">
                    Auto-sync
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Selection indicator */}
            {selectedPhotoIds.size > 0 && (
              <div className="flex items-center gap-2 text-sm text-primary-600">
                <Icon name="check-square" size="xs" />
                {selectedPhotoIds.size} foto{selectedPhotoIds.size !== 1 ? 's' : ''} seleccionada{selectedPhotoIds.size !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View mode toggles */}
            <div className="flex border border-secondary-200 rounded-lg p-1">
              {(['grid', 'masonry', 'timeline'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'primary' : 'ghost'}
                  size="xs"
                  onClick={() => onViewPreferencesChange?.({ viewMode: mode })}
                  className="px-2"
                >
                  <Icon 
                    name={
                      mode === 'grid' ? 'grid' :
                      mode === 'masonry' ? 'layout' : 'clock'
                    } 
                    size="xs" 
                  />
                </Button>
              ))}
            </div>
            
            {/* Batch operations toggle */}
            {showBatchOperations && selectedPhotoIds.size > 0 && (
              <Button
                variant={batchMode ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setBatchMode(!batchMode)}
                leftIcon={<Icon name="layers" size="xs" />}
              >
                Acciones
              </Button>
            )}
            
            {/* Upload button */}
            {showUploader && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setUploadDialogOpen(true)}
                leftIcon={<Icon name="upload" size="xs" />}
                disabled={isUploading}
              >
                {isUploading ? <Loading size="xs" /> : 'Subir Fotos'}
              </Button>
            )}
            
            {/* Capture photo button */}
            {enablePhotoCapture && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Trigger photo capture (would open camera on mobile)
                  console.log('Open camera for photo capture')
                }}
                leftIcon={<Icon name="camera" size="xs" />}
              >
                Capturar
              </Button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-6 p-4 bg-secondary-25 rounded-lg border border-secondary-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <FilterDropdown
                label="Proyectos"
                options={availableProjects.map(p => ({ value: p.id, label: `${p.code} - ${p.name}`, icon: 'folder' }))}
                value={activeFilters.projects || []}
                onValueChange={(value) => handleFilterChange('projects', value)}
                multiple
                placeholder="Todos los proyectos"
                icon="folder"
              />
              
              <FilterDropdown
                label="Categoría"
                options={categoryOptions}
                value={activeFilters.categories || []}
                onValueChange={(value) => handleFilterChange('categories', value)}
                multiple
                placeholder="Todas las categorías"
                icon="tag"
              />
              
              <FilterDropdown
                label="Estado"
                options={statusOptions}
                value={activeFilters.status || []}
                onValueChange={(value) => handleFilterChange('status', value)}
                multiple
                placeholder="Todos los estados"
                icon="flag"
              />
              
              <FilterDropdown
                label="Prioridad"
                options={priorityOptions}
                value={activeFilters.priority || []}
                onValueChange={(value) => handleFilterChange('priority', value)}
                multiple
                placeholder="Todas las prioridades"
                icon="alert-circle"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Typography variant="label-small" className="mb-2">Rango de Fechas</Typography>
                <DatePicker
                  variant="range"
                  value={activeFilters.dateRange}
                  onValueChange={(range) => handleFilterChange('dateRange', range)}
                  placeholder="Seleccionar período"
                />
              </div>
              
              <div>
                <Typography variant="label-small" className="mb-2">Buscar</Typography>
                <div className="relative">
                  <Icon name="search" size="xs" className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Buscar en fotos..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <Icon name="x" size="xs" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveFilters({})
                    setSearchQuery('')
                    onFiltersChange?.({})
                  }}
                  leftIcon={<Icon name="x" size="xs" />}
                >
                  Limpiar
                </Button>
                
                {/* Select all toggle */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedPhotoIds.size === filteredPhotos.length && filteredPhotos.length > 0}
                    indeterminate={selectedPhotoIds.size > 0 && selectedPhotoIds.size < filteredPhotos.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Typography variant="label-small">
                    Seleccionar todo
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch Operations Bar */}
        {batchMode && selectedPhotoIds.size > 0 && (
          <div className="mb-4 p-3 bg-warning-25 border border-warning-200 rounded-lg">
            <div className="flex items-center justify-between">
              <Typography variant="body-small" className="font-medium">
                {selectedPhotoIds.size} foto{selectedPhotoIds.size !== 1 ? 's' : ''} seleccionada{selectedPhotoIds.size !== 1 ? 's' : ''}
              </Typography>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onBatchOperation?.({
                    type: 'approve',
                    targetPhotos: Array.from(selectedPhotoIds),
                    parameters: {},
                    status: 'pending',
                    createdBy: currentUser?.id || 'current-user'
                  })}
                  leftIcon={<Icon name="check" size="xs" />}
                >
                  Aprobar
                </Button>
                
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onBatchOperation?.({
                    type: 'tag',
                    targetPhotos: Array.from(selectedPhotoIds),
                    parameters: { tags: [] },
                    status: 'pending',
                    createdBy: currentUser?.id || 'current-user'
                  })}
                  leftIcon={<Icon name="tag" size="xs" />}
                >
                  Etiquetar
                </Button>
                
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onExportPhotos?.(Array.from(selectedPhotoIds), 'zip')}
                  leftIcon={<Icon name="download" size="xs" />}
                >
                  Exportar
                </Button>
                
                <Button
                  variant="danger"
                  size="xs"
                  onClick={() => {
                    if (confirm(`¿Eliminar ${selectedPhotoIds.size} foto${selectedPhotoIds.size !== 1 ? 's' : ''}?`)) {
                      onPhotosDelete?.(Array.from(selectedPhotoIds))
                      setSelectedPhotoIds(new Set())
                    }
                  }}
                  leftIcon={<Icon name="trash-2" size="xs" />}
                >
                  Eliminar
                </Button>
                
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setSelectedPhotoIds(new Set())
                    setBatchMode(false)
                  }}
                  leftIcon={<Icon name="x" size="xs" />}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="image" size="lg" className="text-secondary-400" />
            </div>
            <Typography variant="h6" className="font-semibold mb-2">
              No se encontraron fotos
            </Typography>
            <Typography variant="body-default" color="muted" className="mb-4">
              {searchQuery || Object.keys(activeFilters).length ? 
                'Intenta ajustar los filtros de búsqueda' :
                'Sube las primeras fotos de tu proyecto'
              }
            </Typography>
            {(!searchQuery && !Object.keys(activeFilters).length) && (
              <Button
                variant="primary"
                onClick={() => setUploadDialogOpen(true)}
                leftIcon={<Icon name="upload" size="xs" />}
              >
                Subir Fotos
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPhotos).map(([groupKey, groupPhotos]) => (
              <div key={groupKey}>
                {groupBy && groupKey && (
                  <div className="mb-4">
                    <Typography variant="h6" className="font-semibold">
                      {groupKey}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {groupPhotos.length} foto{groupPhotos.length !== 1 ? 's' : ''}
                    </Typography>
                  </div>
                )}
                
                <div className={cn(
                  'grid auto-rows-min',
                  `grid-cols-${columns}`,
                  getPhotoSpacingClasses()
                )}>
                  {groupPhotos.map((photo) => {
                    const isSelected = selectedPhotoIds.has(photo.id)
                    const hasAnnotations = photo.annotations.length > 0
                    const hasUnresolvedAnnotations = photo.annotations.some(a => !a.resolved)
                    
                    return (
                      <div
                        key={photo.id}
                        className={cn(
                          'relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all',
                          isSelected ? 'border-primary-500' : 'border-transparent hover:border-secondary-300'
                        )}
                        onClick={() => onPhotoClick?.(photo)}
                        onDoubleClick={() => onPhotoDoubleClick?.(photo)}
                      >
                        {/* Photo thumbnail */}
                        <div className={cn('relative bg-secondary-100', getThumbnailSizeClasses())}>
                          <img
                            src={photo.thumbnailUrl || photo.url}
                            alt={photo.description || photo.filename}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
                          
                          {/* Selection checkbox */}
                          <div className="absolute top-2 left-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handlePhotoSelect(photo.id, checked)}
                              className="bg-white bg-opacity-80"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          
                          {/* Status badges */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {photo.syncStatus === 'pending' && (
                              <Badge variant="warning" size="xs" icon="clock">
                                Sync
                              </Badge>
                            )}
                            {photo.syncStatus === 'failed' && (
                              <Badge variant="danger" size="xs" icon="alert-triangle">
                                Error
                              </Badge>
                            )}
                            {hasUnresolvedAnnotations && (
                              <Badge variant="warning" size="xs" icon="message-circle">
                                {photo.annotations.filter(a => !a.resolved).length}
                              </Badge>
                            )}
                            {photo.qualityInspection?.status === 'approved' && (
                              <Badge variant="success" size="xs" icon="check-circle" />
                            )}
                            {photo.qualityInspection?.status === 'rejected' && (
                              <Badge variant="danger" size="xs" icon="x-circle" />
                            )}
                          </div>
                          
                          {/* Priority indicator */}
                          {photo.priority !== 'low' && (
                            <div className={cn(
                              'absolute bottom-2 left-2 w-3 h-3 rounded-full',
                              photo.priority === 'critical' ? 'bg-red-500' :
                              photo.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                            )} />
                          )}
                          
                          {/* GPS indicator */}
                          {photo.gps && (
                            <Icon name="map-pin" size="xs" className="absolute bottom-2 right-2 text-white" />
                          )}
                          
                          {/* Action buttons on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDownloadPhoto?.(photo.id, 'full')
                                }}
                                className="bg-white bg-opacity-80 hover:bg-opacity-100"
                              >
                                <Icon name="download" size="xs" />
                              </Button>
                              
                              {showAnnotations && (
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setAnnotationMode(true)
                                  }}
                                  className="bg-white bg-opacity-80 hover:bg-opacity-100"
                                >
                                  <Icon name="edit" size="xs" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setFullscreenPhoto(photo.id)
                                }}
                                className="bg-white bg-opacity-80 hover:bg-opacity-100"
                              >
                                <Icon name="maximize" size="xs" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Photo metadata */}
                        {showMetadata && (
                          <div className="p-2 bg-white">
                            <Typography variant="caption" className="font-medium truncate block">
                              {photo.filename}
                            </Typography>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center gap-1">
                                <Avatar
                                  size="xs"
                                  name={photo.capturedBy.name}
                                  title={photo.capturedBy.name}
                                />
                                <Typography variant="caption" color="muted" className="text-xs">
                                  {photo.capturedDate.toLocaleDateString()}
                                </Typography>
                              </div>
                              
                              <StatusCard
                                status={{
                                  value: photo.status,
                                  variant: photo.status === 'approved' ? 'success' :
                                          photo.status === 'rejected' ? 'danger' :
                                          photo.status === 'review' ? 'warning' : 'secondary'
                                }}
                                size="sm"
                              />
                            </div>
                            
                            {/* Tags */}
                            {photo.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {photo.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="secondary" size="xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {photo.tags.length > 3 && (
                                  <Badge variant="secondary" size="xs">
                                    +{photo.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Dialog */}
        {uploadDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="font-semibold">
                  Subir Fotos
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadDialogOpen(false)}
                >
                  <Icon name="x" size="sm" />
                </Button>
              </div>
              
              <PhotoUploader
                multiple
                maxFiles={20}
                maxFileSize={50 * 1024 * 1024} // 50MB
                acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                captureGPS
                constructionContext="work-progress"
                onFilesSelected={(files) => {
                  onPhotoUpload?.(files)
                  setUploadDialogOpen(false)
                }}
                onUploadProgress={onUploadProgress}
                onUploadComplete={(fileId, url) => {
                  // Handle upload complete
                  console.log('Upload complete:', fileId, url)
                }}
                onUploadError={onUploadError}
                showPreview
                showMetadata
                size="large"
              />
            </div>
          </div>
        )}

        {/* Active Batch Operations */}
        {activeBatchOperations.length > 0 && (
          <div className="fixed bottom-4 right-4 space-y-2 z-40">
            {activeBatchOperations.map((operation) => (
              <div
                key={operation.id}
                className="bg-white border border-secondary-200 rounded-lg shadow-lg p-3 min-w-[300px]"
              >
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="body-small" className="font-medium">
                    {operation.type === 'approve' ? 'Aprobando fotos...' :
                     operation.type === 'tag' ? 'Etiquetando fotos...' :
                     operation.type === 'export' ? 'Exportando fotos...' :
                     operation.type === 'delete' ? 'Eliminando fotos...' :
                     'Procesando fotos...'}
                  </Typography>
                  <Badge
                    variant={
                      operation.status === 'completed' ? 'success' :
                      operation.status === 'failed' ? 'danger' :
                      'primary'
                    }
                    size="xs"
                  >
                    {operation.status === 'completed' ? 'Completado' :
                     operation.status === 'failed' ? 'Error' :
                     operation.status === 'in_progress' ? 'En Proceso' :
                     'Pendiente'}
                  </Badge>
                </div>
                
                {operation.progress !== undefined && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{operation.targetPhotos.length} fotos</span>
                      <span>{operation.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${operation.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {operation.result && (
                  <div className="text-xs text-secondary-600">
                    {operation.result.successful} exitosas, {operation.result.failed} fallidas
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

PhotoGallery.displayName = 'PhotoGallery'

export { PhotoGallery, photoGalleryVariants }
export type { 
  PhotoGalleryProps,
  ConstructionPhoto,
  PhotoAnnotation,
  GPSLocation,
  PhotoFilter,
  BatchOperation
}