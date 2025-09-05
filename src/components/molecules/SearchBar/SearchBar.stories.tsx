'use client'

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SearchBar } from './SearchBar'
import type { ConstructionFilter } from './SearchBar'

const meta: Meta<typeof SearchBar> = {
  title: 'Construction/Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Comprehensive search component for construction management with context-specific filters, recent searches, and mobile optimization.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl p-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'full'],
      description: 'Visual variant of the search bar',
    },
    layout: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Layout direction for components',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Size of the search elements',
    },
    constructionContext: {
      control: { type: 'select' },
      options: ['projects', 'units', 'workers', 'materials', 'quality', 'general'],
      description: 'Construction-specific search context',
    },
    showFilters: {
      control: { type: 'boolean' },
      description: 'Show advanced filters button',
    },
    showQuickFilters: {
      control: { type: 'boolean' },
      description: 'Show quick filter buttons',
    },
    showResults: {
      control: { type: 'boolean' },
      description: 'Show results count',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state indicator',
    },
    collapsible: {
      control: { type: 'boolean' },
      description: 'Mobile collapsible behavior',
    },
  },
}

export default meta
type Story = StoryObj<typeof SearchBar>

// Sample construction filters
const projectFilters: ConstructionFilter[] = [
  {
    id: 'status',
    label: 'Estado del Proyecto',
    value: '',
    type: 'select',
    options: [
      { value: 'ACTIVE', label: 'Activo' },
      { value: 'COMPLETED', label: 'Completado' },
      { value: 'ON_HOLD', label: 'En Espera' },
      { value: 'CANCELLED', label: 'Cancelado' },
    ],
    placeholder: 'Seleccionar estado...',
  },
  {
    id: 'type',
    label: 'Tipo de Proyecto',
    value: [],
    type: 'status',
    options: [
      { value: 'RESIDENTIAL', label: 'Residencial' },
      { value: 'COMMERCIAL', label: 'Comercial' },
      { value: 'INDUSTRIAL', label: 'Industrial' },
      { value: 'INFRASTRUCTURE', label: 'Infraestructura' },
    ],
  },
  {
    id: 'startDate',
    label: 'Fecha de Inicio',
    value: '',
    type: 'date',
    placeholder: 'Seleccionar fecha...',
  },
]

const unitFilters: ConstructionFilter[] = [
  {
    id: 'building',
    label: 'Edificio',
    value: '',
    type: 'select',
    options: [
      { value: 'EA', label: 'Edificio A' },
      { value: 'EB', label: 'Edificio B' },
      { value: 'EC', label: 'Edificio C' },
    ],
  },
  {
    id: 'floor',
    label: 'Piso',
    value: '',
    type: 'select',
    options: [
      { value: '1', label: 'Piso 1' },
      { value: '2', label: 'Piso 2' },
      { value: '3', label: 'Piso 3' },
      { value: '4', label: 'Piso 4' },
    ],
  },
  {
    id: 'unitStatus',
    label: 'Estado de Unidad',
    value: [],
    type: 'status',
    options: [
      { value: 'PLANNED', label: 'Planificado' },
      { value: 'IN_PROGRESS', label: 'En Progreso' },
      { value: 'COMPLETED', label: 'Completado' },
      { value: 'DELIVERED', label: 'Entregado' },
    ],
  },
]

const workerFilters: ConstructionFilter[] = [
  {
    id: 'role',
    label: 'Rol',
    value: '',
    type: 'select',
    options: [
      { value: 'SITE_MANAGER', label: 'Jefe de Terreno' },
      { value: 'SUPERVISOR', label: 'Supervisor' },
      { value: 'WORKER', label: 'Operario' },
      { value: 'QUALITY_INSPECTOR', label: 'Inspector de Calidad' },
    ],
  },
  {
    id: 'availability',
    label: 'Disponibilidad',
    value: [],
    type: 'status',
    options: [
      { value: 'AVAILABLE', label: 'Disponible' },
      { value: 'ASSIGNED', label: 'Asignado' },
      { value: 'ON_LEAVE', label: 'Con Permiso' },
      { value: 'INACTIVE', label: 'Inactivo' },
    ],
  },
]

// Default search bar
export const Default: Story = {
  args: {
    placeholder: 'Buscar en el sistema...',
    value: '',
    size: 'default',
    variant: 'default',
    layout: 'horizontal',
  },
}

