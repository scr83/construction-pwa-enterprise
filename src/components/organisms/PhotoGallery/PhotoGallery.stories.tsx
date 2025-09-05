import type { Meta, StoryObj } from '@storybook/react'
import { PhotoGallery } from './PhotoGallery'
import type { ConstructionPhoto, PhotoAnnotation } from './PhotoGallery'

const meta = {
  title: 'Components/Organisms/PhotoGallery',
  component: PhotoGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive construction photo management system with GPS tagging, quality inspection workflows, annotation tools, batch operations, and offline synchronization capabilities.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'full', 'mobile'],
      description: 'Visual variant of the photo gallery',
    },
    layout: {
      control: { type: 'select' },
      options: ['grid', 'masonry', 'timeline', 'details'],
      description: 'Layout configuration for photo display',
    },
    mode: {
      control: { type: 'select' },
      options: ['view', 'edit', 'select', 'upload'],
      description: 'Current operation mode',
    },
    viewMode: {
      control: { type: 'select' },
      options: ['grid', 'masonry', 'timeline', 'details'],
      description: 'Photo display mode',
    },
    columns: {
      control: { type: 'range', min: 2, max: 8, step: 1 },
      description: 'Number of columns in grid view',
    },
    thumbnailSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of photo thumbnails',
    },
    showMetadata: {
      control: { type: 'boolean' },
      description: 'Show photo metadata',
    },
    showAnnotations: {
      control: { type: 'boolean' },
      description: 'Enable annotation functionality',
    },
    enablePhotoCapture: {
      control: { type: 'boolean' },
      description: 'Enable camera photo capture',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PhotoGallery>

export default meta
type Story = StoryObj<typeof meta>

// Sample photo data
const sampleAnnotations: PhotoAnnotation[] = [
  {
    id: 'ann-001',
    type: 'point',
    coordinates: { x: 150, y: 200 },
    content: 'Revisar junta de dilatación - presenta fisura menor',
    author: {
      id: 'user-quality-001',
      name: 'Ana Morales',
      role: 'Inspector de Calidad'
    },
    timestamp: new Date('2024-03-15T10:30:00'),
    severity: 'warning',
    resolved: false,
    category: 'quality'
  },
  {
    id: 'ann-002',
    type: 'rectangle',
    coordinates: { x: 100, y: 150, width: 80, height: 60 },
    content: 'Zona reparada correctamente según especificación',
    author: {
      id: 'user-supervisor-001',
      name: 'Carlos Rodriguez',
      role: 'Supervisor'
    },
    timestamp: new Date('2024-03-16T14:15:00'),
    severity: 'info',
    resolved: true,
    category: 'progress'
  }
]

const samplePhotos: ConstructionPhoto[] = [
  {
    id: 'photo-001',
    filename: 'estructura_piso_5_001.jpg',
    originalFilename: 'IMG_20240315_103045.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop',
    fullResolutionUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=900&fit=crop',
    size: 2458432,
    dimensions: { width: 1920, height: 1440 },
    format: 'JPEG',
    mimeType: 'image/jpeg',
    capturedDate: new Date('2024-03-15T10:30:00'),
    uploadedDate: new Date('2024-03-15T10:35:00'),
    gps: {
      latitude: -33.4372,
      longitude: -70.6506,
      accuracy: 3.5,
      altitude: 580,
      address: 'Las Condes, Santiago',
      zone: 'Torre A',
      floor: 'Piso 5',
      unit: 'Estructura'
    },
    constructionZone: 'Torre A',
    level: 'Piso 5',
    area: 'Estructura Principal',
    project: {
      id: 'proj-001',
      name: 'Torre Residencial Las Condes',
      code: 'TRC-001'
    },
    activity: {
      id: 'act-001',
      name: 'Estructura de Hormigón',
      code: 'E.01',
      partida: 'E.01.05 - Losas de Entrepiso'
    },
    workOrder: {
      id: 'wo-001',
      title: 'Vaciado Losa Piso 5',
      status: 'in-progress'
    },
    qualityInspection: {
      id: 'qi-001',
      type: 'Estructura',
      status: 'approved'
    },
    capturedBy: {
      id: 'user-001',
      name: 'Miguel Torres',
      role: 'Jefe de Terreno',
      avatar: '/avatars/miguel-torres.jpg'
    },
    assignedTo: [
      {
        id: 'user-quality-001',
        name: 'Ana Morales',
        role: 'Inspector de Calidad'
      }
    ],
    tags: ['estructura', 'hormigón', 'losa', 'piso-5'],
    category: 'progress',
    priority: 'medium',
    status: 'approved',
    annotations: sampleAnnotations,
    notes: 'Progreso de vaciado de losa según cronograma. Calidad del hormigón verificada.',
    description: 'Estructura de hormigón - Piso 5, sector norte. Vaciado completado.',
    approvalFlow: {
      requiredApprovals: 1,
      currentApprovals: 1,
      approvers: [
        {
          id: 'user-quality-001',
          name: 'Ana Morales',
          role: 'Inspector de Calidad',
          approved: true,
          timestamp: new Date('2024-03-15T11:00:00'),
          comments: 'Estructura cumple especificaciones técnicas'
        }
      ]
    },
    qualityScore: 95,
    technicalCompliance: true,
    syncStatus: 'synced',
    storageLocation: 'both',
    backupStatus: 'completed',
    visibility: 'team',
    permissions: [
      {
        role: 'JEFE_TERRENO',
        canView: true,
        canEdit: true,
        canDelete: false,
        canApprove: true
      },
      {
        role: 'CONTROL_CALIDAD',
        canView: true,
        canEdit: true,
        canDelete: false,
        canApprove: true
      }
    ]
  },
  {
    id: 'photo-002',
    filename: 'tabiqueria_dept_3a_001.jpg',
    originalFilename: 'IMG_20240316_142220.jpg',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop',
    size: 1923876,
    dimensions: { width: 1920, height: 1440 },
    format: 'JPEG',
    mimeType: 'image/jpeg',
    capturedDate: new Date('2024-03-16T14:22:00'),
    uploadedDate: new Date('2024-03-16T14:28:00'),
    gps: {
      latitude: -33.4375,
      longitude: -70.6503,
      accuracy: 2.8,
      address: 'Las Condes, Santiago',
      zone: 'Torre A',
      floor: 'Piso 3',
      unit: 'Departamento A'
    },
    constructionZone: 'Torre A',
    level: 'Piso 3',
    area: 'Departamento 3A',
    project: {
      id: 'proj-001',
      name: 'Torre Residencial Las Condes',
      code: 'TRC-001'
    },
    activity: {
      id: 'act-002',
      name: 'Tabiquería Interior',
      code: 'T.01',
      partida: 'T.01.03 - Tabiques Yeso Cartón'
    },
    capturedBy: {
      id: 'user-002',
      name: 'Juan Pérez',
      role: 'Maestro Especialista',
      avatar: '/avatars/juan-perez.jpg'
    },
    tags: ['tabiquería', 'yeso-cartón', 'interior', 'depto-3a'],
    category: 'quality',
    priority: 'high',
    status: 'review',
    annotations: [],
    description: 'Tabiquería interior departamento 3A - Instalación yeso cartón.',
    qualityInspection: {
      id: 'qi-002',
      type: 'Tabiquería',
      status: 'pending'
    },
    syncStatus: 'synced',
    storageLocation: 'both',
    visibility: 'team',
    permissions: [
      {
        role: 'JEFE_TERRENO',
        canView: true,
        canEdit: true,
        canDelete: true,
        canApprove: true
      }
    ]
  },
  {
    id: 'photo-003',
    filename: 'seguridad_andamio_001.jpg',
    originalFilename: 'IMG_20240317_090815.jpg',
    url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=200&fit=crop',
    size: 2789345,
    dimensions: { width: 1920, height: 1440 },
    format: 'JPEG',
    mimeType: 'image/jpeg',
    capturedDate: new Date('2024-03-17T09:08:00'),
    uploadedDate: new Date('2024-03-17T09:15:00'),
    gps: {
      latitude: -33.4378,
      longitude: -70.6508,
      accuracy: 4.2,
      address: 'Las Condes, Santiago',
      zone: 'Torre A',
      floor: 'Fachada Sur'
    },
    constructionZone: 'Torre A',
    level: 'Fachada Sur',
    area: 'Andamio Principal',
    project: {
      id: 'proj-001',
      name: 'Torre Residencial Las Condes',
      code: 'TRC-001'
    },
    capturedBy: {
      id: 'user-003',
      name: 'María González',
      role: 'Prevencionista',
      avatar: '/avatars/maria-gonzalez.jpg'
    },
    tags: ['seguridad', 'andamio', 'fachada', 'equipos'],
    category: 'safety',
    priority: 'critical',
    status: 'rejected',
    annotations: [
      {
        id: 'ann-003',
        type: 'point',
        coordinates: { x: 200, y: 180 },
        content: 'Andamio sin línea de vida - CRÍTICO',
        author: {
          id: 'user-003',
          name: 'María González',
          role: 'Prevencionista'
        },
        timestamp: new Date('2024-03-17T09:20:00'),
        severity: 'critical',
        resolved: false,
        category: 'safety'
      }
    ],
    description: 'Andamio fachada sur - Inspección de seguridad.',
    notes: 'CRÍTICO: Andamio instalado sin línea de vida. Requiere corrección inmediata.',
    syncStatus: 'synced',
    storageLocation: 'both',
    visibility: 'team',
    permissions: [
      {
        role: 'PREVENCIONISTA',
        canView: true,
        canEdit: true,
        canDelete: false,
        canApprove: true
      }
    ]
  },
  {
    id: 'photo-004',
    filename: 'materiales_cemento_001.jpg',
    originalFilename: 'IMG_20240318_073045.jpg',
    url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=300&h=200&fit=crop',
    size: 1654789,
    dimensions: { width: 1920, height: 1440 },
    format: 'JPEG',
    mimeType: 'image/jpeg',
    capturedDate: new Date('2024-03-18T07:30:00'),
    uploadedDate: new Date('2024-03-18T07:35:00'),
    gps: {
      latitude: -33.4370,
      longitude: -70.6510,
      address: 'Las Condes, Santiago',
      zone: 'Bodega',
      area: 'Almacén Materiales'
    },
    constructionZone: 'Bodega',
    level: 'Planta Baja',
    area: 'Almacén de Materiales',
    project: {
      id: 'proj-001',
      name: 'Torre Residencial Las Condes',
      code: 'TRC-001'
    },
    activity: {
      id: 'act-003',
      name: 'Recepción de Materiales',
      code: 'M.01'
    },
    capturedBy: {
      id: 'user-004',
      name: 'Roberto Silva',
      role: 'Bodeguero',
      avatar: '/avatars/roberto-silva.jpg'
    },
    tags: ['materiales', 'cemento', 'recepción', 'almacén'],
    category: 'materials',
    priority: 'medium',
    status: 'approved',
    annotations: [],
    description: 'Recepción cemento - Lote CE-2024-0318. Verificación calidad.',
    syncStatus: 'pending',
    storageLocation: 'local',
    visibility: 'team',
    permissions: [
      {
        role: 'BODEGA',
        canView: true,
        canEdit: true,
        canDelete: false,
        canApprove: false
      }
    ]
  },
  {
    id: 'photo-005',
    filename: 'problema_filtracion_001.jpg',
    originalFilename: 'IMG_20240319_161230.jpg',
    url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
    size: 2234567,
    dimensions: { width: 1920, height: 1440 },
    format: 'JPEG',
    mimeType: 'image/jpeg',
    capturedDate: new Date('2024-03-19T16:12:00'),
    uploadedDate: new Date('2024-03-19T16:18:00'),
    gps: {
      latitude: -33.4376,
      longitude: -70.6505,
      accuracy: 2.1,
      address: 'Las Condes, Santiago',
      zone: 'Torre A',
      floor: 'Piso 2',
      unit: 'Baño Principal'
    },
    constructionZone: 'Torre A',
    level: 'Piso 2',
    area: 'Baño Principal Depto 2C',
    project: {
      id: 'proj-001',
      name: 'Torre Residencial Las Condes',
      code: 'TRC-001'
    },
    capturedBy: {
      id: 'user-001',
      name: 'Miguel Torres',
      role: 'Jefe de Terreno',
      avatar: '/avatars/miguel-torres.jpg'
    },
    tags: ['problema', 'filtración', 'baño', 'humedad'],
    category: 'problem',
    priority: 'high',
    status: 'review',
    annotations: [
      {
        id: 'ann-004',
        type: 'rectangle',
        coordinates: { x: 120, y: 100, width: 100, height: 80 },
        content: 'Filtración detectada en junta muro-losa',
        author: {
          id: 'user-001',
          name: 'Miguel Torres',
          role: 'Jefe de Terreno'
        },
        timestamp: new Date('2024-03-19T16:15:00'),
        severity: 'error',
        resolved: false,
        category: 'quality'
      }
    ],
    description: 'Problema filtración en baño - Requiere intervención urgente.',
    notes: 'Filtración detectada en departamento 2C. Coordinar con especialista.',
    afterPhoto: 'photo-006',
    syncStatus: 'failed',
    storageLocation: 'local',
    visibility: 'team',
    permissions: [
      {
        role: 'JEFE_TERRENO',
        canView: true,
        canEdit: true,
        canDelete: false,
        canApprove: true
      }
    ]
  },
  {
    id: 'photo-006',
    filename: 'solucion_filtracion_001.jpg',
    originalFilename: 'IMG_20240320_144520.jpg',
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300&h=200&fit=crop',
    size: 1987654,
    dimensions: { width: 1920, height: 1440 },
    format: 'JPEG',
    mimeType: 'image/jpeg',
    capturedDate: new Date('2024-03-20T14:45:00'),
    uploadedDate: new Date('2024-03-20T14:50:00'),
    gps: {
      latitude: -33.4376,
      longitude: -70.6505,
      accuracy: 1.9,
      address: 'Las Condes, Santiago',
      zone: 'Torre A',
      floor: 'Piso 2',
      unit: 'Baño Principal'
    },
    constructionZone: 'Torre A',
    level: 'Piso 2',
    area: 'Baño Principal Depto 2C',
    project: {
      id: 'proj-001',
      name: 'Torre Residencial Las Condes',
      code: 'TRC-001'
    },
    capturedBy: {
      id: 'user-005',
      name: 'Pedro Ramirez',
      role: 'Especialista Impermeabilizaciones',
      avatar: '/avatars/pedro-ramirez.jpg'
    },
    tags: ['solución', 'impermeabilización', 'reparación', 'completado'],
    category: 'solution',
    priority: 'medium',
    status: 'approved',
    annotations: [],
    description: 'Solución aplicada - Impermeabilización junta muro-losa.',
    notes: 'Reparación completada con sellante estructural. Verificar en 48hrs.',
    beforePhoto: 'photo-005',
    qualityInspection: {
      id: 'qi-003',
      type: 'Impermeabilización',
      status: 'approved'
    },
    syncStatus: 'synced',
    storageLocation: 'both',
    backupStatus: 'completed',
    visibility: 'team',
    permissions: [
      {
        role: 'ESPECIALISTA',
        canView: true,
        canEdit: true,
        canDelete: false,
        canApprove: true
      }
    ]
  }
]

const availableProjects = [
  { id: 'proj-001', name: 'Torre Residencial Las Condes', code: 'TRC-001' },
  { id: 'proj-002', name: 'Centro Comercial Plaza Norte', code: 'CPN-002' },
  { id: 'proj-003', name: 'Bodega Industrial Quilicura', code: 'BIQ-003' },
]

const availableUsers = [
  { id: 'user-001', name: 'Miguel Torres', role: 'Jefe de Terreno' },
  { id: 'user-002', name: 'Juan Pérez', role: 'Maestro Especialista' },
  { id: 'user-003', name: 'María González', role: 'Prevencionista' },
  { id: 'user-004', name: 'Roberto Silva', role: 'Bodeguero' },
  { id: 'user-quality-001', name: 'Ana Morales', role: 'Inspector de Calidad' },
]

const availableZones = ['Torre A', 'Torre B', 'Bodega', 'Área Común', 'Estacionamiento']
const availableTags = ['estructura', 'tabiquería', 'instalaciones', 'terminaciones', 'seguridad', 'materiales']

// Default story
export const Default: Story = {
  args: {
    variant: 'default',
    layout: 'grid',
    mode: 'view',
    photos: samplePhotos,
    selectedPhotos: [],
    columns: 4,
    showMetadata: true,
    showAnnotations: true,
    showFilters: true,
    showBatchOperations: true,
    showUploader: true,
    enablePhotoCapture: true,
    thumbnailSize: 'md',
    photoSpacing: 'normal',
    availableProjects,
    availableUsers,
    availableZones,
    availableTags,
    viewMode: 'grid',
    sortBy: 'date',
    sortOrder: 'desc',
    autoSync: true,
    offlineMode: false,
    currentUser: {
      id: 'user-001',
      name: 'Miguel Torres',
      role: 'Jefe de Terreno',
      permissions: ['view', 'edit', 'upload', 'approve']
    },
  },
}

// Quality inspection workflow
export const QualityInspectionWorkflow: Story = {
  args: {
    ...Default.args,
    photos: samplePhotos.filter(p => ['quality', 'problem', 'solution'].includes(p.category)),
    mode: 'edit',
    currentFilters: {
      categories: ['quality', 'problem', 'solution'],
      status: ['review', 'rejected']
    },
    showAnnotations: true,
    currentUser: {
      id: 'user-quality-001',
      name: 'Ana Morales',
      role: 'Inspector de Calidad',
      permissions: ['view', 'edit', 'annotate', 'approve', 'reject']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Quality inspection workflow showing photos with annotations, approval/rejection status, and before/after problem solving documentation.',
      },
    },
  },
}

