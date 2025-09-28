'use client'

import { TaskManagement } from '@/components/pages/TaskManagement'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { tasksApi, type Task, type CreateTaskData, type UpdateTaskData } from '@/lib/api/tasks'

// Mock data para demostración - Tareas de construcción auténticas
const mockUsuario = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  rol: 'jefe_terreno' as const,
  permisos: ['ver_tareas', 'crear_tareas', 'editar_tareas'],
  proyectosAsignados: ['proj-1']
}

const mockTareas = [
  {
    id: 'task-1',
    title: 'Instalación de Moldajes - EA-101',
    partida: 'Levante de Estructuras',
    building: 'Edificio A',
    unit: 'EA-101',
    assignedTo: 'Juan Pérez (Jefe de Terreno)',
    priority: 'alta' as const,
    status: 'en_progreso' as const,
    category: 'estructura' as const,
    dueDate: '2025-09-15',
    startDate: '2025-09-12',
    description: 'Instalación de moldajes de madera para hormigonado de muros perimetrales. Verificar nivelación y aplomado antes del hormigonado.',
    estimatedHours: 16,
    actualHours: 12,
    materials: ['Madera pino 2x4', 'Clavos 3 pulgadas', 'Alambre negro N°16', 'Aceite desmoldante'],
    prerequisites: ['Fierros instalados', 'Instalaciones embebidas'],
    createdBy: 'María González',
    createdAt: '2025-09-10T08:00:00Z',
    updatedAt: '2025-09-12T14:30:00Z'
  },
  {
    id: 'task-2',
    title: 'Entrega de Kit de Materiales - EA-102',
    partida: 'Kit de Materiales',
    building: 'Edificio A',
    unit: 'EA-102',
    assignedTo: 'María González (Bodega)',
    priority: 'media' as const,
    status: 'programado' as const,
    category: 'materiales' as const,
    dueDate: '2025-09-16',
    startDate: '2025-09-16',
    description: 'Preparar y entregar kit de materiales para inicio de obra gruesa. Coordinar con jefe de terreno para recepción.',
    estimatedHours: 4,
    materials: ['Cemento 42.5kg x20 sacos', 'Fierro 8mm x50 metros', 'Gravilla x2 m³', 'Arena x1.5 m³'],
    prerequisites: ['Autorización de inicio', 'Espacio de almacenaje despejado'],
    createdBy: 'Juan Pérez',
    createdAt: '2025-09-11T10:15:00Z',
    updatedAt: '2025-09-11T10:15:00Z'
  },
  {
    id: 'task-3',
    title: 'Inspección de Calidad - Radier EA-103',
    partida: 'Control de Calidad',
    building: 'Edificio A',
    unit: 'EA-103',
    assignedTo: 'Carlos Morales (Control Calidad)',
    priority: 'alta' as const,
    status: 'retrasado' as const,
    category: 'calidad' as const,
    dueDate: '2025-09-13',
    startDate: '2025-09-13',
    description: 'Inspección de calidad post-hormigonado de radier. Verificar resistencia, nivelación y acabado superficial.',
    estimatedHours: 3,
    actualHours: 1.5,
    materials: ['Esclerómetro', 'Nivel láser', 'Formularios de inspección'],
    prerequisites: ['Radier curado 24hrs mínimo', 'Limpieza de superficie'],
    notes: 'Pendiente por lluvia del día anterior',
    createdBy: 'Patricia López',
    createdAt: '2025-09-12T07:00:00Z',
    updatedAt: '2025-09-13T16:45:00Z'
  },
  {
    id: 'task-4',
    title: 'Instalación Eléctrica - EA-104',
    partida: 'Instalaciones Eléctricas',
    building: 'Edificio A', 
    unit: 'EA-104',
    assignedTo: 'Roberto Kim (Instalaciones)',
    priority: 'media' as const,
    status: 'programado' as const,
    category: 'instalaciones' as const,
    dueDate: '2025-09-18',
    startDate: '2025-09-17',
    description: 'Instalación de canalizaciones eléctricas y cajas de registro. Coordinar con estructuras para perforaciones.',
    estimatedHours: 12,
    materials: ['Conduit PVC 20mm', 'Cajas octogonales', 'Alambre THHN 12 AWG', 'Tacos y tornillos'],
    prerequisites: ['Muros hormigonados', 'Planos de instalaciones actualizados'],
    createdBy: 'Ana Silva',
    createdAt: '2025-09-11T14:20:00Z',
    updatedAt: '2025-09-11T14:20:00Z'
  },
  {
    id: 'task-5',
    title: 'Pintura Interior - EA-105',
    partida: 'Terminaciones',
    building: 'Edificio A',
    unit: 'EA-105',
    assignedTo: 'Felipe Soto (Terminaciones)',
    priority: 'baja' as const,
    status: 'completado' as const,
    category: 'acabados' as const,
    dueDate: '2025-09-10',
    startDate: '2025-09-08',
    description: 'Aplicación de pintura interior en muros y cielos. Dos manos de pintura látex color blanco hueso.',
    estimatedHours: 8,
    actualHours: 9,
    materials: ['Pintura látex blanca x4 galones', 'Rodillos', 'Brochas', 'Lijas grano 120'],
    prerequisites: ['Pasta muro aplicada', 'Superficies lijadas'],
    photos: ['foto-1.jpg', 'foto-2.jpg', 'foto-3.jpg'],
    createdBy: 'Miguel Herrera',
    createdAt: '2025-09-07T09:00:00Z',
    updatedAt: '2025-09-10T17:30:00Z'
  },
  {
    id: 'task-6',
    title: 'Revisión Técnica Estructural',
    partida: 'Oficina Técnica',
    building: 'Edificio A',
    unit: 'General',
    assignedTo: 'Patricia López (Oficina Técnica)',
    priority: 'urgente' as const,
    status: 'en_progreso' as const,
    category: 'calidad' as const,
    dueDate: '2025-09-14',
    startDate: '2025-09-13',
    description: 'Revisión técnica de cálculos estructurales para modificación en vano de ventana. Requiere aprobación antes de ejecutar.',
    estimatedHours: 6,
    actualHours: 3,
    materials: ['Planos estructurales', 'Software de cálculo', 'Normativa NCh'],
    prerequisites: ['Solicitud de modificación aprobada', 'Planos de arquitectura actualizados'],
    createdBy: 'Carlos Morales',
    createdAt: '2025-09-13T08:30:00Z',
    updatedAt: '2025-09-13T15:45:00Z'
  }
]

