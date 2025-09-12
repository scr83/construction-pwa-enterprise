'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'
import { Card } from '@/components/atoms/Card'
import { SearchBar } from '@/components/molecules/SearchBar'
import { StatusCard } from '@/components/molecules/StatusCard'
import { Avatar } from '@/components/atoms/Avatar'
import { useSearchParams } from 'next/navigation'

// Tipos para gestión de equipos de construcción
export type TeamStatus = 'activo' | 'inactivo' | 'en_descanso' | 'capacitacion' | 'licencia'
export type TeamDepartment = 'terreno' | 'instalaciones' | 'calidad' | 'oficina_tecnica' | 'bodega' | 'prevencion'
export type WorkerSpecialty = 'albañil' | 'fierrero' | 'electricista' | 'gasfiter' | 'soldador' | 'operador' | 'ayudante' | 'jefe_equipo'

export interface TeamMember {
  id: string
  nombre: string
  rut: string
  cargo: string
  especialidad: WorkerSpecialty
  telefono: string
  email?: string
  fechaIngreso: string
  contratistaEmpresa?: string
  certificaciones: string[]
  estado: 'activo' | 'inactivo' | 'licencia'
  avatar?: string
}

export interface ConstructionTeam {
  id: string
  name: string
  department: TeamDepartment
  supervisor: string
  supervisorId: string
  members: TeamMember[]
  currentProject: string
  currentLocation: string
  status: TeamStatus
  productivity: number
  workSchedule: {
    startTime: string
    endTime: string
    workDays: string[]
  }
  assignments: string[]
  equipment: string[]
  safetyRecord: {
    daysWithoutIncidents: number
    lastIncidentDate?: string
    safetyRating: number
  }
  performance: {
    tasksCompleted: number
    tasksOnTime: number
    qualityScore: number
    attendance: number
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TeamManagementProps {
  usuario: {
    id: string
    nombre: string
    rol: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
    permisos: string[]
    proyectosAsignados: string[]
  }
  equipos: ConstructionTeam[]
  onTeamCreate?: (team: Partial<ConstructionTeam>) => void
  onTeamUpdate?: (id: string, updates: Partial<ConstructionTeam>) => void
  onMemberAdd?: (teamId: string, member: Partial<TeamMember>) => void
  onMemberUpdate?: (teamId: string, memberId: string, updates: Partial<TeamMember>) => void
}

// Componente de tarjeta de equipo
const TeamCard: React.FC<{
  team: ConstructionTeam
  onClick: () => void
  userRole: string
}> = ({ team, onClick, userRole }) => {
  const getStatusColor = (status: TeamStatus) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'inactivo': return 'bg-gray-100 text-gray-800'
      case 'en_descanso': return 'bg-yellow-100 text-yellow-800'
      case 'capacitacion': return 'bg-blue-100 text-blue-800'
      case 'licencia': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: TeamStatus) => {
    switch (status) {
      case 'activo': return 'Activo'
      case 'inactivo': return 'Inactivo'
      case 'en_descanso': return 'En Descanso'
      case 'capacitacion': return 'En Capacitación'
      case 'licencia': return 'Con Licencia'
      default: return status
    }
  }

  const getDepartmentLabel = (department: TeamDepartment) => {
    switch (department) {
      case 'terreno': return 'Terreno'
      case 'instalaciones': return 'Instalaciones'
      case 'calidad': return 'Control Calidad'
      case 'oficina_tecnica': return 'Oficina Técnica'
      case 'bodega': return 'Bodega'
      case 'prevencion': return 'Prevención Riesgos'
      default: return department
    }
  }

  const activeMembers = team.members.filter(m => m.estado === 'activo').length
  const totalMembers = team.members.length

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Typography variant="body-default" className="font-semibold mb-1">
            {team.name}
          </Typography>
          <Typography variant="body-small" color="muted">
            {getDepartmentLabel(team.department)} • {team.currentLocation}
          </Typography>
        </div>
        <Badge className={getStatusColor(team.status)} size="sm">
          {getStatusLabel(team.status)}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon name="user-check" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            Supervisor: {team.supervisor}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Icon name="users" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            Integrantes: {activeMembers}/{totalMembers} activos
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Icon name="map-pin" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            Proyecto: {team.currentProject}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Icon name="trending-up" size="xs" className="text-gray-400" />
          <Typography variant="body-small" color="muted">
            Productividad: {team.productivity}%
          </Typography>
        </div>
      </div>

      {/* Métricas de rendimiento */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="text-center">
          <Typography variant="h6" className="font-bold text-green-600">
            {team.safetyRecord.daysWithoutIncidents}
          </Typography>
          <Typography variant="caption" color="muted">
            Días sin incidentes
          </Typography>
        </div>
        <div className="text-center">
          <Typography variant="h6" className="font-bold text-blue-600">
            {team.performance.qualityScore}%
          </Typography>
          <Typography variant="caption" color="muted">
            Calidad promedio
          </Typography>
        </div>
      </div>

      {/* Horario de trabajo */}
      {team.workSchedule && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Icon name="clock" size="xs" className="text-gray-400" />
            <Typography variant="caption" color="muted">
              {team.workSchedule.startTime} - {team.workSchedule.endTime}
            </Typography>
          </div>
        </div>
      )}
    </Card>
  )
}

