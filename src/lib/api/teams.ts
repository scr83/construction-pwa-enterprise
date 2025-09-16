// API service layer for teams management
import { ApiResponse } from '@/types'

// Types specific to teams API
export interface Team {
  id: string
  name: string
  type: 'estructuras' | 'instalaciones' | 'terminaciones' | 'calidad'
  projectId: string
  supervisorId: string
  status: 'active' | 'inactive' | 'on_break'
  specialties: string[]
  productivityTarget: number
  createdAt: string
  updatedAt: string
  project: {
    id: string
    name: string
    status: string
  }
  supervisor: {
    id: string
    name: string
    email: string
  }
  members: TeamMember[]
  currentMetrics?: {
    productivity: number
    qualityScore: number
    tasksCompleted: number
    safetyIncidents: number
    attendanceRate: number
  }
  trends?: {
    productivityTrend: number
    qualityTrend: number
    tasksTrend: number
  }
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: 'maestro_mayor' | 'maestro_albanil' | 'maestro_electrico' | 'maestro_gasfiter' | 'oficial_primera' | 'oficial_segunda' | 'ayudante' | 'jornal'
  hourlyRate?: number
  joinedDate: string
  status: 'active' | 'inactive' | 'on_leave' | 'vacation'
  performanceRating: number
  user: {
    id: string
    name: string
    email: string
    phone?: string
    role: string
    company?: string
  }
}

export interface DailyProductivity {
  id: string
  teamId: string
  date: string
  hoursWorked: number
  tasksCompleted: number
  unitsCompleted: number
  productivityScore?: number
  qualityScore?: number
  safetyIncidents: number
  notes?: string
  recordedBy: string
  createdAt: string
  recorder: {
    id: string
    name: string
    role: string
  }
}

export interface ProductivitySummary {
  teamId: string
  teamName: string
  teamSize: number
  recordsCount: number
  targetProductivity: number
  metrics: {
    totalHours: number
    totalTasks: number
    totalUnits: number
    totalSafetyIncidents: number
    avgProductivity: number
    avgQuality: number
    targetComparison: number
    weeklyTrend: number
    avgHoursPerDay: number
    tasksPerDay: number
    unitsPerDay: number
  }
}

export interface DashboardKPIs {
  totalTeams: number
  activeTeams: number
  overallProductivity: number
  qualityScore: number
  safetyScore: number
  dailyEfficiency: number
  weeklyTrend: number
  daysWithoutIncidents: number
  totalTasks: number
  totalIncidents: number
  teamUtilization: number
  avgTasksPerTeam: number
}

export interface CreateTeamData {
  name: string
  type: 'estructuras' | 'instalaciones' | 'terminaciones' | 'calidad'
  projectId: string
  supervisorId: string
  specialties?: string[]
  productivityTarget?: number
}

export interface UpdateTeamData {
  name?: string
  type?: 'estructuras' | 'instalaciones' | 'terminaciones' | 'calidad'
  status?: 'active' | 'inactive' | 'on_break'
  specialties?: string[]
  productivityTarget?: number
}

export interface AddTeamMemberData {
  userId: string
  role: 'maestro_mayor' | 'maestro_albanil' | 'maestro_electrico' | 'maestro_gasfiter' | 'oficial_primera' | 'oficial_segunda' | 'ayudante' | 'jornal'
  hourlyRate?: number
  status?: 'active' | 'inactive' | 'on_leave' | 'vacation'
}

export interface UpdateTeamMemberData {
  userId: string
  role?: 'maestro_mayor' | 'maestro_albanil' | 'maestro_electrico' | 'maestro_gasfiter' | 'oficial_primera' | 'oficial_segunda' | 'ayudante' | 'jornal'
  hourlyRate?: number
  status?: 'active' | 'inactive' | 'on_leave' | 'vacation'
  performanceRating?: number
}