// Safety documentation mode
export const SafetyDocumentation: Story = {
  args: {
    ...Default.args,
    photos: samplePhotos.filter(p => p.category === 'safety' || p.tags.includes('seguridad')),
    currentFilters: {
      categories: ['safety'],
      priority: ['critical', 'high']
    },
    variant: 'full',
    showMetadata: true,
    showAnnotations: true,
    currentUser: {
      id: 'user-003',
      name: 'María González',
      role: 'Prevencionista',
      permissions: ['view', 'edit', 'upload', 'annotate', 'critical-approve']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Safety documentation mode focusing on critical safety issues, with annotation tools for marking hazards and corrective actions.',
      },
    },
  },
}

// Progress tracking timeline
export const ProgressTimeline: Story = {
  args: {
    ...Default.args,
    layout: 'timeline',
    viewMode: 'timeline',
    groupBy: 'date',
    photos: samplePhotos.filter(p => ['progress', 'before', 'after'].includes(p.category)),
    currentFilters: {
      categories: ['progress', 'before', 'after']
    },
    sortBy: 'date',
    sortOrder: 'asc',
    showMetadata: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Timeline view showing construction progress over time, with before/after comparisons and chronological project documentation.',
      },
    },
  },
}

// Batch operations mode
export const BatchOperations: Story = {
  args: {
    ...Default.args,
    mode: 'select',
    selectedPhotos: ['photo-001', 'photo-002', 'photo-004'],
    showBatchOperations: true,
    activeBatchOperations: [
      {
        id: 'batch-001',
        type: 'approve',
        targetPhotos: ['photo-001', 'photo-002'],
        parameters: {},
        status: 'in_progress',
        progress: 65,
        result: {
          successful: 1,
          failed: 0
        },
        createdBy: 'user-quality-001',
        createdAt: new Date()
      }
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Batch operations interface for bulk photo management including approval, tagging, export, and deletion operations.',
      },
    },
  },
}

