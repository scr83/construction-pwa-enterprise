'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { Badge } from '@/components/atoms/Badge'
import { Checkbox } from '@/components/atoms/Checkbox'

const filterDropdownVariants = cva(
  'relative inline-block text-left',
  {
    variants: {
      variant: {
        default: '',
        compact: '',
        mobile: 'w-full',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// Filter option interface
export interface FilterOption {
  id: string
  label: string
  value: string | number | boolean
  description?: string
  icon?: string
  color?: string
  count?: number
  disabled?: boolean
  group?: string
}

// Filter configuration interface
export interface FilterConfig {
  id: string
  label: string
  type: 'single' | 'multiple' | 'range' | 'search' | 'date' | 'boolean'
  options?: FilterOption[]
  
  // Search configuration
  searchable?: boolean
  searchPlaceholder?: string
  
  // Range configuration (for numeric filters)
  min?: number
  max?: number
  step?: number
  unit?: string
  
  // Display options
  showCount?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  maxHeight?: number
  
  // Construction-specific presets
  preset?: 'status' | 'role' | 'project' | 'unit' | 'activity' | 'priority' | 'date'
}

// Active filter value
export interface ActiveFilter {
  id: string
  values: (string | number | boolean)[]
  label?: string
}

export interface FilterDropdownProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filterDropdownVariants> {
  // Filter configuration
  filters: FilterConfig[]
  
  // Active filters
  activeFilters?: ActiveFilter[]
  onFiltersChange?: (filters: ActiveFilter[]) => void
  
  // Dropdown behavior
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  closeOnSelect?: boolean
  
  // Display configuration
  trigger?: React.ReactNode
  triggerLabel?: string
  showActiveCount?: boolean
  showClearAll?: boolean
  placeholder?: string
  
  // Search functionality
  globalSearch?: boolean
  globalSearchPlaceholder?: string
  onGlobalSearch?: (query: string) => void
  
  // Preset filter combinations
  presets?: Array<{
    id: string
    label: string
    filters: ActiveFilter[]
    icon?: string
  }>
  
  // Construction-specific features
  constructionContext?: 'projects' | 'units' | 'activities' | 'workers' | 'materials' | 'inspections'
  roleBasedFilters?: boolean
  
  // Layout options
  maxHeight?: number
  minWidth?: number
  
  // Loading states
  isLoading?: boolean
  loadingFilters?: string[]
  
  // Callbacks
  onPresetSelect?: (preset: FilterDropdownProps['presets'][0]) => void
  onFilterSearch?: (filterId: string, query: string) => FilterOption[]
}

const FilterDropdown = React.forwardRef<HTMLDivElement, FilterDropdownProps>(
  (
    {
      className,
      variant,
      size,
      filters,
      activeFilters = [],
      onFiltersChange,
      isOpen,
      onOpenChange,
      closeOnSelect = false,
      trigger,
      triggerLabel = 'Filtros',
      showActiveCount = true,
      showClearAll = true,
      placeholder,
      globalSearch = false,
      globalSearchPlaceholder = 'Buscar filtros...',
      onGlobalSearch,
      presets = [],
      constructionContext,
      roleBasedFilters = false,
      maxHeight = 400,
      minWidth = 320,
      isLoading = false,
      loadingFilters = [],
      onPresetSelect,
      onFilterSearch,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set())
    const [filterSearchQueries, setFilterSearchQueries] = React.useState<Record<string, string>>({})
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    
    const open = isOpen !== undefined ? isOpen : internalOpen
    
    // Handle dropdown toggle
    const handleToggle = () => {
      const newOpen = !open
      setInternalOpen(newOpen)
      if (onOpenChange) onOpenChange(newOpen)
    }
    
    // Handle filter value change
    const handleFilterChange = (filterId: string, value: string | number | boolean, selected: boolean) => {
      const updatedFilters = [...activeFilters]
      const existingFilterIndex = updatedFilters.findIndex(f => f.id === filterId)
      
      if (existingFilterIndex >= 0) {
        const existingFilter = updatedFilters[existingFilterIndex]
        const filterConfig = filters.find(f => f.id === filterId)
        
        if (filterConfig?.type === 'single') {
          if (selected) {
            existingFilter.values = [value]
          } else {
            updatedFilters.splice(existingFilterIndex, 1)
          }
        } else {
          if (selected) {
            if (!existingFilter.values.includes(value)) {
              existingFilter.values.push(value)
            }
          } else {
            existingFilter.values = existingFilter.values.filter(v => v !== value)
            if (existingFilter.values.length === 0) {
              updatedFilters.splice(existingFilterIndex, 1)
            }
          }
        }
      } else if (selected) {
        const filterConfig = filters.find(f => f.id === filterId)
        updatedFilters.push({
          id: filterId,
          values: [value],
          label: filterConfig?.label,
        })
      }
      
      if (onFiltersChange) {
        onFiltersChange(updatedFilters)
      }
      
      if (closeOnSelect && filterConfig?.type === 'single') {
        setInternalOpen(false)
        if (onOpenChange) onOpenChange(false)
      }
    }
    
    // Handle clear all filters
    const handleClearAll = () => {
      if (onFiltersChange) {
        onFiltersChange([])
      }
    }
    
    // Handle preset selection
    const handlePresetSelect = (preset: FilterDropdownProps['presets'][0]) => {
      if (onFiltersChange) {
        onFiltersChange(preset.filters)
      }
      if (onPresetSelect) {
        onPresetSelect(preset)
      }
      setInternalOpen(false)
      if (onOpenChange) onOpenChange(false)
    }
    
    // Get filtered options for a filter
    const getFilteredOptions = (filter: FilterConfig): FilterOption[] => {
      if (!filter.options) return []
      
      const query = filterSearchQueries[filter.id]?.toLowerCase() || ''
      if (!query) return filter.options
      
      return filter.options.filter(option =>
        option.label.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query)
      )
    }
    
    // Check if option is selected
    const isOptionSelected = (filterId: string, value: string | number | boolean): boolean => {
      const activeFilter = activeFilters.find(f => f.id === filterId)
      return activeFilter ? activeFilter.values.includes(value) : false
    }
    
    // Get total active filter count
    const activeFilterCount = activeFilters.reduce((count, filter) => count + filter.values.length, 0)
    
    // Group options by group property
    const getGroupedOptions = (options: FilterOption[]): Record<string, FilterOption[]> => {
      const grouped: Record<string, FilterOption[]> = {}
      
      options.forEach(option => {
        const group = option.group || 'default'
        if (!grouped[group]) {
          grouped[group] = []
        }
        grouped[group].push(option)
      })
      
      return grouped
    }
    
    // Get construction-specific preset filters
    const getConstructionPresets = (): FilterDropdownProps['presets'] => {
      if (presets.length > 0) return presets
      
      switch (constructionContext) {
        case 'projects':
          return [
            {
              id: 'active-projects',
              label: 'Proyectos Activos',
              icon: 'play',
              filters: [{ id: 'status', values: ['ACTIVE'], label: 'Estado' }],
            },
            {
              id: 'completed-projects',
              label: 'Proyectos Completados',
              icon: 'check-circle',
              filters: [{ id: 'status', values: ['COMPLETED'], label: 'Estado' }],
            },
            {
              id: 'high-priority',
              label: 'Alta Prioridad',
              icon: 'alert-triangle',
              filters: [{ id: 'priority', values: ['HIGH', 'CRITICAL'], label: 'Prioridad' }],
            },
          ]
        case 'activities':
          return [
            {
              id: 'pending-activities',
              label: 'Actividades Pendientes',
              icon: 'clock',
              filters: [{ id: 'status', values: ['PENDING', 'IN_PROGRESS'], label: 'Estado' }],
            },
            {
              id: 'quality-activities',
              label: 'Pendientes de Calidad',
              icon: 'shield-check',
              filters: [{ id: 'status', values: ['QUALITY_REVIEW'], label: 'Estado' }],
            },
          ]
        default:
          return []
      }
    }
    
    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setInternalOpen(false)
          if (onOpenChange) onOpenChange(false)
        }
      }
      
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, onOpenChange])
    
    const constructionPresets = getConstructionPresets()

    return (
      <div
        ref={ref}
        className={cn(filterDropdownVariants({ variant, size }), className)}
        {...props}
      >
        {/* Trigger Button */}
        <Button
          ref={dropdownRef}
          variant="outline"
          onClick={handleToggle}
          className={cn(
            'relative flex items-center gap-2',
            open && 'bg-secondary-50 border-primary-300',
            activeFilterCount > 0 && 'border-primary-300 bg-primary-25'
          )}
          disabled={isLoading}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {trigger || (
            <>
              <Icon name="filter" size="sm" />
              
              <span className="hidden sm:inline">
                {triggerLabel}
              </span>
              
              {showActiveCount && activeFilterCount > 0 && (
                <Badge size="xs" variant="primary" count={activeFilterCount} />
              )}
              
              <Icon 
                name={open ? 'chevron-up' : 'chevron-down'} 
                size="xs" 
                className="text-secondary-400"
              />
            </>
          )}
        </Button>
        
        {/* Dropdown Menu */}
        {open && (
          <div
            className={cn(
              'absolute top-full left-0 mt-2 bg-white border border-secondary-200 rounded-lg shadow-lg z-50',
              variant === 'mobile' ? 'w-full' : `min-w-[${minWidth}px]`
            )}
            style={{ minWidth: variant !== 'mobile' ? minWidth : undefined }}
          >
            {/* Header */}
            <div className="p-4 border-b border-secondary-100">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="h6" className="font-semibold">
                  Filtros
                </Typography>
                
                <div className="flex items-center gap-2">
                  {showClearAll && activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      leftIcon={<Icon name="x" size="xs" />}
                    >
                      Limpiar
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setInternalOpen(false)
                      if (onOpenChange) onOpenChange(false)
                    }}
                  >
                    <Icon name="x" size="sm" />
                  </Button>
                </div>
              </div>
              
              {/* Global Search */}
              {globalSearch && (
                <Input
                  placeholder={globalSearchPlaceholder}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  leftIcon={<Icon name="search" size="sm" />}
                  size="sm"
                  className="mb-3"
                />
              )}
              
              {/* Active Filters Summary */}
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Icon name="filter" size="xs" />
                  <span>{activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''} activo{activeFilterCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
            
            {/* Presets */}
            {constructionPresets.length > 0 && (
              <div className="p-3 border-b border-secondary-100">
                <Typography variant="label-small" color="muted" className="mb-2">
                  Filtros Rápidos
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {constructionPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetSelect(preset)}
                      leftIcon={preset.icon ? <Icon name={preset.icon as any} size="xs" /> : undefined}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Filter Content */}
            <div 
              className="max-h-96 overflow-y-auto"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              {isLoading ? (
                <div className="p-6 text-center">
                  <Icon name="loader-2" size="lg" className="animate-spin mb-2 mx-auto" />
                  <Typography variant="body-small" color="muted">
                    Cargando filtros...
                  </Typography>
                </div>
              ) : (
                <div className="p-2">
                  {filters.map((filter) => {
                    const filteredOptions = getFilteredOptions(filter)
                    const groupedOptions = getGroupedOptions(filteredOptions)
                    const groups = Object.keys(groupedOptions)
                    const hasGroups = groups.length > 1 || groups[0] !== 'default'
                    
                    return (
                      <div key={filter.id} className="mb-4">
                        {/* Filter Label */}
                        <div className="flex items-center justify-between mb-2">
                          <Typography variant="label-default" className="font-semibold">
                            {filter.label}
                          </Typography>
                          
                          {loadingFilters.includes(filter.id) && (
                            <Icon name="loader-2" size="xs" className="animate-spin" />
                          )}
                        </div>
                        
                        {/* Filter Search */}
                        {filter.searchable && filter.options && filter.options.length > 5 && (
                          <Input
                            placeholder={filter.searchPlaceholder || `Buscar ${filter.label.toLowerCase()}...`}
                            value={filterSearchQueries[filter.id] || ''}
                            onChange={(value) => {
                              setFilterSearchQueries(prev => ({
                                ...prev,
                                [filter.id]: value,
                              }))
                            }}
                            leftIcon={<Icon name="search" size="xs" />}
                            size="sm"
                            className="mb-2"
                          />
                        )}
                        
                        {/* Filter Options */}
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {hasGroups ? (
                            groups.map((groupName) => (
                              <div key={groupName}>
                                {groupName !== 'default' && (
                                  <Typography variant="caption" color="muted" className="px-2 py-1 font-medium">
                                    {groupName}
                                  </Typography>
                                )}
                                
                                {groupedOptions[groupName].map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center justify-between px-2 py-1 hover:bg-secondary-50 rounded"
                                  >
                                    <Checkbox
                                      checked={isOptionSelected(filter.id, option.value)}
                                      onCheckedChange={(checked) => 
                                        handleFilterChange(filter.id, option.value, checked)
                                      }
                                      disabled={option.disabled}
                                      label={option.label}
                                      size="sm"
                                    />
                                    
                                    <div className="flex items-center gap-2">
                                      {option.count !== undefined && (
                                        <Typography variant="caption" color="muted">
                                          ({option.count})
                                        </Typography>
                                      )}
                                      
                                      {option.icon && (
                                        <Icon name={option.icon as any} size="xs" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          ) : (
                            filteredOptions.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center justify-between px-2 py-1 hover:bg-secondary-50 rounded"
                              >
                                <Checkbox
                                  checked={isOptionSelected(filter.id, option.value)}
                                  onCheckedChange={(checked) => 
                                    handleFilterChange(filter.id, option.value, checked)
                                  }
                                  disabled={option.disabled}
                                  label={option.label}
                                  size="sm"
                                />
                                
                                <div className="flex items-center gap-2">
                                  {option.count !== undefined && (
                                    <Typography variant="caption" color="muted">
                                      ({option.count})
                                    </Typography>
                                  )}
                                  
                                  {option.icon && (
                                    <Icon name={option.icon as any} size="xs" />
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                          
                          {filteredOptions.length === 0 && (
                            <div className="text-center py-4 text-secondary-500">
                              <Icon name="search" size="sm" className="mx-auto mb-2" />
                              <Typography variant="body-small">
                                No se encontraron opciones
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {activeFilterCount > 0 && (
              <div className="p-3 border-t border-secondary-100 bg-secondary-25">
                <div className="flex items-center justify-between">
                  <Typography variant="body-small" color="muted">
                    {activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''} aplicado{activeFilterCount !== 1 ? 's' : ''}
                  </Typography>
                  
                  <Button
                    size="sm"
                    onClick={() => {
                      setInternalOpen(false)
                      if (onOpenChange) onOpenChange(false)
                    }}
                  >
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

FilterDropdown.displayName = 'FilterDropdown'

export { FilterDropdown, filterDropdownVariants }
export type { FilterOption, FilterConfig, ActiveFilter }