export interface RecordProductivityData {
  date: string // YYYY-MM-DD format
  hoursWorked: number
  tasksCompleted: number
  unitsCompleted: number
  productivityScore?: number
  qualityScore?: number
  safetyIncidents?: number
  notes?: string
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

// Teams API functions
export const teamsApi = {
  // Get all teams for user's projects
  async getTeams(projectId?: string, status?: string): Promise<ApiResponse<{ teams: Team[] }>> {
    const params = new URLSearchParams()
    if (projectId) params.append('projectId', projectId)
    if (status) params.append('status', status)
    
    const queryString = params.toString()
    return apiRequest<{ teams: Team[] }>(
      `/api/teams${queryString ? `?${queryString}` : ''}`
    )
  },

  // Get specific team details
  async getTeam(teamId: string): Promise<ApiResponse<{ team: Team }>> {
    return apiRequest<{ team: Team }>(`/api/teams/${teamId}`)
  },

  // Create new team
  async createTeam(teamData: CreateTeamData): Promise<ApiResponse<{ team: Team; message: string }>> {
    return apiRequest<{ team: Team; message: string }>('/api/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    })
  },

  // Update team
  async updateTeam(teamId: string, teamData: UpdateTeamData): Promise<ApiResponse<{ team: Team; message: string }>> {
    return apiRequest<{ team: Team; message: string }>(`/api/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    })
  },

  // Delete (deactivate) team
  async deleteTeam(teamId: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/api/teams/${teamId}`, {
      method: 'DELETE',
    })
  },

  // Get team members
  async getTeamMembers(teamId: string): Promise<ApiResponse<{ team: { id: string; name: string }; members: TeamMember[] }>> {
    return apiRequest<{ team: { id: string; name: string }; members: TeamMember[] }>(`/api/teams/${teamId}/members`)
  },

  // Add team member
  async addTeamMember(teamId: string, memberData: AddTeamMemberData): Promise<ApiResponse<{ member: TeamMember; message: string }>> {
    return apiRequest<{ member: TeamMember; message: string }>(`/api/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    })
  },

  // Update team member
  async updateTeamMember(teamId: string, memberData: UpdateTeamMemberData): Promise<ApiResponse<{ member: TeamMember; message: string }>> {
    return apiRequest<{ member: TeamMember; message: string }>(`/api/teams/${teamId}/members`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    })
  },

  // Remove team member
  async removeTeamMember(teamId: string, userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/api/teams/${teamId}/members?userId=${userId}`, {
      method: 'DELETE',
    })
  },

  // Get productivity data
  async getProductivity(
    teamId: string,
    startDate?: string,
    endDate?: string,
    limit?: number
  ): Promise<ApiResponse<{ summary: ProductivitySummary; records: DailyProductivity[] }>> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    if (limit) params.append('limit', limit.toString())
    
    const queryString = params.toString()
    return apiRequest<{ summary: ProductivitySummary; records: DailyProductivity[] }>(
      `/api/teams/${teamId}/productivity${queryString ? `?${queryString}` : ''}`
    )
  },

  // Record daily productivity
  async recordProductivity(teamId: string, productivityData: RecordProductivityData): Promise<ApiResponse<{ record: DailyProductivity; message: string }>> {
    return apiRequest<{ record: DailyProductivity; message: string }>(`/api/teams/${teamId}/productivity`, {
      method: 'POST',
      body: JSON.stringify(productivityData),
    })
  },

  // Get dashboard KPIs
  async getDashboardKPIs(projectId?: string): Promise<ApiResponse<{
    kpis: DashboardKPIs
    recentActivity: Array<{
      id: string
      teamId: string
      teamName: string
      date: string
      productivity: number
      quality: number
      tasks: number
      recorder: string
      createdAt: string
    }>
    topPerformingTeams: Array<{
      id: string
      name: string
      productivity: number
      quality: number
      tasks: number
    }>
    alerts: Array<{
      type: 'error' | 'warning' | 'info'
      title: string
      message: string
      teams?: string[]
      severity?: string
    }>
    teamBreakdown: Array<{
      teamId: string
      teamName: string
      productivity: number
      quality: number
      tasks: number
      incidents: number
    }>
  }>> {
    const params = new URLSearchParams()
    if (projectId) params.append('projectId', projectId)
    
    const queryString = params.toString()
    return apiRequest(`/api/productivity/dashboard${queryString ? `?${queryString}` : ''}`)
  }
}

// Utility functions for Chilean construction roles
export const constructionRoles = {
  'maestro_mayor': 'Maestro Mayor',
  'maestro_albanil': 'Maestro Albañil',
  'maestro_electrico': 'Maestro Eléctrico',
  'maestro_gasfiter': 'Maestro Gasfiter',
  'oficial_primera': 'Oficial Primera',
  'oficial_segunda': 'Oficial Segunda',
  'ayudante': 'Ayudante',
  'jornal': 'Jornal'
}

export const teamTypes = {
  'estructuras': 'Estructuras',
  'instalaciones': 'Instalaciones',
  'terminaciones': 'Terminaciones',
  'calidad': 'Control de Calidad'
}

export const teamStatuses = {
  'active': 'Activo',
  'inactive': 'Inactivo',
  'on_break': 'En Descanso'
}

export const memberStatuses = {
  'active': 'Activo',
  'inactive': 'Inactivo',
  'on_leave': 'Con Licencia',
  'vacation': 'De Vacaciones'
}

// Helper function to format Chilean currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount)
}

// Helper function to format dates for Chilean locale
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function to calculate productivity color
export function getProductivityColor(productivity: number, target: number = 85): string {
  const percentage = (productivity / target) * 100
  if (percentage >= 100) return 'text-green-600'
  if (percentage >= 80) return 'text-yellow-600'
  return 'text-red-600'
}

// Helper function to calculate productivity status
export function getProductivityStatus(productivity: number, target: number = 85): 'excellent' | 'good' | 'warning' | 'critical' {
  const percentage = (productivity / target) * 100
  if (percentage >= 100) return 'excellent'
  if (percentage >= 90) return 'good'
  if (percentage >= 70) return 'warning'
  return 'critical'
}