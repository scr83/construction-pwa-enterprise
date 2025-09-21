'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Importar todos los componentes necesarios
import { ListTemplate } from '@/components/templates/ListTemplate'
import { FormTemplate } from '@/components/templates/FormTemplate'
import { MobileTemplate } from '@/components/templates/MobileTemplate'
import { TaskRegistrationForm } from '@/components/organisms/TaskRegistrationForm'
import { TeamAssignment } from '@/components/organisms/TeamAssignment'
import { MaterialTracker } from '@/components/organisms/MaterialTracker'
import { ProjectCard } from '@/components/organisms/ProjectCard'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'
import { Input } from '@/components/atoms/Input'

// Helper function to safely check permissions
const hasPermission = (usuario: any, permission: string): boolean => {
  return usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes(permission)
}

// Definir variantes del componente
export const projectManagementVariants = cva(
  "min-h-screen bg-gray-50",
  {
    variants: {
      mode: {
        list: "project-list-view",
        detail: "project-detail-view", 
        create: "project-create-view",
        kanban: "project-kanban-view"
      },
      layout: {
        desktop: "desktop-layout",
        mobile: "mobile-layout",
        tablet: "tablet-layout"
      }
    },
    defaultVariants: {
      mode: "list",
      layout: "desktop"
    }
  }
)

// Interfaces TypeScript para construcción chilena/latinoamericana
export interface Proyecto {
  id: string
  nombre: string
  codigo: string
  descripcion?: string
  tipo: 'residencial' | 'comercial' | 'industrial' | 'institucional' | 'infraestructura'
  estado: 'planificacion' | 'excavacion' | 'fundaciones' | 'estructura' | 'albanileria' | 'instalaciones' | 'terminaciones' | 'entrega' | 'completado' | 'suspendido' | 'cancelado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  
  // Ubicación
  ubicacion: {
    direccion: string
    numero?: string
    comuna: string
    region: string
    codigoPostal?: string
    coordenadas?: { lat: number; lng: number }
    superficieTerreno?: number
    superficieConstruida?: number
  }
  
  // Fechas
  fechas: {
    inicio: string
    terminoProgramado: string
    terminoReal?: string
    creacion: string
    ultimaModificacion: string
  }
  
  // Financiero
  financiero: {
    presupuestoTotal: number
    presupuestoEjecutado: number
    moneda: 'CLP' | 'USD' | 'UF'
    varianzaPresupuestaria: number
    flujoEfectivo: number
    gastosAutorizados: number
  }
  
  // Avance
  avance: {
    fisico: number
    financiero: number
    cronograma: number
    partidasCompletadas: number
    partidasTotales: number
  }
  
  // Equipo
  equipo: {
    jefeProyecto: string
    jefeTerreno: string
    residenteObra?: string
    ingenieroConstruccion?: string
    arquitecto?: string
    totalTrabajadores: number
    subcontratistas: string[]
  }
  
  // Calidad
  calidad: {
    inspeccionesRealizadas: number
    inspeccionesPendientes: number
    noConformidades: number
    observacionesAbiertas: number
    cumplimientoNormativa: number
    certificacionesObtenidas: string[]
  }
  
  // Unidades (para proyectos residenciales/comerciales)
  unidades?: {
    total: number
    completadas: number
    enProceso: number
    vendidas: number
    disponibles: number
    tipos: Array<{
      tipo: string
      cantidad: number
      superficiePromedio: number
      precioPromedio: number
    }>
  }
  
  // Etiquetas y categorización
  etiquetas: string[]
  cliente?: string
  contrato?: string
  permisos: Array<{
    tipo: string
    numero: string
    fechaObtencion: string
    fechaVencimiento?: string
    estado: 'vigente' | 'vencido' | 'tramite'
  }>
  
  // Metadatos
  metadata: {
    creadoPor: string
    modificadoPor: string
    version: string
    archivos: number
    fotos: number
    documentos: number
  }
}

export interface PartidaConstructiva {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  proyectoId: string
  
  // Jerarquía
  partidaPadre?: string
  subPartidas: string[]
  nivel: number
  
  // Estado y avance  
  estado: 'no_iniciada' | 'en_proceso' | 'completada' | 'suspendida' | 'rechazada'
  avance: number
  fechaInicio?: string
  fechaTermino?: string
  fechaProgramada: string
  
  // Recursos
  presupuesto: number
  gastoAcumulado: number
  unidadMedida: string
  cantidadProgramada: number
  cantidadEjecutada: number
  
  // Asignación
  responsable: string
  cuadrilla?: string
  especialidad: string
  
  // Calidad
  requiereInspeccion: boolean
  inspeccionAprobada?: boolean
  observaciones: string[]
  noConformidades: number
  
  // Materiales
  materialesRequeridos: Array<{
    materialId: string
    nombre: string
    cantidad: number
    unidad: string
    asignado: number
    consumido: number
  }>
  
  // Dependencias
  dependencias: string[]
  bloqueadores: string[]
  
  metadata: {
    creadoPor: string
    fechaCreacion: string
    ultimaModificacion: string
  }
}

