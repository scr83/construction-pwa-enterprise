// API service layer for task management
import { ApiResponse } from '@/types'

// Types specific to tasks API
export interface Task {
  id: string
  title: string
  description?: string
  assigneeId: string
  assignee: {
    id: string
    name: string
    email: string
    role: string
  }
  createdById: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  projectId: string
  project: {
    id: string
    name: string
    status: string
  }
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate?: string
  startDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  building?: string
  unit?: string
  partida?: string
  materials: string[]
  prerequisites: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELAYED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TaskCategory = 'GENERAL' | 'STRUCTURE' | 'MATERIALS' | 'QUALITY' | 'INSTALLATIONS' | 'FINISHES' | 'TECHNICAL_OFFICE'

export interface CreateTaskData {
  title: string
  description?: string
  assigneeId: string
  projectId: string
  priority?: TaskPriority
  category?: TaskCategory
  dueDate?: string
  startDate?: string
  estimatedHours?: number
  building?: string
  unit?: string
  partida?: string
  materials?: string[]
  prerequisites?: string[]
  notes?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  assigneeId?: string
  projectId?: string
  status?: TaskStatus
  priority?: TaskPriority
  category?: TaskCategory
  dueDate?: string
  startDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  building?: string
  unit?: string
  partida?: string
  materials?: string[]
  prerequisites?: string[]
  notes?: string
}

export interface TaskFilters {
  assigneeId?: string
  projectId?: string
  status?: TaskStatus
  priority?: TaskPriority
  category?: TaskCategory
  building?: string
  unit?: string
  dueDateFrom?: string
  dueDateTo?: string
  search?: string
}

export interface TaskMetrics {
  totalTasks: number
  completedTasks: number
  completionRate: number
  completedToday: number
  overdueTasks: number
  avgCompletionTime: number
  hourEfficiency: number
  weeklyTrend: number
  statusBreakdown: {
    PENDING: number
    IN_PROGRESS: number
    COMPLETED: number
    DELAYED: number
    CANCELLED: number
  }
}

// Base API function with error handling (reused from teams.ts pattern)
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

// Tasks API functions
export const tasksApi = {
  // Get all tasks with optional filters
  async getTasks(filters?: TaskFilters): Promise<ApiResponse<{ tasks: Task[] }>> {
    const params = new URLSearchParams()
    if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId)
    if (filters?.projectId) params.append('projectId', filters.projectId)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.category) params.append('category', filters.category)
    if (filters?.building) params.append('building', filters.building)
    if (filters?.unit) params.append('unit', filters.unit)
    if (filters?.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom)
    if (filters?.dueDateTo) params.append('dueDateTo', filters.dueDateTo)
    if (filters?.search) params.append('search', filters.search)
    
    const queryString = params.toString()
    return apiRequest<{ tasks: Task[] }>(
      `/api/tasks${queryString ? `?${queryString}` : ''}`
    )
  },

  // Get specific task details
  async getTask(taskId: string): Promise<ApiResponse<{ task: Task }>> {
    return apiRequest<{ task: Task }>(`/api/tasks/${taskId}`)
  },

  // Create new task
  async createTask(taskData: CreateTaskData): Promise<ApiResponse<{ task: Task; message: string }>> {
    return apiRequest<{ task: Task; message: string }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  },

  // Update task
  async updateTask(taskId: string, taskData: UpdateTaskData): Promise<ApiResponse<{ task: Task; message: string }>> {
    return apiRequest<{ task: Task; message: string }>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  },

  // Complete task
  async completeTask(taskId: string, actualHours?: number): Promise<ApiResponse<{ task: Task; message: string }>> {
    return apiRequest<{ task: Task; message: string }>(`/api/tasks/${taskId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ 
        completedAt: new Date().toISOString(),
        actualHours: actualHours
      }),
    })
  },

  // Start task (set to IN_PROGRESS)
  async startTask(taskId: string): Promise<ApiResponse<{ task: Task; message: string }>> {
    return apiRequest<{ task: Task; message: string }>(`/api/tasks/${taskId}/start`, {
      method: 'PUT',
      body: JSON.stringify({ 
        status: 'IN_PROGRESS',
        startDate: new Date().toISOString()
      }),
    })
  },

  // Cancel task
  async cancelTask(taskId: string, reason?: string): Promise<ApiResponse<{ task: Task; message: string }>> {
    return apiRequest<{ task: Task; message: string }>(`/api/tasks/${taskId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ 
        status: 'CANCELLED',
        notes: reason
      }),
    })
  },

  // Delete task
  async deleteTask(taskId: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
  },

  // Get task metrics for dashboard
  async getTaskMetrics(projectId?: string, assigneeId?: string): Promise<ApiResponse<{ metrics: TaskMetrics }>> {
    const params = new URLSearchParams()
    if (projectId) params.append('projectId', projectId)
    if (assigneeId) params.append('assigneeId', assigneeId)
    
    const queryString = params.toString()
    return apiRequest<{ metrics: TaskMetrics }>(
      `/api/tasks/metrics${queryString ? `?${queryString}` : ''}`
    )
  }
}

// Utility functions for task management
export const taskStatusLabels = {
  'PENDING': 'Pendiente',
  'IN_PROGRESS': 'En Progreso',
  'COMPLETED': 'Completada',
  'CANCELLED': 'Cancelada',
  'DELAYED': 'Retrasada'
}

export const taskPriorityLabels = {
  'LOW': 'Baja',
  'MEDIUM': 'Media',
  'HIGH': 'Alta',
  'URGENT': 'Urgente'
}

export const taskCategoryLabels = {
  'GENERAL': 'General',
  'STRUCTURE': 'Estructura',
  'MATERIALS': 'Materiales',
  'QUALITY': 'Calidad',
  'INSTALLATIONS': 'Instalaciones',
  'FINISHES': 'Terminaciones',
  'TECHNICAL_OFFICE': 'Oficina Técnica'
}

// Helper function to get task status color
export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'COMPLETED':
      return 'text-green-600 bg-green-50'
    case 'IN_PROGRESS':
      return 'text-blue-600 bg-blue-50'
    case 'PENDING':
      return 'text-yellow-600 bg-yellow-50'
    case 'DELAYED':
      return 'text-red-600 bg-red-50'
    case 'CANCELLED':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Helper function to get task priority color
export function getTaskPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'URGENT':
      return 'text-red-600 bg-red-50'
    case 'HIGH':
      return 'text-orange-600 bg-orange-50'
    case 'MEDIUM':
      return 'text-blue-600 bg-blue-50'
    case 'LOW':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Helper function to check if task is overdue
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'COMPLETED' || task.status === 'CANCELLED') {
    return false
  }
  
  const dueDate = new Date(task.dueDate)
  const now = new Date()
  return dueDate < now
}

// Helper function to calculate days until due date
export function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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

// Helper function to calculate task completion percentage for a project
export function calculateTaskCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length
  return Math.round((completedTasks / tasks.length) * 100)
}