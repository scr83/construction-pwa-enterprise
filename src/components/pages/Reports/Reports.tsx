'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Importar todos los componentes necesarios
import { ReportTemplate } from '@/components/templates/ReportTemplate'
import { MobileTemplate } from '@/components/templates/MobileTemplate'
import { ReportViewer } from '@/components/organisms/ReportViewer'
import { MetricDisplay } from '@/components/molecules/MetricDisplay'
// import { ChartDisplay } from '@/components/molecules/ChartDisplay' // Component not found
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'

// Definir variantes del componente
export const reportsVariants = cva(
  "min-h-screen bg-gray-50",
  {
    variants: {
      mode: {
        dashboard: "reports-dashboard-view",
        builder: "reports-builder-view",
        viewer: "reports-viewer-view",
        analytics: "reports-analytics-view"
      },
      layout: {
        desktop: "desktop-reports-layout",
        mobile: "mobile-reports-layout",
        print: "print-reports-layout"
      },
      reportType: {
        executive: "executive-report",
        financial: "financial-report",
        progress: "progress-report",
        quality: "quality-report",
        custom: "custom-report"
      }
    },
    defaultVariants: {
      mode: "dashboard",
      layout: "desktop",
      reportType: "executive"
    }
  }
)

// Interfaces TypeScript para reportes de construcción
export interface ReporteDefinition {
  id: string
  nombre: string
  descripcion: string
  tipo: 'ejecutivo' | 'financiero' | 'avance' | 'calidad' | 'equipos' | 'materiales' | 'seguridad' | 'personalizado'
  categoria: 'operacional' | 'gerencial' | 'tecnico' | 'regulatorio'
  
  // Configuración del reporte
  periodicidad: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'trimestral' | 'anual' | 'personalizado'
  formatoSalida: 'pdf' | 'excel' | 'powerpoint' | 'web'
  
  // Fuentes de datos
  fuentesDatos: Array<{
    id: string
    nombre: string
    tipo: 'proyectos' | 'inspecciones' | 'materiales' | 'equipos' | 'financiero' | 'rrhh'
    filtros?: Record<string, any>
  }>
  
  // Estructura del reporte
  secciones: Array<{
    id: string
    titulo: string
    tipo: 'kpi' | 'grafico' | 'tabla' | 'texto' | 'imagen'
    configuracion: Record<string, any>
    orden: number
    visible: boolean
  }>
  
  // Permisos y audiencia
  destinatarios: Array<{
    rol: string
    email?: string
    notificaciones: boolean
  }>
  
  // Configuración de entrega
  envioAutomatico: boolean
  cronExpresion?: string
  proximoEnvio?: string
  
  // Metadatos
  metadata: {
    creadoPor: string
    fechaCreacion: string
    ultimaModificacion: string
    version: string
    activo: boolean
    plantilla: boolean
  }
}

export interface ReporteGenerado {
  id: string
  reporteDefinicionId: string
  nombre: string
  descripcion?: string
  
  // Información temporal
  periodoInicio: string
  periodoFin: string
  fechaGeneracion: string
  
  // Datos del reporte
  datos: {
    kpis: Array<{
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
    }>
    
    graficos: Array<{
      id: string
      titulo: string
      tipo: 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'scatter'
      datos: any[]
      configuracion?: Record<string, any>
    }>
    
    tablas: Array<{
      id: string
      titulo: string
      columnas: Array<{
        clave: string
        titulo: string
        tipo?: 'texto' | 'numero' | 'fecha' | 'moneda' | 'porcentaje'
        formato?: string
      }>
      filas: any[]
      resumen?: {
        totales?: Record<string, number>
        promedios?: Record<string, number>
      }
    }>
    
    textos: Array<{
      id: string
      titulo: string
      contenido: string
      formato: 'texto' | 'markdown' | 'html'
    }>
  }
  
  // Estado y metadatos
  estado: 'generando' | 'completado' | 'error' | 'enviado'
  tamanoArchivo?: number
  urlDescarga?: string
  
  // Información de entrega
  enviadoA: Array<{
    destinatario: string
    fechaEnvio: string
    estado: 'enviado' | 'entregado' | 'error'
  }>
  