// Mobile field view
export const MobileFieldView: Story = {
  args: {
    ...Default.args,
    variant: 'mobile',
    layout: 'grid',
    columns: 2,
    thumbnailSize: 'lg',
    photoSpacing: 'normal',
    showFilters: false,
    compactView: true,
    photos: samplePhotos.slice(0, 4),
    enablePhotoCapture: true,
    enableSwipeGestures: true,
    enablePinchZoom: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view for field use with larger thumbnails, touch-friendly interface, and camera capture capabilities.',
      },
    },
  },
}

// Offline sync mode
export const OfflineSyncMode: Story = {
  args: {
    ...Default.args,
    offlineMode: true,
    autoSync: false,
    photos: samplePhotos.map(photo => ({
      ...photo,
      syncStatus: Math.random() > 0.5 ? 'pending' : 'failed' as any
    })),
    isSyncing: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Offline mode showing photos with pending and failed sync status, manual sync controls, and offline indicators.',
      },
    },
  },
}

// Material tracking photos
export const MaterialTracking: Story = {
  args: {
    ...Default.args,
    photos: samplePhotos.filter(p => p.category === 'materials' || p.tags.includes('materiales')),
    currentFilters: {
      categories: ['materials']
    },
    currentUser: {
      id: 'user-004',
      name: 'Roberto Silva',
      role: 'Bodeguero',
      permissions: ['view', 'upload', 'edit-metadata']
    },
    showMetadata: true,
    groupBy: 'date',
  },
  parameters: {
    docs: {
      description: {
        story: 'Material tracking and inventory documentation with warehouse-focused metadata and reception verification photos.',
      },
    },
  },
}

