'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  teamsApi, 
  constructionRoles, 
  teamTypes, 
  teamStatuses, 
  memberStatuses,
  getProductivityColor,
  getProductivityStatus,
  formatDate,
  type Team,
  type TeamMember,
  type CreateTeamData,
  type AddTeamMemberData 
} from '@/lib/api/teams'
import { Button } from '@/components/atoms/Button'
import { Loading } from '@/components/atoms/Loading'
import { CreateTeamForm } from './CreateTeamForm'

interface TeamManagementProps {
  projectId?: string
}

export function TeamManagement({ projectId }: TeamManagementProps) {
  const { data: session } = useSession()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAddMemberForm, setShowAddMemberForm] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Calculate total team members across all teams
  const totalMembers = teams.reduce((total, team) => total + (team.members?.length || 0), 0)

  // Load teams data
  const loadTeams = async () => {
    if (!session?.user) return
    
    try {
      setError(null)
      const response = await teamsApi.getTeams(projectId)
      
      if (response.success && response.data) {
        setTeams(response.data.teams)
      } else {
        setError(response.error || 'Error cargando equipos')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Refresh teams data
  const refreshTeams = async () => {
    setRefreshing(true)
    await loadTeams()
  }

  // Handle team status update
  const handleTeamStatusUpdate = async (teamId: string, status: 'active' | 'inactive' | 'on_break') => {
    try {
      const response = await teamsApi.updateTeam(teamId, { status })
      
      if (response.success) {
        await refreshTeams()
      } else {
        setError(response.error || 'Error actualizando equipo')
      }
    } catch (err) {
      setError('Error actualizando estado del equipo')
    }
  }

  // Handle create team
  const handleCreateTeam = async (teamData: CreateTeamData) => {
    try {
      const response = await teamsApi.createTeam(teamData)
      
      if (response.success) {
        setShowCreateForm(false)
        await refreshTeams()
      } else {
        setError(response.error || 'Error creando equipo')
      }
    } catch (err) {
      setError('Error creando equipo')
    }
  }

  // Handle add team member
  const handleAddMember = async (teamId: string, memberData: AddTeamMemberData) => {
    try {
      const response = await teamsApi.addTeamMember(teamId, memberData)
      
      if (response.success) {
        setShowAddMemberForm(null)
        await refreshTeams()
      } else {
        setError(response.error || 'Error agregando miembro')
      }
    } catch (err) {
      setError('Error agregando miembro al equipo')
    }
  }

  // Load teams on component mount
  useEffect(() => {
    loadTeams()
  }, [session, projectId])

  // Get user role for permissions
  const userRole = session?.user?.role || 'WORKER'
  const canManageTeams = ['SITE_MANAGER', 'EXECUTIVE', 'ADMIN'].includes(userRole)
  const canModifyTeams = ['SUPERVISOR', 'SITE_MANAGER', 'EXECUTIVE', 'ADMIN'].includes(userRole)

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Gestión de Equipos
            </h1>
            <p className="text-gray-600">
              Administración de cuadrillas y personal de construcción - {session?.user?.name || 'Usuario'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={refreshTeams}
              disabled={refreshing}
            >
              {refreshing ? '🔄' : '↻'} Actualizar
            </Button>
            {canManageTeams && (
              <Button
                onClick={() => setShowCreateForm(true)}
              >
                👥 Crear Equipo
              </Button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Team KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Cuadrillas</h3>
            <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Personal Total</h3>
            <p className="text-2xl font-bold text-blue-600">{totalMembers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Equipos Activos</h3>
            <p className="text-2xl font-bold text-green-600">
              {teams.filter(t => t.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">En Descanso</h3>
            <p className="text-2xl font-bold text-orange-600">
              {teams.filter(t => t.status === 'on_break').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Productividad Avg</h3>
            <p className="text-2xl font-bold text-purple-600">
              {teams.length > 0 ? Math.round(teams.reduce((sum, t) => sum + (t.currentMetrics?.productivity || 0), 0) / teams.length) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Teams list */}
      <div className="space-y-6">
        {teams.length > 0 ? (
          teams.map(team => (
            <div key={team.id} className="bg-white p-4 md:p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
              {/* Team Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                      {team.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${team.status === 'active' ? 'bg-green-100 text-green-800' :
                          team.status === 'on_break' ? 'bg-orange-100 text-orange-800' :
                          team.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {team.status === 'active' ? '🟢 Activo' :
                         team.status === 'on_break' ? '🟡 En Descanso' :
                         team.status === 'inactive' ? '🔴 Inactivo' :
                         teamStatuses[team.status] || team.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${team.type === 'estructuras' ? 'bg-blue-100 text-blue-800' :
                          team.type === 'instalaciones' ? 'bg-purple-100 text-purple-800' :
                          team.type === 'calidad' ? 'bg-green-100 text-green-800' :
                          team.type === 'terminaciones' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {team.type === 'estructuras' ? '🏗️ Estructuras' :
                         team.type === 'instalaciones' ? '⚡ Instalaciones' :
                         team.type === 'calidad' ? '🛡️ Calidad' :
                         team.type === 'terminaciones' ? '🎨 Terminaciones' :
                         teamTypes[team.type] || team.type}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Supervisor:</strong> {team.supervisor.name}
                    </p>
                    <p>
                      <strong>Proyecto:</strong> {team.project.name}
                    </p>
                  </div>
                </div>
                <div className="flex md:flex-col items-center md:items-end md:text-right">
                  <div className={`text-xl md:text-2xl font-bold mb-1 ${getProductivityColor(team.currentMetrics?.productivity || 0)}`}>
                    {team.currentMetrics?.productivity || 0}%
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 ml-2 md:ml-0">Productividad</div>
                  <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2 mt-1 ml-2 md:ml-0">
                    <div 
                      className={`h-2 rounded-full ${
                        getProductivityStatus(team.currentMetrics?.productivity || 0) === 'excellent' ? 'bg-green-600' :
                        getProductivityStatus(team.currentMetrics?.productivity || 0) === 'good' ? 'bg-blue-600' :
                        getProductivityStatus(team.currentMetrics?.productivity || 0) === 'warning' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(100, team.currentMetrics?.productivity || 0)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Team Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-base md:text-lg font-semibold text-gray-900">
                    {team.currentMetrics?.tasksCompleted || 0}
                  </div>
                  <div className="text-xs text-gray-500">Tareas Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-base md:text-lg font-semibold text-green-600">
                    {team.currentMetrics?.qualityScore || 0}%
                  </div>
                  <div className="text-xs text-gray-500">Calidad</div>
                </div>
                <div className="text-center">
                  <div className="text-base md:text-lg font-semibold text-blue-600">
                    {Math.round(team.currentMetrics?.attendanceRate || 0)}%
                  </div>
                  <div className="text-xs text-gray-500">Asistencia</div>
                </div>
                <div className="text-center">
                  <div className="text-base md:text-lg font-semibold text-purple-600">
                    {team.currentMetrics?.safetyIncidents === 0 ? '✅' : '⚠️'} {team.currentMetrics?.safetyIncidents || 0}
                  </div>
                  <div className="text-xs text-gray-500">Incidentes de Seguridad</div>
                </div>
              </div>

              {/* Team Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">📋 Información del Equipo</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Tipo:</strong> {teamTypes[team.type] || team.type}
                    </p>
                    <p>
                      <strong>Meta Productividad:</strong> {team.productivityTarget}%
                    </p>
                    <p>
                      <strong>Creado:</strong> {formatDate(team.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">🔧 Especialidades</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.specialties && team.specialties.length > 0 ? team.specialties.map((specialty, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {specialty}
                      </span>
                    )) : <span className="text-sm text-gray-500">Sin especialidades definidas</span>}
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    👥 Miembros del Equipo ({team.members?.length || 0})
                  </h4>
                  {canModifyTeams && (
                    <Button
                      size="sm"
                      onClick={() => setShowAddMemberForm(team.id)}
                    >
                      ➕ Agregar Miembro
                    </Button>
                  )}
                </div>

                {team.members && team.members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {team.members.map(member => (
                      <div key={member.id} className="p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm">
                              {member.user.name}
                            </h5>
                            <p className="text-xs text-gray-600 mb-1">
                              {constructionRoles[member.role] || member.role}
                            </p>
                            <p className="text-xs text-gray-500 mb-1">
                              Email: {member.user.email}
                            </p>
                            {member.user.phone && (
                              <p className="text-xs text-gray-500 mb-1">
                                📞 {member.user.phone}
                              </p>
                            )}
                            {member.hourlyRate && (
                              <p className="text-xs text-gray-500 mb-1">
                                💰 ${member.hourlyRate.toLocaleString()}/hora
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Ingresó: {formatDate(member.joinedDate)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${member.status === 'active' ? 'bg-green-100 text-green-800' :
                              member.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                              member.status === 'vacation' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'}`}>
                            {member.status === 'active' ? '✓' :
                             member.status === 'on_leave' ? '🏥' :
                             member.status === 'vacation' ? '🏖️' :
                             '❌'}
                          </span>
                        </div>
                        
                        {member.performanceRating > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Rendimiento:</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full" 
                                  style={{ width: `${member.performanceRating}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{member.performanceRating}%</span>
                            </div>
                          </div>
                        )}

                        {member.user.company && (
                          <p className="text-xs text-gray-500 mt-2">
                            🏢 {member.user.company}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No hay miembros asignados a este equipo
                  </p>
                )}
              </div>

              {/* Action buttons based on role */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                {canModifyTeams && team.status === 'on_break' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleTeamStatusUpdate(team.id, 'active')}
                  >
                    ✅ Activar Equipo
                  </Button>
                )}
                
                {canModifyTeams && team.status === 'active' && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleTeamStatusUpdate(team.id, 'on_break')}
                  >
                    ⏸️ Pausar Trabajo
                  </Button>
                )}
                
                {canManageTeams && (
                  <Button
                    size="sm"
                    onClick={() => window.open(`/teams/${team.id}`, '_blank')}
                  >
                    📊 Ver Detalle
                  </Button>
                )}
                
                {(team.currentMetrics?.productivity || 0) < 80 && canModifyTeams && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => window.open(`/teams/${team.id}/productivity`, '_blank')}
                  >
                    ⚡ Mejorar Productividad
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow border text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay equipos registrados
            </h3>
            <p className="text-gray-600 mb-4">
              {canManageTeams ? 'Crea tu primer equipo de construcción' : 'Los equipos de trabajo aparecerán aquí cuando sean creados'}
            </p>
            {canManageTeams && (
              <Button onClick={() => setShowCreateForm(true)}>
                👥 Crear Primer Equipo
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Create Team Modal */}
      {showCreateForm && (
        <CreateTeamForm
          onSubmit={handleCreateTeam}
          onCancel={() => setShowCreateForm(false)}
          loading={loading}
        />
      )}
      
      {/* Add Member Modal - TODO: Implement AddMemberForm component */}
      {showAddMemberForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Agregar Miembro</h3>
            <p className="text-gray-600 mb-4">Funcionalidad de agregar miembro en desarrollo...</p>
            <Button onClick={() => setShowAddMemberForm(null)}>Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  )
}