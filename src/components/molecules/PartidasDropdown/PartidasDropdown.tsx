'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/atoms/Icon'
import { Typography } from '@/components/atoms/Typography'
import { Loading } from '@/components/atoms/Loading'

const partidasDropdownVariants = cva(
  'relative w-full',
  {
    variants: {
      variant: {
        default: 'border border-secondary-300 rounded-lg',
        outline: 'border-2 border-primary-500 rounded-lg',
        ghost: 'border-0',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface Partida {
  id: string
  name: string
  category: string
  sequence: number
  unit?: string
  description?: string
  budgetWeight?: number
}

export interface PartidasDropdownProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof partidasDropdownVariants> {
  value?: string // Selected partida ID
  onValueChange?: (partidaId: string, partida: Partida) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  showCategory?: boolean
  showUnit?: boolean
  groupByCategory?: boolean
  allowSearch?: boolean
}

const PartidasDropdown = React.forwardRef<HTMLDivElement, PartidasDropdownProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onValueChange,
      placeholder = 'Seleccionar partida...',
      label,
      required = false,
      disabled = false,
      error,
      showCategory = true,
      showUnit = true,
      groupByCategory = true,
      allowSearch = true,
      ...props
    },
    ref
  ) => {
    const [partidas, setPartidas] = React.useState<Partida[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Fetch partidas from API
    React.useEffect(() => {
      const fetchPartidas = async () => {
        try {
          setIsLoading(true)
          const response = await fetch('/api/partidas')
          
          if (!response.ok) {
            throw new Error('Error al cargar partidas')
          }

          const data = await response.json()
          setPartidas(data.partidas || [])
        } catch (error) {
          console.error('Error fetching partidas:', error)
          // TODO: Show error toast/notification
        } finally {
          setIsLoading(false)
        }
      }

      fetchPartidas()
    }, [])

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Filter partidas based on search term
    const filteredPartidas = React.useMemo(() => {
      if (!searchTerm) return partidas

      return partidas.filter(
        (partida) =>
          partida.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partida.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partida.sequence.toString().includes(searchTerm)
      )
    }, [partidas, searchTerm])

    // Group partidas by category
    const groupedPartidas = React.useMemo(() => {
      if (!groupByCategory) return { 'Todas': filteredPartidas }

      return filteredPartidas.reduce((acc, partida) => {
        const category = partida.category || 'Sin Categoría'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(partida)
        return acc
      }, {} as Record<string, Partida[]>)
    }, [filteredPartidas, groupByCategory])

    // Get selected partida
    const selectedPartida = partidas.find((p) => p.id === value)

    const handleSelect = (partida: Partida) => {
      if (onValueChange) {
        onValueChange(partida.id, partida)
      }
      setIsOpen(false)
      setSearchTerm('')
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {/* Label */}
        {label && (
          <label className="block">
            <Typography variant="label-default" className="font-medium">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
          </label>
        )}

        {/* Dropdown Container */}
        <div ref={dropdownRef} className="relative">
          {/* Dropdown Trigger */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled || isLoading}
            className={cn(
              partidasDropdownVariants({ variant, size }),
              'w-full px-4 py-3 text-left bg-white flex items-center justify-between',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'transition-colors duration-200',
              disabled && 'opacity-50 cursor-not-allowed bg-secondary-50',
              error && 'border-red-500 focus:ring-red-500',
              isOpen && 'ring-2 ring-primary-500 border-primary-500'
            )}
          >
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loading size="xs" />
                  <Typography variant="body-default" color="muted">
                    Cargando partidas...
                  </Typography>
                </div>
              ) : selectedPartida ? (
                <div>
                  <Typography variant="body-default" className="font-medium">
                    {selectedPartida.sequence}. {selectedPartida.name}
                  </Typography>
                  {showCategory && (
                    <Typography variant="caption" color="muted">
                      {selectedPartida.category}
                      {showUnit && selectedPartida.unit && ` • ${selectedPartida.unit}`}
                    </Typography>
                  )}
                </div>
              ) : (
                <Typography variant="body-default" color="muted">
                  {placeholder}
                </Typography>
              )}
            </div>
            
            <Icon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size="sm"
              className="ml-2 flex-shrink-0 text-secondary-500"
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && !isLoading && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
              {/* Search Bar */}
              {allowSearch && (
                <div className="p-3 border-b border-secondary-200 bg-secondary-50">
                  <div className="relative">
                    <Icon
                      name="search"
                      size="sm"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar partida..."
                      className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Partidas List */}
              <div className="overflow-y-auto max-h-80">
                {Object.keys(groupedPartidas).length === 0 ? (
                  <div className="p-4 text-center">
                    <Typography variant="body-default" color="muted">
                      No se encontraron partidas
                    </Typography>
                  </div>
                ) : (
                  Object.entries(groupedPartidas).map(([category, categoryPartidas]) => (
                    <div key={category}>
                      {/* Category Header */}
                      {groupByCategory && (
                        <div className="px-4 py-2 bg-secondary-100 border-b border-secondary-200 sticky top-0 z-10">
                          <Typography variant="label-small" className="font-semibold text-secondary-700">
                            {category}
                          </Typography>
                        </div>
                      )}

                      {/* Partidas in Category */}
                      {categoryPartidas.map((partida) => (
                        <button
                          key={partida.id}
                          type="button"
                          onClick={() => handleSelect(partida)}
                          className={cn(
                            'w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors',
                            'border-b border-secondary-100 last:border-0',
                            value === partida.id && 'bg-primary-50 border-l-4 border-l-primary-500'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <Typography variant="body-default" className="font-medium">
                                {partida.sequence}. {partida.name}
                              </Typography>
                              {partida.description && (
                                <Typography variant="caption" color="muted" className="mt-1">
                                  {partida.description}
                                </Typography>
                              )}
                              {showUnit && partida.unit && (
                                <Typography variant="caption" className="text-primary-600 mt-1">
                                  Unidad: {partida.unit}
                                </Typography>
                              )}
                            </div>
                            {value === partida.id && (
                              <Icon name="check" size="sm" className="text-primary-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Typography variant="caption" className="text-red-600">
            {error}
          </Typography>
        )}

        {/* Helper Text */}
        <Typography variant="caption" color="muted">
          {partidas.length} partidas disponibles
        </Typography>
      </div>
    )
  }
)

PartidasDropdown.displayName = 'PartidasDropdown'

export { PartidasDropdown, partidasDropdownVariants }