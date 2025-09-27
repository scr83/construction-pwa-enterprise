'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Importar todos los componentes necesarios
import { FormTemplate } from '@/components/templates/FormTemplate'
import { MobileTemplate } from '@/components/templates/MobileTemplate'
import { NavigationBar } from '@/components/organisms/NavigationBar'
import { PhotoGallery } from '@/components/organisms/PhotoGallery'
import { QualityChecklist } from '@/components/organisms/QualityChecklist'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'
import { Input } from '@/components/atoms/Input'

// Definir variantes del componente
export const qualityControlVariants = cva(
  "min-h-screen bg-gray-50",
  {
    variants: {
      mode: {
        dashboard: "quality-dashboard-view",
        inspection: "quality-inspection-view",
        checklist: "quality-checklist-view",
        photos: "quality-photos-view"
      },
      layout: {
        desktop: "desktop-quality-layout",
        mobile: "mobile-quality-layout",
        tablet: "tablet-quality-layout"
      },
      inspectionType: {
        structural: "structural-inspection",
        electrical: "electrical-inspection",
        plumbing: "plumbing-inspection",
        finishing: "finishing-inspection",
        safety: "safety-inspection"
      }
    },
    defaultVariants: {
      mode: "dashboard",
      layout: "desktop",
      inspectionType: "structural"
    }
  }
)

// Interfaces TypeScript para control de calidad en construcción
export interface ChecklistItem {
  id: string
  codigo: string
  descripcion: string
  categoria: string
  subcategoria?: string
  obligatorio: boolean
  tipoVerificacion: 'visual' | 'medicion' | 'prueba' | 'documento'
  criterioAprobacion: string
  normativaReferencia?: string
  
  // Estado de la verificación
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'en_revision' | 'no_aplica'
  resultado?: string
  valor?: number
  unidadMedida?: string
  rangoAceptable?: { min: number; max: number }
  
  // Evidencias
  requiereFoto: boolean
  fotos: Array<{
    id: string
    url: string
    timestamp: string
    coordenadas?: { lat: number; lng: number }
    observaciones?: string
  }>
  
  requiereDocumento: boolean
  documentos: Array<{
    id: string
    nombre: string
    tipo: string
    url: string
    fechaCarga: string
  }>
  
  // Responsabilidades
  inspector: string
  fechaInspeccion?: string
  firmaDigital?: string
  
  // Observaciones y seguimiento
  observaciones: string[]
  noConformidades: Array<{
    id: string
    descripcion: string
    severidad: 'baja' | 'media' | 'alta' | 'critica'
    fechaDeteccion: string
    responsableCorreccion: string
    fechaCorreccion?: string
    estadoCorreccion: 'abierta' | 'en_proceso' | 'corregida' | 'verificada'
  }>
  
  metadata: {
    version: string
    fechaCreacion: string
    ultimaModificacion: string
    modificadoPor: string
  }
}

export interface InspeccionCalidad {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  proyectoId: string
  proyectoNombre: string
  
  // Tipo y categorización
  tipoInspeccion: 'estructural' | 'instalaciones' | 'terminaciones' | 'seguridad' | 'ambiental'
  especialidad: string
  partidaConstructiva?: string
  ubicacionFisica: string
  nivel?: string
  sector?: string
  
  // Programación
  fechaProgramada: string
  fechaRealizada?: string
  duracionEstimada: number // minutos
  duracionReal?: number
  
  // Personal
  inspector: {
    id: string
    nombre: string
    certificaciones: string[]
    firma: string
  }
  supervisorAprobacion?: {
    id: string
    nombre: string
    fechaAprobacion?: string
    firma?: string
  }
  
  // Estado y avance
  estado: 'programada' | 'en_proceso' | 'completada' | 'aprobada' | 'rechazada' | 'suspendida'
  avance: number
  
  // Checklist
  checklistItems: ChecklistItem[]
  itemsAprobados: number
  itemsRechazados: number
  itemsPendientes: number
  
  // Resultados
  resultadoGeneral: 'aprobado' | 'aprobado_con_observaciones' | 'rechazado'
  puntajeCalidad: number
  cumplimientoNormativa: number
  
  // Condiciones de inspección
  condicionesAmbientales?: {
    temperatura: number
    humedad: number
    viento?: string
    visibilidad: string
  }
  
  equiposUtilizados: string[]
  
  // Ubicación y contexto
  coordenadas?: { lat: number; lng: number }
  altitud?: number
  orientacion?: string
  
  // Seguimiento
  proximaInspeccion?: string
  requiereSeguimiento: boolean
  diasParaSeguimiento?: number
  
  metadata: {
    version: string
    fechaCreacion: string
    ultimaModificacion: string
    creadoPor: string
    sincronizado: boolean
  }
}

export interface TemplateChecklist {
  id: string
  nombre: string
  descripcion: string
  tipoInspeccion: string
  especialidad: string
  version: string
  vigente: boolean
  
