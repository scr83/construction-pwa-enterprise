'use client'

import { Dashboard } from '@/components/pages/Dashboard'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useMemo } from 'react'
import { teamsApi, type DashboardKPIs, type Team } from '@/lib/api/teams'

// Real KPI calculations helper functions
const calculateKPIs = {
  // Team productivity calculations
  getOverallProductivity: (teams: Team[]): number => {
    if (!teams.length) return 0
    const totalProductivity = teams.reduce((sum, team) => 
      sum + (team.currentMetrics?.productivity || 0), 0)
    return Math.round(totalProductivity / teams.length)
  },
  
  // Team utilization rate
  getTeamUtilization: (teams: Team[]): number => {
    if (!teams.length) return 0
    const activeTeams = teams.filter(t => t.status === 'active').length
    return Math.round((activeTeams / teams.length) * 100)
  },
  
  // Quality score average
  getQualityScore: (teams: Team[]): number => {
    if (!teams.length) return 0
    const totalQuality = teams.reduce((sum, team) => 
      sum + (team.currentMetrics?.qualityScore || 0), 0)
    return Math.round(totalQuality / teams.length)
  },
  
  // Safety calculation
  getSafetyScore: (teams: Team[]): number => {
    if (!teams.length) return 100
    const totalIncidents = teams.reduce((sum, team) => 
      sum + (team.currentMetrics?.safetyIncidents || 0), 0)
    // Higher score for fewer incidents
    return Math.max(0, 100 - (totalIncidents * 5))
  },
  
  // Tasks completion rate
  getTasksCompleted: (teams: Team[]): number => {
    return teams.reduce((sum, team) => 
      sum + (team.currentMetrics?.tasksCompleted || 0), 0)
  },
  
  // Daily efficiency calculation
  getDailyEfficiency: (teams: Team[]): number => {
    if (!teams.length) return 0
    const avgProductivity = calculateKPIs.getOverallProductivity(teams)
    const utilizationRate = calculateKPIs.getTeamUtilization(teams)
    return Math.round((avgProductivity * utilizationRate) / 100)
  },
  
  // Attendance rate
  getAttendanceRate: (teams: Team[]): number => {
    if (!teams.length) return 0
    const totalAttendance = teams.reduce((sum, team) => 
      sum + (team.currentMetrics?.attendanceRate || 0), 0)
    return Math.round(totalAttendance / teams.length)
  }
}

// Enhanced project data with real calculations
const mockUsuario = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  rol: 'jefe_terreno' as const,
  avatar: '',
  empresa: 'ConstructorPro',
  proyectosAsignados: ['proj-1', 'proj-2'],
  permisos: ['ver_dashboard', 'gestionar_proyectos']
}

// Enhanced project data with realistic construction metrics
const generateProjectData = () => [
  {
    id: 'proj-1',
    nombre: 'Edificio Las Condes',
    codigo: 'RES-001',
    avanceFisico: 75,
    avanceFinanciero: 68,
    presupuestoTotal: 2500000000,
    presupuestoEjecutado: 1700000000,
    fechaInicio: '2024-01-15',
    fechaTermino: '2024-12-15',
    estado: 'estructura' as const,
    ubicacion: {
      direccion: 'Av. Las Condes 1234',
      comuna: 'Las Condes',
      region: 'Metropolitana'
    },
    equipo: {
      jefeTerreno: 'Carlos Silva',
      maestroAlbanil: 'Pedro Morales',
      totalTrabajadores: 25
    },
    calidad: {
      inspeccionesRealizadas: 12,
      inspeccionesPendientes: 3,
      noConformidades: 1,
      cumplimientoNormativa: 95
    },
    materiales: {
      stockCritico: 2,
      pedidosPendientes: 1,
      entregas: 5
    }
  },
  {
    id: 'proj-2',
    nombre: 'Torre Vitacura',
    codigo: 'COM-002',
    avanceFisico: 45,
    avanceFinanciero: 52,
    presupuestoTotal: 4200000000,
    presupuestoEjecutado: 2184000000,
    fechaInicio: '2024-03-01',
    fechaTermino: '2025-06-30',
    estado: 'fundaciones' as const,
    ubicacion: {
      direccion: 'Av. Vitacura 8800',
      comuna: 'Vitacura',
      region: 'Metropolitana'
    },
    equipo: {
      jefeTerreno: 'Miguel Rodriguez',
      maestroAlbanil: 'Jose Martinez',
      totalTrabajadores: 42
    },
    calidad: {
      inspeccionesRealizadas: 8,
      inspeccionesPendientes: 5,
      noConformidades: 3,
      cumplimientoNormativa: 88
    },
    materiales: {
      stockCritico: 4,
      pedidosPendientes: 2,
      entregas: 8
    }
  },
  {
    id: 'proj-3',
    nombre: 'Complejo Industrial Pudahuel',
    codigo: 'IND-003',
    avanceFisico: 92,
    avanceFinanciero: 89,
    presupuestoTotal: 1800000000,
    presupuestoEjecutado: 1602000000,
    fechaInicio: '2023-08-15',
    fechaTermino: '2024-11-30',
    estado: 'terminaciones' as const,
    ubicacion: {
      direccion: 'Ruta 68 Km 15',
      comuna: 'Pudahuel',
      region: 'Metropolitana'
    },
    equipo: {
      jefeTerreno: 'Ana Gutierrez',
      maestroAlbanil: 'Luis Fernandez',
      totalTrabajadores: 18
    },
    calidad: {
      inspeccionesRealizadas: 24,
      inspeccionesPendientes: 1,
      noConformidades: 0,
      cumplimientoNormativa: 98
    },
    materiales: {
      stockCritico: 0,
      pedidosPendientes: 0,
      entregas: 3
    }
  }
]