  metadata: {
    duracionGeneracion: number
    registrosProcesados: number
    alertasGeneradas: number
    version: string
  }
}

export interface ConfiguracionReportes {
  // Configuración general
  logoEmpresa: string
  nombreEmpresa: string
  colorCorporativo: string
  marcaAgua?: string
  
  // Configuración de exportación
  incluirPortada: boolean
  incluirIndice: boolean
  incluirFirmaDigital: boolean
  comprimirImagenes: boolean
  
  // Configuración de envío
  servidorSMTP: {
    host: string
    puerto: number
    usuario: string
    ssl: boolean
  }
  
  // Configuración de almacenamiento
  retencionReportes: number // días
  almacenamientoNube: boolean
  rutaAlmacenamiento: string
  
  // Configuración de rendimiento
  limiteConcurrente: number
  timeoutGeneracion: number
  cacheResultados: boolean
}

export interface FiltrosReporte {
  fechaInicio?: string
  fechaFin?: string
  proyectos?: string[]
  tipos?: string[]
  estados?: string[]
  responsables?: string[]
  categoria?: string[]
}

export interface ReportsProps extends VariantProps<typeof reportsVariants> {
  // Usuario y contexto
  usuario: {
    id: string
    nombre: string
    rol: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
    permisos: string[]
    proyectosAsignados: string[]
  }
  
  // Datos
  reportesDefinidos: ReporteDefinition[]
  reportesGenerados: ReporteGenerado[]
  proyectos: Array<{
    id: string
    nombre: string
    codigo: string
  }>
  
  // Configuración
  configuracion: ConfiguracionReportes
  esMobile?: boolean
  
  // Estados
  isLoading?: boolean
  error?: string
  
  // Filtros
  filtros?: FiltrosReporte
  
  // Callbacks principales
  onReporteDefinir?: (definicion: Omit<ReporteDefinition, 'id' | 'metadata'>) => Promise<void>
  onReporteActualizar?: (id: string, definicion: Partial<ReporteDefinition>) => Promise<void>
  onReporteEliminar?: (id: string) => Promise<void>
  onReporteGenerar?: (definicionId: string, parametros?: any) => Promise<string>
  onReporteDescargar?: (reporteId: string) => Promise<void>
  onReporteEnviar?: (reporteId: string, destinatarios: string[]) => Promise<void>
  
  // Callbacks de análisis
  onAnalisisPersonalizado?: (configuracion: any) => Promise<any>
  onDashboardPersonalizado?: (widgets: any[]) => void
  onExportarDatos?: (datos: any, formato: 'excel' | 'csv' | 'json') => Promise<void>
  
  // Callbacks de UI
  onFiltrosChange?: (filtros: FiltrosReporte) => void
  onVistaChange?: (vista: string) => void
  
  // Personalización
  className?: string
}

