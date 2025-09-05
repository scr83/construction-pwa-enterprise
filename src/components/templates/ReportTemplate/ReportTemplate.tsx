'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Importar componentes atómicos y moleculares
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'
import { NavigationBar } from '@/components/molecules/NavigationBar'
import { SearchFilter } from '@/components/molecules/SearchFilter'
import { TableView } from '@/components/molecules/TableView'
import { ChartDisplay } from '@/components/molecules/ChartDisplay'

// Definir variantes del componente
export const reportTemplateVariants = cva(
  "min-h-screen bg-gray-50",
  {
    variants: {
      layout: {
        dashboard: "grid grid-cols-1 lg:grid-cols-12 gap-6",
        detailed: "flex flex-col space-y-6",
        comparison: "grid grid-cols-1 xl:grid-cols-2 gap-6",
        fullscreen: "h-screen flex flex-col"
      },
      size: {
        sm: "text-sm",
        md: "text-base", 
        lg: "text-lg"
      },
      exportMode: {
        screen: "",
        print: "print:bg-white print:text-black",
        pdf: "bg-white text-black shadow-none"
      }
    },
    defaultVariants: {
      layout: "dashboard",
      size: "md",
      exportMode: "screen"
    }
  }
)

// Interfaces TypeScript
export interface ReportData {
  id: string
  title: string
  description?: string
  type: 'financial' | 'progress' | 'quality' | 'safety' | 'materials' | 'workforce' | 'timeline'
  period: {
    start: string
    end: string
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom'
  }
  project?: {
    id: string
    name: string
    code: string
  }
  data: any
  metadata: {
    generatedAt: string
    generatedBy: string
    version: string
    currency?: 'CLP' | 'USD'
    format: 'summary' | 'detailed' | 'executive'
  }
}

export interface ReportChart {
  id: string
  title: string
  type: 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'scatter' | 'gauge'
  data: any[]
  config?: {
    xAxis?: string
    yAxis?: string
    colors?: string[]
    showLegend?: boolean
    showValues?: boolean
  }
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ReportTable {
  id: string
  title: string
  data: any[]
  columns: {
    key: string
    label: string
    type?: 'text' | 'number' | 'currency' | 'percentage' | 'date'
    format?: string
    sortable?: boolean
    width?: string
  }[]
  pagination?: boolean
  summary?: {
    totals?: Record<string, number>
    averages?: Record<string, number>
    counts?: Record<string, number>
  }
}

export interface ReportKPI {
  id: string
  title: string
  value: number | string
  type: 'number' | 'currency' | 'percentage' | 'text'
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
    period: string
  }
  status?: 'good' | 'warning' | 'danger' | 'info'
  target?: number
  description?: string
}

export interface ReportSection {
  id: string
  title: string
  subtitle?: string
  type: 'kpis' | 'charts' | 'table' | 'text' | 'mixed'
  content: {
    kpis?: ReportKPI[]
    charts?: ReportChart[]
    tables?: ReportTable[]
    text?: string
    mixed?: Array<ReportKPI | ReportChart | ReportTable>
  }
  layout?: 'single' | 'grid-2' | 'grid-3' | 'grid-4'
  printPageBreak?: boolean
}

export interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'print'
  fileName?: string
  includeCharts?: boolean
  includeRawData?: boolean
  template?: 'standard' | 'executive' | 'detailed'
  orientation?: 'portrait' | 'landscape'
  sections?: string[]
}

export interface ReportTemplateProps extends VariantProps<typeof reportTemplateVariants> {
  // Datos del reporte
  report: ReportData
  sections: ReportSection[]
  
  // Configuración de vista
  layout?: 'dashboard' | 'detailed' | 'comparison' | 'fullscreen'
  showHeader?: boolean
  showFooter?: boolean
  showNavigation?: boolean
  
  // Funcionalidad de exportación
  exportOptions?: ExportConfig[]
  enableExport?: boolean
  
