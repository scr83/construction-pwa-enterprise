'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { Card } from '@/components/atoms/Card'
import { SearchBar } from '@/components/molecules/SearchBar'
import { StatusCard } from '@/components/molecules/StatusCard'
import { useSearchParams } from 'next/navigation'

// Tipos para gestión de tareas de construcción
export type TaskStatus = 'programado' | 'en_progreso' | 'completado' | 'retrasado' | 'cancelado'
export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente'
export type TaskCategory = 'estructura' | 'instalaciones' | 'acabados' | 'calidad' | 'materiales' | 'equipos'

export interface ConstructionTask {
  id: string
  title: string
  partida: string
  building: string
  unit: string
  assignedTo: string
  priority: TaskPriority
  status: TaskStatus
  category: TaskCategory
  dueDate: string
  startDate: string
  description: string
  estimatedHours: number
  actualHours?: number
  materials?: string[]
  prerequisites?: string[]
  photos?: string[]
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface TaskManagementProps {
  usuario: {
    id: string
    nombre: string
    rol: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
    permisos: string[]
    proyectosAsignados: string[]
  }
  tareas: ConstructionTask[]
  onTaskCreate?: (task: Partial<ConstructionTask>) => void
  onTaskUpdate?: (id: string, updates: Partial<ConstructionTask>) => void
  onTaskDelete?: (id: string) => void
}

// Componente de tarjeta de tarea
const TaskCard: React.FC<{
  task: ConstructionTask
  onClick: () => void
  userRole: string
}> = ({ task, onClick, userRole }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completado': return 'bg-green-100 text-green-800'
      case 'en_progreso': return 'bg-blue-100 text-blue-800'
      case 'retrasado': return 'bg-red-100 text-red-800'
      case 'programado': return 'bg-yellow-100 text-yellow-800'
      case 'cancelado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgente': return 'bg-red-500'
      case 'alta': return 'bg-orange-500'
      case 'media': return 'bg-yellow-500'
      case 'baja': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'completado': return 'Completado'
      case 'en_progreso': return 'En Progreso'
      case 'retrasado': return 'Retrasado'
      case 'programado': return 'Programado'
      case 'cancelado': return 'Cancelado'
      default: return status
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            <Typography variant="body-default" className="font-semibold truncate">
              {task.title}
            </Typography>
          </div>
          <Typography variant="body-small" color="muted">
            {task.partida} • {task.building} - {task.unit}
          </Typography>
        </div>
        <Badge className={getStatusColor(task.status)} size="sm">
          {getStatusLabel(task.status)}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon name="user" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            {task.assignedTo}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Icon name="calendar" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            Vence: {new Date(task.dueDate).toLocaleDateString('es-CL')}
          </Typography>
        </div>

        {task.estimatedHours && (
          <div className="flex items-center gap-2">
            <Icon name="clock" size="xs" className="text-gray-400" />
            <Typography variant="body-small" color="muted">
              {task.estimatedHours}h estimadas
              {task.actualHours && ` • ${task.actualHours}h reales`}
            </Typography>
          </div>
        )}
      </div>

      {task.description && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Typography variant="body-small" color="muted" className="line-clamp-2">
            {task.description}
          </Typography>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Icon name="tag" size="xs" className="text-gray-400" />
          <Typography variant="caption" color="muted">
            {task.category}
          </Typography>
        </div>
        
        {task.photos && task.photos.length > 0 && (
          <div className="flex items-center gap-1">
            <Icon name="camera" size="xs" className="text-gray-400" />
            <Typography variant="caption" color="muted">
              {task.photos.length} fotos
            </Typography>
          </div>
        )}
      </div>
    </Card>
  )
}

export function TaskManagement({
  usuario,
  tareas,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete
}: TaskManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'todos'>('todos')
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'todas'>('todas')
  const [selectedTask, setSelectedTask] = useState<ConstructionTask | null>(null)
  
  const searchParams = useSearchParams()
  const currentRole = searchParams.get('role') || usuario.rol

  // Estadísticas de tareas
  const taskStats = useMemo(() => {
    const total = tareas.length
    const completadas = tareas.filter(t => t.status === 'completado').length
    const enProgreso = tareas.filter(t => t.status === 'en_progreso').length
    const retrasadas = tareas.filter(t => t.status === 'retrasado').length
    const programadas = tareas.filter(t => t.status === 'programado').length

    return { total, completadas, enProgreso, retrasadas, programadas }
  }, [tareas])

  // Filtros de tareas
  const filteredTasks = useMemo(() => {
    return tareas.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.partida.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.building.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = selectedStatus === 'todos' || task.status === selectedStatus
      const matchesPriority = selectedPriority === 'todas' || task.priority === selectedPriority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tareas, searchTerm, selectedStatus, selectedPriority])

  // Permisos basados en rol - Add defensive checks
  const canCreateTasks = (usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes('crear_tareas')) || 
                        ['gerencia', 'jefe_terreno', 'oficina_tecnica'].includes(currentRole)
  
  const canEditTasks = (usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes('editar_tareas')) || 
                      ['gerencia', 'jefe_terreno'].includes(currentRole)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h3" className="font-bold text-gray-900">
            Gestión de Tareas
          </Typography>
          <Typography variant="body-default" color="muted">
            Administra y supervisa las actividades de construcción
          </Typography>
        </div>

        {canCreateTasks && (
          <Button
            variant="primary"
            leftIcon={<Icon name="plus" size="sm" />}
            onClick={() => onTaskCreate?.({ 
              assignedTo: usuario.nombre,
              createdBy: usuario.nombre,
              status: 'programado',
              priority: 'media'
            })}
          >
            Nueva Tarea
          </Button>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatusCard
          title="Total"
          value={taskStats.total.toString()}
          variant="default"
          icon="list-checks"
        />
        <StatusCard
          title="Completadas"
          value={taskStats.completadas.toString()}
          variant="success"
          icon="check-circle"
        />
        <StatusCard
          title="En Progreso"
          value={taskStats.enProgreso.toString()}
          variant="info"
          icon="clock"
        />
        <StatusCard
          title="Retrasadas"
          value={taskStats.retrasadas.toString()}
          variant="danger"
          icon="alert-circle"
        />
        <StatusCard
          title="Programadas"
          value={taskStats.programadas.toString()}
          variant="warning"
          icon="calendar"
        />
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Buscar por tarea, partida, responsable o edificio..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TaskStatus | 'todos')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="programado">Programado</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completado</option>
            <option value="retrasado">Retrasado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | 'todas')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todas">Todas las prioridades</option>
            <option value="urgente">Urgente</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="search" size="lg" className="text-gray-400 mx-auto mb-4" />
            <Typography variant="body-default" color="muted">
              {searchTerm || selectedStatus !== 'todos' || selectedPriority !== 'todas'
                ? 'No se encontraron tareas con los filtros aplicados'
                : 'No hay tareas registradas'}
            </Typography>
            {canCreateTasks && (
              <Button
                variant="outline"
                className="mt-4"
                leftIcon={<Icon name="plus" size="sm" />}
                onClick={() => onTaskCreate?.({})}
              >
                Crear primera tarea
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userRole={currentRole}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle de tarea (simplificado para demo) */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Typography variant="h4" className="font-bold mb-1">
                    {selectedTask.title}
                  </Typography>
                  <Typography variant="body-default" color="muted">
                    {selectedTask.partida} • {selectedTask.building} - {selectedTask.unit}
                  </Typography>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTask(null)}
                >
                  <Icon name="x" size="sm" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Typography variant="label-default" className="mb-2">
                    Descripción
                  </Typography>
                  <Typography variant="body-default">
                    {selectedTask.description}
                  </Typography>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="label-default" className="mb-1">
                      Responsable
                    </Typography>
                    <Typography variant="body-default">
                      {selectedTask.assignedTo}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="label-default" className="mb-1">
                      Fecha de vencimiento
                    </Typography>
                    <Typography variant="body-default">
                      {new Date(selectedTask.dueDate).toLocaleDateString('es-CL')}
                    </Typography>
                  </div>
                </div>

                {selectedTask.materials && selectedTask.materials.length > 0 && (
                  <div>
                    <Typography variant="label-default" className="mb-2">
                      Materiales requeridos
                    </Typography>
                    <div className="space-y-1">
                      {selectedTask.materials.map((material, index) => (
                        <Typography key={index} variant="body-small" color="muted">
                          • {material}
                        </Typography>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {canEditTasks && (
                    <Button variant="primary" size="sm">
                      Editar Tarea
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Ver Fotos
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedTask(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}