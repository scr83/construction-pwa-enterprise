'use client'

import { useState, useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { 
  ChevronUp, 
  ChevronDown, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  ExternalLink
} from 'lucide-react'

// Definir variantes del componente
export const tableViewVariants = cva(
  "w-full border border-gray-200 rounded-lg overflow-hidden bg-white",
  {
    variants: {
      variant: {
        simple: "table-simple",
        striped: "table-striped",
        bordered: "table-bordered",
        compact: "table-compact"
      },
      size: {
        sm: "text-sm",
        md: "text-base", 
        lg: "text-lg"
      },
      density: {
        tight: "table-density-tight",
        normal: "table-density-normal",
        loose: "table-density-loose"
      }
    },
    defaultVariants: {
      variant: "simple",
      size: "md",
      density: "normal"
    }
  }
)

export interface TableColumn {
  key: string
  title: string
  type?: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'status' | 'actions'
  width?: string | number
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => React.ReactNode
  format?: (value: any) => string
}

export interface TableAction {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  onClick: (row: any) => void
  show?: (row: any) => boolean
}

export interface TableViewProps extends VariantProps<typeof tableViewVariants> {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
  sortable?: boolean
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  actions?: TableAction[]
  rowActions?: boolean
  selectedRows?: string[]
  onRowSelect?: (rowId: string, selected: boolean) => void
  onRowClick?: (row: any) => void
  stickyHeader?: boolean
  maxHeight?: string | number
  responsive?: boolean
  className?: string
}

export function TableView({
  columns,
  data = [],
  loading = false,
  emptyMessage = "No hay datos para mostrar",
  sortable = true,
  sortBy,
  sortDirection = 'asc',
  onSort,
  actions = [],
  rowActions = false,
  selectedRows = [],
  onRowSelect,
  onRowClick,
  stickyHeader = false,
  maxHeight,
  responsive = true,
  variant,
  size,
  density,
  className,
  ...props
}: TableViewProps) {
  
  const [localSortBy, setLocalSortBy] = useState<string | undefined>(sortBy)
  const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc'>(sortDirection)

  // Manejar ordenamiento
  const handleSort = (columnKey: string) => {
    if (!sortable) return
    
    const column = columns.find(col => col.key === columnKey)
    if (!column?.sortable) return

    let newDirection: 'asc' | 'desc' = 'asc'
    if (localSortBy === columnKey && localSortDirection === 'asc') {
      newDirection = 'desc'
    }

    setLocalSortBy(columnKey)
    setLocalSortDirection(newDirection)
    onSort?.(columnKey, newDirection)
  }

  // Formatear valor de celda
  const formatCellValue = (value: any, column: TableColumn) => {
    if (column.render) {
      return column.render(value, data)
    }

    if (column.format) {
      return column.format(value)
    }

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('es-CL', { 
          style: 'currency', 
          currency: 'CLP' 
        }).format(value || 0)
      
      case 'percentage':
        return `${(value || 0).toFixed(1)}%`
      
      case 'date':
        return value ? new Date(value).toLocaleDateString('es-CL') : '-'
      
      case 'number':
        return new Intl.NumberFormat('es-CL').format(value || 0)
      
      case 'status':
        return (
          <Badge variant={
            value === 'completado' ? 'success' :
            value === 'en_proceso' ? 'warning' :
            value === 'pendiente' ? 'secondary' :
            value === 'cancelado' ? 'destructive' : 'outline'
          }>
            {value}
          </Badge>
        )
      
      default:
        return value || '-'
    }
  }

  // Renderizar acciones de fila
  const renderRowActions = (row: any, rowIndex: number) => {
    const visibleActions = actions.filter(action => 
      !action.show || action.show(row)
    )

    if (visibleActions.length === 0) return null

    if (visibleActions.length === 1) {
      const action = visibleActions[0]
      return (
        <Button
          size="sm"
          variant={action.variant || 'outline'}
          onClick={(e) => {
            e.stopPropagation()
            action.onClick(row)
          }}
          className="h-11 md:h-10"
        >
          {action.icon}
          <span className="ml-1 hidden sm:inline">{action.label}</span>
        </Button>
      )
    }

    return (
      <div className="flex items-center gap-1">
        {visibleActions.slice(0, 2).map(action => (
          <Button
            key={action.id}
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              action.onClick(row)
            }}
            className="h-11 w-11 p-0 md:h-10 md:w-10"
            title={action.label}
          >
            {action.icon}
          </Button>
        ))}
        
        {visibleActions.length > 2 && (
          <Button
            size="sm"
            variant="outline"
            className="h-11 w-11 p-0 md:h-10 md:w-10"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  // Preparar columnas con acciones
  const allColumns = useMemo(() => {
    const cols = [...columns]
    
    if (rowActions && actions.length > 0) {
      cols.push({
        key: 'actions',
        title: 'Acciones',
        type: 'actions' as const,
        width: actions.length === 1 ? 100 : 120,
        align: 'center' as const,
        sortable: false
      })
    }
    
    return cols
  }, [columns, rowActions, actions])

  if (loading) {
    return (
      <div className={cn(tableViewVariants({ variant, size, density }), className)}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn(tableViewVariants({ variant, size, density }), className)}>
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  const tableContent = (
    <table className="w-full">
      {/* Header */}
      <thead className={cn(
        "bg-gray-50 border-b border-gray-200",
        stickyHeader && "sticky top-0 z-10"
      )}>
        <tr>
          {onRowSelect && (
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                className="rounded"
                onChange={(e) => {
                  // Lógica para seleccionar todos
                }}
              />
            </th>
          )}
          
          {allColumns.map((column) => (
            <th
              key={column.key}
              className={cn(
                "px-4 py-3 text-left font-medium text-gray-700",
                column.align === 'center' && "text-center",
                column.align === 'right' && "text-right",
                column.sortable && sortable && "cursor-pointer hover:bg-gray-100 select-none",
                density === 'tight' && "px-2 py-2",
                density === 'loose' && "px-6 py-4"
              )}
              style={{ width: column.width }}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className="flex items-center gap-2">
                <span>{column.title}</span>
                {column.sortable && sortable && (
                  <div className="flex flex-col">
                    <ChevronUp 
                      className={cn(
                        "w-3 h-3",
                        localSortBy === column.key && localSortDirection === 'asc' 
                          ? "text-blue-600" 
                          : "text-gray-400"
                      )} 
                    />
                    <ChevronDown 
                      className={cn(
                        "w-3 h-3 -mt-1",
                        localSortBy === column.key && localSortDirection === 'desc' 
                          ? "text-blue-600" 
                          : "text-gray-400"
                      )} 
                    />
                  </div>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>

      {/* Body */}
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={row.id || rowIndex}
            className={cn(
              "border-b border-gray-100 hover:bg-gray-50 transition-colors",
              variant === 'striped' && rowIndex % 2 === 1 && "bg-gray-25",
              onRowClick && "cursor-pointer",
              selectedRows.includes(row.id) && "bg-blue-50"
            )}
            onClick={() => onRowClick?.(row)}
          >
            {onRowSelect && (
              <td className={cn(
                "px-4 py-3",
                density === 'tight' && "px-2 py-2",
                density === 'loose' && "px-6 py-4"
              )}>
                <input
                  type="checkbox"
                  className="rounded"
                  checked={selectedRows.includes(row.id)}
                  onChange={(e) => {
                    e.stopPropagation()
                    onRowSelect?.(row.id, e.target.checked)
                  }}
                />
              </td>
            )}
            
            {allColumns.map((column) => (
              <td
                key={column.key}
                className={cn(
                  "px-4 py-3",
                  column.align === 'center' && "text-center",
                  column.align === 'right' && "text-right",
                  density === 'tight' && "px-2 py-2",
                  density === 'loose' && "px-6 py-4"
                )}
              >
                {column.key === 'actions' 
                  ? renderRowActions(row, rowIndex)
                  : formatCellValue(row[column.key], column)
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

  if (responsive) {
    return (
      <div className={cn(tableViewVariants({ variant, size, density }), className)} {...props}>
        <div 
          className="overflow-x-auto"
          style={{ maxHeight: maxHeight }}
        >
          {tableContent}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(tableViewVariants({ variant, size, density }), className)} 
      style={{ maxHeight: maxHeight, overflowY: maxHeight ? 'auto' : 'visible' }}
      {...props}
    >
      {tableContent}
    </div>
  )
}