// Projects search context
export const ProjectsSearch: Story = {
  args: {
    constructionContext: 'projects',
    showQuickFilters: true,
    showFilters: true,
    filters: projectFilters,
    showResults: true,
    resultsCount: 15,
  },
}

// Units search with compact variant
export const UnitsSearchCompact: Story = {
  args: {
    constructionContext: 'units',
    variant: 'compact',
    size: 'sm',
    showQuickFilters: true,
    showFilters: true,
    filters: unitFilters,
    quickFilters: ['EA-101', 'EA-102', 'Piso 1', 'Completado'],
  },
}

// Workers search with active filters
export const WorkersSearchWithFilters: Story = {
  args: {
    constructionContext: 'workers',
    showFilters: true,
    filters: workerFilters,
    activeFilters: {
      role: 'SITE_MANAGER',
      availability: ['AVAILABLE', 'ASSIGNED'],
    },
    showResults: true,
    resultsCount: 8,
  },
  play: async ({ canvasElement }) => {
    // Simulate having active filters
  },
}

// Materials search with loading state
export const MaterialsSearchLoading: Story = {
  args: {
    constructionContext: 'materials',
    value: 'hormigón',
    isLoading: true,
    showQuickFilters: true,
    showResults: true,
    resultsCount: 23,
  },
}

// Quality search with recent searches
export const QualitySearchWithRecent: Story = {
  args: {
    constructionContext: 'quality',
    recentSearches: [
      'Inspección de hormigón',
      'Reporte de calidad EA-101',
      'Ensayos de resistencia',
      'Control de materiales',
      'Verificación estructural',
    ],
    showQuickFilters: true,
  },
}

// Vertical layout for mobile
export const VerticalLayout: Story = {
  args: {
    layout: 'vertical',
    constructionContext: 'projects',
    showQuickFilters: true,
    showFilters: true,
    filters: projectFilters,
    collapsible: true,
    expanded: true,
  },
}

// Large size variant
export const LargeSize: Story = {
  args: {
    size: 'lg',
    variant: 'full',
    constructionContext: 'projects',
    showQuickFilters: true,
    showFilters: true,
    filters: projectFilters,
    showResults: true,
    resultsCount: 42,
  },
}

// Mobile collapsible
export const MobileCollapsible: Story = {
  args: {
    collapsible: true,
    expanded: false,
    constructionContext: 'units',
    showQuickFilters: true,
    size: 'sm',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Interactive search demo
export const InteractiveDemo: Story = {
  args: {
    constructionContext: 'projects',
    showQuickFilters: true,
    showFilters: true,
    filters: projectFilters,
    recentSearches: [
      'Proyecto Torres del Mar',
      'Residencial Los Aromos',
      'Comercial Plaza Norte',
    ],
    showResults: true,
    resultsCount: 0,
  },
  render: function InteractiveSearchDemo(args) {
    const [searchValue, setSearchValue] = React.useState('')
    const [activeFilters, setActiveFilters] = React.useState<Record<string, string | string[]>>({})
    const [resultsCount, setResultsCount] = React.useState(0)

    const handleSearchChange = (value: string) => {
      setSearchValue(value)
      // Simulate search results
      setResultsCount(value ? Math.floor(Math.random() * 50) + 1 : 0)
    }

    const handleFilterChange = (filterId: string, value: string | string[]) => {
      setActiveFilters(prev => ({
        ...prev,
        [filterId]: value,
      }))
    }

    const handleFiltersReset = () => {
      setActiveFilters({})
    }

    return (
      <SearchBar
        {...args}
        value={searchValue}
        onSearchChange={handleSearchChange}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onFiltersReset={handleFiltersReset}
        resultsCount={resultsCount}
        showResults={searchValue.length > 0 || Object.keys(activeFilters).length > 0}
      />
    )
  },
}

// All features enabled
export const AllFeatures: Story = {
  args: {
    constructionContext: 'projects',
    variant: 'full',
    size: 'default',
    layout: 'horizontal',
    showQuickFilters: true,
    showFilters: true,
    showResults: true,
    filters: projectFilters,
    quickFilters: ['Activos', 'Completados', 'Esta semana', 'Residencial'],
    recentSearches: [
      'Torres del Mar',
      'Plaza Norte',
      'Residencial Los Aromos',
    ],
    activeFilters: {
      status: 'ACTIVE',
      type: ['RESIDENTIAL', 'COMMERCIAL'],
    },
    resultsCount: 28,
    collapsible: true,
    expanded: true,
  },
}