export interface FiltrosProyecto {
  texto?: string
  estado?: string[]
  tipo?: string[]
  prioridad?: string[]
  region?: string[]
  responsable?: string[]
  rangoFechas?: {
    inicio: string
    fin: string
  }
  rangoPresupuesto?: {
    min: number
    max: number
  }
  avanceMinimo?: number
  soloConProblemas?: boolean
  soloAsignados?: boolean
}

export interface ConfiguracionVista {
  mostrarUnidades: boolean
  mostrarFinanciero: boolean
  mostrarEquipo: boolean
  mostrarCalidad: boolean
  densidad: 'compacta' | 'normal' | 'espaciosa'
  ordenamiento: {
    campo: string
    direccion: 'asc' | 'desc'
  }
  columnas?: string[]
}

export interface ProjectManagementProps extends VariantProps<typeof projectManagementVariants> {
  // Usuario y contexto
  usuario: {
    id: string
    nombre: string
    rol: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
    permisos: string[]
    proyectosAsignados: string[]
  }
  
  // Datos
  proyectos: Proyecto[]
  partidasConstructivas: PartidaConstructiva[]
  
  // Configuración
  configuracion: ConfiguracionVista
  esMobile?: boolean
  
  // Estados
  isLoading?: boolean
  error?: string
  
  // Filtros y búsqueda
  filtros?: FiltrosProyecto
  
  // Callbacks principales
  onProyectoCrear?: (proyecto: Omit<Proyecto, 'id' | 'metadata'>) => Promise<void>
  onProyectoActualizar?: (id: string, proyecto: Partial<Proyecto>) => Promise<void>
  onProyectoEliminar?: (id: string) => Promise<void>
  onProyectoSelect?: (proyecto: Proyecto) => void
  
  // Callbacks de partidas
  onPartidaCrear?: (partida: Omit<PartidaConstructiva, 'id' | 'metadata'>) => Promise<void>
  onPartidaActualizar?: (id: string, partida: Partial<PartidaConstructiva>) => Promise<void>
  onPartidaEliminar?: (id: string) => Promise<void>
  
  // Callbacks de workflow
  onCambiarEstado?: (proyectoId: string, nuevoEstado: Proyecto['estado']) => Promise<void>
  onAsignarEquipo?: (proyectoId: string, equipoData: any) => Promise<void>
  onActualizarAvance?: (proyectoId: string, avanceData: any) => Promise<void>
  
  // Callbacks de UI
  onFiltrosChange?: (filtros: FiltrosProyecto) => void
  onConfiguracionChange?: (configuracion: ConfiguracionVista) => void
  onExportar?: (proyectos: Proyecto[], formato: 'excel' | 'pdf' | 'csv') => void
  
  // Personalización
  className?: string
}

