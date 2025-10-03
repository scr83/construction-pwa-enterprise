// Re-export Prisma types for convenience
export type {
  User,
  UserRole,
  Project,
  Building,
  Floor,
  Unit,
  Partida,
  ConstructionActivity,
  WorkRecord,
  WorkStatus,
  MaterialRecord,
  MaterialStatus,
  QualityRecord,
  QualityStatus,
  PaymentRecord,
  PaymentStatus,
  Photo,
  ProjectAssignment,
} from '@prisma/client'

// Extended types for the application
export interface ProjectWithDetails extends Project {
  buildings: BuildingWithDetails[]
  projectAssignments: ProjectAssignment[]
  constructionActivities: ConstructionActivity[]
}

export interface BuildingWithDetails extends Building {
  floors: FloorWithDetails[]
}

export interface FloorWithDetails extends Floor {
  units: UnitWithDetails[]
}

export interface UnitWithDetails extends Unit {
  workRecords: WorkRecordWithDetails[]
}

export interface WorkRecordWithDetails extends WorkRecord {
  unit: Unit
  constructionActivity: ConstructionActivity
  user: User
  materialRecords: MaterialRecord[]
  qualityRecords: QualityRecord[]
  paymentRecords: PaymentRecord[]
  photos: Photo[]
}

// Form types
export interface CreateProjectForm {
  name: string
  description?: string
  projectType: string
  startDate: Date
  endDate?: Date
}

export interface CreateWorkRecordForm {
  unitId: string
  constructionActivityId: string
  executionDate?: Date
  quantity?: number
  notes?: string
  latitude?: number
  longitude?: number
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Construction industry specific types
export type ConstructionProjectType = 'residential' | 'commercial' | 'industrial' | 'infrastructure'

export interface DashboardKPI {
  label: string
  value: number | string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  format?: 'number' | 'currency' | 'percentage'
}

export interface ConstructionUnit {
  id: string
  name: string
  type: string
  status: WorkStatus
  progress: number
  location: {
    building: string
    floor: string
  }
}

// Mobile-specific types
export interface GeolocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface PhotoMetadata {
  filename: string
  url: string
  description?: string
  geolocation?: GeolocationData
  workRecordId?: string
  qualityRecordId?: string
}