// Calculate dynamic KPIs based on project data
const calculateProjectKPIs = (projects: any[]) => {
  const activeProjects = projects.filter(p => !['completado', 'suspendido', 'cancelado'].includes(p.estado))
  const totalBudget = projects.reduce((sum, p) => sum + p.presupuestoTotal, 0)
  const totalExecuted = projects.reduce((sum, p) => sum + p.presupuestoEjecutado, 0)
  const avgProgress = projects.reduce((sum, p) => sum + p.avanceFisico, 0) / projects.length
  const totalWorkers = projects.reduce((sum, p) => sum + p.equipo.totalTrabajadores, 0)
  const totalInspections = projects.reduce((sum, p) => sum + p.calidad.inspeccionesPendientes, 0)
  const totalNonCompliance = projects.reduce((sum, p) => sum + p.calidad.noConformidades, 0)
  const avgCompliance = projects.reduce((sum, p) => sum + p.calidad.cumplimientoNormativa, 0) / projects.length
  const criticalStock = projects.reduce((sum, p) => sum + p.materiales.stockCritico, 0)
  
  return {
    activeProjects: activeProjects.length,
    totalProjects: projects.length,
    totalBudget,
    totalExecuted,
    budgetUtilization: (totalExecuted / totalBudget) * 100,
    avgProgress: Math.round(avgProgress),
    totalWorkers,
    totalInspections,
    totalNonCompliance,
    avgCompliance: Math.round(avgCompliance),
    criticalStock,
    onTimeProjects: projects.filter(p => {
      const today = new Date()
      const endDate = new Date(p.fechaTermino)
      const progress = p.avanceFisico
      const timeElapsed = (today.getTime() - new Date(p.fechaInicio).getTime()) / (endDate.getTime() - new Date(p.fechaInicio).getTime())
      return progress >= (timeElapsed * 100)
    }).length
  }
}

const mockNotificaciones = [
  {
    id: 'notif-1',
    tipo: 'importante' as const,
    titulo: 'Inspección Programada',
    mensaje: 'Inspección estructural en Edificio Las Condes',
    fechaCreacion: new Date().toISOString(),
    leida: false
  }
]

const mockAccionesRapidas = [
  {
    id: 'accion-1',
    etiqueta: 'Nueva Tarea',
    icono: '📝',
    descripcion: 'Registrar nueva actividad',
    disponible: true,
    onClick: () => console.log('Nueva tarea'),
    roles: ['jefe_terreno' as const]
  }
]

