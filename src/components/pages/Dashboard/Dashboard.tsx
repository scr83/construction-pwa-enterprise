'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { signOut } from 'next-auth/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Importar todos los componentes necesarios
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { MobileTemplate } from '@/components/templates/MobileTemplate'
import { DashboardGrid } from '@/components/organisms/DashboardGrid'
import { NotificationCard } from '@/components/molecules/NotificationCard'
// import { ChartDisplay } from '@/components/molecules/ChartDisplay' // Component not found
import { MetricDisplay } from '@/components/molecules/MetricDisplay'
import { TaskRegistrationForm } from '@/components/organisms/TaskRegistrationForm'
import { MaterialTracker } from '@/components/organisms/MaterialTracker'
import { TeamAssignment } from '@/components/organisms/TeamAssignment'
import { ReportViewer } from '@/components/organisms/ReportViewer'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'

// Definir variantes del componente
export const dashboardVariants = cva(
  "min-h-screen bg-gray-50",
  {
    variants: {
      mode: {
        desktop: "lg:grid lg:grid-cols-12 lg:gap-6",
        mobile: "flex flex-col",
        hybrid: "responsive-dashboard"
      },
      density: {
        compact: "space-y-2 text-sm",
        comfortable: "space-y-4 text-base",
        spacious: "space-y-6 text-lg"
      },
      role: {
        gerencia: "executive-dashboard",
        jefe_terreno: "field-dashboard", 
        bodega: "warehouse-dashboard",
        oficina_tecnica: "technical-dashboard",
        control_calidad: "quality-dashboard"
      }
    },
    defaultVariants: {
      mode: "hybrid",
      density: "comfortable",
      role: "jefe_terreno"
    }
  }
)

// Interfaces TypeScript para construcción chilena/latinoamericana
export interface ProjectMetrics {
  id: string
  nombre: string
  codigo: string
  avanceFisico: number
  avanceFinanciero: number
  presupuestoTotal: number
  presupuestoEjecutado: number
  fechaInicio: string
  fechaTermino: string
  estado: 'planificacion' | 'excavacion' | 'fundaciones' | 'estructura' | 'albanileria' | 'instalaciones' | 'terminaciones' | 'entrega'
  ubicacion: {
    direccion: string
    comuna: string
    region: string
    coordenadas?: { lat: number; lng: number }
  }
  equipo: {
    jefeTerreno: string
    maestroAlbanil: string
    totalTrabajadores: number
  }
  calidad: {
    inspeccionesRealizadas: number
    inspeccionesPendientes: number
    noConformidades: number
    cumplimientoNormativa: number
  }
  materiales: {
    stockCritico: number
    pedidosPendientes: number
    entregas: number
  }
}

export interface DashboardKPI {
  id: string
  titulo: string
  valor: number | string
  tipo: 'numero' | 'moneda' | 'porcentaje' | 'texto'
  tendencia?: {
    direccion: 'subiendo' | 'bajando' | 'estable'
    porcentaje: number
    periodo: string
  }
  estado: 'bueno' | 'advertencia' | 'critico' | 'info'
  meta?: number
  descripcion?: string
  ultimaActualizacion: string
}

export interface NotificacionObra {
  id: string
  tipo: 'urgente' | 'importante' | 'informativa' | 'sistema'
  titulo: string
  mensaje: string
  proyecto?: string
  responsable?: string
  fechaCreacion: string
  fechaVencimiento?: string
  leida: boolean
  acciones?: Array<{
    etiqueta: string
    accion: () => void
    tipo: 'primary' | 'secondary' | 'danger'
  }>
}

export interface AccionRapida {
  id: string
  etiqueta: string
  icono: string
  descripcion: string
  disponible: boolean
  requiereCamara?: boolean
  requiereUbicacion?: boolean
  onClick: () => void
  roles: Array<'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'>
}

export interface ConfiguracionDashboard {
  actualizacionAutomatica: boolean
  intervaloActualizacion: number // segundos
  notificacionesPush: boolean
  modoOffline: boolean
  sincronizacionAutomatica: boolean
  alertasTempranas: boolean
}

