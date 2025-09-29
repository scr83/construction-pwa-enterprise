'use client'

import { useState, useEffect } from 'react'

export function TaskManagement({ usuario, tareas = [], onTaskCreate, onTaskUpdate, onTaskDelete }) {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  
  // Safety check for props
  const safeTareas = Array.isArray(tareas) ? tareas : []
  const safeUsuario = usuario || { rol: 'jefe_terreno', nombre: 'Usuario' }

  // Load projects and users for task creation
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load projects
        const projectsResponse = await fetch('/api/projects')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects || [])
        }

        // Load users
        const usersResponse = await fetch('/api/users')
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData.users || [])
        }
      } catch (error) {
        console.error('Error loading data for task creation:', error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Tareas
        </h1>
        <p className="text-gray-600 mb-4">
          Control de actividades de construcción - {safeUsuario.rol?.replace('_', ' ') || 'Usuario'}
        </p>
        
        {/* Simple KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Tareas</h3>
            <p className="text-2xl font-bold text-gray-900">{safeTareas.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Completadas</h3>
            <p className="text-2xl font-bold text-green-600">
              {safeTareas.filter(t => t.status === 'completado').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">En Progreso</h3>
            <p className="text-2xl font-bold text-blue-600">
              {safeTareas.filter(t => t.status === 'en_progreso').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Retrasadas</h3>
            <p className="text-2xl font-bold text-red-600">
              {safeTareas.filter(t => t.status === 'retrasado').length}
            </p>
          </div>
        </div>
      </div>

      {/* Simple task list */}
      <div className="space-y-4">
        {safeTareas.length > 0 ? (
          safeTareas.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Partida: {task.partida}
                  </p>
                  <div className="flex gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${task.status === 'completado' ? 'bg-green-100 text-green-800' :
                        task.status === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'retrasado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {task.status === 'completado' ? 'Completado' :
                       task.status === 'en_progreso' ? 'En Progreso' :
                       task.status === 'retrasado' ? 'Retrasado' :
                       'Programado'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${task.priority === 'urgente' ? 'bg-red-100 text-red-800' :
                        task.priority === 'alta' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {task.priority === 'urgente' ? 'Urgente' :
                       task.priority === 'alta' ? 'Alta' :
                       task.priority === 'media' ? 'Media' :
                       'Baja'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Edificio: {task.building}</span>
                  <span>Unidad: {task.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Asignado: {task.assignedTo}</span>
                  <span>Vence: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-CL') : 'No definido'}</span>
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-gray-700 mt-3 pt-3 border-t">
                  {task.description}
                </p>
              )}

              <div className="flex gap-2 mt-4 pt-3 border-t">
                {safeUsuario.rol === 'jefe_terreno' && task.status === 'programado' && (
                  <button
                    onClick={() => onTaskUpdate && onTaskUpdate(task.id, { status: 'en_progreso' })}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Iniciar Faena
                  </button>
                )}
                {safeUsuario.rol === 'jefe_terreno' && task.status === 'en_progreso' && (
                  <button
                    onClick={() => onTaskUpdate && onTaskUpdate(task.id, { status: 'completado' })}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Completar
                  </button>
                )}
                {safeUsuario.rol === 'gerencia' && (
                  <button
                    onClick={() => onTaskDelete && onTaskDelete(task.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow border text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay tareas asignadas
            </h3>
            <p className="text-gray-600">
              Las tareas aparecerán aquí cuando sean creadas
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Rol actual: {safeUsuario.rol?.replace('_', ' ') || 'Usuario'}
            </p>
          </div>
        )}
      </div>

      {/* Add new task button for allowed roles */}
      {(safeUsuario.rol === 'gerencia' || safeUsuario.rol === 'jefe_terreno') && onTaskCreate && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowTaskForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            ➕ Crear Nueva Tarea
          </button>
        </div>
      )}

      {/* Task Creation Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Crear Nueva Tarea</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const taskData = {
                title: formData.get('title'),
                description: formData.get('description'),
                assigneeId: formData.get('assigneeId'),
                projectId: formData.get('projectId'),
                priority: formData.get('priority') || 'MEDIUM',
                category: 'GENERAL',
                partida: formData.get('partida') || 'General',
                status: 'programado'
              }
              onTaskCreate(taskData)
              setShowTaskForm(false)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título de la Tarea *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Instalar moldajes EA-101"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción detallada de la tarea..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asignar a *
                  </label>
                  <select
                    name="assigneeId"
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar usuario...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proyecto *
                  </label>
                  <select
                    name="projectId"
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar proyecto...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    name="priority"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM" selected>Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partida
                  </label>
                  <input
                    type="text"
                    name="partida"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Estructura, Instalaciones, etc."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}