  items: Omit<ChecklistItem, 'estado' | 'resultado' | 'fotos' | 'documentos' | 'inspector' | 'observaciones' | 'noConformidades'>[]
  
  metadata: {
    creadoPor: string
    fechaCreacion: string
    aprobadoPor?: string
    fechaAprobacion?: string
  }
}

export interface ConfiguracionCalidad {
  fotosObligatorias: boolean
  gpsObligatorio: boolean
  firmaDigitalObligatoria: boolean
  sincronizacionOffline: boolean
  alertasVencimiento: boolean
  diasAlertaVencimiento: number
  requiereAprobacionSupervisor: boolean
  
  // Configuración de fotos
  calidadFoto: 'baja' | 'media' | 'alta'
  marcaDeAgua: boolean
  compressionAutomatica: boolean
  
  // Configuración de reportes
  formatoReportePorDefecto: 'pdf' | 'excel'
  incluirFotosEnReporte: boolean
  logoEmpresa?: string
}

export interface QualityControlProps extends VariantProps<typeof qualityControlVariants> {
  // Usuario y contexto
  usuario: {
    id: string
    nombre: string
    rol: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
    certificaciones: string[]
    permisos: string[]
    proyectosAsignados: string[]
    firmaDigital?: string
  }
  
  // Datos
  inspecciones: InspeccionCalidad[]
  templatesChecklist: TemplateChecklist[]
  
  // Configuración
  configuracion: ConfiguracionCalidad
  esMobile?: boolean
  
  // Estados
  isLoading?: boolean
  error?: string
  modoOffline?: boolean
  
  // Callbacks principales
  onInspeccionCrear?: (inspeccion: Omit<InspeccionCalidad, 'id' | 'metadata'>) => Promise<void>
  onInspeccionActualizar?: (id: string, inspeccion: Partial<InspeccionCalidad>) => Promise<void>
  onInspeccionEliminar?: (id: string) => Promise<void>
  onInspeccionIniciar?: (id: string) => Promise<void>
  onInspeccionCompletar?: (id: string) => Promise<void>
  onInspeccionAprobar?: (id: string, aprobacion: any) => Promise<void>
  
  // Callbacks de checklist
  onChecklistItemActualizar?: (inspeccionId: string, itemId: string, datos: Partial<ChecklistItem>) => Promise<void>
  onFotoSubir?: (inspeccionId: string, itemId: string, foto: File) => Promise<string>
  onDocumentoSubir?: (inspeccionId: string, itemId: string, documento: File) => Promise<string>
  
  // Callbacks de no conformidades
  onNoConformidadCrear?: (inspeccionId: string, itemId: string, noConformidad: any) => Promise<void>
  onNoConformidadActualizar?: (noConformidadId: string, datos: any) => Promise<void>
  
  // Callbacks de reportes
  onGenerarReporte?: (inspeccionId: string, formato: 'pdf' | 'excel') => Promise<void>
  onExportarDatos?: (inspecciones: InspeccionCalidad[], formato: 'excel' | 'csv') => Promise<void>
  
  // Callbacks PWA
  onCapturaFoto?: (callback: (file: File) => void) => void
  onCapturaUbicacion?: (callback: (coords: GeolocationCoordinates) => void) => void
  onFirmaDigital?: (callback: (firma: string) => void) => void
  
  // Personalización
  className?: string
}

