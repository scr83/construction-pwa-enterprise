'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Importar componentes atómicos y moleculares
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Badge } from '@/components/atoms/Badge'
import { Card } from '@/components/atoms/Card'
import { Avatar } from '@/components/atoms/Avatar'
import { NavigationBar } from '@/components/molecules/NavigationBar'
import { SearchFilter } from '@/components/molecules/SearchFilter'
import { Pagination } from '@/components/molecules/Pagination'
import { TableView } from '@/components/molecules/TableView'

// Definir variantes del componente
export const listTemplateVariants = cva(
  "min-h-screen bg-gray-50",
  {
    variants: {
      layout: {
        grid: "grid grid-cols-1 lg:grid-cols-4 gap-6",
        table: "flex flex-col",
        cards: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      },
      density: {
        compact: "space-y-2",
        comfortable: "space-y-4",
        spacious: "space-y-6"
      }
    },
    defaultVariants: {
      layout: "cards",
      size: "md",
      density: "comfortable"
    }
  }
)

// Interfaces TypeScript
export interface ListItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  assignedTo?: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  metadata?: {
    progress?: number
    budget?: number
    location?: string
    dueDate?: string
    [key: string]: any
  }
  actions?: ListAction[]
}

export interface ListAction {
  id: string
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'destructive'
  onClick: (item: ListItem) => void
  condition?: (item: ListItem) => boolean
}

export interface ListColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  render?: (value: any, item: ListItem) => React.ReactNode
}

export interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date' | 'range' | 'boolean'
  options?: { value: string; label: string }[]
  placeholder?: string
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface ListTemplateProps extends VariantProps<typeof listTemplateVariants> {
  // Datos básicos
  title: string
  subtitle?: string
  items: ListItem[]
  
  // Configuración de vista
  layout?: 'grid' | 'table' | 'cards'
  columns?: ListColumn[]
  itemsPerPage?: number
  
  // Funcionalidad de filtros
  filters?: FilterConfig[]
  enableSearch?: boolean
  searchPlaceholder?: string
  
  // Funcionalidad de ordenamiento
  sortableColumns?: string[]
  defaultSort?: SortConfig
  
  // Acciones globales
  actions?: ListAction[]
  bulkActions?: ListAction[]
  enableBulkSelect?: boolean
  
  // Personalización
  emptyStateTitle?: string
  emptyStateMessage?: string
  emptyStateAction?: {
    label: string
    onClick: () => void
  }
  
  // Estados
  isLoading?: boolean
  error?: string
  
  // Callbacks
  onItemSelect?: (item: ListItem) => void
  onBulkSelect?: (items: ListItem[]) => void
  onSort?: (sort: SortConfig) => void
  onFilter?: (filters: Record<string, any>) => void
  onSearch?: (query: string) => void
  onPageChange?: (page: number) => void
  onRefresh?: () => void
  
  // Roles y permisos
  role?: 'gerencia' | 'jefe_terreno' | 'bodega' | 'oficina_tecnica' | 'control_calidad'
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
  
  // Personalización adicional
  className?: string
  headerContent?: React.ReactNode
  footerContent?: React.ReactNode
}