  // Filtros y interactividad
  enableFilters?: boolean
  filters?: {
    dateRange?: boolean
    projects?: boolean
    categories?: boolean
    customFilters?: Array<{
      key: string
      label: string
      type: 'select' | 'multiselect' | 'date' | 'range'
      options?: { value: string; label: string }[]
    }>
  }
  
  // Estados
  isLoading?: boolean
  error?: string
  
  // Callbacks
  onExport?: (config: ExportConfig) => void
  onFilterChange?: (filters: Record<string, any>) => void
  onRefresh?: () => void
  onSectionToggle?: (sectionId: string, visible: boolean) => void
  
  // Roles y permisos
  role?: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
  permissions?: {
    canExport?: boolean
    canModify?: boolean
    canShare?: boolean
  }
  
  // Personalización
  companyLogo?: string
  companyName?: string
  watermark?: string
  className?: string
}

export function ReportTemplate({
  report,
  sections = [],
  layout = "dashboard",
  showHeader = true,
  showFooter = true,
  showNavigation = true,
  exportOptions = [],
  enableExport = true,
  enableFilters = false,
  filters,
  isLoading = false,
  error,
  onExport,
  onFilterChange,
  onRefresh,
  onSectionToggle,
  role = 'gerencia',
  permissions = {
    canExport: true,
    canModify: false,
    canShare: true
  },
  companyLogo,
  companyName = 'Constructora ABC',
  watermark,
  size,
  exportMode = 'screen',
  className,
  ...props
}: ReportTemplateProps) {
  // Estados locales
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [isExporting, setIsExporting] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  )
  const reportRef = useRef<HTMLDivElement>(null)

  // Efectos y cálculos
  const filteredSections = useMemo(() => {
    return sections.filter(section => visibleSections[section.id])
  }, [sections, visibleSections])

  // Handlers
  const handleExport = useCallback(async (config: ExportConfig) => {
    if (!permissions.canExport) return
    
    setIsExporting(true)
    try {
      if (config.format === 'print') {
        window.print()
      } else {
        onExport?.(config)
      }
    } catch (error) {
      console.error('Error al exportar:', error)
    } finally {
      setIsExporting(false)
    }
  }, [permissions.canExport, onExport])

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilterValues(prev => ({ ...prev, ...newFilters }))
    onFilterChange?.(newFilters)
  }, [onFilterChange])

  const handleSectionToggle = useCallback((sectionId: string) => {
    setVisibleSections(prev => {
      const newState = { ...prev, [sectionId]: !prev[sectionId] }
      onSectionToggle?.(sectionId, newState[sectionId])
      return newState
    })
  }, [onSectionToggle])

  // Función para renderizar KPIs
  const renderKPI = useCallback((kpi: ReportKPI) => {
    const getStatusColor = (status?: string) => {
      switch (status) {
        case 'good': return 'text-green-600 bg-green-50 border-green-200'
        case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        case 'danger': return 'text-red-600 bg-red-50 border-red-200'
        case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
        default: return 'text-gray-600 bg-gray-50 border-gray-200'
      }
    }

    const formatValue = (value: number | string, type: string) => {
      if (typeof value === 'string') return value
      
      switch (type) {
        case 'currency':
          return new Intl.NumberFormat('es-CL', { 
            style: 'currency', 
            currency: report.metadata.currency || 'CLP' 
          }).format(value)
        case 'percentage':
          return `${value.toFixed(1)}%`
        case 'number':
          return new Intl.NumberFormat('es-CL').format(value)
        default:
          return value.toString()
      }
    }

    const getTrendIcon = (direction: string) => {
      switch (direction) {
        case 'up': return '↗️'
        case 'down': return '↘️'
        case 'stable': return '➡️'
        default: return ''
      }
    }

    return (
      <Card 
        key={kpi.id} 
        className={cn('p-6 border-2', getStatusColor(kpi.status))}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {kpi.title}
            </h3>
            <div className="text-2xl font-bold">
              {formatValue(kpi.value, kpi.type)}
            </div>
            {kpi.target && typeof kpi.value === 'number' && (
              <div className="text-xs text-gray-500 mt-1">
                Meta: {formatValue(kpi.target, kpi.type)}
              </div>
            )}
          </div>
          
          {kpi.trend && (
            <div className={cn(
              'text-right',
              kpi.trend.direction === 'up' ? 'text-green-600' :
              kpi.trend.direction === 'down' ? 'text-red-600' :
              'text-gray-600'
            )}>
              <div className="text-lg">
                {getTrendIcon(kpi.trend.direction)}
              </div>
              <div className="text-sm font-medium">
                {kpi.trend.percentage > 0 ? '+' : ''}{kpi.trend.percentage}%
              </div>
              <div className="text-xs text-gray-500">
                {kpi.trend.period}
              </div>
            </div>
          )}
        </div>
        
        {kpi.description && (
          <p className="text-sm text-gray-600 mt-3 border-t pt-3">
            {kpi.description}
          </p>
        )}
      </Card>
    )
  }, [report.metadata.currency])

  // Función para renderizar gráficos
  const renderChart = useCallback((chart: ReportChart) => {
    const getSizeClass = (size?: string) => {
      switch (size) {
        case 'sm': return 'h-64'
        case 'md': return 'h-80'
        case 'lg': return 'h-96'
        case 'xl': return 'h-[32rem]'
        default: return 'h-80'
      }
    }

    return (
      <Card key={chart.id} className="p-6">
        <h3 className="text-lg font-semibold mb-4">{chart.title}</h3>
        <div className={cn('w-full', getSizeClass(chart.size))}>
          <ChartDisplay
            type={chart.type}
            data={chart.data}
            config={chart.config}
            className="w-full h-full"
          />
        </div>
      </Card>
    )
  }, [])

  // Función para renderizar tablas
  const renderTable = useCallback((table: ReportTable) => {
    const formatCellValue = (value: any, type?: string) => {
      if (value === null || value === undefined) return '-'
      
      switch (type) {
        case 'currency':
          return new Intl.NumberFormat('es-CL', { 
            style: 'currency', 
            currency: report.metadata.currency || 'CLP' 
          }).format(value)
        case 'percentage':
          return `${parseFloat(value).toFixed(1)}%`
        case 'number':
          return new Intl.NumberFormat('es-CL').format(value)
        case 'date':
          return new Date(value).toLocaleDateString('es-CL')
        default:
          return value.toString()
      }
    }

    return (
      <Card key={table.id} className="overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold mb-4">{table.title}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {table.columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {table.columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCellValue(row[column.key], column.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            
            {/* Fila de resumen */}
            {table.summary && (
              <tfoot className="bg-gray-100 font-semibold">
                <tr>
                  {table.columns.map((column, index) => {
                    let summaryValue = ''
                    if (index === 0) {
                      summaryValue = 'TOTAL'
                    } else if (table.summary?.totals?.[column.key]) {
                      summaryValue = formatCellValue(table.summary.totals[column.key], column.type)
                    } else if (table.summary?.averages?.[column.key]) {
                      summaryValue = `Prom: ${formatCellValue(table.summary.averages[column.key], column.type)}`
                    } else if (table.summary?.counts?.[column.key]) {
                      summaryValue = `${table.summary.counts[column.key]} items`
                    }
                    
                    return (
                      <td key={column.key} className="px-6 py-3 text-sm">
                        {summaryValue}
                      </td>
                    )
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>
    )
  }, [report.metadata.currency])

  // Función para renderizar sección
  const renderSection = useCallback((section: ReportSection) => {
    const getGridClass = (layout?: string) => {
      switch (layout) {
        case 'grid-2': return 'grid grid-cols-1 md:grid-cols-2 gap-6'
        case 'grid-3': return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        case 'grid-4': return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        case 'single': return 'space-y-6'
        default: return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }
    }

    return (
      <div key={section.id} className={cn(
        "space-y-6",
        section.printPageBreak && "print:break-before-page"
      )}>
        {/* Header de la sección */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-gray-600 mt-1">{section.subtitle}</p>
            )}
          </div>
          
          {permissions.canModify && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSectionToggle(section.id)}
              className="print:hidden"
            >
              {visibleSections[section.id] ? 'Ocultar' : 'Mostrar'}
            </Button>
          )}
        </div>

        {/* Contenido de la sección */}
        {visibleSections[section.id] && (
          <div className={getGridClass(section.layout)}>
            {/* KPIs */}
            {section.content.kpis?.map(renderKPI)}
            
            {/* Gráficos */}
            {section.content.charts?.map(renderChart)}
            
            {/* Tablas */}
            {section.content.tables?.map(renderTable)}
            
            {/* Texto */}
            {section.content.text && (
              <Card className="p-6">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content.text }}
                />
              </Card>
            )}
            
            {/* Contenido mixto */}
            {section.content.mixed?.map((item) => {
              if ('value' in item) return renderKPI(item as ReportKPI)
              if ('data' in item && 'type' in item) return renderChart(item as ReportChart)
              if ('columns' in item) return renderTable(item as ReportTable)
              return null
            })}
          </div>
        )}
      </div>
    )
  }, [visibleSections, permissions.canModify, renderKPI, renderChart, renderTable, handleSectionToggle])

  // Estado de carga
  if (isLoading) {
    return (
      <div className={cn(reportTemplateVariants({ layout, size, exportMode }), className)}>
        <div className="animate-pulse space-y-6 p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className={cn(reportTemplateVariants({ layout, size, exportMode }), className)}>
        <div className="text-center py-12 p-6">
          <div className="text-red-600 text-xl font-semibold mb-2">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              Reintentar
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(reportTemplateVariants({ layout, size, exportMode }), className)} {...props}>
      {/* Header del reporte */}
      {showHeader && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 print:border-none">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              {companyLogo && (
                <img src={companyLogo} alt={companyName} className="h-12 w-auto" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                {report.description && (
                  <p className="text-gray-600 mt-1">{report.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>
                    Período: {new Date(report.period.start).toLocaleDateString('es-CL')} - {new Date(report.period.end).toLocaleDateString('es-CL')}
                  </span>
                  {report.project && (
                    <span>
                      Proyecto: {report.project.name} ({report.project.code})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center space-x-3 print:hidden">
              {enableFilters && filters && (
                <div className="flex space-x-2">
                  {/* Aquí irían los controles de filtro */}
                  <Button variant="outline" size="sm">
                    Filtros
                  </Button>
                </div>
              )}
              
              {enableExport && exportOptions.length > 0 && (
                <div className="flex space-x-2">
                  {exportOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(option)}
                      disabled={isExporting}
                    >
                      Exportar {option.format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              )}
              
              {onRefresh && (
                <Button
                  variant="outline"
                  onClick={onRefresh}
                  className="px-3"
                >
                  Actualizar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div ref={reportRef} className="flex-1 p-6 space-y-8">
        {filteredSections.map(renderSection)}
        
        {/* Watermark */}
        {watermark && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-5 print:opacity-10">
            <div className="text-6xl font-bold text-gray-500 rotate-45">
              {watermark}
            </div>
          </div>
        )}
      </div>

      {/* Footer del reporte */}
      {showFooter && (
        <div className="bg-white border-t border-gray-200 px-6 py-4 print:border-none">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div className="text-sm text-gray-500">
              <span>{companyName}</span>
              {report.metadata.generatedBy && (
                <span className="ml-4">
                  Generado por: {report.metadata.generatedBy}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <span>
                Generado el: {new Date(report.metadata.generatedAt).toLocaleString('es-CL')}
              </span>
              {report.metadata.version && (
                <span className="ml-4">
                  Versión: {report.metadata.version}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}