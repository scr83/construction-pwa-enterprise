'use client'

import { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts'

// Definir variantes del componente
export const chartDisplayVariants = cva(
  "bg-white rounded-lg border border-gray-200 p-4",
  {
    variants: {
      variant: {
        simple: "chart-simple",
        detailed: "chart-detailed",
        compact: "chart-compact",
        dashboard: "chart-dashboard"
      },
      size: {
        sm: "h-48",
        md: "h-64",
        lg: "h-80",
        xl: "h-96"
      },
      theme: {
        default: "chart-theme-default",
        construction: "chart-theme-construction",
        minimal: "chart-theme-minimal"
      }
    },
    defaultVariants: {
      variant: "detailed",
      size: "md",
      theme: "construction"
    }
  }
)

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: any
}

export interface ChartSeries {
  key: string
  name: string
  color: string
}

export interface ChartDisplayProps extends VariantProps<typeof chartDisplayVariants> {
  type: 'bar' | 'line' | 'pie' | 'area' | 'progress'
  data: ChartDataPoint[]
  title?: string
  subtitle?: string
  series?: ChartSeries[]
  colors?: string[]
  showLegend?: boolean
  showTooltip?: boolean
  showGrid?: boolean
  showLabels?: boolean
  height?: number
  loading?: boolean
  error?: string
  emptyMessage?: string
  currency?: boolean
  percentage?: boolean
  responsive?: boolean
  className?: string
}

// Colores por defecto para construcción
const CONSTRUCTION_COLORS = [
  '#3b82f6', // Blue - Proyectos activos
  '#f59e0b', // Amber - En progreso  
  '#10b981', // Green - Completados
  '#ef4444', // Red - Problemas
  '#8b5cf6', // Purple - Pendientes
  '#06b6d4', // Cyan - Inspecciones
  '#84cc16', // Lime - Materiales
  '#f97316', // Orange - Equipos
  '#ec4899', // Pink - Calidad
  '#6b7280'  // Gray - Otros
]

export function ChartDisplay({
  type,
  data = [],
  title,
  subtitle,
  series = [],
  colors = CONSTRUCTION_COLORS,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  showLabels = false,
  height,
  loading = false,
  error,
  emptyMessage = "No hay datos para mostrar",
  currency = false,
  percentage = false,
  responsive = true,
  variant,
  size,
  theme,
  className,
  ...props
}: ChartDisplayProps) {

  // Formatear valores para tooltip
  const formatValue = (value: number) => {
    if (currency) {
      return new Intl.NumberFormat('es-CL', { 
        style: 'currency', 
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }
    
    if (percentage) {
      return `${value}%`
    }
    
    return new Intl.NumberFormat('es-CL').format(value)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium">{formatValue(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  // Preparar datos para múltiples series
  const chartData = useMemo(() => {
    if (series.length === 0) {
      return data
    }
    
    // Transformar datos para múltiples series
    return data.map(item => {
      const transformedItem = { name: item.name }
      series.forEach(s => {
        transformedItem[s.key] = item[s.key] || 0
      })
      return transformedItem
    })
  }, [data, series])

  // Estados de error y carga
  if (loading) {
    return (
      <div className={cn(chartDisplayVariants({ variant, size, theme }), className)} {...props}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Cargando gráfico...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn(chartDisplayVariants({ variant, size, theme }), className)} {...props}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="flex flex-col items-center justify-center h-full text-red-600">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-center text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className={cn(chartDisplayVariants({ variant, size, theme }), className)} {...props}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-center">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  // Renderizar gráfico según tipo
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => currency ? `${value/1000000}M` : value}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && series.length > 0 && <Legend />}
            
            {series.length > 0 ? (
              series.map((s, index) => (
                <Bar 
                  key={s.key}
                  dataKey={s.key}
                  name={s.name}
                  fill={s.color || colors[index % colors.length]}
                  radius={[2, 2, 0, 0]}
                />
              ))
            ) : (
              <Bar 
                dataKey="value" 
                fill={colors[0]}
                radius={[2, 2, 0, 0]}
              />
            )}
          </BarChart>
        )

      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => currency ? `${value/1000000}M` : value}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && series.length > 0 && <Legend />}
            
            {series.length > 0 ? (
              series.map((s, index) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color || colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))
            ) : (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            )}
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => currency ? `${value/1000000}M` : value}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && series.length > 0 && <Legend />}
            
            {series.length > 0 ? (
              series.map((s, index) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stackId="1"
                  stroke={s.color || colors[index % colors.length]}
                  fill={s.color || colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))
            ) : (
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.6}
              />
            )}
          </AreaChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showLabels ? (entry) => `${entry.name}: ${formatValue(entry.value)}` : false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip formatter={(value) => formatValue(value as number)} />}
            {showLegend && <Legend />}
          </PieChart>
        )

      case 'progress':
        const totalValue = chartData.reduce((sum, item) => sum + item.value, 0)
        return (
          <div className="space-y-4">
            {chartData.map((item, index) => {
              const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatValue(item.value)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: colors[index % colors.length]
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )

      default:
        return null
    }
  }

  const actualHeight = height || (size === 'sm' ? 192 : size === 'md' ? 256 : size === 'lg' ? 320 : 384)

  return (
    <div className={cn(chartDisplayVariants({ variant, size, theme }), className)} {...props}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      
      <div style={{ height: actualHeight }}>
        {type === 'progress' ? (
          <div className="h-full overflow-y-auto">
            {renderChart()}
          </div>
        ) : responsive ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  )
}