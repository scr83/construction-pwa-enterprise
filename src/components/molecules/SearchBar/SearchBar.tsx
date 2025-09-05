'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Typography } from '@/components/atoms/Typography'
import { Icon } from '@/components/atoms/Icon'

const searchBarVariants = cva(
  'relative w-full',
  {
    variants: {
      variant: {
        default: '',
        compact: 'max-w-md',
        full: 'w-full',
      },
      layout: {
        horizontal: 'flex items-center gap-3',
        vertical: 'space-y-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'horizontal',
    },
  }
)

// Construction-specific filter types
export interface ConstructionFilter {
  id: string
  label: string
  value: string | string[]
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'status' | 'role'
  options?: Array<{ value: string; label: string; icon?: React.ReactNode }>
  placeholder?: string
}

export interface SearchBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof searchBarVariants> {
  // Search functionality
  value?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (value: string, filters: Record<string, string | string[]>) => void
  
  // Placeholder and labels
  placeholder?: string
  searchLabel?: string
  
  // Construction-specific features
  constructionContext?: 'projects' | 'units' | 'workers' | 'materials' | 'quality' | 'general'
  quickFilters?: string[] // Common search terms
  
  // Filters
  filters?: ConstructionFilter[]
  activeFilters?: Record<string, string | string[]>
  onFilterChange?: (filterId: string, value: string | string[]) => void
  onFiltersReset?: () => void
  
  // Advanced features
  showFilters?: boolean
  showQuickFilters?: boolean
  showResults?: boolean
  resultsCount?: number
  isLoading?: boolean
  
  // Recent searches
  recentSearches?: string[]
  onRecentSearchSelect?: (search: string) => void
  
  // Mobile optimization
  collapsible?: boolean
  expanded?: boolean
  onExpandToggle?: () => void
  
  // Styling
  size?: 'sm' | 'default' | 'lg'
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      className,
      variant,
      layout,
      value = '',
      onSearchChange,
      onSearchSubmit,
      placeholder,
      searchLabel,
      constructionContext = 'general',
      quickFilters = [],
      filters = [],
      activeFilters = {},
      onFilterChange,
      onFiltersReset,
      showFilters = false,
      showQuickFilters = false,
      showResults = false,
      resultsCount,
      isLoading = false,
      recentSearches = [],
      onRecentSearchSelect,
      collapsible = false,
      expanded = false,
      onExpandToggle,
      size = 'default',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value)
    const [showDropdown, setShowDropdown] = React.useState(false)
    const [showFiltersPanel, setShowFiltersPanel] = React.useState(false)
    const searchRef = React.useRef<HTMLInputElement>(null)
    
    // Sync internal value with prop
    React.useEffect(() => {
      setInternalValue(value)
    }, [value])
    
    // Get context-specific placeholder
    const getContextPlaceholder = () => {
      if (placeholder) return placeholder
      
      switch (constructionContext) {
        case 'projects':
          return 'Buscar proyectos por nombre, código...'
        case 'units':
          return 'Buscar unidades por código, edificio...'
        case 'workers':
          return 'Buscar trabajadores por nombre, rol...'
        case 'materials':
          return 'Buscar materiales por tipo, código...'
        case 'quality':
          return 'Buscar inspecciones, reportes...'
        default:
          return 'Buscar...'
      }
    }
    
    // Get context-specific quick filters
    const getContextQuickFilters = () => {
      if (quickFilters.length > 0) return quickFilters
      
      switch (constructionContext) {
        case 'projects':
          return ['Activos', 'Completados', 'Residencial', 'Comercial']
        case 'units':
          return ['EA-', 'Piso 1', 'Completado', 'En Progreso']
        case 'workers':
          return ['Jefe de Terreno', 'Operario', 'Activos', 'Disponibles']
        case 'materials':
          return ['Hormigón', 'En Bodega', 'Entregado', 'Pendiente']
        case 'quality':
          return ['Aprobado', 'Pendiente', 'Rechazado', 'Esta semana']
        default:
          return []
      }
    }
    
    // Handle search input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      
      if (onSearchChange) {
        onSearchChange(newValue)
      }
      
      // Show dropdown with recent searches if there's focus and content
      if (newValue.length === 0 && recentSearches.length > 0) {
        setShowDropdown(true)
      } else {
        setShowDropdown(false)
      }
    }
    
    // Handle search submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      if (onSearchSubmit && internalValue.trim()) {
        onSearchSubmit(internalValue.trim(), activeFilters)
      }
      
      setShowDropdown(false)
      searchRef.current?.blur()
    }
    
    // Handle quick filter click
    const handleQuickFilterClick = (filter: string) => {
      setInternalValue(filter)
      if (onSearchChange) {
        onSearchChange(filter)
      }
      if (onSearchSubmit) {
        onSearchSubmit(filter, activeFilters)
      }
    }
    
    // Handle recent search selection
    const handleRecentSearchClick = (search: string) => {
      setInternalValue(search)
      if (onRecentSearchSelect) {
        onRecentSearchSelect(search)
      }
      if (onSearchChange) {
        onSearchChange(search)
      }
      setShowDropdown(false)
    }
    
    // Handle filter change
    const handleFilterChange = (filterId: string, value: string | string[]) => {
      if (onFilterChange) {
        onFilterChange(filterId, value)
      }
    }
    
    // Count active filters
    const activeFiltersCount = Object.keys(activeFilters).filter(
      key => {
        const value = activeFilters[key]
        return Array.isArray(value) ? value.length > 0 : value && value !== ''
      }
    ).length
    
    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.closest('.search-container')?.contains(event.target as Node)) {
          setShowDropdown(false)
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
      <div
        ref={ref}
        className={cn(searchBarVariants({ variant, layout }), 'search-container', className)}
        {...props}
      >
        {/* Search Input Section */}
        <div className="flex-1 relative">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              ref={searchRef}
              value={internalValue}
              onChange={handleInputChange}
              placeholder={getContextPlaceholder()}
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
              leftIcon={<Icon name="search" size="sm" />}
              rightIcon={
                internalValue ? (
                  <button
                    type="button"
                    onClick={() => {
                      setInternalValue('')
                      if (onSearchChange) onSearchChange('')
                    }}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    <Icon name="x" size="sm" />
                  </button>
                ) : isLoading ? (
                  <Icon name="refresh" size="sm" className="animate-spin" />
                ) : undefined
              }
              onFocus={() => {
                if (internalValue.length === 0 && recentSearches.length > 0) {
                  setShowDropdown(true)
                }
              }}
              className="pr-12"
            />
            
            {/* Search button */}
            <Button
              type="submit"
              size={size === 'sm' ? 'sm' : 'default'}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-auto py-1.5 px-3"
              disabled={!internalValue.trim() || isLoading}
            >
              <Icon name="search" size="sm" />
            </Button>
          </form>
          
          {/* Dropdown with recent searches */}
          {showDropdown && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <Typography variant="caption" color="muted" className="px-2 py-1">
                  Búsquedas recientes
                </Typography>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-2 py-1 hover:bg-secondary-50 rounded text-sm flex items-center gap-2"
                  >
                    <Icon name="clock" size="xs" variant="muted" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Filter Controls */}
        {(showFilters || activeFiltersCount > 0) && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size={size === 'sm' ? 'sm' : 'default'}
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              leftIcon={<Icon name="filter" size="sm" />}
              className={cn(
                activeFiltersCount > 0 && 'border-primary-300 bg-primary-50 text-primary-700'
              )}
            >
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-primary-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            
            {activeFiltersCount > 0 && onFiltersReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onFiltersReset}
                leftIcon={<Icon name="x" size="xs" />}
              >
                Limpiar
              </Button>
            )}
          </div>
        )}
        
        {/* Mobile expand/collapse toggle */}
        {collapsible && (
          <Button
            variant="outline"
            size={size === 'sm' ? 'sm' : 'default'}
            onClick={onExpandToggle}
            className="md:hidden"
          >
            <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size="sm" />
          </Button>
        )}
        
        {/* Quick Filters */}
        {showQuickFilters && getContextQuickFilters().length > 0 && (
          <div className={cn(
            'flex flex-wrap gap-2',
            layout === 'vertical' && 'mt-0',
            collapsible && !expanded && 'hidden md:flex'
          )}>
            {getContextQuickFilters().map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilterClick(filter)}
                className={cn(
                  'text-xs',
                  internalValue === filter && 'border-primary-500 bg-primary-50 text-primary-700'
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        )}
        
        {/* Advanced Filters Panel */}
        {showFiltersPanel && filters.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-secondary-200 rounded-lg shadow-lg z-40 p-4">
            <div className="flex items-center justify-between mb-3">
              <Typography variant="label-default" className="font-semibold">
                Filtros Avanzados
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFiltersPanel(false)}
              >
                <Icon name="x" size="sm" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <Typography variant="label-small">
                    {filter.label}
                  </Typography>
                  
                  {filter.type === 'select' && filter.options && (
                    <select
                      value={activeFilters[filter.id] as string || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md text-sm"
                    >
                      <option value="">{filter.placeholder || 'Seleccionar...'}</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {filter.type === 'date' && (
                    <Input
                      type="date"
                      size="sm"
                      value={activeFilters[filter.id] as string || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    />
                  )}
                  
                  {filter.type === 'status' && filter.options && (
                    <div className="flex flex-wrap gap-1">
                      {filter.options.map((option) => (
                        <Button
                          key={option.value}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentValues = (activeFilters[filter.id] as string[]) || []
                            const newValues = currentValues.includes(option.value)
                              ? currentValues.filter(v => v !== option.value)
                              : [...currentValues, option.value]
                            handleFilterChange(filter.id, newValues)
                          }}
                          className={cn(
                            'text-xs',
                            ((activeFilters[filter.id] as string[]) || []).includes(option.value) &&
                            'border-primary-500 bg-primary-50 text-primary-700'
                          )}
                          leftIcon={option.icon}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {(onFiltersReset && activeFiltersCount > 0) && (
              <div className="mt-4 pt-3 border-t flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onFiltersReset()
                    setShowFiltersPanel(false)
                  }}
                >
                  Limpiar Filtros
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowFiltersPanel(false)}
                >
                  Aplicar Filtros
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Results count */}
        {showResults && resultsCount !== undefined && (
          <div className={cn(
            'text-sm text-secondary-600',
            layout === 'horizontal' && 'whitespace-nowrap'
          )}>
            {resultsCount} resultado{resultsCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    )
  }
)
SearchBar.displayName = 'SearchBar'

export { SearchBar, searchBarVariants }
export type { ConstructionFilter }