// Componente de tarjeta de miembro
const MemberCard: React.FC<{
  member: TeamMember
  onClick: () => void
}> = ({ member, onClick }) => {
  const getSpecialtyLabel = (specialty: WorkerSpecialty) => {
    switch (specialty) {
      case 'albañil': return 'Albañil'
      case 'fierrero': return 'Fierrero'
      case 'electricista': return 'Electricista'
      case 'gasfiter': return 'Gasfiter'
      case 'soldador': return 'Soldador'
      case 'operador': return 'Operador'
      case 'ayudante': return 'Ayudante'
      case 'jefe_equipo': return 'Jefe de Equipo'
      default: return specialty
    }
  }

  const getEstadoColor = (estado: TeamMember['estado']) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'inactivo': return 'bg-gray-100 text-gray-800'
      case 'licencia': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="p-3 hover:shadow-sm transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-3">
        <Avatar
          name={member.nombre}
          src={member.avatar}
          size="default"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <Typography variant="body-default" className="font-semibold truncate">
              {member.nombre}
            </Typography>
            <Badge className={getEstadoColor(member.estado)} size="xs">
              {member.estado}
            </Badge>
          </div>
          
          <Typography variant="body-small" color="muted" className="mb-1">
            {getSpecialtyLabel(member.especialidad)} • {member.cargo}
          </Typography>
          
          <Typography variant="caption" color="muted">
            {member.telefono}
          </Typography>

          {member.certificaciones.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {member.certificaciones.slice(0, 2).map((cert, index) => (
                <Badge key={index} size="xs" variant="outline">
                  {cert}
                </Badge>
              ))}
              {member.certificaciones.length > 2 && (
                <Badge size="xs" variant="outline">
                  +{member.certificaciones.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export function TeamManagement({
  usuario,
  equipos,
  onTeamCreate,
  onTeamUpdate,
  onMemberAdd,
  onMemberUpdate
}: TeamManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<TeamStatus | 'todos'>('todos')
  const [selectedDepartment, setSelectedDepartment] = useState<TeamDepartment | 'todos'>('todos')
  const [selectedTeam, setSelectedTeam] = useState<ConstructionTeam | null>(null)
  const [viewMode, setViewMode] = useState<'equipos' | 'miembros'>('equipos')
  
  
  const searchParams = useSearchParams()
  const currentRole = searchParams.get('role') || usuario?.rol || 'jefe_terreno'

  // Estadísticas de equipos - with defensive coding
  const teamStats = useMemo(() => {
    if (!equipos || !Array.isArray(equipos)) {
      return { totalEquipos: 0, equiposActivos: 0, totalMiembros: 0, miembrosActivos: 0, promedioProductividad: 0 }
    }
    
    const totalEquipos = equipos.length
    const equiposActivos = equipos.filter(e => e?.status === 'activo').length
    const totalMiembros = equipos.reduce((sum, team) => sum + (team?.members?.length || 0), 0)
    const miembrosActivos = equipos.reduce((sum, team) => 
      sum + (team?.members?.filter(m => m?.estado === 'activo')?.length || 0), 0)
    const promedioProductividad = equipos.length > 0 ? 
      Math.round(equipos.reduce((sum, team) => sum + (team?.productivity || 0), 0) / equipos.length) : 0

    return { totalEquipos, equiposActivos, totalMiembros, miembrosActivos, promedioProductividad }
  }, [equipos])

  // Filtros de equipos - with defensive coding
  const filteredTeams = useMemo(() => {
    if (!equipos || !Array.isArray(equipos)) {
      return []
    }
    
    return equipos.filter(team => {
      if (!team) return false
      const matchesSearch = (team.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (team.supervisor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (team.currentProject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (team.members || []).some(m => (m?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = selectedStatus === 'todos' || team.status === selectedStatus
      const matchesDepartment = selectedDepartment === 'todos' || team.department === selectedDepartment

      return matchesSearch && matchesStatus && matchesDepartment
    })
  }, [equipos, searchTerm, selectedStatus, selectedDepartment])

  // Lista plana de miembros para vista de miembros
  const allMembers = useMemo(() => {
    return equipos.flatMap(team => 
      team.members.map(member => ({ ...member, teamName: team.name }))
    )
  }, [equipos])

  // Permisos basados en rol
  const canManageTeams = (usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes('gestionar_equipos')) || 
                        ['gerencia', 'jefe_terreno', 'oficina_tecnica'].includes(currentRole)
  
  const canAssignTasks = (usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes('asignar_tareas')) || 
                        ['gerencia', 'jefe_terreno'].includes(currentRole)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h3" className="font-bold text-gray-900">
            Gestión de Equipos
          </Typography>
          <Typography variant="body-default" color="muted">
            Administra equipos de trabajo y coordina actividades de construcción
          </Typography>
        </div>

        <div className="flex gap-2">
          {canManageTeams && (
            <Button
              variant="outline"
              leftIcon={<Icon name="plus" size="sm" />}
              onClick={() => onMemberAdd?.('', {})}
            >
              Agregar Miembro
            </Button>
          )}
          
          {canManageTeams && (
            <Button
              variant="primary"
              leftIcon={<Icon name="users" size="sm" />}
              onClick={() => onTeamCreate?.({})}
            >
              Nuevo Equipo
            </Button>
          )}
        </div>
      </div>

      {/* Toggle de vista */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'equipos' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setViewMode('equipos')}
          leftIcon={<Icon name="users" size="sm" />}
        >
          Equipos
        </Button>
        <Button
          variant={viewMode === 'miembros' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setViewMode('miembros')}
          leftIcon={<Icon name="user" size="sm" />}
        >
          Miembros
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatusCard
          title="Equipos"
          value={`${teamStats.equiposActivos}/${teamStats.totalEquipos}`}
          variant="default"
          icon="users"
        />
        <StatusCard
          title="Miembros Activos"
          value={teamStats.miembrosActivos.toString()}
          variant="success"
          icon="user-check"
        />
        <StatusCard
          title="Total Miembros"
          value={teamStats.totalMiembros.toString()}
          variant="info"
          icon="user"
        />
        <StatusCard
          title="Productividad"
          value={`${teamStats.promedioProductividad}%`}
          variant="warning"
          icon="trending-up"
        />
        <StatusCard
          title="Días sin Incidentes"
          value={equipos.reduce((max, team) => 
            Math.max(max, team.safetyRecord.daysWithoutIncidents), 0).toString()}
          variant="success"
          icon="shield-check"
        />
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder={viewMode === 'equipos' 
              ? "Buscar por equipo, supervisor o proyecto..." 
              : "Buscar por nombre, especialidad o teléfono..."}
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        {viewMode === 'equipos' && (
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TeamStatus | 'todos')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_descanso">En Descanso</option>
              <option value="capacitacion">En Capacitación</option>
              <option value="licencia">Con Licencia</option>
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value as TeamDepartment | 'todos')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los departamentos</option>
              <option value="terreno">Terreno</option>
              <option value="instalaciones">Instalaciones</option>
              <option value="calidad">Control Calidad</option>
              <option value="oficina_tecnica">Oficina Técnica</option>
              <option value="bodega">Bodega</option>
              <option value="prevencion">Prevención Riesgos</option>
            </select>
          </div>
        )}
      </div>

      {/* Lista de equipos o miembros */}
      <div className="space-y-4">
        {viewMode === 'equipos' ? (
          filteredTeams.length === 0 ? (
            <Card className="p-8 text-center">
              <Icon name="users" size="lg" className="text-gray-400 mx-auto mb-4" />
              <Typography variant="body-default" color="muted">
                {searchTerm || selectedStatus !== 'todos' || selectedDepartment !== 'todos'
                  ? 'No se encontraron equipos con los filtros aplicados'
                  : 'No hay equipos registrados'}
              </Typography>
              {canManageTeams && (
                <Button
                  variant="outline"
                  className="mt-4"
                  leftIcon={<Icon name="plus" size="sm" />}
                  onClick={() => onTeamCreate?.({})}
                >
                  Crear primer equipo
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  userRole={currentRole}
                  onClick={() => setSelectedTeam(team)}
                />
              ))}
            </div>
          )
        ) : (
          allMembers.length === 0 ? (
            <Card className="p-8 text-center">
              <Icon name="user" size="lg" className="text-gray-400 mx-auto mb-4" />
              <Typography variant="body-default" color="muted">
                No hay miembros registrados
              </Typography>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {allMembers.map((member, index) => (
                <MemberCard
                  key={`${member.id}-${index}`}
                  member={member}
                  onClick={() => {}}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Modal de detalle de equipo */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Typography variant="h4" className="font-bold mb-1">
                    {selectedTeam.name}
                  </Typography>
                  <Typography variant="body-default" color="muted">
                    {selectedTeam.currentProject} • {selectedTeam.currentLocation}
                  </Typography>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTeam(null)}
                >
                  <Icon name="x" size="sm" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Información del equipo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Typography variant="label-default" className="mb-1">
                      Supervisor
                    </Typography>
                    <Typography variant="body-default">
                      {selectedTeam.supervisor}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="label-default" className="mb-1">
                      Horario
                    </Typography>
                    <Typography variant="body-default">
                      {selectedTeam.workSchedule.startTime} - {selectedTeam.workSchedule.endTime}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="label-default" className="mb-1">
                      Productividad
                    </Typography>
                    <Typography variant="body-default">
                      {selectedTeam.productivity}%
                    </Typography>
                  </div>
                </div>

                {/* Miembros del equipo */}
                <div>
                  <Typography variant="label-default" className="mb-3">
                    Miembros del Equipo ({selectedTeam.members.length})
                  </Typography>
                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedTeam.members.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        onClick={() => {}}
                      />
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t">
                  {canManageTeams && (
                    <Button variant="primary" size="sm">
                      Editar Equipo
                    </Button>
                  )}
                  {canAssignTasks && (
                    <Button variant="outline" size="sm">
                      Asignar Tareas
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Ver Rendimiento
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedTeam(null)}
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