export function Reports({
  usuario,
  reportesDefinidos = [],
  reportesGenerados = [],
  proyectos = [],
  configuracion,
  esMobile = false,
  isLoading = false,
  error,
  filtros = {},
  onReporteDefinir,
  onReporteActualizar,
  onReporteEliminar,
  onReporteGenerar,
  onReporteDescargar,
  onReporteEnviar,
  onAnalisisPersonalizado,
  onDashboardPersonalizado,
  onExportarDatos,
  onFiltrosChange,
  onVistaChange,
  mode = "dashboard",
  layout,
  reportType,
  className,
  ...props
}: ReportsProps) {
  // Estados locales
  const [vistaActiva, setVistaActiva] = useState<'dashboard' | 'reportes' | 'generar' | 'analytics' | 'configuracion'>('dashboard')
  const [reporteSeleccionado, setReporteSeleccionado] = useState<ReporteGenerado | null>(null)
  const [definicionSeleccionada, setDefinicionSeleccionada] = useState<ReporteDefinition | null>(null)
  const [generandoReporte, setGenerandoReporte] = useState<string | null>(null)
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosReporte>(filtros)
  const [parametrosReporte, setParametrosReporte] = useState<any>({})

  // Datos derivados y filtrados
  const reportesFiltrados = useMemo(() => {
    let resultado = reportesGenerados

    if (filtrosAplicados.fechaInicio) {
      resultado = resultado.filter(r => 
        new Date(r.fechaGeneracion) >= new Date(filtrosAplicados.fechaInicio!)
      )
    }

    if (filtrosAplicados.fechaFin) {
      resultado = resultado.filter(r => 
        new Date(r.fechaGeneracion) <= new Date(filtrosAplicados.fechaFin!)
      )
    }

    if (filtrosAplicados.tipos?.length) {
      resultado = resultado.filter(r => {
        const definicion = reportesDefinidos.find(d => d.id === r.reporteDefinicionId)
        return definicion && filtrosAplicados.tipos!.includes(definicion.tipo)
      })
    }

    if (filtrosAplicados.estados?.length) {
      resultado = resultado.filter(r => filtrosAplicados.estados!.includes(r.estado))
    }

    return resultado.sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime())
  }, [reportesGenerados, reportesDefinidos, filtrosAplicados])

  // Estadísticas derivadas
  const estadisticas = useMemo(() => {
    const hoy = new Date().toDateString()
    const reportesHoy = reportesFiltrados.filter(r => 
      new Date(r.fechaGeneracion).toDateString() === hoy
    )

    const reportesPendientes = reportesDefinidos.filter(d => {
      if (!d.envioAutomatico || !d.proximoEnvio) return false
      return new Date(d.proximoEnvio) <= new Date()
    })

    return {
      total: reportesFiltrados.length,
      hoy: reportesHoy.length,
      pendientes: reportesPendientes.length,
      completados: reportesFiltrados.filter(r => r.estado === 'completado').length,
      enviados: reportesFiltrados.filter(r => r.estado === 'enviado').length,
      errores: reportesFiltrados.filter(r => r.estado === 'error').length,
      definicionesActivas: reportesDefinidos.filter(d => d.metadata.activo).length
    }
  }, [reportesFiltrados, reportesDefinidos])

  // Handlers principales
  const handleGenerarReporte = useCallback(async (definicionId: string) => {
    setGenerandoReporte(definicionId)
    try {
      const reporteId = await onReporteGenerar?.(definicionId, parametrosReporte)
      console.log('Reporte generado:', reporteId)
    } catch (error) {
      console.error('Error generando reporte:', error)
    } finally {
      setGenerandoReporte(null)
    }
  }, [onReporteGenerar, parametrosReporte])

  const handleDescargarReporte = useCallback(async (reporteId: string) => {
    await onReporteDescargar?.(reporteId)
  }, [onReporteDescargar])

  const handleEnviarReporte = useCallback(async (reporteId: string, destinatarios: string[]) => {
    await onReporteEnviar?.(reporteId, destinatarios)
  }, [onReporteEnviar])

  const handleFiltrosChange = useCallback((nuevosFiltros: FiltrosReporte) => {
    setFiltrosAplicados(nuevosFiltros)
    onFiltrosChange?.(nuevosFiltros)
  }, [onFiltrosChange])

  const handleVistaChange = useCallback((vista: string) => {
    setVistaActiva(vista as any)
    onVistaChange?.(vista)
  }, [onVistaChange])

  // Renderizar dashboard de reportes
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Total</h3>
          <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
          <p className="text-sm text-gray-500">reportes</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Hoy</h3>
          <div className="text-2xl font-bold text-green-600">{estadisticas.hoy}</div>
          <p className="text-sm text-gray-500">generados</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Pendientes</h3>
          <div className="text-2xl font-bold text-orange-600">{estadisticas.pendientes}</div>
          <p className="text-sm text-gray-500">por generar</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Completados</h3>
          <div className="text-2xl font-bold text-green-600">{estadisticas.completados}</div>
          <p className="text-sm text-gray-500">exitosos</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Enviados</h3>
          <div className="text-2xl font-bold text-blue-600">{estadisticas.enviados}</div>
          <p className="text-sm text-gray-500">distribuidos</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-gray-700 mb-1">Errores</h3>
          <div className="text-2xl font-bold text-red-600">{estadisticas.errores}</div>
          <p className="text-sm text-gray-500">fallidos</p>
        </Card>
      </div>

      {/* Reportes recientes */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reportes Recientes</h2>
          <Button onClick={() => setVistaActiva('reportes')}>
            Ver Todos
          </Button>
        </div>
        
        <div className="space-y-3">
          {reportesFiltrados.slice(0, 5).map(reporte => {
            const definicion = reportesDefinidos.find(d => d.id === reporte.reporteDefinicionId)
            return (
              <div 
                key={reporte.id}
                className="flex items-center justify-between p-4 min-h-[48px] bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setReporteSeleccionado(reporte)
                  setVistaActiva('analytics')
                }}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{reporte.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    {definicion?.tipo} • {new Date(reporte.fechaGeneracion).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={
                    reporte.estado === 'completado' ? 'success' :
                    reporte.estado === 'enviado' ? 'success' :
                    reporte.estado === 'generando' ? 'warning' :
                    reporte.estado === 'error' ? 'destructive' : 'secondary'
                  }>
                    {reporte.estado}
                  </Badge>
                  
                  {reporte.estado === 'completado' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDescargarReporte(reporte.id)
                        }}
                      >
                        📥 Descargar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {reportesFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No hay reportes generados aún</p>
          </div>
        )}
      </Card>

      {/* Definiciones de reportes */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reportes Configurados</h2>
          <Button onClick={() => setVistaActiva('generar')}>
            Nuevo Reporte
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportesDefinidos.filter(d => d.metadata.activo).map(definicion => (
            <Card key={definicion.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setDefinicionSeleccionada(definicion)
                    setVistaActiva('generar')
                  }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{definicion.nombre}</h3>
                  <p className="text-sm text-gray-600">{definicion.descripcion}</p>
                </div>
                <Badge variant="outline">
                  {definicion.tipo}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Periodicidad:</span>
                  <span className="font-medium">{definicion.periodicidad}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Formato:</span>
                  <span className="font-medium">{definicion.formatoSalida}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Secciones:</span>
                  <span className="font-medium">{definicion?.secciones?.length || 0}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {definicion.envioAutomatico ? 'Automático' : 'Manual'}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerarReporte(definicion.id)
                      }}
                      disabled={generandoReporte === definicion.id}
                    >
                      {generandoReporte === definicion.id ? '⏳ Generando...' : '▶️ Generar'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {reportesDefinidos.filter(d => d.metadata.activo).length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium mb-2">No hay reportes configurados</h3>
            <p className="text-gray-600 mb-4">
              Configure su primer reporte para comenzar a generar análisis automáticos.
            </p>
            <Button onClick={() => setVistaActiva('generar')}>
              Crear Primer Reporte
            </Button>
          </div>
        )}
      </Card>

      {/* Acciones rápidas */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => setVistaActiva('generar')}
          >
            <span className="text-2xl mb-1">📊</span>
            Generar Reporte
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => setVistaActiva('analytics')}
          >
            <span className="text-2xl mb-1">📈</span>
            Ver Analytics
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => onExportarDatos?.(reportesFiltrados, 'excel')}
          >
            <span className="text-2xl mb-1">📤</span>
            Exportar Datos
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => setVistaActiva('configuracion')}
          >
            <span className="text-2xl mb-1">⚙️</span>
            Configuración
          </Button>
        </div>
      </Card>
    </div>
  )

  // Renderizar lista de reportes
  const renderReportes = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            type="date"
            value={filtrosAplicados.fechaInicio || ''}
            onChange={(e) => handleFiltrosChange({ ...filtrosAplicados, fechaInicio: e.target.value })}
            placeholder="Fecha inicio"
          />
          <Input
            type="date"
            value={filtrosAplicados.fechaFin || ''}
            onChange={(e) => handleFiltrosChange({ ...filtrosAplicados, fechaFin: e.target.value })}
            placeholder="Fecha fin"
          />
          <select
            value={filtrosAplicados.tipos?.[0] || ''}
            onChange={(e) => handleFiltrosChange({ 
              ...filtrosAplicados, 
              tipos: e.target.value ? [e.target.value] : undefined 
            })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos los tipos</option>
            <option value="ejecutivo">Ejecutivo</option>
            <option value="financiero">Financiero</option>
            <option value="avance">Avance</option>
            <option value="calidad">Calidad</option>
            <option value="equipos">Equipos</option>
          </select>
          <select
            value={filtrosAplicados.estados?.[0] || ''}
            onChange={(e) => handleFiltrosChange({ 
              ...filtrosAplicados, 
              estados: e.target.value ? [e.target.value] : undefined 
            })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos los estados</option>
            <option value="completado">Completado</option>
            <option value="enviado">Enviado</option>
            <option value="generando">Generando</option>
            <option value="error">Error</option>
          </select>
          <Button 
            variant="outline"
            onClick={() => handleFiltrosChange({})}
          >
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Lista de reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reportesFiltrados.map(reporte => {
          const definicion = reportesDefinidos.find(d => d.id === reporte.reporteDefinicionId)
          return (
            <Card key={reporte.id} className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setReporteSeleccionado(reporte)
                    setVistaActiva('analytics')
                  }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{reporte.nombre}</h3>
                  <p className="text-sm text-gray-600">{reporte.descripcion}</p>
                </div>
                <Badge variant={
                  reporte.estado === 'completado' ? 'success' :
                  reporte.estado === 'enviado' ? 'success' :
                  reporte.estado === 'generando' ? 'warning' :
                  reporte.estado === 'error' ? 'destructive' : 'secondary'
                }>
                  {reporte.estado}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <div className="font-medium">{definicion?.tipo}</div>
                </div>
                <div>
                  <span className="text-gray-600">Período:</span>
                  <div className="font-medium">
                    {new Date(reporte.periodoInicio).toLocaleDateString('es-CL')} - 
                    {new Date(reporte.periodoFin).toLocaleDateString('es-CL')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Generado:</span>
                  <div className="font-medium">
                    {new Date(reporte.fechaGeneracion).toLocaleDateString('es-CL')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Tamaño:</span>
                  <div className="font-medium">
                    {reporte.tamanoArchivo ? `${(reporte.tamanoArchivo / 1024 / 1024).toFixed(2)} MB` : '-'}
                  </div>
                </div>
              </div>

              {/* Métricas del reporte */}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {reporte.datos?.kpis?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">KPIs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {reporte.datos?.graficos?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Gráficos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">
                      {reporte.datos?.tablas?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Tablas</div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {reporte.estado === 'completado' && (
                <div className="mt-4 pt-4 border-t flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDescargarReporte(reporte.id)
                    }}
                    className="flex-1"
                  >
                    📥 Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEnviarReporte(reporte.id, ['equipo@empresa.com'])
                    }}
                    className="flex-1"
                  >
                    📧 Enviar
                  </Button>
                </div>
              )}

              {/* Información de envío */}
              {reporte.enviadoA?.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    Enviado a: {reporte.enviadoA.map(e => e.destinatario).join(', ')}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {reportesFiltrados.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron reportes</h3>
          <p className="text-gray-600 mb-4">
            No hay reportes que coincidan con los filtros aplicados.
          </p>
          <Button onClick={() => setVistaActiva('generar')}>
            Generar Nuevo Reporte
          </Button>
        </Card>
      )}
    </div>
  )

  // Renderizar visor de reportes/analytics
  const renderAnalytics = () => {
    if (!reporteSeleccionado) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Seleccione un Reporte</h2>
          <p className="text-gray-600">Elija un reporte para ver su contenido y análisis.</p>
        </div>
      )
    }

    return (
      <ReportTemplate
        report={{
          id: reporteSeleccionado.id,
          title: reporteSeleccionado.nombre,
          description: reporteSeleccionado.descripcion,
          type: 'financial',
          period: {
            start: reporteSeleccionado.periodoInicio,
            end: reporteSeleccionado.periodoFin,
            type: 'custom'
          },
          data: reporteSeleccionado.datos,
          metadata: {
            generatedAt: reporteSeleccionado.fechaGeneracion,
            generatedBy: usuario.nombre,
            version: reporteSeleccionado.metadata.version,
            currency: 'CLP'
          }
        }}
        sections={[
          {
            id: 'kpis-section',
            title: 'Indicadores Principales',
            subtitle: 'Métricas clave del período analizado',
            type: 'kpis',
            layout: 'grid-4',
            content: {
              kpis: reporteSeleccionado.datos.kpis
            }
          },
          {
            id: 'charts-section',
            title: 'Análisis Gráfico',
            subtitle: 'Visualización de tendencias y comparativas',
            type: 'charts',
            layout: 'grid-2',
            content: {
              charts: reporteSeleccionado.datos.graficos
            }
          },
          {
            id: 'tables-section',
            title: 'Datos Detallados',
            subtitle: 'Información tabular y resúmenes',
            type: 'table',
            layout: 'single',
            content: {
              tables: reporteSeleccionado.datos.tablas
            }
          }
        ]}
        layout="detailed"
        enableExport={true}
        exportOptions={[
          { format: 'pdf', fileName: `${reporteSeleccionado.nombre}.pdf`, includeCharts: true },
          { format: 'excel', fileName: `${reporteSeleccionado.nombre}.xlsx`, includeRawData: true }
        ]}
        onExport={(config) => {
          console.log('Exportar reporte con configuración:', config)
          handleDescargarReporte(reporteSeleccionado.id)
        }}
        role={usuario.rol}
        permissions={{
          canExport: usuario?.permisos?.includes?.('exportar_reportes') || false,
          canShare: usuario?.permisos?.includes?.('compartir_reportes') || false
        }}
        companyName={configuracion.nombreEmpresa}
        watermark={configuracion.marcaAgua}
      />
    )
  }

  // Renderizar generador de reportes
  const renderGenerador = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Generador de Reportes</h2>
        <p className="text-gray-600 mb-6">
          Configure los parámetros para generar un nuevo reporte personalizado.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuración básica */}
          <div className="space-y-4">
            <h3 className="font-medium">Configuración Básica</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Reporte</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="ejecutivo">Reporte Ejecutivo</option>
                <option value="financiero">Reporte Financiero</option>
                <option value="avance">Reporte de Avance</option>
                <option value="calidad">Reporte de Calidad</option>
                <option value="equipos">Reporte de Equipos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Período</label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" placeholder="Fecha inicio" />
                <Input type="date" placeholder="Fecha fin" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Proyectos</label>
              <select multiple className="w-full px-3 py-2 border border-gray-300 rounded-md h-24">
                {proyectos.map(proyecto => (
                  <option key={proyecto.id} value={proyecto.id}>
                    {proyecto.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Configuración avanzada */}
          <div className="space-y-4">
            <h3 className="font-medium">Configuración Avanzada</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Formato de Salida</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="powerpoint">PowerPoint</option>
                <option value="web">Web</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secciones a Incluir</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Resumen Ejecutivo</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Indicadores KPI</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Análisis Gráficos</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Datos Detallados</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Fotografías</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Destinatarios</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={3}
                placeholder="Ingrese emails separados por coma"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => setVistaActiva('dashboard')}>
            Cancelar
          </Button>
          <Button 
            onClick={async () => {
              try {
                // Simulate report generation with loading state
                setGenerandoReporte('new-report')
                
                // Collect form data (simplified for MVP)
                const tipoReporte = (document.querySelector('select') as HTMLSelectElement)?.value || 'ejecutivo'
                const fechaInicio = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value
                const fechaFin = (document.querySelector('input[type="date"]:last-child') as HTMLInputElement)?.value
                
                // Create new report object
                const nuevoReporte = {
                  id: `rep-${Date.now()}`,
                  reporteDefinicionId: 'custom',
                  nombre: `Reporte ${tipoReporte.charAt(0).toUpperCase() + tipoReporte.slice(1)} - ${new Date().toLocaleDateString('es-CL')}`,
                  fechaGeneracion: new Date().toISOString(),
                  estado: 'completado' as const,
                  datos: {
                    kpis: [
                      { id: '1', titulo: 'Avance General', valor: 75, tipo: 'porcentaje', estado: 'bueno' },
                      { id: '2', titulo: 'Presupuesto Ejecutado', valor: 68, tipo: 'porcentaje', estado: 'bueno' }
                    ],
                    graficos: [],
                    tablas: [],
                    textos: [`Reporte generado automáticamente el ${new Date().toLocaleDateString('es-CL')}`]
                  },
                  enviadoA: [],
                  metadata: { 
                    duracionGeneracion: 2000, 
                    registrosProcesados: 500, 
                    alertasGeneradas: 0, 
                    version: '1.0' 
                  }
                }
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 2000))
                
                // Call the onReporteGenerar callback if provided
                if (onReporteGenerar) {
                  const reporteId = await onReporteGenerar('custom', { tipoReporte, fechaInicio, fechaFin })
                  console.log('Report generated with ID:', reporteId)
                } else {
                  // Fallback: show success message
                  alert(`Reporte "${nuevoReporte.nombre}" generado exitosamente`)
                }
                
                setGenerandoReporte(null)
                setVistaActiva('reportes')
                
              } catch (error) {
                console.error('Error generating report:', error)
                setGenerandoReporte(null)
                alert('Error al generar el reporte')
              }
            }}
            loading={generandoReporte === 'new-report'}
          >
            {generandoReporte === 'new-report' ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </div>
      </Card>

      {/* Templates predefinidos */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Templates Predefinidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportesDefinidos.filter(d => d.metadata.plantilla).map(template => (
            <Card key={template.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setDefinicionSeleccionada(template)
                    handleGenerarReporte(template.id)
                  }}>
              <h3 className="font-semibold mb-2">{template.nombre}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.descripcion}</p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{template.tipo}</Badge>
                <Button size="sm">Usar Template</Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )

  // Renderizar contenido principal
  const renderContenidoPrincipal = () => {
    switch (vistaActiva) {
      case 'dashboard':
        return renderDashboard()
      case 'reportes':
        return renderReportes()
      case 'generar':
        return renderGenerador()
      case 'analytics':
        return renderAnalytics()
      case 'configuracion':
        return (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración de Reportes</h2>
            <p className="text-gray-600">
              Configuración de parámetros globales para la generación de reportes.
            </p>
          </Card>
        )
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
        id: 'reportes',
        label: 'Reportes',
        icon: '📊',
        active: vistaActiva === 'reportes',
        onClick: () => setVistaActiva('reportes'),
        badge: estadisticas.pendientes > 0 ? estadisticas.pendientes : undefined
      },
      {
        id: 'generar',
        label: 'Generar',
        icon: '➕',
        active: vistaActiva === 'generar',
        onClick: () => setVistaActiva('generar')
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: '📈',
        active: vistaActiva === 'analytics',
        onClick: () => setVistaActiva('analytics')
      }
    ]
  }), [vistaActiva, estadisticas.pendientes])

  // Renderizar según dispositivo
  if (esMobile) {
    return (
      <MobileTemplate
        title={
          vistaActiva === 'dashboard' ? 'Reportes' :
          vistaActiva === 'reportes' ? 'Reportes Generados' :
          vistaActiva === 'generar' ? 'Generar Reporte' :
          vistaActiva === 'analytics' ? reporteSeleccionado?.nombre || 'Analytics' :
          'Reportes'
        }
        subtitle={
          vistaActiva === 'dashboard' ? `${estadisticas.total} reportes total` :
          vistaActiva === 'reportes' ? `${reportesFiltrados.length} encontrados` :
          undefined
        }
        showBackButton={vistaActiva !== 'dashboard'}
        onBack={() => {
          if (vistaActiva === 'analytics') {
            setVistaActiva('reportes')
            setReporteSeleccionado(null)
          } else {
            setVistaActiva('dashboard')
          }
        }}
        navigation={navegacionMobile}
        role={usuario.rol}
        className={cn(reportsVariants({ mode, layout, reportType }), className)}
        {...props}
      >
        {renderContenidoPrincipal()}
      </MobileTemplate>
    )
  }

  // Versión desktop
  return (
    <div className={cn(reportsVariants({ mode, layout, reportType }), className)} {...props}>
      {/* Header de navegación */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centro de Reportes</h1>
            <p className="text-gray-600">
              {estadisticas.total} reportes • {estadisticas.pendientes} pendientes
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={vistaActiva === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => handleVistaChange('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                size="sm"
                variant={vistaActiva === 'reportes' ? 'default' : 'ghost'}
                onClick={() => handleVistaChange('reportes')}
              >
                Reportes
              </Button>
              <Button
                size="sm"
                variant={vistaActiva === 'analytics' ? 'default' : 'ghost'}
                onClick={() => handleVistaChange('analytics')}
              >
                Analytics
              </Button>
            </div>

            <Button onClick={() => handleVistaChange('generar')}>
              Generar Reporte
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
    </div>
  )
}