export default function DashboardPage() {
  const { data: session } = useSession()
  
  // Real teams data state
  const [teams, setTeams] = useState<Team[]>([])
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [teamsError, setTeamsError] = useState<string | null>(null)
  
  // Customer-requested productivity data state
  const [productivityKPIs, setProductivityKPIs] = useState<DashboardKPIs | null>(null)
  const [productivityLoading, setProductivityLoading] = useState(true)
  const [productivityError, setProductivityError] = useState<string | null>(null)
  
  // Generate project data
  const mockProyectos = useMemo(() => generateProjectData(), [])
  
  // Map NextAuth role to dashboard role format  
  const role = session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno'
  
  // Personalizar datos según rol del usuario autenticado
  const usuario = {
    ...mockUsuario,
    id: session?.user.id || 'user-1',
    nombre: session?.user.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
  }

  // Load real teams data
  useEffect(() => {
    const loadTeamsData = async () => {
      if (!session?.user) return
      
      try {
        setTeamsError(null)
        const response = await teamsApi.getTeams()
        
        if (response.success && response.data) {
          setTeams(response.data.teams)
        } else {
          setTeamsError(response.error || 'Error cargando equipos')
        }
      } catch (error) {
        setTeamsError('Error de conexión')
      } finally {
        setTeamsLoading(false)
      }
    }

    loadTeamsData()
  }, [session])
  
  // Load real productivity data - customer's #1 requested feature
  useEffect(() => {
    const loadProductivityData = async () => {
      if (!session?.user) return
      
      try {
        setProductivityError(null)
        const response = await teamsApi.getDashboardKPIs()
        
        if (response.success && response.data) {
          setProductivityKPIs(response.data.kpis)
        } else {
          setProductivityError(response.error || 'Error cargando métricas de productividad')
        }
      } catch (error) {
        setProductivityError('Error de conexión')
      } finally {
        setProductivityLoading(false)
      }
    }

    loadProductivityData()
  }, [session])

  // Calculate comprehensive KPIs using real data
  const projectKPIs = useMemo(() => calculateProjectKPIs(mockProyectos), [mockProyectos])
  const teamKPIs = useMemo(() => ({
    overallProductivity: calculateKPIs.getOverallProductivity(teams),
    teamUtilization: calculateKPIs.getTeamUtilization(teams),
    qualityScore: calculateKPIs.getQualityScore(teams),
    safetyScore: calculateKPIs.getSafetyScore(teams),
    tasksCompleted: calculateKPIs.getTasksCompleted(teams),
    dailyEfficiency: calculateKPIs.getDailyEfficiency(teams),
    attendanceRate: calculateKPIs.getAttendanceRate(teams),
    activeTeams: teams.filter(t => t.status === 'active').length,
    totalTeams: teams.length
  }), [teams])
  
  // Real productivity KPIs - customer validated feature  
  const kpisPersonalizados = role === 'gerencia' ? [
    {
      id: 'kpi-productividad-organizacional',
      titulo: 'Productividad Organizacional',
      valor: teamKPIs.overallProductivity,
      tipo: 'porcentaje' as const,
      estado: teamKPIs.overallProductivity >= 90 ? 'bueno' as const : 
              teamKPIs.overallProductivity >= 80 ? 'advertencia' as const : 'critico' as const,
      tendencia: {
        direccion: (productivityKPIs?.weeklyTrend || 0) > 0 ? 'subiendo' as const : 
                   (productivityKPIs?.weeklyTrend || 0) < 0 ? 'bajando' as const : 'estable' as const,
        porcentaje: Math.abs(productivityKPIs?.weeklyTrend || 0),
        periodo: 'vs semana anterior'
      },
      meta: 90,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-presupuesto-utilizacion',
      titulo: 'Utilización Presupuesto',
      valor: Math.round(projectKPIs.budgetUtilization),
      tipo: 'porcentaje' as const,
      estado: projectKPIs.budgetUtilization <= 100 ? 'bueno' as const : 
              projectKPIs.budgetUtilization <= 110 ? 'advertencia' as const : 'critico' as const,
      meta: 95,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-proyectos-en-cronograma',
      titulo: 'Proyectos en Cronograma',
      valor: `${projectKPIs.onTimeProjects} de ${projectKPIs.totalProjects}`,
      tipo: 'texto' as const,
      estado: (projectKPIs.onTimeProjects / projectKPIs.totalProjects) >= 0.8 ? 'bueno' as const : 'advertencia' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-utilizacion-equipos', 
      titulo: 'Utilización de Equipos',
      valor: teamKPIs.teamUtilization,
      tipo: 'porcentaje' as const,
      estado: teamKPIs.teamUtilization >= 85 ? 'bueno' as const : 
              teamKPIs.teamUtilization >= 70 ? 'advertencia' as const : 'critico' as const,
      meta: 85,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-personal-total',
      titulo: 'Personal Total',
      valor: projectKPIs.totalWorkers,
      tipo: 'numero' as const,
      estado: 'info' as const,
      descripcion: `${teamKPIs.activeTeams} equipos activos`,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-seguridad-ejecutivo',
      titulo: 'Rating de Seguridad',
      valor: teamKPIs.safetyScore,
      tipo: 'numero' as const,
      estado: teamKPIs.safetyScore >= 95 ? 'bueno' as const : 
              teamKPIs.safetyScore >= 85 ? 'advertencia' as const : 'critico' as const,
      meta: 95,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-cumplimiento-calidad',
      titulo: 'Cumplimiento Calidad',
      valor: Math.round(projectKPIs.avgCompliance),
      tipo: 'porcentaje' as const,
      estado: projectKPIs.avgCompliance >= 95 ? 'bueno' as const : 
              projectKPIs.avgCompliance >= 85 ? 'advertencia' as const : 'critico' as const,
      meta: 95,
      ultimaActualizacion: new Date().toISOString()
    }
  ] : role === 'jefe_terreno' ? [
    {
      id: 'kpi-productividad-general',
      titulo: 'Productividad General',
      valor: teamKPIs.overallProductivity,
      tipo: 'porcentaje' as const,
      estado: teamKPIs.overallProductivity >= 85 ? 'bueno' as const : 
              teamKPIs.overallProductivity >= 70 ? 'advertencia' as const : 'critico' as const,
      tendencia: {
        direccion: (productivityKPIs?.weeklyTrend || 0) > 0 ? 'subiendo' as const : 
                   (productivityKPIs?.weeklyTrend || 0) < 0 ? 'bajando' as const : 'estable' as const,
        porcentaje: Math.abs(productivityKPIs?.weeklyTrend || 0),
        periodo: 'vs semana anterior'
      },
      meta: 85,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-equipos-activos-terreno',
      titulo: 'Equipos Activos',
      valor: `${teamKPIs.activeTeams} de ${teamKPIs.totalTeams}`,
      tipo: 'texto' as const,
      estado: (teamKPIs.totalTeams > 0 && teamKPIs.activeTeams / teamKPIs.totalTeams >= 0.8) ? 'bueno' as const : 'advertencia' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-tareas-completadas',
      titulo: 'Tareas Completadas Hoy',
      valor: teamKPIs.tasksCompleted,
      tipo: 'numero' as const,
      estado: teamKPIs.tasksCompleted >= 20 ? 'bueno' as const : 
              teamKPIs.tasksCompleted >= 10 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-calidad-promedio',
      titulo: 'Calidad Promedio',
      valor: teamKPIs.qualityScore,
      tipo: 'porcentaje' as const,
      estado: teamKPIs.qualityScore >= 90 ? 'bueno' as const : 
              teamKPIs.qualityScore >= 80 ? 'advertencia' as const : 'critico' as const,
      meta: 90,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-rating-seguridad',
      titulo: 'Rating de Seguridad',
      valor: teamKPIs.safetyScore,
      tipo: 'numero' as const,
      estado: teamKPIs.safetyScore >= 95 ? 'bueno' as const : 
              teamKPIs.safetyScore >= 85 ? 'advertencia' as const : 'critico' as const,
      meta: 95,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-asistencia',
      titulo: 'Asistencia Personal',
      valor: teamKPIs.attendanceRate,
      tipo: 'porcentaje' as const,
      estado: teamKPIs.attendanceRate >= 95 ? 'bueno' as const : 
              teamKPIs.attendanceRate >= 85 ? 'advertencia' as const : 'critico' as const,
      meta: 95,
      ultimaActualizacion: new Date().toISOString()
    }
  ] : role === 'bodega' ? [
    {
      id: 'kpi-stock-critico',
      titulo: 'Materiales Stock Crítico',
      valor: projectKPIs.criticalStock,
      tipo: 'numero' as const,
      estado: projectKPIs.criticalStock === 0 ? 'bueno' as const : 
              projectKPIs.criticalStock <= 3 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-pedidos-pendientes',
      titulo: 'Pedidos Pendientes',
      valor: mockProyectos.reduce((sum, p) => sum + p.materiales.pedidosPendientes, 0),
      tipo: 'numero' as const,
      estado: 'advertencia' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-entregas-semana',
      titulo: 'Entregas Esta Semana',
      valor: mockProyectos.reduce((sum, p) => sum + p.materiales.entregas, 0),
      tipo: 'numero' as const,
      estado: 'bueno' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-proyectos-suministro',
      titulo: 'Proyectos Suministrando',
      valor: projectKPIs.activeProjects,
      tipo: 'numero' as const,
      estado: 'info' as const,
      descripcion: `de ${projectKPIs.totalProjects} totales`,
      ultimaActualizacion: new Date().toISOString()
    }
  ] : role === 'control_calidad' ? [
    {
      id: 'kpi-inspecciones-pendientes',
      titulo: 'Inspecciones Pendientes',
      valor: projectKPIs.totalInspections,
      tipo: 'numero' as const,
      estado: projectKPIs.totalInspections === 0 ? 'bueno' as const : 
              projectKPIs.totalInspections <= 5 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-no-conformidades',
      titulo: 'No Conformidades',
      valor: projectKPIs.totalNonCompliance,
      tipo: 'numero' as const,
      estado: projectKPIs.totalNonCompliance === 0 ? 'bueno' as const : 
              projectKPIs.totalNonCompliance <= 2 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-cumplimiento-normativo',
      titulo: 'Cumplimiento Normativo',
      valor: Math.round(projectKPIs.avgCompliance),
      tipo: 'porcentaje' as const,
      estado: projectKPIs.avgCompliance >= 95 ? 'bueno' as const : 
              projectKPIs.avgCompliance >= 85 ? 'advertencia' as const : 'critico' as const,
      meta: 95,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-inspecciones-realizadas',
      titulo: 'Inspecciones Realizadas',
      valor: mockProyectos.reduce((sum, p) => sum + p.calidad.inspeccionesRealizadas, 0),
      tipo: 'numero' as const,
      estado: 'bueno' as const,
      descripcion: 'Total acumulado',
      ultimaActualizacion: new Date().toISOString()
    }
  ] : [
    {
      id: 'kpi-general-1',
      titulo: 'Proyectos Activos',
      valor: projectKPIs.activeProjects,
      tipo: 'numero' as const,
      estado: 'bueno' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-general-2',
      titulo: 'Avance Promedio',
      valor: projectKPIs.avgProgress,
      tipo: 'porcentaje' as const,
      estado: projectKPIs.avgProgress >= 70 ? 'bueno' as const : 
              projectKPIs.avgProgress >= 50 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    }
  ]

  // Generate smart notifications based on real data
  const generateSmartNotifications = () => {
    const notifications = []
    
    // Critical stock alerts
    if (projectKPIs.criticalStock > 0) {
      notifications.push({
        id: 'notif-stock-critico',
        tipo: 'urgente' as const,
        titulo: 'Stock Crítico Detectado',
        mensaje: `${projectKPIs.criticalStock} materiales en stock crítico requieren atención inmediata`,
        fechaCreacion: new Date().toISOString(),
        leida: false
      })
    }
    
    // Quality issues
    if (projectKPIs.totalNonCompliance > 0) {
      notifications.push({
        id: 'notif-calidad',
        tipo: 'importante' as const,
        titulo: 'No Conformidades Pendientes',
        mensaje: `${projectKPIs.totalNonCompliance} no conformidades requieren resolución`,
        fechaCreacion: new Date().toISOString(),
        leida: false
      })
    }
    
    // Productivity alerts
    if (teamKPIs.overallProductivity < 70) {
      notifications.push({
        id: 'notif-productividad',
        tipo: 'importante' as const,
        titulo: 'Productividad Bajo Objetivo',
        mensaje: `Productividad actual ${teamKPIs.overallProductivity}% está por debajo del objetivo`,
        fechaCreacion: new Date().toISOString(),
        leida: false
      })
    }
    
    // Safety alerts
    if (teamKPIs.safetyScore < 90) {
      notifications.push({
        id: 'notif-seguridad',
        tipo: 'urgente' as const,
        titulo: 'Alerta de Seguridad',
        mensaje: 'Rating de seguridad requiere atención inmediata',
        fechaCreacion: new Date().toISOString(),
        leida: false
      })
    }
    
    // Role-specific notifications
    if (role === 'gerencia') {
      notifications.push({
        id: 'notif-gerencia-1',
        tipo: 'informativa' as const,
        titulo: 'Resumen Ejecutivo Disponible',
        mensaje: `${projectKPIs.totalProjects} proyectos con ${Math.round(projectKPIs.budgetUtilization)}% utilización presupuestaria`,
        fechaCreacion: new Date().toISOString(),
        leida: false
      })
    }
    
    return notifications
  }
  
  // Dynamic notifications based on real data
  const notificacionesPersonalizadas = generateSmartNotifications()


  // Loading state
  if (teamsLoading || productivityLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando métricas de productividad...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <Dashboard 
        usuario={usuario}
        proyectos={mockProyectos}
        kpis={kpisPersonalizados}
        notificaciones={notificacionesPersonalizadas}
        accionesRapidas={mockAccionesRapidas}
        isLoading={teamsLoading || productivityLoading}
        error={teamsError || productivityError}
        ultimaActualizacion={new Date().toISOString()}
      />
    </ProtectedLayout>
  )
}
