'use client'

import { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms/Button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

// Definir variantes del componente
export const paginationVariants = cva(
  "flex items-center justify-between gap-2",
  {
    variants: {
      variant: {
        simple: "pagination-simple",
        numbered: "pagination-numbered",
        advanced: "pagination-advanced"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      },
      alignment: {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
        between: "justify-between"
      }
    },
    defaultVariants: {
      variant: "numbered",
      size: "md",
      alignment: "between"
    }
  }
)

export interface PaginationProps extends VariantProps<typeof paginationVariants> {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  showPageInfo?: boolean
  showItemsInfo?: boolean
  maxVisiblePages?: number
  disabled?: boolean
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showPageInfo = true,
  showItemsInfo = true,
  maxVisiblePages = 5,
  disabled = false,
  variant,
  size,
  alignment,
  className,
  ...props
}: PaginationProps) {
  
  // Generar números de páginas visibles
  const visiblePages = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Lógica para páginas con ellipsis
      const halfVisible = Math.floor(maxVisiblePages / 2)
      let startPage = Math.max(1, currentPage - halfVisible)
      let endPage = Math.min(totalPages, currentPage + halfVisible)
      
      // Ajustar si estamos cerca del inicio o final
      if (currentPage <= halfVisible) {
        endPage = maxVisiblePages
      }
      if (currentPage > totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1
      }
      
      // Agregar primera página si no está incluida
      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) {
          pages.push('ellipsis')
        }
      }
      
      // Agregar páginas del rango
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Agregar última página si no está incluida
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis')
        }
        pages.push(totalPages)
      }
    }
    
    return pages
  }, [currentPage, totalPages, maxVisiblePages])

  // Calcular información de items
  const itemsInfo = useMemo(() => {
    const startItem = ((currentPage - 1) * itemsPerPage) + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)
    return { startItem, endItem }
  }, [currentPage, itemsPerPage, totalItems])

  // Handlers
  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
  }

  // Renderizado simple
  if (variant === 'simple') {
    return (
      <div className={cn(paginationVariants({ variant, size, alignment }), className)} {...props}>
        {showPrevNext && (
          <Button
            variant="outline"
            size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage <= 1}
            className="min-w-[44px] h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only md:not-sr-only md:ml-2">Anterior</span>
          </Button>
        )}
        
        {showPageInfo && (
          <div className="flex-1 text-center">
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            {showItemsInfo && totalItems > 0 && (
              <div className="text-xs text-gray-500">
                {itemsInfo.startItem}-{itemsInfo.endItem} de {totalItems} elementos
              </div>
            )}
          </div>
        )}
        
        {showPrevNext && (
          <Button
            variant="outline"
            size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage >= totalPages}
            className="min-w-[44px] h-[44px] flex items-center justify-center"
          >
            <span className="sr-only md:not-sr-only md:mr-2">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  // Renderizado completo (numbered/advanced)
  return (
    <div className="space-y-4">
      {/* Información de items */}
      {showItemsInfo && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
          <div>
            Mostrando {itemsInfo.startItem} a {itemsInfo.endItem} de {totalItems} proyectos
          </div>
          <div className="mt-2 sm:mt-0">
            {itemsPerPage} elementos por página
          </div>
        </div>
      )}

      {/* Controles de paginación */}
      <div className={cn(paginationVariants({ variant, size, alignment }), className)} {...props}>
        {/* Botón Primera página */}
        {showFirstLast && totalPages > maxVisiblePages && (
          <Button
            variant="outline"
            size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage <= 1}
            className="min-w-[44px] h-[44px] hidden sm:flex items-center justify-center"
          >
            Primera
          </Button>
        )}

        {/* Botón Anterior */}
        {showPrevNext && (
          <Button
            variant="outline"
            size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage <= 1}
            className="min-w-[44px] h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only sm:ml-2">Anterior</span>
          </Button>
        )}

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-[44px] h-[44px] text-gray-400"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                className={cn(
                  "min-w-[44px] h-[44px] flex items-center justify-center",
                  currentPage === page && "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {page}
              </Button>
            )
          })}
        </div>

        {/* Botón Siguiente */}
        {showPrevNext && (
          <Button
            variant="outline"
            size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage >= totalPages}
            className="min-w-[44px] h-[44px] flex items-center justify-center"
          >
            <span className="sr-only sm:not-sr-only sm:mr-2">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {/* Botón Última página */}
        {showFirstLast && totalPages > maxVisiblePages && (
          <Button
            variant="outline"
            size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default'}
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage >= totalPages}
            className="min-w-[44px] h-[44px] hidden sm:flex items-center justify-center"
          >
            Última
          </Button>
        )}
      </div>

      {/* Información de página (móvil) */}
      {showPageInfo && (
        <div className="flex sm:hidden justify-center text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </div>
      )}
    </div>
  )
}