export function ListTemplate({
  title,
  subtitle,
  items = [],
  layout = "cards",
  columns,
  itemsPerPage = 12,
  filters,
  enableSearch = true,
  searchPlaceholder = "Buscar...",
  sortableColumns,
  defaultSort,
  actions = [],
  bulkActions = [],
  enableBulkSelect = false,
  emptyStateTitle = "Sin elementos",
  emptyStateMessage = "No se encontraron elementos que coincidan con los criterios de búsqueda.",
  emptyStateAction,
  isLoading = false,
  error,
  onItemSelect,
  onBulkSelect,
  onSort,
  onFilter,
  onSearch,
  onPageChange,
  onRefresh,
  role = 'jefe_terreno',
  canCreate = false,
  canEdit = false,
  canDelete = false,
  size,
  density,
  className,
  headerContent,
  footerContent,
  ...props
}: ListTemplateProps) {
  // Estados locales
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort || null)
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'cards'>(layout)

  // Efectos
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterValues])

  // Filtrado y ordenamiento de items
  const processedItems = useMemo(() => {
    let filtered = [...items]

    // Aplicar búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Aplicar filtros
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return
      
      filtered = filtered.filter(item => {
        const itemValue = (item as any)[key] || item.metadata?.[key]
        
        if (Array.isArray(value)) {
          return value.includes(itemValue)
        }
        
        return itemValue === value
      })
    })

    // Aplicar ordenamiento
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key] || a.metadata?.[sortConfig.key] || ''
        const bValue = (b as any)[sortConfig.key] || b.metadata?.[sortConfig.key] || ''
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [items, searchQuery, filterValues, sortConfig])

  // Paginación
  const totalPages = Math.ceil(processedItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = processedItems.slice(startIndex, startIndex + itemsPerPage)

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }, [onSearch])

  const handleFilter = useCallback((newFilters: Record<string, any>) => {
    setFilterValues(prev => ({ ...prev, ...newFilters }))
    onFilter?.(newFilters)
  }, [onFilter])

  const handleSort = useCallback((key: string) => {
    const newSort: SortConfig = {
      key,
      direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    }
    setSortConfig(newSort)
    onSort?.(newSort)
  }, [sortConfig, onSort])

  const handleItemSelect = useCallback((item: ListItem) => {
    onItemSelect?.(item)
  }, [onItemSelect])

  const handleBulkSelect = useCallback((itemId: string, selected: boolean) => {
    setSelectedItems(prev => {
      const newSelection = selected 
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId)
      
      const selectedItemObjects = items.filter(item => newSelection.includes(item.id))
      onBulkSelect?.(selectedItemObjects)
      
      return newSelection
    })
  }, [items, onBulkSelect])

  const handleSelectAll = useCallback((selected: boolean) => {
    const newSelection = selected ? paginatedItems.map(item => item.id) : []
    setSelectedItems(newSelection)
    
    const selectedItemObjects = items.filter(item => newSelection.includes(item.id))
    onBulkSelect?.(selectedItemObjects)
  }, [paginatedItems, items, onBulkSelect])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }, [onPageChange])

  // Función para obtener el color del estado
  const getStatusColor = (status: ListItem['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para obtener el color de la prioridad
  const getPriorityColor = (priority?: ListItem['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  // Renderizado de item como card
  const renderCard = useCallback((item: ListItem) => (
    <Card
      key={item.id}
      className="h-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleItemSelect(item)}
    >
      <div className="p-6">
        {/* Header del card */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {item.priority && (
              <div
                className={cn("w-3 h-3 rounded-full", getPriorityColor(item.priority))}
                title={`Prioridad: ${item.priority}`}
              />
            )}
            
            {enableBulkSelect && (
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={(e) => handleBulkSelect(item.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Contenido principal */}
        {item.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Metadata */}
        {item.metadata?.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progreso</span>
              <span className="text-sm font-medium">{item.metadata.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all" 
                style={{ width: `${item.metadata.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" size="sm">
                +{item.tags.length - 3} más
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Badge 
              variant="outline" 
              className={getStatusColor(item.status)}
            >
              {item.status}
            </Badge>
            
            {item.assignedTo && (
              <div className="flex items-center space-x-2">
                <Avatar
                  src={item.assignedTo.avatar}
                  alt={item.assignedTo.name}
                  size="sm"
                />
                <span className="text-sm text-gray-600 truncate max-w-20">
                  {item.assignedTo.name}
                </span>
              </div>
            )}
          </div>

          {/* Acciones del item */}
          {item.actions && item.actions.length > 0 && (
            <div className="flex space-x-1">
              {item.actions
                .filter(action => !action.condition || action.condition(item))
                .slice(0, 2)
                .map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={action.variant || "ghost"}
                    onClick={(e) => {
                      e.stopPropagation()
                      action.onClick(item)
                    }}
                    className="px-3"
                  >
                    {action.label}
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  ), [selectedItems, enableBulkSelect, handleItemSelect, handleBulkSelect])

  // Estado de carga
  if (isLoading) {
    return (
      <div className={cn(listTemplateVariants({ layout: "cards", size, density }), className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className={cn(listTemplateVariants({ layout: "cards", size, density }), className)}>
        <div className="text-center py-12">
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
    <div className={cn(listTemplateVariants({ layout: "cards", size, density }), className)} {...props}>
      {/* Header principal */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Acciones del header */}
          <div className="flex items-center space-x-3">
            {/* Controles de vista */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                onClick={() => setViewMode('cards')}
                className="px-3"
              >
                Cards
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                onClick={() => setViewMode('table')}
                className="px-3"
              >
                Tabla
              </Button>
            </div>

            {/* Acciones globales */}
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={() => action.onClick({} as ListItem)}
              >
                {action.label}
              </Button>
            ))}

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

        {headerContent && (
          <div className="mt-4">
            {headerContent}
          </div>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Búsqueda */}
          {enableSearch && (
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Filtros */}
          {filters && filters.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <div key={filter.key} className="min-w-40">
                  {filter.type === 'select' && (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterValues[filter.key] || ''}
                      onChange={(e) => handleFilter({ [filter.key]: e.target.value || null })}
                    >
                      <option value="">{filter.placeholder || `Todos ${filter.label}`}</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {filter.type === 'text' && (
                    <Input
                      type="text"
                      placeholder={filter.placeholder || filter.label}
                      value={filterValues[filter.key] || ''}
                      onChange={(e) => handleFilter({ [filter.key]: e.target.value || null })}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones masivas */}
        {enableBulkSelect && selectedItems.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3 mt-4">
            <span className="text-blue-800">
              {selectedItems.length} elemento{selectedItems.length !== 1 ? 's' : ''} seleccionado{selectedItems.length !== 1 ? 's' : ''}
            </span>
            <div className="flex space-x-2">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'outline'}
                  onClick={() => action.onClick({} as ListItem)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        {processedItems.length === 0 ? (
          // Estado vacío
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {emptyStateTitle}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {emptyStateMessage}
            </p>
            {emptyStateAction && (
              <Button onClick={emptyStateAction.onClick}>
                {emptyStateAction.label}
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Vista de cards */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {paginatedItems.map(renderCard)}
              </div>
            )}

            {/* Vista de tabla */}
            {viewMode === 'table' && columns && (
              <div className="bg-white rounded-lg border border-gray-200">
                <TableView
                  columns={columns}
                  data={paginatedItems}
                  sortableColumns={sortableColumns}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  enableBulkSelect={enableBulkSelect}
                  selectedItems={selectedItems}
                  onBulkSelect={handleBulkSelect}
                  onSelectAll={handleSelectAll}
                  onRowClick={handleItemSelect}
                />
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  showPreviousNext={true}
                  showFirstLast={true}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {footerContent && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          {footerContent}
        </div>
      )}
    </div>
  )
}