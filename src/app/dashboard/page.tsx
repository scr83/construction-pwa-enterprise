'use client'

import { Dashboard } from '@/components/pages/Dashboard'
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout'
import { useSession } from 'next-auth/react'

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
  
  // Map NextAuth role to dashboard role format  
  const role = session?.user.role === 'EXECUTIVE' ? 'gerencia' : 'jefe_terreno'
  
  // Personalizar datos según rol del usuario autenticado
  const usuario = {
    ...mockUsuario,
    id: session?.user.id || 'user-1',
    nombre: session?.user.name || 'Usuario',
    rol: role as 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
  }

  // KPIs personalizados por rol
  const kpisPersonalizados = role === 'gerencia' ? [
    {
      id: 'kpi-gerencia-1',
      titulo: 'ROI Proyectos',
      valor: 15.2,
      tipo: 'porcentaje' as const,
      estado: 'bueno' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-gerencia-2', 
      titulo: 'Margen EBITDA',
      valor: 18.5,
      tipo: 'porcentaje' as const,
      estado: 'excelente' as const,
      ultimaActualizacion: new Date().toISOString()
    }
  ] : role === 'jefe_terreno' ? [
    {
      id: 'kpi-terreno-1',
      titulo: 'Tareas Hoy',
      valor: 12,
      tipo: 'numero' as const,
      estado: 'advertencia' as const,
      ultimaActualizacion: new Date().toISOString()
    },
    {
      id: 'kpi-terreno-2',
      titulo: 'Trabajadores Activos',
      valor: 25,
      tipo: 'numero' as const,
      estado: 'bueno' as const,
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