export function ProjectManagement({
  usuario,
  proyectos = [],
  partidasConstructivas = [],
  configuracion,
  esMobile = false,
  isLoading = false,
  error,
  filtros = {},
  onProyectoCrear,
  onProyectoActualizar,
  onProyectoEliminar,
  onProyectoSelect,
  onPartidaCrear,
  onPartidaActualizar,
  onPartidaEliminar,
  onCambiarEstado,
  onAsignarEquipo,
  onActualizarAvance,
  onFiltrosChange,
  onConfiguracionChange,
  onExportar,
  mode = "list",
  layout,
  className,
  ...props
}: ProjectManagementProps) {
  // Estados locales
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'tarjetas' | 'kanban' | 'calendario'>('tarjetas')
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null)
  const [modoEdicion, setModoEdicion] = useState<'crear' | 'editar' | null>(null)
  const [mostrarFormPartida, setMostrarFormPartida] = useState(false)
  const [mostrarTeamAssignment, setMostrarTeamAssignment] = useState(false)
  const [mostrarMaterialTracker, setMostrarMaterialTracker] = useState(false)
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosProyecto>(filtros)
  const [seleccionMultiple, setSeleccionMultiple] = useState<string[]>([])

  // Proyectos filtrados y procesados
  const proyectosFiltrados = useMemo(() => {
    let resultado = proyectos

    // Filtrar por permisos de usuario
    if (!hasPermission(usuario, 'ver_todos_proyectos')) {
      resultado = resultado.filter(p => usuario?.proyectosAsignados?.includes?.(p.id))
    }

    // Aplicar filtros de búsqueda
    if (filtrosAplicados.texto) {
      const textoLower = filtrosAplicados.texto.toLowerCase()
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(textoLower) ||
        p.codigo.toLowerCase().includes(textoLower) ||
        p.descripcion?.toLowerCase().includes(textoLower) ||
        p.ubicacion.direccion.toLowerCase().includes(textoLower) ||
        p.ubicacion.comuna.toLowerCase().includes(textoLower)
      )
    }

    if (filtrosAplicados.estado?.length) {
      resultado = resultado.filter(p => filtrosAplicados.estado!.includes(p.estado))
    }

    if (filtrosAplicados.tipo?.length) {
      resultado = resultado.filter(p => filtrosAplicados.tipo!.includes(p.tipo))
    }

    if (filtrosAplicados.prioridad?.length) {
      resultado = resultado.filter(p => filtrosAplicados.prioridad!.includes(p.prioridad))
    }

    if (filtrosAplicados.region?.length) {
      resultado = resultado.filter(p => filtrosAplicados.region!.includes(p.ubicacion.region))
    }

    if (filtrosAplicados.responsable?.length) {
      resultado = resultado.filter(p => 
        filtrosAplicados.responsable!.includes(p.equipo.jefeProyecto) ||
        filtrosAplicados.responsable!.includes(p.equipo.jefeTerreno)
      )
    }

    if (filtrosAplicados.rangoFechas) {
      resultado = resultado.filter(p => {
        const inicio = new Date(p.fechas.inicio)
        const rangoInicio = new Date(filtrosAplicados.rangoFechas!.inicio)
        const rangoFin = new Date(filtrosAplicados.rangoFechas!.fin)
        return inicio >= rangoInicio && inicio <= rangoFin
      })
    }

    if (filtrosAplicados.rangoPresupuesto) {
      resultado = resultado.filter(p =>
        p.financiero.presupuestoTotal >= filtrosAplicados.rangoPresupuesto!.min &&
        p.financiero.presupuestoTotal <= filtrosAplicados.rangoPresupuesto!.max
      )
    }

    if (filtrosAplicados.avanceMinimo !== undefined) {
      resultado = resultado.filter(p => p.avance.fisico >= filtrosAplicados.avanceMinimo!)
    }

    if (filtrosAplicados.soloConProblemas) {
      resultado = resultado.filter(p =>
        p.calidad.noConformidades > 0 ||
        p.financiero.varianzaPresupuestaria > 10 ||
        p.avance.cronograma < 90
      )
    }

    if (filtrosAplicados.soloAsignados) {
      resultado = resultado.filter(p => usuario.proyectosAsignados.includes(p.id))
    }

    // Ordenar
    if (configuracion.ordenamiento) {
      resultado.sort((a, b) => {
        const getValue = (obj: any, path: string) => {
          return path.split('.').reduce((o, p) => o?.[p], obj)
        }

        const aValue = getValue(a, configuracion.ordenamiento.campo)
        const bValue = getValue(b, configuracion.ordenamiento.campo)

        if (configuracion.ordenamiento.direccion === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    return resultado
  }, [proyectos, filtrosAplicados, usuario, configuracion.ordenamiento])

  // Estadísticas derivadas
  const estadisticas = useMemo(() => {
    const proyectosActivos = proyectosFiltrados.filter(p => 
      !['completado', 'suspendido', 'cancelado'].includes(p.estado)
    )

    return {
      total: proyectosFiltrados.length,
      activos: proyectosActivos.length,
      completados: proyectosFiltrados.filter(p => p.estado === 'completado').length,
      retrasados: proyectosActivos.filter(p => p.avance.cronograma < 90).length,
      conProblemas: proyectosActivos.filter(p => p.calidad.noConformidades > 0).length,
      presupuestoTotal: proyectosFiltrados.reduce((acc, p) => acc + p.financiero.presupuestoTotal, 0),
      avancePromedio: proyectosActivos.length > 0 
        ? proyectosActivos.reduce((acc, p) => acc + p.avance.fisico, 0) / proyectosActivos.length 
        : 0
    }
  }, [proyectosFiltrados])

  // Handlers principales
  const handleProyectoSelect = useCallback((proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto)
    onProyectoSelect?.(proyecto)
  }, [onProyectoSelect])

  const handleCrearProyecto = useCallback(() => {
    setModoEdicion('crear')
    setProyectoSeleccionado(null)
  }, [])

  const handleEditarProyecto = useCallback((proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto)
    setModoEdicion('editar')
  }, [])

  const handleGuardarProyecto = useCallback(async (datosProyecto: any) => {
    try {
      if (modoEdicion === 'crear') {
        await onProyectoCrear?.(datosProyecto)
      } else if (modoEdicion === 'editar' && proyectoSeleccionado) {
        await onProyectoActualizar?.(proyectoSeleccionado.id, datosProyecto)
      }
      setModoEdicion(null)
      setProyectoSeleccionado(null)
    } catch (error) {
      console.error('Error guardando proyecto:', error)
    }
  }, [modoEdicion, proyectoSeleccionado, onProyectoCrear, onProyectoActualizar])

  const handleEliminarProyecto = useCallback(async (proyectoId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      await onProyectoEliminar?.(proyectoId)
    }
  }, [onProyectoEliminar])

  const handleCambiarEstado = useCallback(async (proyectoId: string, nuevoEstado: Proyecto['estado']) => {
    await onCambiarEstado?.(proyectoId, nuevoEstado)
  }, [onCambiarEstado])

  const handleFiltrosChange = useCallback((nuevosFiltros: FiltrosProyecto) => {
    setFiltrosAplicados(nuevosFiltros)
    onFiltrosChange?.(nuevosFiltros)
  }, [onFiltrosChange])

  const handleSeleccionMultiple = useCallback((proyectoId: string, seleccionado: boolean) => {
    if (seleccionado) {
      setSeleccionMultiple(prev => [...prev, proyectoId])
    } else {
      setSeleccionMultiple(prev => prev.filter(id => id !== proyectoId))
    }
  }, [])

  const handleAccionMasiva = useCallback((accion: string) => {
    const proyectosSeleccionados = proyectos.filter(p => seleccionMultiple.includes(p.id))
    
    switch (accion) {
      case 'exportar':
        onExportar?.(proyectosSeleccionados, 'excel')
        break
      case 'cambiar-estado':
        // Mostrar modal para cambiar estado
        console.log('Cambiar estado múltiple')
        break
      case 'asignar-responsable':
        // Mostrar modal para asignación
        console.log('Asignar responsable múltiple')
        break
    }
    
    setSeleccionMultiple([])
  }, [seleccionMultiple, proyectos, onExportar])

  // Configuración de filtros para ListTemplate
  const configuracionFiltros = useMemo(() => [
    {
      key: 'estado',
      label: 'Estado',
      type: 'multiselect' as const,
      options: [
        { value: 'planificacion', label: 'Planificación' },
        { value: 'excavacion', label: 'Excavación' },
        { value: 'fundaciones', label: 'Fundaciones' },
        { value: 'estructura', label: 'Estructura' },
        { value: 'albanileria', label: 'Albañilería' },
        { value: 'instalaciones', label: 'Instalaciones' },
        { value: 'terminaciones', label: 'Terminaciones' },
        { value: 'entrega', label: 'Entrega' },
        { value: 'completado', label: 'Completado' },
        { value: 'suspendido', label: 'Suspendido' }
      ]
    },
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'multiselect' as const,
      options: [
        { value: 'residencial', label: 'Residencial' },
        { value: 'comercial', label: 'Comercial' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'institucional', label: 'Institucional' },
        { value: 'infraestructura', label: 'Infraestructura' }
      ]
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      type: 'select' as const,
      options: [
        { value: 'baja', label: 'Baja' },
        { value: 'media', label: 'Media' },
        { value: 'alta', label: 'Alta' },
        { value: 'critica', label: 'Crítica' }
      ]
    },
    {
      key: 'region',
      label: 'Región',
      type: 'select' as const,
      options: [
        { value: 'Metropolitana', label: 'R.M.' },
        { value: 'Valparaíso', label: 'Valparaíso' },
        { value: 'Biobío', label: 'Biobío' },
        { value: 'Antofagasta', label: 'Antofagasta' }
      ]
    }
  ], [])

  // Acciones disponibles por rol
  const accionesDisponibles = useMemo(() => {
    const acciones = []

    if (hasPermission(usuario, 'crear_proyecto')) {
      acciones.push({
        id: 'crear',
        label: 'Nuevo Proyecto',
        variant: 'primary' as const,
        onClick: handleCrearProyecto
      })
    }

    if (hasPermission(usuario, 'exportar_datos')) {
      acciones.push({
        id: 'exportar',
        label: 'Exportar',
        variant: 'secondary' as const,
        onClick: () => onExportar?.(proyectosFiltrados, 'excel')
      })
    }

    if (hasPermission(usuario, 'gestionar_equipos')) {
      acciones.push({
        id: 'equipos',
        label: 'Gestionar Equipos',
        variant: 'secondary' as const,
        onClick: () => setMostrarTeamAssignment(true)
      })
    }

    return acciones
  }, [usuario.permisos, handleCrearProyecto, onExportar, proyectosFiltrados])

  // Conversión a formato ListTemplate
  const itemsListTemplate = useMemo(() => {
    return proyectosFiltrados.map(proyecto => ({
      id: proyecto.id,
      title: proyecto.nombre,
      subtitle: `${proyecto.codigo} - ${proyecto.ubicacion.comuna}`,
      description: proyecto.descripcion || `Proyecto ${proyecto.tipo} en ${proyecto.ubicacion.direccion}`,
      status: proyecto.estado as any,
      priority: proyecto.prioridad as any,
      category: proyecto.tipo,
      tags: proyecto.etiquetas,
      createdAt: proyecto.fechas.creacion,
      updatedAt: proyecto.fechas.ultimaModificacion,
      assignedTo: {
        id: 'user-1',
        name: proyecto.equipo.jefeProyecto,
        avatar: '',
        role: 'Jefe de Proyecto'
      },
      metadata: {
        progress: proyecto.avance.fisico,
        budget: proyecto.financiero.presupuestoTotal,
        location: `${proyecto.ubicacion.comuna}, ${proyecto.ubicacion.region}`,
        dueDate: proyecto.fechas.terminoProgramado,
        workers: proyecto.equipo.totalTrabajadores,
        issues: proyecto.calidad.noConformidades,
        compliance: proyecto.calidad.cumplimientoNormativa
      },
      actions: [
        {
          id: 'ver',
          label: 'Ver',
          variant: 'secondary' as const,
          onClick: () => handleProyectoSelect(proyecto)
        },
        ...(hasPermission(usuario, 'editar_proyecto') ? [{
          id: 'editar',
          label: 'Editar',
          variant: 'secondary' as const,
          onClick: () => handleEditarProyecto(proyecto)
        }] : []),
        ...(hasPermission(usuario, 'eliminar_proyecto') ? [{
          id: 'eliminar',
          label: 'Eliminar',
          variant: 'destructive' as const,
          onClick: () => handleEliminarProyecto(proyecto.id)
        }] : [])
      ]
    }))
  }, [proyectosFiltrados, usuario.permisos, handleProyectoSelect, handleEditarProyecto, handleEliminarProyecto])

  // Renderizar formulario de proyecto
  const renderFormularioProyecto = () => {
    const seccionesFormulario = [
      {
        id: 'informacion-general',
        title: 'Información General',
        fields: [
          { id: 'nombre', label: 'Nombre del Proyecto', type: 'text' as const, required: true },
          { id: 'codigo', label: 'Código del Proyecto', type: 'text' as const, required: true },
          { id: 'descripcion', label: 'Descripción', type: 'textarea' as const },
          { 
            id: 'tipo', 
            label: 'Tipo de Proyecto', 
            type: 'select' as const, 
            required: true,
            options: ['Residencial', 'Comercial', 'Industrial', 'Institucional', 'Infraestructura']
          },
          { 
            id: 'prioridad', 
            label: 'Prioridad', 
            type: 'select' as const, 
            required: true,
            options: ['Baja', 'Media', 'Alta', 'Crítica']
          }
        ]
      },
      {
        id: 'ubicacion',
        title: 'Ubicación y Terreno',
        fields: [
          { id: 'direccion', label: 'Dirección', type: 'text' as const, required: true },
          { id: 'numero', label: 'Número', type: 'text' as const },
          { id: 'comuna', label: 'Comuna', type: 'text' as const, required: true },
          { 
            id: 'region', 
            label: 'Región', 
            type: 'select' as const, 
            required: true,
            options: ['Metropolitana', 'Valparaíso', 'Biobío', 'Antofagasta']
          },
          { id: 'superficie_terreno', label: 'Superficie del Terreno (m²)', type: 'number' as const },
          { id: 'superficie_construida', label: 'Superficie Construida (m²)', type: 'number' as const },
          { id: 'coordenadas', label: 'Coordenadas GPS', type: 'location' as const }
        ]
      },
      {
        id: 'financiero',
        title: 'Información Financiera',
        fields: [
          { id: 'presupuesto_total', label: 'Presupuesto Total', type: 'number' as const, required: true },
          { 
            id: 'moneda', 
            label: 'Moneda', 
            type: 'select' as const, 
            required: true,
            options: ['CLP', 'USD', 'UF'],
            defaultValue: 'CLP'
          },
          { id: 'cliente', label: 'Cliente', type: 'text' as const },
          { id: 'contrato', label: 'Número de Contrato', type: 'text' as const }
        ]
      },
      {
        id: 'cronograma',
        title: 'Cronograma',
        fields: [
          { id: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date' as const, required: true },
          { id: 'fecha_termino', label: 'Fecha de Término', type: 'date' as const, required: true }
        ]
      },
      {
        id: 'equipo',
        title: 'Equipo de Trabajo',
        fields: [
          { id: 'jefe_proyecto', label: 'Jefe de Proyecto', type: 'text' as const, required: true },
          { id: 'jefe_terreno', label: 'Jefe de Terreno', type: 'text' as const, required: true },
          { id: 'residente_obra', label: 'Residente de Obra', type: 'text' as const },
          { id: 'ingeniero_construccion', label: 'Ingeniero de Construcción', type: 'text' as const },
          { id: 'arquitecto', label: 'Arquitecto', type: 'text' as const }
        ]
      }
    ]

    return (
      <FormTemplate
        mode="single"
        title={modoEdicion === 'crear' ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
        subtitle={modoEdicion === 'crear' 
          ? 'Complete la información del nuevo proyecto' 
          : `Editando: ${proyectoSeleccionado?.nombre}`
        }
        sections={seccionesFormulario}
        role={usuario.rol}
        data={proyectoSeleccionado ? {
          nombre: proyectoSeleccionado.nombre,
          codigo: proyectoSeleccionado.codigo,
          descripcion: proyectoSeleccionado.descripcion,
          tipo: proyectoSeleccionado.tipo,
          prioridad: proyectoSeleccionado.prioridad,
          direccion: proyectoSeleccionado.ubicacion.direccion,
          numero: proyectoSeleccionado.ubicacion.numero,
          comuna: proyectoSeleccionado.ubicacion.comuna,
          region: proyectoSeleccionado.ubicacion.region,
          superficie_terreno: proyectoSeleccionado.ubicacion.superficieTerreno,
          superficie_construida: proyectoSeleccionado.ubicacion.superficieConstruida,
          presupuesto_total: proyectoSeleccionado.financiero.presupuestoTotal,
          moneda: proyectoSeleccionado.financiero.moneda,
          cliente: proyectoSeleccionado.cliente,
          contrato: proyectoSeleccionado.contrato,
          fecha_inicio: proyectoSeleccionado.fechas.inicio,
          fecha_termino: proyectoSeleccionado.fechas.terminoProgramado,
          jefe_proyecto: proyectoSeleccionado.equipo.jefeProyecto,
          jefe_terreno: proyectoSeleccionado.equipo.jefeTerreno,
          residente_obra: proyectoSeleccionado.equipo.residenteObra,
          ingeniero_construccion: proyectoSeleccionado.equipo.ingenieroConstruccion,
          arquitecto: proyectoSeleccionado.equipo.arquitecto
        } : {}}
        onSubmit={handleGuardarProyecto}
        onCancel={() => {
          setModoEdicion(null)
          setProyectoSeleccionado(null)
        }}
      />
    )
  }

  // Renderizar detalle de proyecto
  const renderDetalleProyecto = () => {
    if (!proyectoSeleccionado) return null

    return (
      <div className="space-y-6">
        {/* Header del proyecto */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{proyectoSeleccionado.nombre}</h1>
              <p className="text-gray-600">{proyectoSeleccionado.codigo}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant={
                  proyectoSeleccionado.estado === 'completado' ? 'success' :
                  ['suspendido', 'cancelado'].includes(proyectoSeleccionado.estado) ? 'destructive' :
                  proyectoSeleccionado.avance.fisico >= 70 ? 'warning' : 'secondary'
                }
              >
                {proyectoSeleccionado.estado}
              </Badge>
              <Badge 
                variant={
                  proyectoSeleccionado.prioridad === 'critica' ? 'destructive' :
                  proyectoSeleccionado.prioridad === 'alta' ? 'warning' : 'secondary'
                }
              >
                {proyectoSeleccionado.prioridad}
              </Badge>
              {hasPermission(usuario, 'editar_proyecto') && (
                <Button 
                  variant="outline" 
                  onClick={() => handleEditarProyecto(proyectoSeleccionado)}
                >
                  Editar
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Avance Físico</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${proyectoSeleccionado.avance.fisico}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{proyectoSeleccionado.avance.fisico}%</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Presupuesto</h3>
              <div className="text-sm">
                <div>Total: {new Intl.NumberFormat('es-CL', { 
                  style: 'currency', 
                  currency: proyectoSeleccionado.financiero.moneda === 'CLP' ? 'CLP' : 'USD' 
                }).format(proyectoSeleccionado.financiero.presupuestoTotal)}</div>
                <div>Ejecutado: {new Intl.NumberFormat('es-CL', { 
                  style: 'currency', 
                  currency: proyectoSeleccionado.financiero.moneda === 'CLP' ? 'CLP' : 'USD' 
                }).format(proyectoSeleccionado.financiero.presupuestoEjecutado)}</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Equipo</h3>
              <div className="text-sm">
                <div>Jefe: {proyectoSeleccionado.equipo.jefeProyecto}</div>
                <div>Terreno: {proyectoSeleccionado.equipo.jefeTerreno}</div>
                <div>{proyectoSeleccionado.equipo.totalTrabajadores} trabajadores</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Calidad</h3>
              <div className="text-sm">
                <div>Cumplimiento: {proyectoSeleccionado.calidad.cumplimientoNormativa}%</div>
                <div>Inspecciones: {proyectoSeleccionado.calidad.inspeccionesRealizadas}</div>
                {proyectoSeleccionado.calidad.noConformidades > 0 && (
                  <div className="text-red-600">
                    {proyectoSeleccionado.calidad.noConformidades} no conformidades
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs para diferentes secciones */}
        <div className="bg-white rounded-lg border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {['general', 'partidas', 'equipo', 'materiales', 'calidad'].map((tab) => (
                <button
                  key={tab}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm capitalize",
                    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Ubicación</h4>
                <p className="text-sm text-gray-600">
                  {proyectoSeleccionado.ubicacion.direccion}
                  {proyectoSeleccionado.ubicacion.numero && ` ${proyectoSeleccionado.ubicacion.numero}`}
                </p>
                <p className="text-sm text-gray-600">
                  {proyectoSeleccionado.ubicacion.comuna}, {proyectoSeleccionado.ubicacion.region}
                </p>
                {proyectoSeleccionado.ubicacion.superficieTerreno && (
                  <p className="text-sm text-gray-600">
                    Terreno: {proyectoSeleccionado.ubicacion.superficieTerreno} m²
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Cronograma</h4>
                <p className="text-sm text-gray-600">
                  Inicio: {new Date(proyectoSeleccionado.fechas.inicio).toLocaleDateString('es-CL')}
                </p>
                <p className="text-sm text-gray-600">
                  Término: {new Date(proyectoSeleccionado.fechas.terminoProgramado).toLocaleDateString('es-CL')}
                </p>
                {proyectoSeleccionado.cliente && (
                  <p className="text-sm text-gray-600">
                    Cliente: {proyectoSeleccionado.cliente}
                  </p>
                )}
              </div>
            </div>

            {proyectoSeleccionado.descripcion && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Descripción</h4>
                <p className="text-sm text-gray-600">{proyectoSeleccionado.descripcion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Renderizar contenido principal
  const renderContenidoPrincipal = () => {
    if (modoEdicion) {
      return renderFormularioProyecto()
    }

    if (proyectoSeleccionado && mode === 'detail') {
      return renderDetalleProyecto()
    }

    if (mostrarFormPartida) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Nueva Partida Constructiva</h2>
            <Button variant="ghost" onClick={() => setMostrarFormPartida(false)}>✕</Button>
          </div>
          <TaskRegistrationForm
            projects={proyectos.map(p => ({ id: p.id, name: p.nombre, code: p.codigo }))}
            currentUser={{
              id: usuario.id,
              name: usuario.nombre,
              role: usuario.rol
            }}
            onSubmit={(taskData) => {
              console.log('Nueva partida:', taskData)
              setMostrarFormPartida(false)
            }}
            onCancel={() => setMostrarFormPartida(false)}
          />
        </div>
      )
    }

    if (mostrarTeamAssignment) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gestión de Equipos</h2>
            <Button variant="ghost" onClick={() => setMostrarTeamAssignment(false)}>✕</Button>
          </div>
          <TeamAssignment
            projects={proyectos.map(p => ({ id: p.id, name: p.nombre }))}
            role={usuario.rol}
            onAssignmentChange={(data) => console.log('Asignación:', data)}
            onPerformanceUpdate={(data) => console.log('Rendimiento:', data)}
          />
        </div>
      )
    }

    if (mostrarMaterialTracker) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gestión de Materiales</h2>
            <Button variant="ghost" onClick={() => setMostrarMaterialTracker(false)}>✕</Button>
          </div>
          <MaterialTracker
            projects={proyectos.map(p => ({ id: p.id, name: p.nombre }))}
            role={usuario.rol}
            onInventoryUpdate={(data) => console.log('Inventario:', data)}
            onPurchaseOrder={(data) => console.log('Orden de compra:', data)}
          />
        </div>
      )
    }

    // Vista principal de listado
    return (
      <div className="space-y-6">
        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
          <Card className="p-4">
            <h3 className="font-medium text-gray-700 mb-1">Total Proyectos</h3>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium text-gray-700 mb-1">Activos</h3>
            <div className="text-2xl font-bold text-green-600">{estadisticas.activos}</div>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium text-gray-700 mb-1">Con Problemas</h3>
            <div className="text-2xl font-bold text-red-600">{estadisticas.conProblemas}</div>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium text-gray-700 mb-1">Avance Promedio</h3>
            <div className="text-2xl font-bold text-orange-600">{estadisticas.avancePromedio.toFixed(1)}%</div>
          </Card>
        </div>

        {/* Desktop Project Cards - Fixed Layout */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Gestión de Proyectos</h2>
                <p className="text-gray-600">{estadisticas.total} proyectos en total</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setVistaActiva('tarjetas')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                      vistaActiva === 'tarjetas'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-gray-500 border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setVistaActiva('lista')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                      vistaActiva === 'lista'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-gray-500 border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Tabla
                  </button>
                </div>
                {accionesDisponibles.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <Input
                placeholder="Buscar proyectos..."
                value={filtrosAplicados.texto || ''}
                onChange={(e) => handleFiltrosChange({ ...filtrosAplicados, texto: e.target.value })}
                className="max-w-sm"
              />
              <select
                value={filtrosAplicados.prioridad?.[0] || 'all'}
                onChange={(e) => handleFiltrosChange({ 
                  ...filtrosAplicados, 
                  prioridad: e.target.value === 'all' ? [] : [e.target.value] 
                })}
                className="border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm appearance-none bg-white bg-no-repeat bg-right bg-[length:12px_12px] bg-[position:right_8px_center]" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                }}
              >
                <option value="all">Todos Prioridad</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
              <select
                value={filtrosAplicados.region?.[0] || 'all'}
                onChange={(e) => handleFiltrosChange({ 
                  ...filtrosAplicados, 
                  region: e.target.value === 'all' ? [] : [e.target.value] 
                })}
                className="border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm appearance-none bg-white bg-no-repeat bg-right bg-[length:12px_12px] bg-[position:right_8px_center]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                }}
              >
                <option value="all">Todos Región</option>
                <option value="Metropolitana">R.M.</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Biobío">Biobío</option>
                <option value="Antofagasta">Antofagasta</option>
              </select>
            </div>

            {/* Projects Grid/Table */}
            {proyectosFiltrados.length > 0 ? (
              <div className={vistaActiva === 'tarjetas' ? 'grid grid-cols-1 gap-6' : ''}>
                {proyectosFiltrados.map((proyecto) => (
                  <div key={proyecto.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{proyecto.nombre}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Código:</span> {proyecto.codigo}</p>
                          <p><span className="font-medium">Ubicación:</span> {proyecto.ubicacion.direccion}, {proyecto.ubicacion.comuna}</p>
                          <p><span className="font-medium">Descripción:</span> {proyecto.descripcion}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Progreso:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${proyecto.avance.fisico}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{proyecto.avance.fisico}%</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-3">
                          <Badge variant={
                            proyecto.estado === 'completado' ? 'success' :
                            ['suspendido', 'cancelado'].includes(proyecto.estado) ? 'destructive' :
                            proyecto.avance.fisico >= 70 ? 'warning' : 'secondary'
                          }>
                            {proyecto.estado}
                          </Badge>
                          <Badge variant={
                            proyecto.tipo === 'residencial' ? 'secondary' : 'outline'
                          }>
                            {proyecto.tipo}
                          </Badge>
                          <Badge variant={
                            proyecto.prioridad === 'critica' ? 'destructive' :
                            proyecto.prioridad === 'alta' ? 'warning' : 'secondary'
                          }>
                            {proyecto.prioridad}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <span>👷</span>
                            <span>{proyecto.equipo.jefeProyecto}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>🏗️</span>
                            <span>{proyecto.equipo.jefeTerreno}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProyectoSelect(proyecto)}
                        >
                          Ver
                        </Button>
                        {hasPermission(usuario, 'editar_proyecto') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditarProyecto(proyecto)}
                          >
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
                <p className="text-gray-600 mb-4">No se encontraron proyectos que coincidan con los criterios de búsqueda.</p>
                {hasPermission(usuario, 'crear_proyecto') && (
                  <Button onClick={handleCrearProyecto}>
                    Crear Primer Proyecto
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile View - Keep Original ListTemplate */}
        <div className="block md:hidden">
          <ListTemplate
            title="Gestión de Proyectos"
            subtitle={`${estadisticas.total} proyectos en total`}
            items={itemsListTemplate}
            layout={vistaActiva === 'lista' ? 'table' : 'cards'}
            filters={configuracionFiltros}
            enableSearch={true}
            searchPlaceholder="Buscar proyectos..."
            enableBulkSelect={hasPermission(usuario, 'acciones_masivas')}
            actions={accionesDisponibles}
            bulkActions={[
              {
                id: 'exportar',
                label: 'Exportar Seleccionados',
                variant: 'secondary',
                onClick: () => handleAccionMasiva('exportar')
              },
              {
                id: 'cambiar-estado',
                label: 'Cambiar Estado',
                variant: 'secondary',
                onClick: () => handleAccionMasiva('cambiar-estado')
              }
            ]}
            onItemSelect={(item) => {
              const proyecto = proyectos.find(p => p.id === item.id)
              if (proyecto) handleProyectoSelect(proyecto)
            }}
            onBulkSelect={(items) => {
              setSeleccionMultiple(items.map(item => item.id))
            }}
            onFilter={handleFiltrosChange}
            role={usuario.rol}
            isLoading={isLoading}
            error={error}
            emptyStateTitle="No hay proyectos"
            emptyStateMessage="No se encontraron proyectos que coincidan con los criterios de búsqueda."
            emptyStateAction={
              hasPermission(usuario, 'crear_proyecto') ? {
                label: 'Crear Primer Proyecto',
                onClick: handleCrearProyecto
              } : undefined
            }
          />
        </div>
      </div>
    )
  }

  // Renderizar según dispositivo
  if (esMobile) {
    return (
      <MobileTemplate
        title="Proyectos"
        subtitle={`${estadisticas.activos} activos`}
        showBackButton={Boolean(proyectoSeleccionado || modoEdicion)}
        onBack={() => {
          if (modoEdicion) {
            setModoEdicion(null)
          } else if (proyectoSeleccionado) {
            setProyectoSeleccionado(null)
          }
        }}
        navigation={{
          type: 'bottom',
          position: 'fixed',
          items: [
            {
              id: 'proyectos',
              label: 'Proyectos',
              icon: '🏗️',
              active: !mostrarFormPartida && !mostrarTeamAssignment && !mostrarMaterialTracker,
              onClick: () => {
                setMostrarFormPartida(false)
                setMostrarTeamAssignment(false)
                setMostrarMaterialTracker(false)
              }
            },
            {
              id: 'partidas',
              label: 'Partidas',
              icon: '📋',
              active: mostrarFormPartida,
              onClick: () => setMostrarFormPartida(true)
            },
            {
              id: 'equipos',
              label: 'Equipos',
              icon: '👥',
              active: mostrarTeamAssignment,
              onClick: () => setMostrarTeamAssignment(true)
            },
            {
              id: 'materiales',
              label: 'Materiales',
              icon: '📦',
              active: mostrarMaterialTracker,
              onClick: () => setMostrarMaterialTracker(true)
            }
          ]
        }}
        role={usuario.rol}
        className={cn(projectManagementVariants({ mode, layout }), className)}
        actions={hasPermission(usuario, 'crear_proyecto') ? [
          {
            id: 'crear',
            label: 'Nuevo Proyecto',
            variant: 'primary' as const,
            onClick: handleCrearProyecto
          }
        ] : undefined}
        {...props}
      >
        {renderContenidoPrincipal()}
      </MobileTemplate>
    )
  }

  // Versión desktop
  return (
    <div className={cn(projectManagementVariants({ mode, layout }), className)} {...props}>
      {renderContenidoPrincipal()}
    </div>
  )
}