export default function TasksPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get role from URL params with fallback
  const role = searchParams.get('role') || 
               (session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno')
  
  // Load tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      if (!session?.user) return
      
      try {
        setLoading(true)
        setError(null)

        // Apply role-based filters
        let filters: any = {}
        
        if (role === 'bodega') {
          filters.category = 'MATERIALS'
        } else if (role === 'control_calidad') {
          filters.category = 'QUALITY'
        } else if (role === 'oficina_tecnica') {
          filters.category = 'TECHNICAL_OFFICE'
        }
        // gerencia and jefe_terreno see all tasks

        const response = await tasksApi.getTasks(filters)
        
        if (response.success && response.data) {
          setTasks(response.data.tasks)
        } else {
          setError(response.error || 'Error al cargar tareas')
        }
      } catch (err) {
        console.error('Error loading tasks:', err)
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [session, role])

  // Map user data for component compatibility
  const usuario = {
    id: session?.user?.id || 'user-1',
    nombre: session?.user?.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad',
    permisos: ['ver_tareas', 'crear_tareas', 'editar_tareas'],
    proyectosAsignados: []
  }

  // Convert API tasks to component format
  const convertedTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    partida: task.partida || task.category,
    building: task.building || 'Sin edificio',
    unit: task.unit || 'Sin unidad',
    assignedTo: `${task.assignee.name} (${task.assignee.role})`,
    priority: task.priority.toLowerCase() as 'baja' | 'media' | 'alta' | 'urgente',
    status: task.status === 'PENDING' ? 'programado' as const :
           task.status === 'IN_PROGRESS' ? 'en_progreso' as const :
           task.status === 'COMPLETED' ? 'completado' as const :
           task.status === 'DELAYED' ? 'retrasado' as const :
           'programado' as const,
    category: task.category.toLowerCase() as 'estructura' | 'materiales' | 'calidad' | 'instalaciones' | 'acabados' | 'general',
    dueDate: task.dueDate?.split('T')[0] || '',
    startDate: task.startDate?.split('T')[0] || '',
    description: task.description || '',
    estimatedHours: task.estimatedHours || 0,
    actualHours: task.actualHours || 0,
    materials: task.materials || [],
    prerequisites: task.prerequisites || [],
    createdBy: task.createdBy.name,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    notes: task.notes
  }))

  const handleTaskCreate = async (taskData: any) => {
    try {
      // Convert component format to API format
      const createData: CreateTaskData = {
        title: taskData.title,
        description: taskData.description,
        assigneeId: taskData.assigneeId, // This should come from the form
        projectId: taskData.projectId || 'default-project', // Should be selected in form
        priority: taskData.priority?.toUpperCase() as any || 'MEDIUM',
        category: taskData.category?.toUpperCase() as any || 'GENERAL',
        dueDate: taskData.dueDate,
        startDate: taskData.startDate,
        estimatedHours: taskData.estimatedHours,
        building: taskData.building,
        unit: taskData.unit,
        partida: taskData.partida,
        materials: taskData.materials || [],
        prerequisites: taskData.prerequisites || [],
        notes: taskData.notes
      }

      const response = await tasksApi.createTask(createData)
      
      if (response.success && response.data) {
        // Reload tasks
        const tasksResponse = await tasksApi.getTasks()
        if (tasksResponse.success && tasksResponse.data) {
          setTasks(tasksResponse.data.tasks)
        }
        alert('Tarea creada exitosamente')
      } else {
        alert(`Error al crear tarea: ${response.error}`)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Error al crear tarea')
    }
  }

  const handleTaskUpdate = async (id: string, updates: any) => {
    try {
      // Convert updates to API format
      const updateData: UpdateTaskData = {
        status: updates.status === 'completado' ? 'COMPLETED' :
               updates.status === 'en_progreso' ? 'IN_PROGRESS' :
               updates.status === 'programado' ? 'PENDING' :
               updates.status === 'retrasado' ? 'DELAYED' : undefined,
        actualHours: updates.actualHours
      }

      const response = await tasksApi.updateTask(id, updateData)
      
      if (response.success && response.data) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === id ? response.data!.task : task
        ))
        alert('Tarea actualizada exitosamente')
      } else {
        alert(`Error al actualizar tarea: ${response.error}`)
      }
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Error al actualizar tarea')
    }
  }

  const handleTaskDelete = async (id: string) => {
    try {
      const response = await tasksApi.deleteTask(id)
      
      if (response.success) {
        // Remove from local state
        setTasks(prev => prev.filter(task => task.id !== id))
        alert('Tarea eliminada exitosamente')
      } else {
        alert(`Error al eliminar tarea: ${response.error}`)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Error al eliminar tarea')
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tareas...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-600 mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar tareas</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <ErrorBoundary>
        <TaskManagement 
          usuario={usuario}
          tareas={convertedTasks}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </ErrorBoundary>
    </ProtectedLayout>
  )
}