// Annotation and review mode
export const AnnotationReviewMode: Story = {
  args: {
    ...Default.args,
    photos: samplePhotos.filter(p => p.annotations.length > 0),
    showAnnotations: true,
    mode: 'edit',
    layout: 'details',
    variant: 'full',
    currentUser: {
      id: 'user-quality-001',
      name: 'Ana Morales',
      role: 'Inspector de Calidad',
      permissions: ['view', 'edit', 'annotate', 'approve', 'resolve']
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Detailed annotation and review mode showing photos with quality inspection annotations, severity levels, and resolution tracking.',
      },
    },
  },
}

// Loading state
export const LoadingState: Story = {
  args: {
    ...Default.args,
    isLoading: true,
    photos: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton placeholders while photo data is being fetched.',
      },
    },
  },
}

// Empty gallery state
export const EmptyState: Story = {
  args: {
    ...Default.args,
    photos: [],
    showUploader: true,
    enablePhotoCapture: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty gallery state encouraging users to upload their first construction photos.',
      },
    },
  },
}

// Upload in progress
export const UploadInProgress: Story = {
  args: {
    ...Default.args,
    isUploading: true,
    photos: samplePhotos.slice(0, 3),
    activeBatchOperations: [
      {
        id: 'upload-001',
        type: 'upload' as any,
        targetPhotos: ['upload-temp-001', 'upload-temp-002'],
        parameters: {},
        status: 'in_progress',
        progress: 45,
        createdBy: 'user-001',
        createdAt: new Date()
      }
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Photo upload in progress with progress indicators and batch upload status.',
      },
    },
  },
}