export function QualityControl({
  usuario,
  inspecciones = [],
  templatesChecklist = [],
  configuracion,
  esMobile = false,
  isLoading = false,
  error,
  modoOffline = false,
  onInspeccionCrear,
  onInspeccionActualizar,
  onInspeccionEliminar,
  onInspeccionIniciar,
  onInspeccionCompletar,
  onInspeccionAprobar,
  onChecklistItemActualizar,
  onFotoSubir,
  onDocumentoSubir,
  onNoConformidadCrear,
  onNoConformidadActualizar,
  onGenerarReporte,
  onExportarDatos,
  onCapturaFoto,
  onCapturaUbicacion,
  onFirmaDigital,
  mode = "dashboard",
  layout,
  inspectionType,
  className,
  ...props
}: QualityControlProps) {
  // Estados locales
  const [vistaActiva, setVistaActiva] = useState<'dashboard' | 'inspecciones' | 'nueva-inspeccion' | 'checklist' | 'fotos'>('dashboard')
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState<InspeccionCalidad | null>(null)
  const [itemChecklistActivo, setItemChecklistActivo] = useState<ChecklistItem | null>(null)
  const [modoInspeccion, setModoInspeccion] = useState<'lectura' | 'edicion'>('lectura')
  const [fotoCapturada, setFotoCapturada] = useState<File | null>(null)
  const [ubicacionActual, setUbicacionActual] = useState<GeolocationCoordinates | null>(null)
  const [filtros, setFiltros] = useState({
    estado: '',
    tipo: '',
    proyecto: '',
    inspector: '',
    fechaDesde: '',
    fechaHasta: ''
  })

  // Referencias para funcionalidades PWA
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Efectos
  useEffect(() => {
    // Obtener ubicación si está configurado
    if (configuracion.gpsObligatorio && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUbicacionActual(position.coords),
        (error) => console.warn('Error obteniendo ubicación:', error),
        { enableHighAccuracy: true }
      )
    }
  }, [configuracion.gpsObligatorio])

  useEffect(() => {
    // Sincronización offline
    if (!modoOffline && configuracion.sincronizacionOffline) {
      // Sincronizar datos pendientes
      console.log('Sincronizando datos offline...')
    }
  }, [modoOffline, configuracion.sincronizacionOffline])

  // Datos derivados y filtrados
  const inspeccionesFiltradas = useMemo(() => {
    let resultado = inspecciones

    // Filtrar por proyectos asignados
    if (!(usuario?.permisos && Array.isArray(usuario.permisos) && usuario.permisos.includes('ver_todas_inspecciones'))) {
      resultado = resultado.filter(i => usuario?.proyectosAsignados?.includes?.(i.proyectoId))
    }

    // Aplicar filtros
    if (filtros.estado) {
      resultado = resultado.filter(i => i.estado === filtros.estado)
    }

    if (filtros.tipo) {
      resultado = resultado.filter(i => i.tipoInspeccion === filtros.tipo)
    }

    if (filtros.proyecto) {
      resultado = resultado.filter(i => i.proyectoId === filtros.proyecto)
    }

    if (filtros.inspector) {
      resultado = resultado.filter(i => i.inspector.id === filtros.inspector)
    }

    if (filtros.fechaDesde) {
      resultado = resultado.filter(i => new Date(i.fechaProgramada) >= new Date(filtros.fechaDesde))
    }

    if (filtros.fechaHasta) {
      resultado = resultado.filter(i => new Date(i.fechaProgramada) <= new Date(filtros.fechaHasta))
    }

    return resultado.sort((a, b) => new Date(b.fechaProgramada).getTime() - new Date(a.fechaProgramada).getTime())
  }, [inspecciones, filtros, usuario])

  // Estadísticas derivadas
  const estadisticas = useMemo(() => {
    const inspeccionesHoy = inspeccionesFiltradas.filter(i => {
      const hoy = new Date().toDateString()
      return new Date(i.fechaProgramada).toDateString() === hoy
    })

    const inspeccionesPendientes = inspeccionesFiltradas.filter(i => 
      ['programada', 'en_proceso'].includes(i.estado)
    )

    const noConformidadesAbiertas = inspeccionesFiltradas.reduce((acc, i) =>
      acc + (i.checklistItems || []).reduce((itemAcc, item) =>
        itemAcc + (item.noConformidades || []).filter(nc => nc.estadoCorreccion !== 'verificada').length, 0), 0)

    const cumplimientoPromedio = inspeccionesFiltradas.length > 0
      ? inspeccionesFiltradas
          .filter(i => i.estado === 'completada' || i.estado === 'aprobada')
          .reduce((acc, i) => acc + i.cumplimientoNormativa, 0) / 
        inspeccionesFiltradas.filter(i => i.estado === 'completada' || i.estado === 'aprobada').length
      : 0

    return {
      total: inspeccionesFiltradas.length,
      hoy: inspeccionesHoy.length,
      pendientes: inspeccionesPendientes.length,
      completadas: inspeccionesFiltradas.filter(i => i.estado === 'completada').length,
      aprobadas: inspeccionesFiltradas.filter(i => i.estado === 'aprobada').length,
      rechazadas: inspeccionesFiltradas.filter(i => i.estado === 'rechazada').length,
      noConformidades: noConformidadesAbiertas,
      cumplimientoPromedio: cumplimientoPromedio
    }
  }, [inspeccionesFiltradas])

  // Handlers principales
  const handleIniciarInspeccion = useCallback(async (inspeccion: InspeccionCalidad) => {
    setInspeccionSeleccionada(inspeccion)
    setVistaActiva('checklist')
    setModoInspeccion('edicion')
    
    if (inspeccion.estado === 'programada') {
      await onInspeccionIniciar?.(inspeccion.id)
    }
  }, [onInspeccionIniciar])

  const handleCompletarInspeccion = useCallback(async () => {
    if (!inspeccionSeleccionada) return

    const itemsPendientes = inspeccionSeleccionada.checklistItems.filter(
      item => item.estado === 'pendiente' && item.obligatorio
    ).length

    if (itemsPendientes > 0 && !confirm(`Quedan ${itemsPendientes} items obligatorios pendientes. ¿Desea continuar?`)) {
      return
    }

    await onInspeccionCompletar?.(inspeccionSeleccionada.id)
    setModoInspeccion('lectura')
  }, [inspeccionSeleccionada, onInspeccionCompletar])

  const handleActualizarItem = useCallback(async (item: ChecklistItem, datos: Partial<ChecklistItem>) => {
    if (!inspeccionSeleccionada) return

    await onChecklistItemActualizar?.(inspeccionSeleccionada.id, item.id, {
      ...datos,
      inspector: usuario.nombre,
      fechaInspeccion: new Date().toISOString()
    })

    // Actualizar localmente
    setInspeccionSeleccionada(prev => {
      if (!prev) return prev
      return {
        ...prev,
        checklistItems: prev.checklistItems.map(i =>
          i.id === item.id ? { ...i, ...datos } : i
        )
      }
    })
  }, [inspeccionSeleccionada, usuario.nombre, onChecklistItemActualizar])

  const handleCapturarFoto = useCallback((itemId: string) => {
    onCapturaFoto?.(async (file: File) => {
      if (!inspeccionSeleccionada) return

      try {
        const fotoUrl = await onFotoSubir?.(inspeccionSeleccionada.id, itemId, file)
        
        if (fotoUrl) {
          const nuevaFoto = {
            id: `foto-${Date.now()}`,
            url: fotoUrl,
            timestamp: new Date().toISOString(),
            coordenadas: ubicacionActual ? { lat: ubicacionActual.latitude, lng: ubicacionActual.longitude } : undefined
          }

          await handleActualizarItem(
            inspeccionSeleccionada.checklistItems.find(i => i.id === itemId)!,
            {
              fotos: [
                ...inspeccionSeleccionada.checklistItems.find(i => i.id === itemId)!.fotos,
                nuevaFoto
              ]
            }
          )
        }
      } catch (error) {
        console.error('Error subiendo foto:', error)
      }
    })
  }, [inspeccionSeleccionada, ubicacionActual, onCapturaFoto, onFotoSubir, handleActualizarItem])

  const handleCrearNoConformidad = useCallback(async (itemId: string, descripcion: string, severidad: string) => {
    if (!inspeccionSeleccionada) return

    const noConformidad = {
      descripcion,
      severidad,
      fechaDeteccion: new Date().toISOString(),
      responsableCorreccion: usuario.nombre,
      estadoCorreccion: 'abierta' as const
    }

    await onNoConformidadCrear?.(inspeccionSeleccionada.id, itemId, noConformidad)
  }, [inspeccionSeleccionada, usuario.nombre, onNoConformidadCrear])

  const handleGenerarReporte = useCallback(async (inspeccionId: string) => {
    await onGenerarReporte?.(inspeccionId, configuracion.formatoReportePorDefecto)
  }, [onGenerarReporte, configuracion.formatoReportePorDefecto])

  // Renderizar dashboard de calidad
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Hoy</h3>
          <div className="text-2xl font-bold text-blue-600">{estadisticas.hoy}</div>
          <p className="text-sm text-gray-500">inspecciones</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Pendientes</h3>
          <div className="text-2xl font-bold text-orange-600">{estadisticas.pendientes}</div>
          <p className="text-sm text-gray-500">por realizar</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">No Conformidades</h3>
          <div className="text-2xl font-bold text-red-600">{estadisticas.noConformidades}</div>
          <p className="text-sm text-gray-500">abiertas</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Cumplimiento</h3>
          <div className="text-2xl font-bold text-green-600">{estadisticas.cumplimientoPromedio.toFixed(1)}%</div>
          <p className="text-sm text-gray-500">promedio</p>
        </Card>
      </div>

      {/* Inspecciones del día */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Inspecciones de Hoy</h2>
        <div className="space-y-3">
          {inspeccionesFiltradas
            .filter(i => new Date(i.fechaProgramada).toDateString() === new Date().toDateString())
            .slice(0, 5)
            .map(inspeccion => (
              <div 
                key={inspeccion.id}
                className="flex items-center justify-between p-4 min-h-[48px] bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => handleIniciarInspeccion(inspeccion)}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{inspeccion.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    {inspeccion.proyectoNombre} • {inspeccion.ubicacionFisica}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={
                    inspeccion.estado === 'completada' ? 'success' :
                    inspeccion.estado === 'en_proceso' ? 'warning' :
                    inspeccion.estado === 'rechazada' ? 'destructive' : 'secondary'
                  }>
                    {inspeccion.estado}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(inspeccion.fechaProgramada).toLocaleTimeString('es-CL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
        </div>
        
        {estadisticas.hoy === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">✅</div>
            <p>No hay inspecciones programadas para hoy</p>
          </div>
        )}
      </Card>

      {/* Acciones rápidas */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => setVistaActiva('nueva-inspeccion')}
          >
            <span className="text-2xl mb-1">📋</span>
            Nueva Inspección
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => setVistaActiva('inspecciones')}
          >
            <span className="text-2xl mb-1">📊</span>
            Ver Inspecciones
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => onExportarDatos?.(inspeccionesFiltradas, 'excel')}
          >
            <span className="text-2xl mb-1">📈</span>
            Exportar Datos
          </Button>
        </div>
      </Card>
    </div>
  )

  // Renderizar lista de inspecciones
  const renderInspecciones = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos los estados</option>
            <option value="programada">Programada</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completada">Completada</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>

          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos los tipos</option>
            <option value="estructural">Estructural</option>
            <option value="instalaciones">Instalaciones</option>
            <option value="terminaciones">Terminaciones</option>
            <option value="seguridad">Seguridad</option>
            <option value="ambiental">Ambiental</option>
          </select>

          <Input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
            placeholder="Desde"
          />

          <Input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
            placeholder="Hasta"
          />

          <Button 
            variant="outline"
            onClick={() => setFiltros({ estado: '', tipo: '', proyecto: '', inspector: '', fechaDesde: '', fechaHasta: '' })}
          >
            Limpiar
          </Button>

          <Button onClick={() => setVistaActiva('nueva-inspeccion')}>
            Nueva Inspección
          </Button>
        </div>
      </Card>

      {/* Lista de inspecciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {inspeccionesFiltradas.map(inspeccion => (
          <Card key={inspeccion.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleIniciarInspeccion(inspeccion)}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold">{inspeccion.nombre}</h3>
                <p className="text-sm text-gray-600">{inspeccion.proyectoNombre}</p>
              </div>
              <Badge variant={
                inspeccion.estado === 'completada' ? 'success' :
                inspeccion.estado === 'aprobada' ? 'success' :
                inspeccion.estado === 'en_proceso' ? 'warning' :
                inspeccion.estado === 'rechazada' ? 'destructive' : 'secondary'
              }>
                {inspeccion.estado}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tipo:</span>
                <span className="font-medium">{inspeccion.tipoInspeccion}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fecha:</span>
                <span>{new Date(inspeccion.fechaProgramada).toLocaleDateString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inspector:</span>
                <span>{inspeccion.inspector.nombre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ubicación:</span>
                <span>{inspeccion.ubicacionFisica}</span>
              </div>

              {inspeccion.estado !== 'programada' && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Avance:</span>
                    <span>{inspeccion.avance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${inspeccion.avance}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {inspeccion.noConformidades > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">⚠️</span>
                  <span className="text-sm text-red-600">
                    {(inspeccion.checklistItems || []).reduce((acc, item) => 
                      acc + (item.noConformidades || []).filter(nc => nc.estadoCorreccion !== 'verificada').length, 0
                    )} no conformidades
                  </span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {inspeccionesFiltradas.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron inspecciones</h3>
          <p className="text-gray-600 mb-4">
            No hay inspecciones que coincidan con los filtros aplicados.
          </p>
          <Button onClick={() => setVistaActiva('nueva-inspeccion')}>
            Crear Nueva Inspección
          </Button>
        </Card>
      )}
    </div>
  )

  // Renderizar formulario de nueva inspección
  const renderNuevaInspeccion = () => {
    const seccionesFormulario = [
      {
        id: 'informacion-general',
        title: 'Información General',
        fields: [
          { id: 'nombre', label: 'Nombre de la Inspección', type: 'text' as const, required: true },
          { id: 'codigo', label: 'Código', type: 'text' as const, required: true },
          { id: 'descripcion', label: 'Descripción', type: 'textarea' as const },
          { 
            id: 'tipo_inspeccion', 
            label: 'Tipo de Inspección', 
            type: 'select' as const, 
            required: true,
            options: ['Estructural', 'Instalaciones', 'Terminaciones', 'Seguridad', 'Ambiental']
          },
          { id: 'especialidad', label: 'Especialidad', type: 'text' as const, required: true }
        ]
      },
      {
        id: 'ubicacion',
        title: 'Ubicación y Contexto',
        fields: [
          { 
            id: 'proyecto_id', 
            label: 'Proyecto', 
            type: 'select' as const, 
            required: true,
            options: usuario.proyectosAsignados // Esto debería ser dinámico
          },
          { id: 'ubicacion_fisica', label: 'Ubicación Física', type: 'text' as const, required: true },
          { id: 'nivel', label: 'Nivel/Piso', type: 'text' as const },
          { id: 'sector', label: 'Sector', type: 'text' as const },
          { id: 'partida_constructiva', label: 'Partida Constructiva', type: 'text' as const },
          { id: 'coordenadas', label: 'Coordenadas GPS', type: 'location' as const }
        ]
      },
      {
        id: 'programacion',
        title: 'Programación',
        fields: [
          { id: 'fecha_programada', label: 'Fecha Programada', type: 'date' as const, required: true },
          { id: 'hora_programada', label: 'Hora', type: 'time' as const, required: true },
          { id: 'duracion_estimada', label: 'Duración Estimada (min)', type: 'number' as const, required: true }
        ]
      },
      {
        id: 'checklist',
        title: 'Template de Checklist',
        fields: [
          { 
            id: 'template_checklist', 
            label: 'Template de Checklist', 
            type: 'select' as const, 
            required: true,
            options: templatesChecklist.map(t => t.nombre)
          }
        ]
      }
    ]

    return (
      <FormTemplate
        mode="single"
        title="Nueva Inspección de Calidad"
        subtitle="Complete la información para crear una nueva inspección"
        sections={seccionesFormulario}
        role={usuario.rol}
        onSubmit={async (datosFormulario) => {
          const templateSeleccionado = templatesChecklist.find(t => t.nombre === datosFormulario.template_checklist)
          
          const nuevaInspeccion = {
            codigo: datosFormulario.codigo,
            nombre: datosFormulario.nombre,
            descripcion: datosFormulario.descripcion,
            proyectoId: datosFormulario.proyecto_id,
            proyectoNombre: 'Nombre del Proyecto', // Esto debería ser dinámico
            tipoInspeccion: datosFormulario.tipo_inspeccion.toLowerCase(),
            especialidad: datosFormulario.especialidad,
            partidaConstructiva: datosFormulario.partida_constructiva,
            ubicacionFisica: datosFormulario.ubicacion_fisica,
            nivel: datosFormulario.nivel,
            sector: datosFormulario.sector,
            fechaProgramada: `${datosFormulario.fecha_programada}T${datosFormulario.hora_programada}:00.000Z`,
            duracionEstimada: parseInt(datosFormulario.duracion_estimada),
            inspector: {
              id: usuario.id,
              nombre: usuario.nombre,
              certificaciones: usuario.certificaciones,
              firma: usuario.firmaDigital || ''
            },
            estado: 'programada' as const,
            avance: 0,
            checklistItems: templateSeleccionado?.items.map(item => ({
              ...item,
              id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              estado: 'pendiente' as const,
              fotos: [],
              documentos: [],
              inspector: '',
              observaciones: [],
              noConformidades: [],
              metadata: {
                version: '1.0',
                fechaCreacion: new Date().toISOString(),
                ultimaModificacion: new Date().toISOString(),
                modificadoPor: usuario.nombre
              }
            })) || [],
            itemsAprobados: 0,
            itemsRechazados: 0,
            itemsPendientes: templateSeleccionado?.items.length || 0,
            resultadoGeneral: 'aprobado' as const,
            puntajeCalidad: 0,
            cumplimientoNormativa: 0,
            equiposUtilizados: [],
            coordenadas: datosFormulario.coordenadas ? {
              lat: parseFloat(datosFormulario.coordenadas.split(',')[0]),
              lng: parseFloat(datosFormulario.coordenadas.split(',')[1])
            } : undefined,
            requiereSeguimiento: false
          }

          await onInspeccionCrear?.(nuevaInspeccion)
          setVistaActiva('inspecciones')
        }}
        onCancel={() => setVistaActiva('inspecciones')}
      />
    )
  }

  // Renderizar checklist de inspección
  const renderChecklist = () => {
    if (!inspeccionSeleccionada) return null

    return (
      <div className="space-y-6">
        {/* Header de inspección */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{inspeccionSeleccionada.nombre}</h1>
              <p className="text-gray-600">{inspeccionSeleccionada.descripcion}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={
                inspeccionSeleccionada.estado === 'completada' ? 'success' :
                inspeccionSeleccionada.estado === 'en_proceso' ? 'warning' : 'secondary'
              }>
                {inspeccionSeleccionada.estado}
              </Badge>
              {modoInspeccion === 'edicion' && (
                <Button onClick={handleCompletarInspeccion}>
                  Completar Inspección
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="font-medium mb-1">Proyecto</h3>
              <p className="text-sm">{inspeccionSeleccionada.proyectoNombre}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Ubicación</h3>
              <p className="text-sm">{inspeccionSeleccionada.ubicacionFisica}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Inspector</h3>
              <p className="text-sm">{inspeccionSeleccionada.inspector.nombre}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Fecha</h3>
              <p className="text-sm">
                {new Date(inspeccionSeleccionada.fechaProgramada).toLocaleDateString('es-CL')}
              </p>
            </div>
          </div>

          {/* Progreso */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span>Progreso de Inspección</span>
              <span>{inspeccionSeleccionada.avance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${inspeccionSeleccionada.avance}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{inspeccionSeleccionada.itemsAprobados} aprobados</span>
              <span>{inspeccionSeleccionada.itemsPendientes} pendientes</span>
              <span>{inspeccionSeleccionada.itemsRechazados} rechazados</span>
            </div>
          </div>
        </Card>

        {/* Items del checklist */}
        <div className="space-y-4">
          {inspeccionSeleccionada.checklistItems.map(item => (
            <Card key={item.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.descripcion}</h3>
                  <p className="text-sm text-gray-600">{item.categoria}</p>
                  {item.normativaReferencia && (
                    <p className="text-xs text-blue-600">Ref: {item.normativaReferencia}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {item.obligatorio && (
                    <Badge variant="outline" className="text-xs">Obligatorio</Badge>
                  )}
                  <Badge variant={
                    item.estado === 'aprobado' ? 'success' :
                    item.estado === 'rechazado' ? 'destructive' :
                    item.estado === 'en_revision' ? 'warning' : 'secondary'
                  }>
                    {item.estado}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {/* Criterio de aprobación */}
                <div>
                  <h4 className="font-medium mb-1">Criterio de Aprobación</h4>
                  <p className="text-sm text-gray-600">{item.criterioAprobacion}</p>
                </div>

                {modoInspeccion === 'edicion' && item.estado === 'pendiente' && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {/* Resultado de verificación */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Resultado</label>
                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          variant={item.estado === 'aprobado' ? 'default' : 'outline'}
                          onClick={() => handleActualizarItem(item, { 
                            estado: 'aprobado',
                            resultado: 'Cumple con los criterios establecidos'
                          })}
                        >
                          ✅ Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant={item.estado === 'rechazado' ? 'destructive' : 'outline'}
                          onClick={() => handleActualizarItem(item, { 
                            estado: 'rechazado',
                            resultado: 'No cumple con los criterios'
                          })}
                        >
                          ❌ Rechazar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActualizarItem(item, { estado: 'no_aplica' })}
                        >
                          N/A
                        </Button>
                      </div>
                    </div>

                    {/* Medición (si aplica) */}
                    {item.tipoVerificacion === 'medicion' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Valor Medido {item.unidadMedida && `(${item.unidadMedida})`}
                        </label>
                        <Input
                          type="number"
                          value={item.valor || ''}
                          onChange={(e) => handleActualizarItem(item, { 
                            valor: parseFloat(e.target.value) 
                          })}
                          className="w-32"
                        />
                        {item.rangoAceptable && (
                          <p className="text-xs text-gray-500 mt-1">
                            Rango aceptable: {item.rangoAceptable.min} - {item.rangoAceptable.max}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Fotos */}
                    {item.requiereFoto && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">Fotografías</label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCapturarFoto(item.id)}
                          >
                            📷 Tomar Foto
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {item.fotos.map(foto => (
                            <img
                              key={foto.id}
                              src={foto.url}
                              alt="Evidencia"
                              className="w-full h-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Observaciones */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Observaciones</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={2}
                        placeholder="Agregar observaciones..."
                        onBlur={(e) => {
                          if (e.target.value.trim()) {
                            handleActualizarItem(item, {
                              observaciones: [...item.observaciones, e.target.value.trim()]
                            })
                            e.target.value = ''
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Mostrar resultado si ya fue inspeccionado */}
                {item.estado !== 'pendiente' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {item.resultado && (
                      <div className="mb-2">
                        <span className="font-medium">Resultado: </span>
                        <span>{item.resultado}</span>
                      </div>
                    )}

                    {item.valor && (
                      <div className="mb-2">
                        <span className="font-medium">Valor: </span>
                        <span>{item.valor} {item.unidadMedida}</span>
                      </div>
                    )}

                    {item.fotos?.length > 0 && (
                      <div className="mb-2">
                        <span className="font-medium">Fotos: </span>
                        <div className="grid grid-cols-4 gap-2 mt-1">
                          {item.fotos.map(foto => (
                            <img
                              key={foto.id}
                              src={foto.url}
                              alt="Evidencia"
                              className="w-full h-16 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {item.observaciones?.length > 0 && (
                      <div className="mb-2">
                        <span className="font-medium">Observaciones:</span>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {item.observaciones.map((obs, index) => (
                            <li key={index}>{obs}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.noConformidades?.length > 0 && (
                      <div>
                        <span className="font-medium text-red-600">No Conformidades:</span>
                        <div className="space-y-2 mt-1">
                          {item.noConformidades.map(nc => (
                            <div key={nc.id} className="bg-red-50 p-2 rounded border border-red-200">
                              <div className="flex justify-between items-start">
                                <span className="text-sm">{nc.descripcion}</span>
                                <Badge variant="destructive" className="text-xs">
                                  {nc.severidad}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(nc.fechaDeteccion).toLocaleDateString('es-CL')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Renderizar galería de fotos
  const renderGaleriaFotos = () => {
    const todasLasFotos = inspeccionesFiltradas.flatMap(inspeccion =>
      inspeccion.checklistItems.flatMap(item =>
        item.fotos.map(foto => ({
          ...foto,
          inspeccion: inspeccion.nombre,
          item: item.descripcion
        }))
      )
    )

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Galería de Fotos de Calidad</h2>
          
          {todasLasFotos.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-lg font-medium mb-2">No hay fotos disponibles</h3>
              <p className="text-gray-600">
                Las fotos capturadas durante las inspecciones aparecerán aquí.
              </p>
            </div>
          ) : (
            <PhotoGallery
              photos={todasLasFotos.map(foto => ({
                id: foto.id,
                url: foto.url,
                title: `${foto.inspeccion} - ${foto.item}`,
                timestamp: foto.timestamp,
                location: foto.coordenadas,
                tags: ['calidad', 'inspeccion'],
                metadata: {
                  project: foto.inspeccion,
                  inspector: 'Inspector',
                  equipment: 'Móvil'
                }
              }))}
              onPhotoSelect={(photo) => console.log('Foto seleccionada:', photo)}
              onPhotoDelete={(photoId) => console.log('Eliminar foto:', photoId)}
              enableAnnotations={true}
              showMetadata={true}
              groupBy="project"
            />
          )}
        </Card>
      </div>
    )
  }

  // Renderizar contenido principal
  const renderContenidoPrincipal = () => {
    switch (vistaActiva) {
      case 'dashboard':
        return renderDashboard()
      case 'inspecciones':
        return renderInspecciones()
      case 'nueva-inspeccion':
        return renderNuevaInspeccion()
      case 'checklist':
        return renderChecklist()
      case 'fotos':
        return renderGaleriaFotos()
      default:
        return renderDashboard()
    }
  }

  // Navegación móvil
  const navegacionMobile = useMemo(() => ({
    type: 'bottom' as const,
    position: 'fixed' as const,
    items: [
      {
        id: 'dashboard',
        label: 'Inicio',
        icon: '🏠',
        active: vistaActiva === 'dashboard',
        onClick: () => setVistaActiva('dashboard')
      },
      {
        id: 'inspecciones',
        label: 'Inspecciones',
        icon: '📋',
        active: vistaActiva === 'inspecciones',
        onClick: () => setVistaActiva('inspecciones'),
        badge: estadisticas.pendientes > 0 ? estadisticas.pendientes : undefined
      },
      {
        id: 'nueva',
        label: 'Nueva',
        icon: '➕',
        onClick: () => setVistaActiva('nueva-inspeccion')
      },
      {
        id: 'fotos',
        label: 'Fotos',
        icon: '📷',
        active: vistaActiva === 'fotos',
        onClick: () => setVistaActiva('fotos')
      }
    ]
  }), [vistaActiva, estadisticas.pendientes])

  // Renderizar según dispositivo
  if (esMobile) {
    return (
      <MobileTemplate
        title={
          vistaActiva === 'dashboard' ? 'Control de Calidad' :
          vistaActiva === 'inspecciones' ? 'Inspecciones' :
          vistaActiva === 'nueva-inspeccion' ? 'Nueva Inspección' :
          vistaActiva === 'checklist' ? inspeccionSeleccionada?.nombre || 'Checklist' :
          vistaActiva === 'fotos' ? 'Galería de Fotos' : 'Calidad'
        }
        subtitle={
          vistaActiva === 'dashboard' ? `${estadisticas.hoy} inspecciones hoy` :
          vistaActiva === 'inspecciones' ? `${estadisticas.total} total` :
          undefined
        }
        showBackButton={vistaActiva !== 'dashboard'}
        onBack={() => {
          if (vistaActiva === 'checklist') {
            setVistaActiva('inspecciones')
            setInspeccionSeleccionada(null)
          } else {
            setVistaActiva('dashboard')
          }
        }}
        navigation={navegacionMobile}
        role={usuario.rol}
        cameraAccess={true}
        locationAccess={configuracion.gpsObligatorio}
        onCameraCapture={(file) => {
          if (itemChecklistActivo && inspeccionSeleccionada) {
            handleCapturarFoto(itemChecklistActivo.id)
          }
        }}
        onLocationCapture={(coords) => setUbicacionActual(coords)}
        connectionStatus={modoOffline ? 'offline' : 'online'}
        offline={{
          enabled: configuracion.sincronizacionOffline,
          strategies: ['cache-first'],
          syncOnReconnect: true
        }}
        className={cn(qualityControlVariants({ mode, layout, inspectionType }), className)}
        {...props}
      >
        {renderContenidoPrincipal()}
      </MobileTemplate>
    )
  }

  // Versión desktop
  return (
    <div className={cn(qualityControlVariants({ mode, layout, inspectionType }), className)} {...props}>
      {/* Navigation Bar */}
      <NavigationBar 
        currentUser={{
          id: usuario.id,
          name: usuario.nombre,
          role: 'QUALITY_INSPECTOR',
          isOnline: true
        }}
      />
      
      {/* Header de navegación */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Control de Calidad</h1>
            <p className="text-gray-600">
              {estadisticas.hoy} inspecciones hoy • {estadisticas.pendientes} pendientes
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={vistaActiva === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setVistaActiva('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                size="sm"
                variant={vistaActiva === 'inspecciones' ? 'default' : 'ghost'}
                onClick={() => setVistaActiva('inspecciones')}
              >
                Inspecciones
              </Button>
              <Button
                size="sm"
                variant={vistaActiva === 'fotos' ? 'default' : 'ghost'}
                onClick={() => setVistaActiva('fotos')}
              >
                Fotos
              </Button>
            </div>

            <Button onClick={() => setVistaActiva('nueva-inspeccion')}>
              Nueva Inspección
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        ) : (
          renderContenidoPrincipal()
        )}
      </div>

      {/* Indicador de modo offline */}
      {modoOffline && (
        <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>📱</span>
            <span className="text-sm">Modo Offline</span>
          </div>
        </div>
      )}
    </div>
  )
}