export interface DashboardProps extends VariantProps<typeof dashboardVariants> {
  // Usuario y contexto
  usuario: {
    id: string
    nombre: string
    rol: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
    avatar?: string
    empresa: string
    proyectosAsignados: string[]
    permisos: string[]
  }
  
  // Datos del dashboard
  proyectos: ProjectMetrics[]
  kpis: DashboardKPI[]
  notificaciones: NotificacionObra[]
  accionesRapidas: AccionRapida[]
  
  // Configuración
  configuracion?: ConfiguracionDashboard
  esMobile?: boolean
  modoOffline?: boolean
  
  // Estados
  isLoading?: boolean
  error?: string
  ultimaActualizacion?: string
  
  // Callbacks
  onProyectoSelect?: (proyectoId: string) => void
  onAccionRapida?: (accionId: string) => void
  onNotificacionAction?: (notificacionId: string, accion: string) => void
  onActualizar?: () => Promise<void>
  onConfiguracion?: () => void
  onNavegacion?: (ruta: string) => void
  
  // PWA y Mobile
  onInstalarPWA?: () => void
  onCapturaFoto?: (archivo: File) => void
  onCapturaUbicacion?: (coordenadas: GeolocationCoordinates) => void
  
  // Personalización
  className?: string
}

export function Dashboard({
  usuario,
  proyectos = [],
  kpis = [],
  notificaciones = [],
  accionesRapidas = [],
  configuracion = {
    actualizacionAutomatica: true,
    intervaloActualizacion: 30,
    notificacionesPush: true,
    modoOffline: true,
    sincronizacionAutomatica: true,
    alertasTempranas: true
  },
  esMobile = false,
  modoOffline = false,
  isLoading = false,
  error,
  ultimaActualizacion,
  onProyectoSelect,
  onAccionRapida,
  onNotificacionAction,
  onActualizar,
  onConfiguracion,
  onNavegacion,
  onInstalarPWA,
  onCapturaFoto,
  onCapturaUbicacion,
  mode,
  density,
  role = usuario.rol,
  className,
  ...props
}: DashboardProps) {
  // Estados locales
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string | null>(null)
  const [vistaActiva, setVistaActiva] = useState<'resumen' | 'proyectos' | 'tareas' | 'calidad' | 'materiales'>('resumen')
  const [notificacionesFiltradas, setNotificacionesFiltradas] = useState(notificaciones)
  const [actualizando, setActualizando] = useState(false)
  const [mostrarFormTarea, setMostrarFormTarea] = useState(false)
  const [mostrarMaterialTracker, setMostrarMaterialTracker] = useState(false)
  const [mostrarTeamAssignment, setMostrarTeamAssignment] = useState(false)

  // Efectos
  useEffect(() => {
    // Actualización automática
    if (configuracion.actualizacionAutomatica && !modoOffline) {
      const intervalo = setInterval(() => {
        handleActualizar()
      }, configuracion.intervaloActualizacion * 1000)

      return () => clearInterval(intervalo)
    }
  }, [configuracion.actualizacionAutomatica, configuracion.intervaloActualizacion, modoOffline])

  useEffect(() => {
    // Filtrar notificaciones por rol y proyecto
    const filtradas = notificaciones.filter(notif => {
      if (!notif.proyecto) return true
      return usuario.proyectosAsignados.includes(notif.proyecto)
    })
    setNotificacionesFiltradas(filtradas)
  }, [notificaciones, usuario.proyectosAsignados])

  // Cálculos derivados por rol
  const dashboardData = useMemo(() => {
    const proyectosActivos = proyectos.filter(p => 
      ['estructura', 'albanileria', 'instalaciones'].includes(p.estado)
    )
    const proyectosAsignados = proyectos.filter(p => 
      usuario.proyectosAsignados.includes(p.id)
    )

    switch (usuario.rol) {
      case 'gerencia':
        return {
          titulo: 'Dashboard Ejecutivo',
          subtitulo: `${proyectos.length} proyectos en cartera`,
          kpisPrincipales: [
            {
              id: 'ingresos-mes',
              titulo: 'Ingresos del Mes',
              valor: proyectos.reduce((acc, p) => acc + (p.presupuestoEjecutado * 0.1), 0),
              tipo: 'moneda' as const,
              estado: 'bueno' as const,
              tendencia: { direccion: 'subiendo' as const, porcentaje: 12.5, periodo: 'vs mes anterior' },
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'margen-utilidad',
              titulo: 'Margen de Utilidad',
              valor: 18.7,
              tipo: 'porcentaje' as const,
              estado: 'bueno' as const,
              meta: 15,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'proyectos-activos',
              titulo: 'Proyectos Activos',
              valor: proyectosActivos.length,
              tipo: 'numero' as const,
              estado: 'info' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'eficiencia-operacional',
              titulo: 'Eficiencia Operacional',
              valor: 94.2,
              tipo: 'porcentaje' as const,
              estado: 'bueno' as const,
              meta: 90,
              ultimaActualizacion: new Date().toISOString()
            }
          ],
          vistasDisponibles: ['resumen', 'proyectos', 'financiero', 'equipos']
        }

      case 'jefe_terreno':
        const tareasHoy = proyectosAsignados.reduce((acc, p) => acc + p.calidad.inspeccionesPendientes, 0)
        return {
          titulo: 'Control de Terreno',
          subtitulo: `${proyectosAsignados.length} proyectos asignados`,
          kpisPrincipales: [
            {
              id: 'tareas-hoy',
              titulo: 'Tareas de Hoy',
              valor: tareasHoy,
              tipo: 'numero' as const,
              estado: tareasHoy > 10 ? 'advertencia' as const : 'bueno' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'avance-semanal',
              titulo: 'Avance Semanal',
              valor: proyectosAsignados.reduce((acc, p) => acc + p.avanceFisico, 0) / proyectosAsignados.length || 0,
              tipo: 'porcentaje' as const,
              estado: 'bueno' as const,
              meta: 70,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'trabajadores-activos',
              titulo: 'Trabajadores en Terreno',
              valor: proyectosAsignados.reduce((acc, p) => acc + p.equipo.totalTrabajadores, 0),
              tipo: 'numero' as const,
              estado: 'info' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'incidentes-calidad',
              titulo: 'Incidentes de Calidad',
              valor: proyectosAsignados.reduce((acc, p) => acc + p.calidad.noConformidades, 0),
              tipo: 'numero' as const,
              estado: 'advertencia' as const,
              ultimaActualizacion: new Date().toISOString()
            }
          ],
          vistasDisponibles: ['resumen', 'proyectos', 'tareas', 'equipos', 'calidad']
        }

      case 'bodega':
        const stockCritico = proyectos.reduce((acc, p) => acc + p.materiales.stockCritico, 0)
        return {
          titulo: 'Gestión de Bodega',
          subtitulo: `${proyectos.length} proyectos con materiales`,
          kpisPrincipales: [
            {
              id: 'stock-critico',
              titulo: 'Materiales Stock Crítico',
              valor: stockCritico,
              tipo: 'numero' as const,
              estado: stockCritico > 15 ? 'critico' as const : 'bueno' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'pedidos-pendientes',
              titulo: 'Pedidos Pendientes',
              valor: proyectos.reduce((acc, p) => acc + p.materiales.pedidosPendientes, 0),
              tipo: 'numero' as const,
              estado: 'advertencia' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'entregas-semana',
              titulo: 'Entregas Esta Semana',
              valor: proyectos.reduce((acc, p) => acc + p.materiales.entregas, 0),
              tipo: 'numero' as const,
              estado: 'bueno' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'rotacion-inventario',
              titulo: 'Rotación de Inventario',
              valor: 85.3,
              tipo: 'porcentaje' as const,
              estado: 'bueno' as const,
              meta: 80,
              ultimaActualizacion: new Date().toISOString()
            }
          ],
          vistasDisponibles: ['resumen', 'inventario', 'pedidos', 'proveedores']
        }

      case 'oficina_tecnica':
        return {
          titulo: 'Oficina Técnica',
          subtitulo: 'Planificación y coordinación técnica',
          kpisPrincipales: [
            {
              id: 'planos-revision',
              titulo: 'Planos en Revisión',
              valor: 8,
              tipo: 'numero' as const,
              estado: 'advertencia' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'permisos-tramite',
              titulo: 'Permisos en Trámite',
              valor: 12,
              tipo: 'numero' as const,
              estado: 'info' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'cumplimiento-cronograma',
              titulo: 'Cumplimiento Cronograma',
              valor: 92.8,
              tipo: 'porcentaje' as const,
              estado: 'bueno' as const,
              meta: 90,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'modificaciones-proyecto',
              titulo: 'Modificaciones Pendientes',
              valor: 5,
              tipo: 'numero' as const,
              estado: 'advertencia' as const,
              ultimaActualizacion: new Date().toISOString()
            }
          ],
          vistasDisponibles: ['resumen', 'planificacion', 'documentos', 'cronogramas']
        }

      case 'control_calidad':
        const inspeccionesTotales = proyectos.reduce((acc, p) => acc + p.calidad.inspeccionesRealizadas, 0)
        return {
          titulo: 'Control de Calidad',
          subtitulo: `${inspeccionesTotales} inspecciones realizadas`,
          kpisPrincipales: [
            {
              id: 'inspecciones-pendientes',
              titulo: 'Inspecciones Pendientes',
              valor: proyectos.reduce((acc, p) => acc + p.calidad.inspeccionesPendientes, 0),
              tipo: 'numero' as const,
              estado: 'advertencia' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'no-conformidades',
              titulo: 'No Conformidades',
              valor: proyectos.reduce((acc, p) => acc + p.calidad.noConformidades, 0),
              tipo: 'numero' as const,
              estado: 'critico' as const,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'cumplimiento-normativa',
              titulo: 'Cumplimiento Normativo',
              valor: proyectos.reduce((acc, p) => acc + p.calidad.cumplimientoNormativa, 0) / proyectos.length || 0,
              tipo: 'porcentaje' as const,
              estado: 'bueno' as const,
              meta: 95,
              ultimaActualizacion: new Date().toISOString()
            },
            {
              id: 'certificaciones-vigentes',
              titulo: 'Certificaciones Vigentes',
              valor: 28,
              tipo: 'numero' as const,
              estado: 'bueno' as const,
              ultimaActualizacion: new Date().toISOString()
            }
          ],
          vistasDisponibles: ['resumen', 'inspecciones', 'certificaciones', 'reportes']
        }

      default:
        return {
          titulo: 'Dashboard',
          subtitulo: '',
          kpisPrincipales: [],
          vistasDisponibles: ['resumen']
        }
    }
  }, [usuario.rol, proyectos, usuario.proyectosAsignados])

  // Handlers
  const handleActualizar = useCallback(async () => {
    setActualizando(true)
    try {
      await onActualizar?.()
    } finally {
      setActualizando(false)
    }
  }, [onActualizar])

  const handleAccionRapida = useCallback((accionId: string) => {
    const accion = accionesRapidas.find(a => a.id === accionId)
    if (!accion?.disponible) return

    switch (accionId) {
      case 'nueva-tarea':
        setMostrarFormTarea(true)
        break
      case 'revisar-materiales':
        setMostrarMaterialTracker(true)
        break
      case 'asignar-equipo':
        setMostrarTeamAssignment(true)
        break
      case 'tomar-foto':
        if (accion.requiereCamara) {
          // Activar cámara
          navigator.mediaDevices?.getUserMedia({ video: true })
            .then(stream => {
              // Lógica de captura de foto
              console.log('Cámara activada para inspección')
            })
            .catch(err => console.error('Error accediendo a cámara:', err))
        }
        break
      case 'ubicacion-gps':
        if (accion.requiereUbicacion) {
          navigator.geolocation?.getCurrentPosition(
            (position) => {
              onCapturaUbicacion?.(position.coords)
              console.log('Ubicación capturada:', position.coords)
            },
            (error) => console.error('Error obteniendo ubicación:', error)
          )
        }
        break
      default:
        accion.onClick()
    }

    onAccionRapida?.(accionId)
  }, [accionesRapidas, onAccionRapida, onCapturaUbicacion])

  const handleNavegacion = useCallback((vista: string) => {
    setVistaActiva(vista as any)
    onNavegacion?.(vista)
  }, [onNavegacion])

  // Acciones rápidas por rol
  const accionesRapidasPorRol = useMemo(() => {
    const baseAcciones: AccionRapida[] = [
      {
        id: 'actualizar',
        etiqueta: 'Actualizar Datos',
        icono: '🔄',
        descripcion: 'Sincronizar información más reciente',
        disponible: !actualizando,
        onClick: handleActualizar,
        roles: ['gerencia', 'jefe_terreno', 'bodega', 'oficina_tecnica', 'control_calidad']
      }
    ]

    const accionesEspecificas: Record<typeof usuario.rol, AccionRapida[]> = {
      gerencia: [
        {
          id: 'reporte-ejecutivo',
          etiqueta: 'Reporte Ejecutivo',
          icono: '📊',
          descripcion: 'Generar reporte para directorio',
          disponible: true,
          onClick: () => setVistaActiva('proyectos'),
          roles: ['gerencia']
        },
        {
          id: 'aprobar-presupuesto',
          etiqueta: 'Aprobar Presupuestos',
          icono: '✅',
          descripcion: 'Revisar presupuestos pendientes',
          disponible: true,
          onClick: () => console.log('Aprobar presupuestos'),
          roles: ['gerencia']
        }
      ],
      jefe_terreno: [
        {
          id: 'nueva-tarea',
          etiqueta: 'Nueva Tarea',
          icono: '📝',
          descripcion: 'Registrar nueva actividad de obra',
          disponible: true,
          onClick: () => setMostrarFormTarea(true),
          roles: ['jefe_terreno']
        },
        {
          id: 'tomar-foto',
          etiqueta: 'Tomar Foto',
          icono: '📷',
          descripcion: 'Capturar imagen para inspección',
          disponible: true,
          requiereCamara: true,
          onClick: () => console.log('Captura foto'),
          roles: ['jefe_terreno']
        },
        {
          id: 'ubicacion-gps',
          etiqueta: 'Ubicación GPS',
          icono: '📍',
          descripcion: 'Marcar coordenadas actuales',
          disponible: true,
          requiereUbicacion: true,
          onClick: () => console.log('Captura GPS'),
          roles: ['jefe_terreno']
        }
      ],
      bodega: [
        {
          id: 'revisar-materiales',
          etiqueta: 'Revisar Stock',
          icono: '📦',
          descripción: 'Ver estado de inventario',
          disponible: true,
          onClick: () => setMostrarMaterialTracker(true),
          roles: ['bodega']
        },
        {
          id: 'nuevo-pedido',
          etiqueta: 'Nuevo Pedido',
          icono: '🛒',
          descripcion: 'Crear orden de compra',
          disponible: true,
          onClick: () => console.log('Nuevo pedido'),
          roles: ['bodega']
        }
      ],
      oficina_tecnica: [
        {
          id: 'revisar-planos',
          etiqueta: 'Revisar Planos',
          icono: '📐',
          descripcion: 'Verificar documentación técnica',
          disponible: true,
          onClick: () => console.log('Revisar planos'),
          roles: ['oficina_tecnica']
        },
        {
          id: 'cronograma',
          etiqueta: 'Actualizar Cronograma',
          icono: '📅',
          descripcion: 'Modificar planificación',
          disponible: true,
          onClick: () => console.log('Cronograma'),
          roles: ['oficina_tecnica']
        }
      ],
      control_calidad: [
        {
          id: 'nueva-inspeccion',
          etiqueta: 'Nueva Inspección',
          icono: '🔍',
          descripcion: 'Iniciar checklist de calidad',
          disponible: true,
          onClick: () => console.log('Nueva inspección'),
          roles: ['control_calidad']
        },
        {
          id: 'certificar-calidad',
          etiqueta: 'Certificar Calidad',
          icono: '✅',
          descripcion: 'Aprobar partida constructiva',
          disponible: true,
          onClick: () => console.log('Certificar'),
          roles: ['control_calidad']
        }
      ]
    }

    return [
      ...baseAcciones,
      ...accionesEspecificas[usuario.rol]
    ].filter(accion => accion.roles.includes(usuario.rol))
  }, [usuario.rol, actualizando, handleActualizar])

  // Navegación móvil
  const navegacionMobile = useMemo(() => ({
    type: 'bottom' as const,
    position: 'fixed' as const,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '🏠',
        active: vistaActiva === 'resumen',
        onClick: () => handleNavegacion('resumen')
      },
      {
        id: 'proyectos',
        label: 'Proyectos',
        icon: '🏗️',
        active: vistaActiva === 'proyectos',
        onClick: () => handleNavegacion('proyectos'),
        badge: proyectos.filter(p => p.calidad.noConformidades > 0).length || undefined
      },
      {
        id: 'tareas',
        label: usuario.rol === 'bodega' ? 'Stock' : 'Tareas',
        icon: usuario.rol === 'bodega' ? '📦' : '✅',
        active: vistaActiva === 'tareas',
        onClick: () => handleNavegacion('tareas'),
        badge: usuario.rol === 'bodega' 
          ? proyectos.reduce((acc, p) => acc + p.materiales.stockCritico, 0) || undefined
          : proyectos.reduce((acc, p) => acc + p.calidad.inspeccionesPendientes, 0) || undefined
      },
      {
        id: 'reportes',
        label: 'Reportes',
        icon: '📊',
        active: vistaActiva === 'calidad',
        onClick: () => handleNavegacion('calidad')
      },
      {
        id: 'perfil',
        label: 'Perfil',
        icon: '👤',
        onClick: () => handleNavegacion('perfil')
      }
    ]
  }), [vistaActiva, usuario.rol, proyectos, handleNavegacion])

  // Renderizar contenido por vista
  const renderContenidoVista = () => {
    switch (vistaActiva) {
      case 'resumen':
        return (
          <DashboardTemplate
            user={{
              name: usuario.nombre,
              role: usuario.rol,
              avatar: usuario.avatar
            }}
            widgets={[
              {
                id: 'kpis-principales',
                type: 'metrics',
                title: 'Indicadores Principales',
                size: 'large',
                data: dashboardData.kpisPrincipales.map(kpi => ({
                  label: kpi.titulo,
                  value: kpi.valor,
                  type: kpi.tipo,
                  trend: kpi.tendencia ? {
                    direction: kpi.tendencia.direccion === 'subiendo' ? 'up' as const : 
                              kpi.tendencia.direccion === 'bajando' ? 'down' as const : 'stable' as const,
                    percentage: kpi.tendencia.porcentaje,
                    period: kpi.tendencia.periodo
                  } : undefined,
                  status: kpi.estado === 'bueno' ? 'success' as const :
                          kpi.estado === 'advertencia' ? 'warning' as const :
                          kpi.estado === 'critico' ? 'error' as const : 'info' as const
                }))
              },
              {
                id: 'proyectos-activos',
                type: 'list',
                title: 'Proyectos Asignados',
                size: 'medium',
                data: proyectos.filter(p => usuario.proyectosAsignados.includes(p.id)).slice(0, 5).map(p => ({
                  id: p.id,
                  title: p.nombre,
                  subtitle: `${p.estado} - ${p.avanceFisico}% completado`,
                  status: p.avanceFisico >= 90 ? 'success' as const :
                           p.avanceFisico >= 50 ? 'warning' as const : 'error' as const,
                  onClick: () => onProyectoSelect?.(p.id)
                }))
              },
              {
                id: 'notificaciones-importantes',
                type: 'notifications',
                title: 'Notificaciones Importantes',
                size: 'medium',
                data: notificacionesFiltradas.filter(n => n.tipo === 'urgente' || n.tipo === 'importante').slice(0, 3)
              },
              {
                id: 'acciones-rapidas',
                type: 'actions',
                title: 'Acciones Rápidas',
                size: 'small',
                data: accionesRapidasPorRol.slice(0, 4)
              }
            ]}
            notifications={notificacionesFiltradas.map(n => ({
              id: n.id,
              title: n.titulo,
              message: n.mensaje,
              type: n.tipo === 'urgente' ? 'error' as const :
                    n.tipo === 'importante' ? 'warning' as const : 'info' as const,
              timestamp: n.fechaCreacion
            }))}
            quickActions={accionesRapidasPorRol.map(a => ({
              id: a.id,
              label: a.etiqueta,
              icon: a.icono,
              onClick: () => handleAccionRapida(a.id)
            }))}
            onRefresh={handleActualizar}
            onSettingsOpen={onConfiguracion || (() => {
              console.log('🔧 CONFIGURAR clicked')
              // Redirigir a configuración
              window.location.href = '/settings'
            })}
          />
        )

      case 'proyectos':
        return (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Gestión de Proyectos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proyectos.map(proyecto => (
                <Card key={proyecto.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onProyectoSelect?.(proyecto.id)}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold truncate">{proyecto.nombre}</h3>
                    <Badge variant={
                      proyecto.avanceFisico >= 90 ? 'success' :
                      proyecto.avanceFisico >= 50 ? 'warning' : 'destructive'
                    }>
                      {proyecto.estado}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{proyecto.ubicacion.direccion}, {proyecto.ubicacion.comuna}</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Avance Físico</span>
                        <span>{proyecto.avanceFisico}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" 
                             style={{ width: `${proyecto.avanceFisico}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Jefe: {proyecto.equipo.jefeTerreno}</span>
                      <span>{proyecto.equipo.totalTrabajadores} trabajadores</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'tareas':
        if (mostrarFormTarea) {
          return (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Nueva Tarea</h2>
                <Button variant="ghost" onClick={() => setMostrarFormTarea(false)}>✕</Button>
              </div>
              <TaskRegistrationForm
                projects={proyectos.map(p => ({ id: p.id, name: p.nombre, code: p.codigo }))}
                currentUser={{
                  id: usuario.id,
                  name: usuario.nombre,
                  role: usuario.rol
                }}
                onSubmit={(taskData) => {
                  console.log('Nueva tarea:', taskData)
                  setMostrarFormTarea(false)
                }}
                onCancel={() => setMostrarFormTarea(false)}
              />
            </div>
          )
        }

        if (mostrarMaterialTracker) {
          return (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Gestión de Materiales</h2>
                <Button variant="ghost" onClick={() => setMostrarMaterialTracker(false)}>✕</Button>
              </div>
              <MaterialTracker
                projects={proyectos.map(p => ({ id: p.id, name: p.nombre }))}
                role={usuario.rol}
                onInventoryUpdate={(data) => console.log('Inventario actualizado:', data)}
                onPurchaseOrder={(data) => console.log('Orden de compra:', data)}
              />
            </div>
          )
        }

        if (mostrarTeamAssignment) {
          return (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Asignación de Equipos</h2>
                <Button variant="ghost" onClick={() => setMostrarTeamAssignment(false)}>✕</Button>
              </div>
              <TeamAssignment
                projects={proyectos.map(p => ({ id: p.id, name: p.nombre }))}
                role={usuario.rol}
                onAssignmentChange={(data) => console.log('Asignación actualizada:', data)}
                onPerformanceUpdate={(data) => console.log('Rendimiento actualizado:', data)}
              />
            </div>
          )
        }

        return (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {usuario.rol === 'bodega' ? 'Gestión de Stock' : 'Tareas y Actividades'}
              </h2>
              <div className="flex space-x-2">
                {accionesRapidasPorRol.slice(1, 3).map(accion => (
                  <Button 
                    key={accion.id} 
                    size="sm"
                    onClick={() => handleAccionRapida(accion.id)}
                    disabled={!accion.disponible}
                  >
                    {accion.icono} {accion.etiqueta}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proyectos.filter(p => usuario.proyectosAsignados.includes(p.id)).map(proyecto => (
                <Card key={proyecto.id} className="p-4">
                  <h3 className="font-semibold mb-2">{proyecto.nombre}</h3>
                  
                  {usuario.rol === 'bodega' ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Stock Crítico:</span>
                        <Badge variant={proyecto.materiales.stockCritico > 5 ? 'destructive' : 'success'}>
                          {proyecto.materiales.stockCritico} items
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pedidos Pendientes:</span>
                        <span className="text-sm font-medium">{proyecto.materiales.pedidosPendientes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Entregas:</span>
                        <span className="text-sm font-medium">{proyecto.materiales.entregas}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Inspecciones Pendientes:</span>
                        <Badge variant={proyecto.calidad.inspeccionesPendientes > 3 ? 'destructive' : 'secondary'}>
                          {proyecto.calidad.inspeccionesPendientes}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">No Conformidades:</span>
                        <Badge variant={proyecto.calidad.noConformidades > 0 ? 'destructive' : 'success'}>
                          {proyecto.calidad.noConformidades}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cumplimiento:</span>
                        <span className="text-sm font-medium">{proyecto.calidad.cumplimientoNormativa}%</span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )

      case 'calidad':
        return (
          <div className="p-4">
            <ReportViewer
              reportType="quality"
              projects={proyectos.map(p => ({ id: p.id, name: p.nombre }))}
              role={usuario.rol}
              onExport={(data) => console.log('Exportar reporte:', data)}
              onInspectionSchedule={(data) => console.log('Programar inspección:', data)}
            />
          </div>
        )

      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Vista en Desarrollo</h2>
            <p className="text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
          </div>
        )
    }
  }

  // Renderizar según el dispositivo
  if (esMobile) {
    return (
      <MobileTemplate
        title={dashboardData.titulo}
        subtitle={dashboardData.subtitulo}
        navigation={navegacionMobile}
        notifications={notificacionesFiltradas.map(n => ({
          id: n.id,
          title: n.titulo,
          message: n.mensaje,
          type: n.tipo === 'urgente' ? 'error' : n.tipo === 'importante' ? 'warning' : 'info',
          timestamp: n.fechaCreacion,
          actions: n.acciones?.map(a => ({ label: a.etiqueta, action: a.accion }))
        }))}
        onNotificationDismiss={(id) => setNotificacionesFiltradas(prev => 
          prev.map(n => n.id === id ? { ...n, leida: true } : n)
        )}
        onRefresh={handleActualizar}
        isRefreshing={actualizando}
        role={usuario.rol}
        cameraAccess={accionesRapidasPorRol.some(a => a.requiereCamara)}
        locationAccess={accionesRapidasPorRol.some(a => a.requiereUbicacion)}
        onCameraCapture={onCapturaFoto}
        onLocationCapture={onCapturaUbicacion}
        offline={{
          enabled: configuracion.modoOffline,
          strategies: ['cache-first'],
          syncOnReconnect: configuracion.sincronizacionAutomatica
        }}
        connectionStatus={modoOffline ? 'offline' : 'online'}
        className={cn(dashboardVariants({ mode, density, role }), className)}
        {...props}
      >
        {renderContenidoVista()}
      </MobileTemplate>
    )
  }

  // Versión desktop
  return (
    <div className={cn(dashboardVariants({ mode, density, role }), className)} {...props}>
      
      {/* Contenido principal */}
      <div className="col-span-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleActualizar}>Reintentar</Button>
          </div>
        ) : (
          renderContenidoVista()
        )}
      </div>

      {/* Panel de notificaciones fijo */}
      {notificacionesFiltradas.length > 0 && (
        <div className="fixed top-4 right-4 w-80 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Notificaciones</h3>
            {notificacionesFiltradas.slice(0, 3).map(n => (
              <div key={n.id} className="flex items-start space-x-3 p-2 rounded bg-gray-50">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                  n.tipo === 'urgente' ? 'bg-red-500' : 
                  n.tipo === 'importante' ? 'bg-yellow-500' : 'bg-blue-500'
                )}>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{n.titulo}</p>
                  <p className="text-xs text-gray-600 mt-1">{n.mensaje}</p>
                </div>
                <button
                  onClick={() => setNotificacionesFiltradas(prev => 
                    prev.filter(item => item.id !== n.id)
                  )}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer con información de actualización */}
      {ultimaActualizacion && (
        <div className="col-span-full bg-gray-50 border-t px-6 py-2 text-center text-sm text-gray-500">
          Última actualización: {new Date(ultimaActualizacion).toLocaleString('es-CL')}
          {modoOffline && <span className="ml-4 text-orange-600">• Modo Offline</span>}
        </div>
      )}
    </div>
  )
}