// Advanced filtering
export const AdvancedFiltering: Story = {
  args: {
    ...Default.args,
    showFilters: true,
    currentFilters: {
      projects: ['proj-001'],
      categories: ['quality', 'problem'],
      status: ['review', 'rejected'],
      priority: ['high', 'critical'],
      dateRange: {
        start: new Date('2024-03-15'),
        end: new Date('2024-03-20')
      },
      annotations: {
        hasAnnotations: true,
        severity: ['warning', 'critical'],
        resolved: false
      }
    },
    variant: 'full',
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced filtering capabilities with multiple filter types including date ranges, annotations, and complex criteria combinations.',
      },
    },
  },
}

// Masonry layout
export const MasonryLayout: Story = {
  args: {
    ...Default.args,
    layout: 'masonry',
    viewMode: 'masonry',
    columns: 3,
    photoSpacing: 'loose',
    showMetadata: true,
    // Mix of different aspect ratios
    photos: samplePhotos.map((photo, index) => ({
      ...photo,
      dimensions: {
        width: 1920,
        height: [1080, 1440, 1200, 1600, 900, 1300][index] || 1440
      }
    }))
  },
  parameters: {
    docs: {
      description: {
        story: 'Masonry layout with dynamic photo heights creating a Pinterest-style gallery view optimized for mixed aspect ratios.',
      },
    },
  },
}