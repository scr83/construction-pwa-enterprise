// API service layer for projects management
import { ApiResponse } from '@/types'

// Types specific to projects API
export interface Project {
  id: string
  nombre: string
  codigo: string
  descripcion?: string
  tipo: 'residencial' | 'comercial' | 'industrial' | 'institucional' | 'infraestructura'
  estado: 'planificacion' | 'estructura' | 'fundaciones' | 'terminaciones' | 'completado' | 'suspendido' | 'cancelado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  
  ubicacion: {
    direccion: string
    numero?: string
    comuna: string
    region: string
    codigoPostal?: string
    coordenadas?: { lat: number; lng: number }
    superficieTerreno?: number
    superficieConstruida?: number
  }
  
  fechas: {
    inicio: string
    terminoProgramado: string
    creacion: string
    ultimaModificacion: string
  }
  
  financiero: {
    presupuestoTotal: number
    presupuestoEjecutado: number
    moneda: 'CLP' | 'USD' | 'UF'
    varianzaPresupuestaria?: number
    flujoEfectivo?: number
    gastosAutorizados?: number
  }
  
  avance: {
    fisico: number
    financiero: number
    cronograma: number
    partidasCompletadas: number
    partidasTotales: number
  }
  
  equipo: {
    jefeProyecto: string
    jefeTerreno: string
    residenteObra?: string
    ingenieroConstruccion?: string
    arquitecto?: string
    totalTrabajadores: number
    subcontratistas?: string[]
  }
  
  calidad: {
    inspeccionesRealizadas: number
    inspeccionesPendientes: number
    noConformidades: number
    observacionesAbiertas?: number
    cumplimientoNormativa: number
    certificacionesObtenidas?: string[]
  }
  
  unidades?: {
    total: number
    completadas: number
    enProceso: number
    vendidas?: number
    disponibles?: number
    tipos?: Array<{
      tipo: string
      cantidad: number
      superficiePromedio: number
      precioPromedio?: number
    }>
  }
  
  etiquetas: string[]
  cliente: string
  contrato: string
  
  permisos: Array<{
    tipo: string
    numero: string
    fechaObtencion: string
    fechaVencimiento: string
    estado: 'vigente' | 'vencido' | 'tramite'
  }>
  
  metadata: {
    creadoPor: string
    modificadoPor: string
    version: string
    archivos: number
    fotos: number
    documentos: number
  }
}

export interface CreateProjectData {
  nombre: string
  codigo?: string
  descripcion?: string
  tipo?: 'residencial' | 'comercial' | 'industrial' | 'institucional' | 'infraestructura'
  prioridad?: 'baja' | 'media' | 'alta' | 'critica'
  direccion?: string
  numero?: string
  comuna?: string
  region?: string
  superficieTerreno?: number
  superficieConstruida?: number
  coordenadas?: { lat: number; lng: number }
  presupuestoTotal?: number
  moneda?: 'CLP' | 'USD' | 'UF'
  cliente?: string
  contrato?: string
  fechaInicio?: string
  fechaTermino?: string
  jefeProyecto?: string
  jefeTerreno?: string
  residenteObra?: string
  ingenieroConstruccion?: string
  arquitecto?: string
}

export interface UpdateProjectData {
  nombre?: string
  descripcion?: string
  tipo?: 'residencial' | 'comercial' | 'industrial' | 'institucional' | 'infraestructura'
  estado?: 'planificacion' | 'estructura' | 'fundaciones' | 'terminaciones' | 'completado' | 'suspendido' | 'cancelado'
  prioridad?: 'baja' | 'media' | 'alta' | 'critica'
  direccion?: string
  comuna?: string
  region?: string
  presupuestoTotal?: number
  fechaInicio?: string
  fechaTermino?: string
  jefeProyecto?: string
  jefeTerreno?: string
}

// Base API function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
        data: undefined
      }
    }

    return {
      success: true,
      data: data,
      error: undefined
    }
  } catch (error) {
    console.error('API request failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión',
      data: undefined
    }
  }
}

// Projects API functions
export const projectsApi = {
  // Get all projects for user
  async getProjects(): Promise<ApiResponse<{ projects: Project[] }>> {
    return apiRequest<{ projects: Project[] }>('/api/projects')
  },

  // Get specific project details
  async getProject(projectId: string): Promise<ApiResponse<{ project: Project }>> {
    return apiRequest<{ project: Project }>(`/api/projects/${projectId}`)
  },

  // Create new project
  async createProject(projectData: CreateProjectData): Promise<ApiResponse<{ project: Project; message: string }>> {
    return apiRequest<{ project: Project; message: string }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  },

  // Update project
  async updateProject(projectId: string, projectData: UpdateProjectData): Promise<ApiResponse<{ project: Project; message: string }>> {
    return apiRequest<{ project: Project; message: string }>(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    })
  },

  // Delete project
  async deleteProject(projectId: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/api/projects/${projectId}`, {
      method: 'DELETE',
    })
  }
}

// Utility functions for project status and types
export const projectTypes = {
  'residencial': 'Residencial',
  'comercial': 'Comercial',
  'industrial': 'Industrial',
  'institucional': 'Institucional',
  'infraestructura': 'Infraestructura'
}

export const projectStatuses = {
  'planificacion': 'Planificación',
  'estructura': 'Estructura',
  'fundaciones': 'Fundaciones',
  'terminaciones': 'Terminaciones',
  'completado': 'Completado',
  'suspendido': 'Suspendido',
  'cancelado': 'Cancelado'
}

export const projectPriorities = {
  'baja': 'Baja',
  'media': 'Media',
  'alta': 'Alta',
  'critica': 'Crítica'
}

// Helper function to calculate project progress color
export function getProgressColor(progress: number): string {
  if (progress >= 90) return 'text-green-600'
  if (progress >= 70) return 'text-blue-600'
  if (progress >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

// Helper function to get project status color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completado':
      return 'text-green-600 bg-green-50'
    case 'estructura':
    case 'fundaciones':
    case 'terminaciones':
      return 'text-blue-600 bg-blue-50'
    case 'planificacion':
      return 'text-yellow-600 bg-yellow-50'
    case 'suspendido':
      return 'text-orange-600 bg-orange-50'
    case 'cancelado':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Helper function to calculate days remaining
export function getDaysRemaining(endDate: string): number {
  const today = new Date()
  const end = new Date(endDate)
  const diffTime = end.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Helper function to check if project is on schedule
export function isOnSchedule(project: Project): boolean {
  const today = new Date()
  const startDate = new Date(project.fechas.inicio)
  const endDate = new Date(project.fechas.terminoProgramado)
  
  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsedTime = today.getTime() - startDate.getTime()
  const expectedProgress = (elapsedTime / totalDuration) * 100
  
  return project.avance.fisico >= expectedProgress
}