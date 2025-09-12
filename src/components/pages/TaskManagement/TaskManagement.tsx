'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { StatusCard } from '@/components/molecules/StatusCard'
import { SearchBar } from '@/components/molecules/SearchBar'
import { FilterDropdown } from '@/components/molecules/FilterDropdown'

interface TaskManagementProps {
  usuario: {
    id: string
    nombre: string
    rol: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
    permisos: string[]
    proyectosAsignados: string[]
  }
  tareas: Array<{
    id: string
    title: string
    partida: string
    building: string
    unit: string
    assignedTo: string
    priority: 'baja' | 'media' | 'alta' | 'urgente'
    status: 'programado' | 'en_progreso' | 'completado' | 'retrasado'
    category: 'estructura' | 'materiales' | 'calidad' | 'instalaciones' | 'acabados'
    dueDate: string
    description: string
    createdAt?: string
    updatedAt?: string
  }>
  onTaskCreate: (taskData: any) => void
  onTaskUpdate: (id: string, updates: any) => void
  onTaskDelete: (id: string) => void
}

const CONSTRUCTION_STATUSES = {
  programado: { label: 'Programado', color: 'gray', icon: 'Calendar' },
  materiales_asignados: { label: 'Materiales Asignados', color: 'blue', icon: 'Package' },
  en_progreso: { label: 'En Progreso', color: 'yellow', icon: 'Clock' },
  faena_ejecutada: { label: 'Faena Ejecutada', color: 'orange', icon: 'CheckCircle' },
  entregado_calidad: { label: 'Entregado a Calidad', color: 'purple', icon: 'Shield' },
  completado: { label: 'Completado', color: 'green', icon: 'Check' },
  retrasado: { label: 'Retrasado', color: 'red', icon: 'AlertTriangle' }
} as const

const PRIORITY_CONFIG = {
  baja: { label: 'Baja', color: 'blue' },
  media: { label: 'Media', color: 'yellow' },
  alta: { label: 'Alta', color: 'orange' },
  urgente: { label: 'Urgente', color: 'red' }
} as const

const CATEGORY_LABELS = {
  estructura: 'Estructura',
  materiales: 'Materiales',
  calidad: 'Control de Calidad',
  instalaciones: 'Instalaciones',
  acabados: 'Acabados'
} as const

