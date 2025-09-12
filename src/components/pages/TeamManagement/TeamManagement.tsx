'use client'

export function TeamManagement({ usuario, equipos = [], onTeamCreate, onTeamUpdate, onMemberAdd, onMemberUpdate }) {
  // Safety check for props
  const safeEquipos = Array.isArray(equipos) ? equipos : []
  const safeUsuario = usuario || { rol: 'jefe_terreno', nombre: 'Usuario' }

  // Calculate total team members across all teams
  const totalMembers = safeEquipos.reduce((total, team) => total + (team.members?.length || 0), 0)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Equipos
        </h1>
        <p className="text-gray-600 mb-4">
          Administración de cuadrillas y personal de construcción - {safeUsuario.rol?.replace('_', ' ') || 'Usuario'}
        </p>
        
        {/* Team KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Cuadrillas</h3>
            <p className="text-2xl font-bold text-gray-900">{safeEquipos.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Personal Total</h3>
            <p className="text-2xl font-bold text-blue-600">{totalMembers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Equipos Activos</h3>
            <p className="text-2xl font-bold text-green-600">
              {safeEquipos.filter(e => e.status === 'activo').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">En Descanso</h3>
            <p className="text-2xl font-bold text-orange-600">
              {safeEquipos.filter(e => e.status === 'en_descanso').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Productividad Avg</h3>
            <p className="text-2xl font-bold text-purple-600">
              {safeEquipos.length > 0 ? Math.round(safeEquipos.reduce((sum, e) => sum + (e.productivity || 0), 0) / safeEquipos.length) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Teams list */}
      <div className="space-y-6">
        {safeEquipos.length > 0 ? (
          safeEquipos.map(equipo => (
            <div key={equipo.id} className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
              {/* Team Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {equipo.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${equipo.status === 'activo' ? 'bg-green-100 text-green-800' :
                        equipo.status === 'en_descanso' ? 'bg-orange-100 text-orange-800' :
                        equipo.status === 'inactivo' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {equipo.status === 'activo' ? '🟢 Activo' :
                       equipo.status === 'en_descanso' ? '🟡 En Descanso' :
                       equipo.status === 'inactivo' ? '🔴 Inactivo' :
                       equipo.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${equipo.department === 'terreno' ? 'bg-blue-100 text-blue-800' :
                        equipo.department === 'instalaciones' ? 'bg-purple-100 text-purple-800' :
                        equipo.department === 'calidad' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {equipo.department === 'terreno' ? '🏗️ Terreno' :
                       equipo.department === 'instalaciones' ? '⚡ Instalaciones' :
                       equipo.department === 'calidad' ? '🛡️ Calidad' :
                       equipo.department}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Supervisor:</strong> {equipo.supervisor}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Proyecto:</strong> {equipo.currentProject} - {equipo.currentLocation}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {equipo.productivity || 0}%
                  </div>
                  <div className="text-sm text-gray-500">Productividad</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, equipo.productivity || 0)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Team Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {equipo.performance?.tasksCompleted || 0}
                  </div>
                  <div className="text-xs text-gray-500">Tareas Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {equipo.performance?.qualityScore || 0}%
                  </div>
                  <div className="text-xs text-gray-500">Calidad</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {equipo.performance?.attendance || 0}%
                  </div>
                  <div className="text-xs text-gray-500">Asistencia</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {equipo.safetyRecord?.daysWithoutIncidents || 0}
                  </div>
                  <div className="text-xs text-gray-500">Días sin Incidentes</div>
                </div>
              </div>

              {/* Work Schedule and Assignments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">📅 Horario de Trabajo</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {equipo.workSchedule?.startTime} - {equipo.workSchedule?.endTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    {equipo.workSchedule?.workDays?.join(', ') || 'No definido'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">🔧 Asignaciones Actuales</h4>
                  <div className="flex flex-wrap gap-1">
                    {equipo.assignments?.map((assignment, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {assignment}
                      </span>
                    )) || <span className="text-sm text-gray-500">Sin asignaciones</span>}
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    👥 Miembros del Equipo ({equipo.members?.length || 0})
                  </h4>
                  {(safeUsuario.rol === 'gerencia' || safeUsuario.rol === 'jefe_terreno') && onMemberAdd && (
                    <button
                      onClick={() => onMemberAdd(equipo.id, {
                        nombre: 'Nuevo Trabajador',
                        cargo: 'Ayudante',
                        especialidad: 'ayudante'
                      })}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      ➕ Agregar Miembro
                    </button>
                  )}
                </div>

                {equipo.members && equipo.members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {equipo.members.map(member => (
                      <div key={member.id} className="p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm">
                              {member.nombre}
                            </h5>
                            <p className="text-xs text-gray-600 mb-1">
                              {member.cargo} - {member.especialidad === 'albañil' ? 'Albañil' :
                                                member.especialidad === 'fierrero' ? 'Fierrero' :
                                                member.especialidad === 'electricista' ? 'Electricista' :
                                                member.especialidad === 'gasfiter' ? 'Gasfiter' :
                                                member.especialidad === 'jefe_equipo' ? 'Jefe de Equipo' :
                                                member.especialidad === 'operador' ? 'Operador' :
                                                'Ayudante'}
                            </p>
                            <p className="text-xs text-gray-500 mb-1">
                              RUT: {member.rut}
                            </p>
                            {member.telefono && (
                              <p className="text-xs text-gray-500 mb-1">
                                📞 {member.telefono}
                              </p>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${member.estado === 'activo' ? 'bg-green-100 text-green-800' :
                              member.estado === 'licencia' ? 'bg-yellow-100 text-yellow-800' :
                              member.estado === 'vacaciones' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'}`}>
                            {member.estado === 'activo' ? '✓' :
                             member.estado === 'licencia' ? '🏥' :
                             member.estado === 'vacaciones' ? '🏖️' :
                             '❌'}
                          </span>
                        </div>
                        
                        {member.certificaciones && member.certificaciones.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Certificaciones:</p>
                            <div className="flex flex-wrap gap-1">
                              {member.certificaciones.slice(0, 2).map((cert, index) => (
                                <span key={index} className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                  🏅 {cert}
                                </span>
                              ))}
                              {member.certificaciones.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{member.certificaciones.length - 2} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {member.contratistaEmpresa && (
                          <p className="text-xs text-gray-500 mt-2">
                            🏢 {member.contratistaEmpresa}
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

              {/* Equipment and Tools */}
              {equipo.equipment && equipo.equipment.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">🔨 Equipos y Herramientas</h4>
                  <div className="flex flex-wrap gap-2">
                    {equipo.equipment.map((item, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                        🛠️ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {equipo.notes && (
                <p className="text-sm text-gray-700 mt-3 pt-3 border-t">
                  📝 {equipo.notes}
                </p>
              )}

              {/* Action buttons based on role */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                {safeUsuario.rol === 'jefe_terreno' && equipo.status === 'en_descanso' && (
                  <button
                    onClick={() => onTeamUpdate && onTeamUpdate(equipo.id, { status: 'activo' })}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    ✅ Activar Equipo
                  </button>
                )}
                
                {safeUsuario.rol === 'jefe_terreno' && equipo.status === 'activo' && (
                  <button
                    onClick={() => onTeamUpdate && onTeamUpdate(equipo.id, { status: 'en_descanso' })}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                  >
                    ⏸️ Pausar Trabajo
                  </button>
                )}
                
                {(safeUsuario.rol === 'gerencia' || safeUsuario.rol === 'jefe_terreno') && (
                  <button
                    onClick={() => console.log('Asignar nueva tarea:', equipo.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    📋 Asignar Tarea
                  </button>
                )}
                
                {safeUsuario.rol === 'gerencia' && (
                  <button
                    onClick={() => console.log('Ver reporte detallado:', equipo.id)}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                  >
                    📊 Ver Reporte
                  </button>
                )}
                
                {equipo.productivity < 80 && safeUsuario.rol === 'jefe_terreno' && (
                  <button
                    onClick={() => console.log('Plan mejora productividad:', equipo.id)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                  >
                    ⚡ Mejorar Productividad
                  </button>
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
              No hay equipos asignados
            </h3>
            <p className="text-gray-600">
              Los equipos de trabajo aparecerán aquí cuando sean creados
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Rol actual: {safeUsuario.rol?.replace('_', ' ') || 'Usuario'}
            </p>
          </div>
        )}
      </div>

      {/* Add new team button for allowed roles */}
      {(safeUsuario.rol === 'gerencia' || safeUsuario.rol === 'jefe_terreno') && onTeamCreate && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onTeamCreate({
              name: 'Nuevo Equipo de Construcción',
              department: 'terreno',
              supervisor: safeUsuario.nombre,
              status: 'activo',
              productivity: 85
            })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            👥 Crear Nuevo Equipo
          </button>
        </div>
      )}
    </div>
  )
}