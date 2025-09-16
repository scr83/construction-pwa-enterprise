'use client'

import { Dashboard } from '@/components/pages/Dashboard'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { teamsApi, type DashboardKPIs } from '@/lib/api/teams'

// Mock data for demonstration
const mockUsuario = {
  id: 'user-1',
  nombre: 'Juan Pérez',
  rol: 'jefe_terreno' as const,
  avatar: '',
  empresa: 'ConstructorPro',
  proyectosAsignados: ['proj-1', 'proj-2'],
  permisos: ['ver_dashboard', 'gestionar_proyectos']
}

const mockProyectos = [
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
  }
]

const mockKPIs = [
  {
    id: 'kpi-1',
    titulo: 'Proyectos Activos',
    valor: 8,
    tipo: 'numero' as const,
    estado: 'bueno' as const,
    ultimaActualizacion: new Date().toISOString()
  }
]

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
  
  // Customer-requested productivity data state
  const [productivityKPIs, setProductivityKPIs] = useState<DashboardKPIs | null>(null)
  const [productivityLoading, setProductivityLoading] = useState(true)
  const [productivityError, setProductivityError] = useState<string | null>(null)
  
  // Map NextAuth role to dashboard role format  
  const role = session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno'
  
  // Personalizar datos según rol del usuario autenticado
  const usuario = {
    ...mockUsuario,
    id: session?.user.id || 'user-1',
    nombre: session?.user.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
  }

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

  // Real productivity KPIs - customer validated feature
  const kpisPersonalizados = role === 'gerencia' ? [
    {
      id: 'kpi-productividad-organizacional',
      titulo: 'Productividad Organizacional',
      valor: productivityKPIs?.overallProductivity || 0,
      tipo: 'porcentaje' as const,
      estado: (productivityKPIs?.overallProductivity || 0) >= 90 ? 'bueno' as const : 
              (productivityKPIs?.overallProductivity || 0) >= 80 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-utilizacion-equipos', 
      titulo: 'Utilización de Equipos',
      valor: productivityKPIs?.teamUtilization || 0,
      tipo: 'porcentaje' as const,
      estado: (productivityKPIs?.teamUtilization || 0) >= 85 ? 'bueno' as const : 'advertencia' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-equipos-activos',
      titulo: 'Equipos Activos',
      valor: productivityKPIs?.activeTeams || 0,
      tipo: 'numero' as const,
      estado: 'info' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-seguridad-ejecutivo',
      titulo: 'Rating de Seguridad',
      valor: productivityKPIs?.safetyScore || 0,
      tipo: 'numero' as const,
      estado: (productivityKPIs?.safetyScore || 0) >= 95 ? 'bueno' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    }
  ] : role === 'jefe_terreno' ? [
    {
      id: 'kpi-productividad-general',
      titulo: 'Productividad General',
      valor: productivityKPIs?.overallProductivity || 0,
      tipo: 'porcentaje' as const,
      estado: (productivityKPIs?.overallProductivity || 0) >= 85 ? 'bueno' as const : 
              (productivityKPIs?.overallProductivity || 0) >= 70 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-equipos-activos-terreno',
      titulo: 'Equipos Activos',
      valor: `${productivityKPIs?.activeTeams || 0} de ${productivityKPIs?.totalTeams || 0}`,
      tipo: 'texto' as const,
      estado: (productivityKPIs?.totalTeams && productivityKPIs?.activeTeams / productivityKPIs.totalTeams >= 0.8) ? 'bueno' as const : 'advertencia' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-calidad-promedio',
      titulo: 'Calidad Promedio',
      valor: productivityKPIs?.qualityScore || 0,
      tipo: 'porcentaje' as const,
      estado: (productivityKPIs?.qualityScore || 0) >= 90 ? 'bueno' as const : 
              (productivityKPIs?.qualityScore || 0) >= 80 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-dias-sin-incidentes',
      titulo: 'Días sin Incidentes',
      valor: productivityKPIs?.daysWithoutIncidents || 0,
      tipo: 'numero' as const,
      estado: (productivityKPIs?.daysWithoutIncidents || 0) >= 30 ? 'bueno' as const : 
              (productivityKPIs?.daysWithoutIncidents || 0) >= 15 ? 'advertencia' as const : 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    }
  ] : role === 'bodega' ? [
    {
      id: 'kpi-bodega-1',
      titulo: 'Stock Crítico',
      valor: 3,
      tipo: 'numero' as const,
      estado: 'critico' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-bodega-2',
      titulo: 'Entregas Hoy',
      valor: 8,
      tipo: 'numero' as const,
      estado: 'bueno' as const,
      ultimaActualizacion: new Date().toISOString()
    }
  ] : role === 'control_calidad' ? [
    {
      id: 'kpi-calidad-1',
      titulo: 'Inspecciones Pendientes',
      valor: 5,
      tipo: 'numero' as const,
      estado: 'advertencia' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-calidad-2',
      titulo: 'Cumplimiento',
      valor: 94.5,
      tipo: 'porcentaje' as const,
      estado: 'bueno' as const,
      ultimaActualizacion: new Date().toISOString()
    }
  ] : mockKPIs

  // Notificaciones personalizadas por rol
  const notificacionesPersonalizadas = role === 'gerencia' ? [
    {
      id: 'notif-gerencia-1',
      tipo: 'importante' as const,
      titulo: 'Reunión Directorio',
      mensaje: 'Presentación financiera mensual a las 14:00',
      fechaCreacion: new Date().toISOString(),
      leida: false
    }
  ] : role === 'jefe_terreno' ? [
    {
      id: 'notif-terreno-1',
      tipo: 'urgente' as const,
      titulo: 'Retraso en Entregas',
      mensaje: 'Camión con hormigón atrasado 45 min - Edificio Las Condes',
      fechaCreacion: new Date().toISOString(),
      leida: false
    }
  ] : role === 'bodega' ? [
    {
      id: 'notif-bodega-1',
      tipo: 'importante' as const,
      titulo: 'Stock Bajo',
      mensaje: 'Cemento Portland: 2 días de stock restante',
      fechaCreacion: new Date().toISOString(),
      leida: false
    }
  ] : mockNotificaciones

  return (
    <ProtectedLayout>
      <Dashboard 
        usuario={usuario}
        proyectos={mockProyectos}
        kpis={kpisPersonalizados}
        notificaciones={notificacionesPersonalizadas}
        accionesRapidas={mockAccionesRapidas}
      />
    </ProtectedLayout>
  )
}