export function TaskManagement({ usuario, tareas = [], onTaskCreate, onTaskUpdate, onTaskDelete }: TaskManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status'>('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Role-based task filtering
  const visibleTasks = useMemo(() => {
    let filtered = tareas

    // Role-based filtering
    if (usuario.rol === 'jefe_terreno') {
      filtered = filtered.filter(task => 
        usuario.proyectosAsignados.includes(task.building) ||
        task.assignedTo === usuario.id
      )
    } else if (usuario.rol === 'control_calidad') {
      filtered = filtered.filter(task => 
        task.status === 'entregado_calidad' || 
        task.category === 'calidad' ||
        task.status === 'completado'
      )
    } else if (usuario.rol === 'bodega') {
      filtered = filtered.filter(task => 
        task.category === 'materiales' ||
        task.status === 'materiales_asignados'
      )
    }

    return filtered
  }, [tareas, usuario])

  // Search and filter logic
  const filteredTasks = useMemo(() => {
    let filtered = visibleTasks

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.partida.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter)
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy]
      let bValue: string | number = b[sortBy]

      if (sortBy === 'dueDate') {
        aValue = new Date(a.dueDate).getTime()
        bValue = new Date(b.dueDate).getTime()
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'urgente': 4, 'alta': 3, 'media': 2, 'baja': 1 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue > bValue ? -1 : 1
      }
    })

    return filtered
  }, [visibleTasks, searchTerm, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const total = visibleTasks.length
    const completed = visibleTasks.filter(t => t.status === 'completado').length
    const inProgress = visibleTasks.filter(t => t.status === 'en_progreso' || t.status === 'faena_ejecutada').length
    const delayed = visibleTasks.filter(t => t.status === 'retrasado').length
    
    return { total, completed, inProgress, delayed }
  }, [visibleTasks])

  // Role-based action permissions
  const canCreateTask = usuario.rol === 'gerencia' || usuario.rol === 'jefe_terreno' || usuario.rol === 'oficina_tecnica'
  const canEditTask = (task: any) => {
    if (usuario.rol === 'gerencia') return true
    if (usuario.rol === 'jefe_terreno') return task.assignedTo === usuario.id || usuario.proyectosAsignados.includes(task.building)
    if (usuario.rol === 'control_calidad') return task.status === 'entregado_calidad'
    if (usuario.rol === 'bodega') return task.category === 'materiales'
    return false
  }

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    onTaskUpdate(taskId, { status: newStatus, updatedAt: new Date().toISOString() })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const TaskCard = ({ task }: { task: any }) => {
    const status = CONSTRUCTION_STATUSES[task.status] || CONSTRUCTION_STATUSES.programado
    const priority = PRIORITY_CONFIG[task.priority]
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completado'
    
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Typography variant="h6" className="text-gray-900 font-medium">
                {task.title}
              </Typography>
              {isOverdue && (
                <Badge color="red" size="sm">
                  <Icon name="AlertTriangle" size={12} />
                  Vencido
                </Badge>
              )}
            </div>
            <Typography variant="body2" className="text-gray-600 mb-2">
              Partida: {task.partida}
            </Typography>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge color={status.color} size="sm">
                <Icon name={status.icon} size={12} />
                {status.label}
              </Badge>
              <Badge color={priority.color} size="sm">
                {priority.label}
              </Badge>
              <Badge color="blue" size="sm">
                {CATEGORY_LABELS[task.category]}
              </Badge>
            </div>
          </div>
          {canEditTask(task) && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTask(task)}
              >
                <Icon name="Edit" size={16} />
              </Button>
              {usuario.rol === 'gerencia' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTaskDelete(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Edificio: {task.building}</span>
            <span>Unidad: {task.unit}</span>
          </div>
          <div className="flex justify-between">
            <span>Asignado: {task.assignedTo}</span>
            <span>Vence: {formatDate(task.dueDate)}</span>
          </div>
        </div>

        {task.description && (
          <Typography variant="body2" className="text-gray-700 mt-3 border-t pt-3">
            {task.description}
          </Typography>
        )}

        {canEditTask(task) && (
          <div className="flex gap-2 mt-4 pt-3 border-t">
            {usuario.rol === 'jefe_terreno' && task.status === 'programado' && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(task.id, 'en_progreso')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Iniciar Faena
              </Button>
            )}
            {usuario.rol === 'jefe_terreno' && task.status === 'en_progreso' && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(task.id, 'faena_ejecutada')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Marcar Ejecutado
              </Button>
            )}
            {usuario.rol === 'jefe_terreno' && task.status === 'faena_ejecutada' && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(task.id, 'entregado_calidad')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Entregar a Calidad
              </Button>
            )}
            {usuario.rol === 'control_calidad' && task.status === 'entregado_calidad' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(task.id, 'completado')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Aprobar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(task.id, 'en_progreso')}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Rechazar
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div>
            <Typography variant="h4" className="text-gray-900 font-bold mb-1">
              Gestión de Tareas
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Control de actividades de construcción - {usuario.rol.replace('_', ' ')}
            </Typography>
          </div>
          {canCreateTask && (
            <Button 
              onClick={() => setShowNewTaskForm(true)}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              <Icon name="Plus" size={16} />
              Nueva Tarea
            </Button>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            title="Total Tareas"
            value={kpis.total.toString()}
            subtitle="Asignadas"
            variant="default"
          />
          <StatusCard
            title="Completadas"
            value={kpis.completed.toString()}
            subtitle={`${kpis.total > 0 ? Math.round((kpis.completed / kpis.total) * 100) : 0}% del total`}
            variant="success"
          />
          <StatusCard
            title="En Progreso"
            value={kpis.inProgress.toString()}
            subtitle="Activas"
            variant="warning"
          />
          <StatusCard
            title="Retrasadas"
            value={kpis.delayed.toString()}
            subtitle="Requieren atención"
            variant="error"
          />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Buscar por título, partida, unidad o asignado..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <FilterDropdown
              label="Estado"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'programado', label: 'Programado' },
                { value: 'en_progreso', label: 'En Progreso' },
                { value: 'completado', label: 'Completado' },
                { value: 'retrasado', label: 'Retrasado' }
              ]}
            />
            <FilterDropdown
              label="Prioridad"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: 'all', label: 'Todas las prioridades' },
                { value: 'urgente', label: 'Urgente' },
                { value: 'alta', label: 'Alta' },
                { value: 'media', label: 'Media' },
                { value: 'baja', label: 'Baja' }
              ]}
            />
            <FilterDropdown
              label="Categoría"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: 'all', label: 'Todas las categorías' },
                { value: 'estructura', label: 'Estructura' },
                { value: 'materiales', label: 'Materiales' },
                { value: 'calidad', label: 'Control de Calidad' },
                { value: 'instalaciones', label: 'Instalaciones' },
                { value: 'acabados', label: 'Acabados' }
              ]}
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <Typography variant="body2" className="text-gray-600">
            Ordenar por:
          </Typography>
          <Button
            variant={sortBy === 'dueDate' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('dueDate')}
          >
            Fecha de Vencimiento
          </Button>
          <Button
            variant={sortBy === 'priority' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('priority')}
          >
            Prioridad
          </Button>
          <Button
            variant={sortBy === 'status' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('status')}
          >
            Estado
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </Button>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <Typography variant="body2" className="text-gray-600">
          Mostrando {filteredTasks.length} de {visibleTasks.length} tareas
          {searchTerm && ` para "${searchTerm}"`}
        </Typography>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="Clipboard" size={48} className="mx-auto text-gray-400 mb-4" />
            <Typography variant="h6" className="text-gray-600 mb-2">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                ? 'No se encontraron tareas con los filtros aplicados'
                : 'No hay tareas asignadas'}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {canCreateTask && 'Crea una nueva tarea para comenzar'}
            </Typography>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  )
}